import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  FileJson,
  Filter,
  GraduationCap,
  LoaderCircle,
  Search,
  Star,
  Upload,
  X,
} from "lucide-react";
import { MATERIAL_SKILLS, MATERIAL_LANGUAGE_FOCUS, readMaterialDocument } from "./material-model";
import MaterialClassification from "./MaterialClassification";
import { APP_LOCALE, normaliseSearchText } from "./app-language";
import { navigateToMaterial } from "./app-routes";
import type {
  Material,
  MaterialSummary,
} from "./material-model";
import {
  importMaterial,
  loadFavourites,
  loadMaterial,
  loadMaterials,
  saveFavourite,
} from "./material-api";
import { useTeacherAccount } from "./use-teacher-account";
import { TeacherAccount } from "./TeacherAccount";
import MaterialStudy, { downloadMaterial } from "./MaterialStudy";

function AccountDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="library-account-dialog"
      aria-labelledby="library-account-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="dialog-heading">
        <h2 id="library-account-title">Sign in to your workspace</h2>
        <button
          className="icon-button"
          aria-label="Close sign-in dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <TeacherAccount />
    </dialog>
  );
}
function ImportDialog({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (material: Material) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  const submit = async () => {
    setErrors([]);
    let content: unknown;
    try {
      content = JSON.parse(text);
    } catch {
      setErrors(["Could not read the JSON. Check commas and quotation marks."]);
      return;
    }
    const result = readMaterialDocument(content);
    if (!result.document) {
      setErrors(result.errors);
      return;
    }
    setBusy(true);
    try {
      onSaved(await importMaterial(result.document));
    } catch (error) {
      setErrors([(error as Error).message]);
    } finally {
      setBusy(false);
    }
  };
  return (
    <dialog
      ref={dialog}
      className="material-import-dialog"
      aria-labelledby="import-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <div className="dialog-heading">
        <div>
          <span className="eyebrow">BUILD YOUR LIBRARY</span>
          <h2 id="import-title">Import a lesson</h2>
        </div>
        <button
          className="icon-button"
          aria-label="Close lesson import"
          disabled={busy}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <p>
        Prepare a lesson with AI or write your own using the library’s JSON
        template. Imported lessons are private to your account.
      </p>
      <label className="json-file-label">
        <Upload size={18} />
        Choose a JSON file
        <input
          type="file"
          accept=".json,application/json"
          disabled={busy}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (file.size > 150000) {
              setErrors(["The file must be no larger than 150 KB."]);
              return;
            }
            setText(await file.text());
            setErrors([]);
          }}
        />
      </label>
      <label className="material-json-label">
        Lesson JSON
        <textarea
          rows={12}
          value={text}
          disabled={busy}
          spellCheck={false}
          placeholder={
            '{\n  "catalogue": { "title": "My new lesson", … },\n  "content": { "schemaVersion": 2, … }\n}'
          }
          onChange={(event) => {
            setText(event.target.value);
            setErrors([]);
          }}
        />
      </label>
      {errors.length > 0 && (
        <div className="library-error" role="alert">
          <strong>Check the lesson content</strong>
          <ul>
            {errors.slice(0, 10).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="student-dialog-actions">
        <button className="secondary" disabled={busy} onClick={onClose}>
          Cancel
        </button>
        <button
          className="primary"
          disabled={busy || !text.trim()}
          onClick={() => void submit()}
        >
          {busy ? (
            <LoaderCircle className="students-spinner" size={17} />
          ) : (
            <Upload size={17} />
          )}{" "}
          {busy ? "Saving…" : "Import lesson"}
        </button>
      </div>
    </dialog>
  );
}

export default function AssignmentsLibrary({
  onOpenLegacy,
  materialId,
}: {
  onOpenLegacy: () => void;
  materialId: string;
}) {
  const { user, ready } = useTeacherAccount();
  const [rows, setRows] = useState<MaterialSummary[]>([]);
  const [favourites, setFavourites] = useState(new Set<string>());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [skill, setSkill] = useState("");
  const [languageFocus, setLanguageFocus] = useState("");
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("all");
  const [page, setPage] = useState(0);
  const [pendingFavourite, setPendingFavourite] = useState<string | null>(null);
  const [material, setMaterial] = useState<Material | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [templateBusy, setTemplateBusy] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void loadMaterials(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setRows(result.materials);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("The library is unavailable. Try refreshing the page.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    if (user)
      void loadFavourites(controller.signal)
        .then((set) => {
          if (!controller.signal.aborted) setFavourites(set);
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setError(
              "Could not load your favourites. Other lessons are still available. Try again to reload your favourites.",
            );
        });
    else setFavourites(new Set());
    return () => controller.abort();
  }, [user?.id, ready, reload]);
  useEffect(() => {
    if (user) setAccountOpen(false);
  }, [user?.id]);
  useEffect(() => {
    if (!materialId) {
      setMaterial(null);
      setDetailError("");
      return;
    }
    const controller = new AbortController();
    setDetailLoading(true);
    setDetailError("");
    setMaterial(null);
    void loadMaterial(materialId, controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) setMaterial(value);
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setDetailError((error as Error).message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setDetailLoading(false);
      });
    return () => controller.abort();
  }, [materialId, user?.id]);
  const open = (id: string) => {
    navigateToMaterial(id);
  };
  const toggleFavourite = async (id: string) => {
    if (!user) {
      setAccountOpen(true);
      return;
    }
    setPendingFavourite(id);
    setError("");
    try {
      const active = !favourites.has(id);
      await saveFavourite(id, active);
      setFavourites((previous) => {
        const next = new Set(previous);
        if (active) next.add(id);
        else next.delete(id);
        return next;
      });
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setPendingFavourite(null);
    }
  };
  const allowedRows = rows.filter(
    (row) => !row.owner_id || row.owner_id === user?.id,
  );
  const topics = [...new Set(allowedRows.map((row) => row.topic))].sort(
    (a, b) => a.localeCompare(b, APP_LOCALE),
  );
  const normalized = normaliseSearchText(search).trim();
  const filtered = allowedRows.filter(
    (row) =>
      (!level || row.level === level) &&
      (!skill || (row.classification_status === "reviewed" && row.skills.includes(skill as keyof typeof MATERIAL_SKILLS))) &&
      (!languageFocus || (row.classification_status === "reviewed" && row.language_focus.includes(languageFocus as keyof typeof MATERIAL_LANGUAGE_FOCUS))) &&
      (!topic || row.topic === topic) &&
      (!normalized ||
        normaliseSearchText(`${row.title} ${row.subtitle} ${row.topic}`)
          .includes(normalized)) &&
      (source !== "studio" || !row.owner_id) &&
      (source !== "mine" || row.owner_id === user?.id) &&
      (source !== "favourites" || favourites.has(row.id)),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 9));
  const currentPage = Math.min(page, pages - 1);
  const visible = filtered.slice(currentPage * 9, currentPage * 9 + 9);
  const hasFilters = !!(search || level || skill || languageFocus || topic);
  const needsSignIn = !user && (source === "mine" || source === "favourites");
  const emptyTitle = needsSignIn
    ? "Sign in to your library"
    : hasFilters ? "No matching lessons"
      : source === "favourites" ? "No favourites yet"
        : source === "mine" ? "Your own lessons will appear here" : "No lessons found";
  const emptyDescription = needsSignIn
    ? "Sign in to access your own lessons and favourites on any device."
    : hasFilters ? "Try a different search or clear the filters to see all lessons."
      : source === "favourites" ? "Select the star on a lesson to save it here."
        : source === "mine" ? "Import a lesson to add it to your private collection."
          : "Browse the Studio collection or import a lesson of your own.";
  const setFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(0);
  };
  const template = async () => {
    setTemplateBusy(true);
    setError("");
    try {
      const data = await loadMaterial("a1-01", new AbortController().signal);
      downloadMaterial(data);
    } catch {
      setError("Could not download the template. Please try again.");
    } finally {
      setTemplateBusy(false);
    }
  };
  return (
    <section className="assignments-library">
      {materialId ? (
        <>
          {detailLoading ? (
            <div className="library-loading" role="status">
              <LoaderCircle className="students-spinner" />
              Loading lesson…
            </div>
          ) : material &&
            (!material.owner_id || material.owner_id === user?.id) ? (
            <MaterialStudy
              key={`${material.id}.${material.version}`}
              material={material}
              teacher
              onBack={() => open("")}
            />
          ) : (
            <div className="library-error" role="alert">
              <p>
                {detailError ||
                  "Sign in to the account that owns this private lesson."}
              </p>
              <button className="secondary" onClick={() => open("")}>
                Back to lesson library
              </button>
              {!user && (
                <button
                  className="text-button"
                  onClick={() => setAccountOpen(true)}
                >
                  Sign in
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="library-top-actions">
            <div>
              <span className="eyebrow">TEACHER LIBRARY</span>
              <h1>Lesson library</h1>
              <p>
                Choose materials for each learning goal. Grow your library with
                your own lessons.
              </p>
            </div>
            <div>
              <button className="secondary" disabled={templateBusy} onClick={() => void template()}>
                <Download size={17} />
                {templateBusy ? "Preparing template…" : "Download template"}
              </button>
              <button
                className="primary"
                onClick={() =>
                  user ? setImportOpen(true) : setAccountOpen(true)
                }
              >
                <Upload size={17} />
                Import lesson
              </button>
            </div>
          </div>
          <div className="a1-collection-banner">
            <span className="a1-collection-mark">A1</span>
            <div>
              <span className="eyebrow">LESSON STUDIO COLLECTION</span>
              <h2>First conversations</h2>
              <p>
                30 lessons · 300 questions with feedback · speaking, writing and
                homework
              </p>
            </div>
            <GraduationCap size={39} />
          </div>
          <div
            className="library-source-tabs"
            aria-label="Material collections"
          >
            {[
              { id: "all", label: "All materials" },
              { id: "studio", label: "Studio collection" },
              { id: "mine", label: "My materials" },
              { id: "favourites", label: "Favourites" },
            ].map((tab) => (
              <button
                key={tab.id}
                aria-pressed={source === tab.id}
                className={source === tab.id ? "active" : ""}
                onClick={() => {
                  if (!user && ["mine", "favourites"].includes(tab.id)) {
                    setAccountOpen(true);
                    return;
                  }
                  setFilter(setSource, tab.id);
                }}
              >
                {tab.id === "favourites" && <Star size={16} />} {tab.label}
              </button>
            ))}
          </div>
          <div className="library-filters">
            <label className="library-search">
              <Search size={18} />
              <span className="sr-only">Search lessons</span>
              <input
                type="search"
                placeholder="Search by title or topic"
                value={search}
                maxLength={120}
                onChange={(event) => setFilter(setSearch, event.target.value)}
              />
            </label>
            <label>
              <span className="library-filter-label">Level</span>
              <select
                value={level}
                onChange={(event) => setFilter(setLevel, event.target.value)}
              >
                <option value="">All levels</option>
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="library-filter-label">Skills</span>
              <select
                value={skill}
                onChange={(event) => setFilter(setSkill, event.target.value)}
              >
                <option value="">All skills</option>
                {Object.entries(MATERIAL_SKILLS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="library-language-focus">
              <span className="library-filter-label">Language focus</span>
              <select
                value={languageFocus}
                onChange={(event) => setFilter(setLanguageFocus, event.target.value)}
              >
                <option value="">Any language focus</option>
                {Object.entries(MATERIAL_LANGUAGE_FOCUS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="library-filter-label">Topic</span>
              <select
                value={topic}
                onChange={(event) => setFilter(setTopic, event.target.value)}
              >
                <option value="">All topics</option>
                {topics.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {error && (
            <div className="library-error" role="alert">
              <p>{error}</p>
              <button
                className="secondary"
                onClick={() => setReload((value) => value + 1)}
              >
                Try again
              </button>
            </div>
          )}
          {notice && (
            <p className="library-notice" role="status">
              {notice}
            </p>
          )}
          <div className="library-result-line">
            <span>
              <Filter size={15} />
              {loading ? "Loading materials…" : `Results: ${filtered.length}`}
            </span>
            <small>Skills describe communication practice; language focus describes the language features taught.</small>
          </div>
          {loading ? (
            <div className="library-loading" role="status">
              <LoaderCircle className="students-spinner" />
              Loading library…
            </div>
          ) : visible.length ? (
            <div className="material-grid">
              {visible.map((row) => (
                <article className="material-card" key={row.id}>
                  <div className="material-card-top">
                    <span className="material-level">{row.level}</span>
                    <span>
                      {row.owner_id
                        ? "My lesson"
                        : `Lesson ${String(row.sequence).padStart(2, "0")}`}
                    </span>
                    <button
                      className={`icon-button favourite-button ${favourites.has(row.id) ? "selected" : ""}`}
                      aria-label={`${favourites.has(row.id) ? "Remove from favourites" : "Add to favourites"}: ${row.title}`}
                      aria-pressed={favourites.has(row.id)}
                      disabled={pendingFavourite === row.id}
                      onClick={() => void toggleFavourite(row.id)}
                    >
                      <Star
                        size={18}
                        fill={favourites.has(row.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <span className="material-topic">{row.topic}</span>
                  <h2>
                    <button onClick={() => open(row.id)}>{row.title}</button>
                  </h2>
                  <p>{row.subtitle}</p>
                  <MaterialClassification classification={row} />
                  <div className="material-card-bottom">
                    <span>
                      <Clock3 size={15} />
                      {row.duration} min
                    </span>
                    <button
                      className="text-button"
                      onClick={() => open(row.id)}
                    >
                      Open lesson
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="library-empty">
              <BookOpen size={34} />
              <h2>{emptyTitle}</h2>
              <p>{emptyDescription}</p>
              <button
                className="secondary"
                onClick={() => {
                  if (needsSignIn) { setAccountOpen(true); return; }
                  setSearch("");
                  setLevel("");
                  setSkill("");
                  setLanguageFocus("");
                  setTopic("");
                  setSource("all");
                  setPage(0);
                }}
              >
                {needsSignIn ? "Sign in" : hasFilters ? "Clear filters" : "Browse all lessons"}
              </button>
            </div>
          )}
          {pages > 1 && !loading && (
            <div className="library-pagination">
              <span>
                Page {currentPage + 1} of {pages}
              </span>
              <div>
                <button
                  className="secondary"
                  disabled={!currentPage}
                  onClick={() => {
                    setPage(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <button
                  className="secondary"
                  disabled={currentPage >= pages - 1}
                  onClick={() => {
                    setPage(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
          <section className="legacy-material-link">
            <BookOpen size={22} />
            <div>
              <h2>A Better Life · textbook lesson</h2>
              <p>
                Teach from the textbook pages, invite your student and use the lesson timer.
              </p>
            </div>
            <button className="secondary" onClick={onOpenLegacy}>
              Open classroom
              <ExternalLink size={15} />
            </button>
          </section>
          <details className="library-methods">
            <summary>
              <FileJson size={17} />
              About the lessons and adding your own materials
            </summary>
            <p>
              Lessons use everyday CEFR A1 communication goals, short models,
              recall practice and feedback. The teacher adjusts the pace and
              workload. To import a lesson, prepare one JSON object using a
              downloaded lesson as a template. Your imported materials are private
              to your account.
            </p>
            <p>
              <a
                href="https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors"
                target="_blank"
                rel="noopener noreferrer"
              >
                CEFR: goals and descriptors
              </a>{" "}
              ·{" "}
              <a
                href="https://www.teachingenglish.org.uk/professional-development/teachers/knowing-subject/task-based-approach"
                target="_blank"
                rel="noopener noreferrer"
              >
                TeachingEnglish: communicative tasks
              </a>
            </p>
            <p>
              This 30-lesson collection supports learning; it does not guarantee
              a CEFR level or provide certification. Assigning lessons and
              sharing student results are coming in a future update.
            </p>
          </details>
        </>
      )}
      {accountOpen && <AccountDialog onClose={() => setAccountOpen(false)} />}
      {importOpen && (
        <ImportDialog
          onClose={() => setImportOpen(false)}
          onSaved={(value) => {
            setImportOpen(false);
            setNotice(value.classification_status === "needs_review"
              ? "Lesson imported. Its previous tags are saved for classification review."
              : "Lesson imported into your library.");
            setReload((previous) => previous + 1);
            open(value.id);
          }}
        />
      )}
    </section>
  );
}

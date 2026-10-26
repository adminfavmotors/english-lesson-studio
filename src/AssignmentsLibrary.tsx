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
import { MATERIAL_SKILLS, validateMaterial } from "./material-model";
import { materialPresentation } from "./material-presentation";
import type {
  Material,
  MaterialContent,
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
import "./students.css";
import "./materials.css";

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
          aria-label="Close sign in"
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
    const problems = validateMaterial(content);
    if (problems.length) {
      setErrors(problems);
      return;
    }
    setBusy(true);
    try {
      onSaved(await importMaterial(content as MaterialContent));
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
          aria-label="Close import"
          disabled={busy}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <p>
        Prepare a lesson with AI or write your own. Export a lesson from the
        collection to use as a template. Importing creates a private material in
        your workspace.
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
            '{\n  "schemaVersion": 1,\n  "title": "My new lesson",\n  …\n}'
          }
          onChange={(event) => {
            setText(event.target.value);
            setErrors([]);
          }}
        />
      </label>
      {errors.length > 0 && (
        <div className="library-error" role="alert">
          <strong>Check the structure</strong>
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
          {busy ? "Saving…" : "Add to my materials"}
        </button>
      </div>
    </dialog>
  );
}

export default function AssignmentsLibrary({
  onOpenLegacy,
}: {
  onOpenLegacy: () => void;
}) {
  const { user, ready } = useTeacherAccount();
  const [rows, setRows] = useState<MaterialSummary[]>([]);
  const [favourites, setFavourites] = useState(new Set<string>());
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [skill, setSkill] = useState("");
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("all");
  const [page, setPage] = useState(0);
  const [pendingFavourite, setPendingFavourite] = useState<string | null>(null);
  const [materialId, setMaterialId] = useState(
    () => new URLSearchParams(location.search).get("material") ?? "",
  );
  const [material, setMaterial] = useState<Material | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  useEffect(() => {
    const pop = () =>
      setMaterialId(new URLSearchParams(location.search).get("material") ?? "");
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void loadMaterials(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setRows(result.materials);
          setOffline(result.offline);
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
              "Could not load favourites. The collection is available; refresh to try loading your personal materials again.",
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
    setMaterialId(id);
    const url = new URL(location.href);
    if (id) url.searchParams.set("material", id);
    else url.searchParams.delete("material");
    history.pushState(null, "", url);
    window.scrollTo({ top: 0, behavior: "instant" });
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
  const topicLabels = new Map(
    allowedRows.map((row) => [row.topic, materialPresentation(row).topic]),
  );
  const topics = [...topicLabels.keys()].sort((a, b) =>
    topicLabels.get(a)!.localeCompare(topicLabels.get(b)!, "en-GB"),
  );
  const normalized = search.toLocaleLowerCase().trim();
  const filtered = allowedRows.filter(
    (row) =>
      (!level || row.level === level) &&
      (!skill || row.skills.includes(skill as keyof typeof MATERIAL_SKILLS)) &&
      (!topic || row.topic === topic) &&
      (!normalized ||
        `${row.title} ${row.subtitle} ${row.topic} ${materialPresentation(row).subtitle} ${materialPresentation(row).topic}`
          .toLocaleLowerCase()
          .includes(normalized)) &&
      (source !== "studio" || !row.owner_id) &&
      (source !== "mine" || row.owner_id === user?.id) &&
      (source !== "favourites" || favourites.has(row.id)),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 9));
  const currentPage = Math.min(page, pages - 1);
  const visible = filtered.slice(currentPage * 9, currentPage * 9 + 9);
  const setFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(0);
  };
  const template = async () => {
    const data = await loadMaterial("a1-01", new AbortController().signal);
    downloadMaterial(data);
  };
  return (
    <section className="assignments-library">
      {materialId ? (
        <>
          {detailLoading ? (
            <div className="library-loading" role="status">
              <LoaderCircle className="students-spinner" />
              Opening lesson…
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
                  "Sign in to the account that owns this private material."}
              </p>
              <button className="secondary" onClick={() => open("")}>
                Back to library
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
              <h1>Assignments and lessons</h1>
              <p>
                Choose materials for each learning goal. Grow your library with
                your own lessons.
              </p>
            </div>
            <div>
              <button className="secondary" onClick={() => void template()}>
                <Download size={17} />
                Sample JSON
              </button>
              <button
                className="primary"
                onClick={() =>
                  user ? setImportOpen(true) : setAccountOpen(true)
                }
              >
                <Upload size={17} />
                Add lesson
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
                home practice
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
                placeholder="Topic, title or keyword"
                value={search}
                maxLength={120}
                onChange={(event) => setFilter(setSearch, event.target.value)}
              />
            </label>
            <label>
              <span className="sr-only">Lesson level</span>
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
              <span className="sr-only">Lesson skill</span>
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
            <label>
              <span className="sr-only">Lesson topic</span>
              <select
                value={topic}
                onChange={(event) => setFilter(setTopic, event.target.value)}
              >
                <option value="">All topics</option>
                {topics.map((value) => (
                  <option key={value} value={value}>
                    {topicLabels.get(value)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {offline && (
            <p className="library-notice" role="status">
              The cloud is unavailable. You are viewing the built-in A1
              collection; private materials and favourites may be unavailable.
            </p>
          )}
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
            <small>Skills show the main focus of each lesson</small>
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
                        ? "My material"
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
                  <span className="material-topic">
                    {materialPresentation(row).topic}
                  </span>
                  <h2>
                    <button onClick={() => open(row.id)}>{row.title}</button>
                  </h2>
                  <p>{materialPresentation(row).subtitle}</p>
                  <div className="material-skill-tags">
                    {row.skills.slice(0, 3).map((value) => (
                      <span key={value}>{MATERIAL_SKILLS[value]}</span>
                    ))}
                  </div>
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
              <h2>No materials found</h2>
              <p>
                Try another topic or skill. You can import your own lessons for
                levels A2–C2 using JSON.
              </p>
              <button
                className="secondary"
                onClick={() => {
                  setSearch("");
                  setLevel("");
                  setSkill("");
                  setTopic("");
                  setSource("all");
                  setPage(0);
                }}
              >
                Clear filters
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
              <h2>A Better Life · textbook material</h2>
              <p>
                Open the textbook classroom with a shared session, lesson timer
                and original page.
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
              workload. To import a lesson, prepare one JSON object using an
              exported lesson as a template. Your imported materials are private
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
              a CEFR level or provide certification. Student assignments and a
              shared results record will be added in a future update.
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
            setNotice("Lesson added to your materials.");
            setReload((previous) => previous + 1);
            open(value.id);
          }}
        />
      )}
    </section>
  );
}

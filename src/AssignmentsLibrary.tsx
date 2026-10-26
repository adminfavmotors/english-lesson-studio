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
        <h2 id="library-account-title">Вход в кабинет учителя</h2>
        <button
          className="icon-button"
          aria-label="Закрыть вход"
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
      setErrors(["Не удалось прочитать JSON. Проверьте запятые и кавычки."]);
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
          <span className="eyebrow">НАПОЛНЕНИЕ БИБЛИОТЕКИ</span>
          <h2 id="import-title">Импортировать урок</h2>
        </div>
        <button
          className="icon-button"
          aria-label="Закрыть импорт"
          disabled={busy}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <p>
        Подготовьте урок с ИИ или самостоятельно. Экспорт любого урока коллекции
        подходит как образец структуры. Импорт создаёт ваш личный материал;
        исходная коллекция сохраняется.
      </p>
      <label className="json-file-label">
        <Upload size={18} />
        Выбрать JSON-файл
        <input
          type="file"
          accept=".json,application/json"
          disabled={busy}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (file.size > 150000) {
              setErrors(["Файл должен быть не больше 150 КБ."]);
              return;
            }
            setText(await file.text());
            setErrors([]);
          }}
        />
      </label>
      <label className="material-json-label">
        JSON урока
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
          <strong>Проверьте структуру</strong>
          <ul>
            {errors.slice(0, 10).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="student-dialog-actions">
        <button className="secondary" disabled={busy} onClick={onClose}>
          Отмена
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
          {busy ? "Сохраняем…" : "Добавить в мои материалы"}
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
          setError("Библиотека недоступна. Попробуйте обновить страницу.");
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
              "Не удалось загрузить избранное. Коллекция доступна; повторите обновление для личных данных.",
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
  const topics = [...new Set(allowedRows.map((row) => row.topic))].sort(
    (a, b) => a.localeCompare(b, "ru"),
  );
  const normalized = search.toLocaleLowerCase().trim();
  const filtered = allowedRows.filter(
    (row) =>
      (!level || row.level === level) &&
      (!skill || row.skills.includes(skill as keyof typeof MATERIAL_SKILLS)) &&
      (!topic || row.topic === topic) &&
      (!normalized ||
        `${row.title} ${row.subtitle} ${row.topic}`
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
              Открываем урок…
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
                  "Для личного материала войдите в кабинет владельца."}
              </p>
              <button className="secondary" onClick={() => open("")}>
                Вернуться в библиотеку
              </button>
              {!user && (
                <button
                  className="text-button"
                  onClick={() => setAccountOpen(true)}
                >
                  Войти в кабинет
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="library-top-actions">
            <div>
              <span className="eyebrow">БИБЛИОТЕКА УЧИТЕЛЯ</span>
              <h1>Задания и уроки</h1>
              <p>
                Выбирайте материал под цель ученика. Дополняйте библиотеку
                своими уроками.
              </p>
            </div>
            <div>
              <button className="secondary" onClick={() => void template()}>
                <Download size={17} />
                Пример JSON
              </button>
              <button
                className="primary"
                onClick={() =>
                  user ? setImportOpen(true) : setAccountOpen(true)
                }
              >
                <Upload size={17} />
                Добавить урок
              </button>
            </div>
          </div>
          <div className="a1-collection-banner">
            <span className="a1-collection-mark">A1</span>
            <div>
              <span className="eyebrow">КОЛЛЕКЦИЯ LESSON STUDIO</span>
              <h2>Первые уверенные разговоры</h2>
              <p>
                30 уроков · 300 вопросов с проверкой · речь, письмо и домашняя
                практика
              </p>
            </div>
            <GraduationCap size={39} />
          </div>
          <div
            className="library-source-tabs"
            aria-label="Коллекции материалов"
          >
            {[
              { id: "all", label: "Все материалы" },
              { id: "studio", label: "Коллекция Studio" },
              { id: "mine", label: "Мои материалы" },
              { id: "favourites", label: "Избранное" },
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
              <span className="sr-only">Поиск урока</span>
              <input
                type="search"
                placeholder="Тема, название или ключевое слово"
                value={search}
                maxLength={120}
                onChange={(event) => setFilter(setSearch, event.target.value)}
              />
            </label>
            <label>
              <span className="sr-only">Уровень урока</span>
              <select
                value={level}
                onChange={(event) => setFilter(setLevel, event.target.value)}
              >
                <option value="">Все уровни</option>
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Навык урока</span>
              <select
                value={skill}
                onChange={(event) => setFilter(setSkill, event.target.value)}
              >
                <option value="">Любой навык</option>
                {Object.entries(MATERIAL_SKILLS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Тема урока</span>
              <select
                value={topic}
                onChange={(event) => setFilter(setTopic, event.target.value)}
              >
                <option value="">Все темы</option>
                {topics.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>
          {offline && (
            <p className="library-notice" role="status">
              Облако недоступно. Открыта встроенная коллекция A1; личные
              материалы и избранное могут быть недоступны.
            </p>
          )}
          {error && (
            <div className="library-error" role="alert">
              <p>{error}</p>
              <button
                className="secondary"
                onClick={() => setReload((value) => value + 1)}
              >
                Повторить загрузку
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
              {loading ? "Загружаем материалы…" : `Найдено: ${filtered.length}`}
            </span>
            <small>Навыки — основной фокус урока</small>
          </div>
          {loading ? (
            <div className="library-loading" role="status">
              <LoaderCircle className="students-spinner" />
              Загружаем библиотеку…
            </div>
          ) : visible.length ? (
            <div className="material-grid">
              {visible.map((row) => (
                <article className="material-card" key={row.id}>
                  <div className="material-card-top">
                    <span className="material-level">{row.level}</span>
                    <span>
                      {row.owner_id
                        ? "Мой материал"
                        : `Урок ${String(row.sequence).padStart(2, "0")}`}
                    </span>
                    <button
                      className={`icon-button favourite-button ${favourites.has(row.id) ? "selected" : ""}`}
                      aria-label={`${favourites.has(row.id) ? "Убрать из избранного" : "В избранное"}: ${row.title}`}
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
                  <div className="material-skill-tags">
                    {row.skills.slice(0, 3).map((value) => (
                      <span key={value}>{MATERIAL_SKILLS[value]}</span>
                    ))}
                  </div>
                  <div className="material-card-bottom">
                    <span>
                      <Clock3 size={15} />
                      {row.duration} мин
                    </span>
                    <button
                      className="text-button"
                      onClick={() => open(row.id)}
                    >
                      Открыть урок
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="library-empty">
              <BookOpen size={34} />
              <h2>Материалы не найдены</h2>
              <p>
                Попробуйте другую тему или навык. Для A2–C2 можно добавить
                собственный урок через JSON-импорт.
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
                Сбросить фильтры
              </button>
            </div>
          )}
          {pages > 1 && !loading && (
            <div className="library-pagination">
              <span>
                Страница {currentPage + 1} из {pages}
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
                  Назад
                </button>
                <button
                  className="secondary"
                  disabled={currentPage >= pages - 1}
                  onClick={() => {
                    setPage(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                >
                  Далее
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
          <section className="legacy-material-link">
            <BookOpen size={22} />
            <div>
              <h2>A Better Life · материал из учебника</h2>
              <p>
                Прежняя учебная комната с общей сессией, таймером и исходной
                страницей сохранена отдельно.
              </p>
            </div>
            <button className="secondary" onClick={onOpenLegacy}>
              Открыть комнату
              <ExternalLink size={15} />
            </button>
          </section>
          <details className="library-methods">
            <summary>
              <FileJson size={17} />
              Как устроены уроки и дальнейшее наполнение
            </summary>
            <p>
              Уроки опираются на повседневные коммуникативные цели CEFR A1,
              короткие образцы, повторение из памяти и практику с обратной
              связью. Темп и объём адаптирует учитель. Для импорта подготовьте
              один JSON-объект по экспорту любого урока. Созданные материалы
              видны только владельцу кабинета.
            </p>
            <p>
              <a
                href="https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors"
                target="_blank"
                rel="noopener noreferrer"
              >
                CEFR: цели и дескрипторы
              </a>{" "}
              ·{" "}
              <a
                href="https://www.teachingenglish.org.uk/professional-development/teachers/knowing-subject/task-based-approach"
                target="_blank"
                rel="noopener noreferrer"
              >
                TeachingEnglish: коммуникативные задачи
              </a>
            </p>
            <p>
              30 уроков — учебная коллекция, а не гарантия достижения уровня или
              официальная сертификация. Назначение ученикам и общий журнал
              результатов будут отдельным этапом платформы.
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
            setNotice("Урок добавлен в ваши материалы.");
            setReload((previous) => previous + 1);
            open(value.id);
          }}
        />
      )}
    </section>
  );
}

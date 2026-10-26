import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  RotateCcw,
  Volume2,
  X,
} from "lucide-react";
import {
  MATERIAL_SKILLS,
  materialStages,
  isCorrectAnswer,
} from "./material-model";
import type { Material, PracticeTask, PracticeItem } from "./material-model";
import {
  blankMaterialDraft as blankDraft,
  materialPracticeKey,
  parseMaterialDraft,
} from "./material-practice";
import type { MaterialDraft as Draft } from "./material-practice";
import "./materials.css";

function loadDraft(key: string): Draft {
  try {
    return parseMaterialDraft(localStorage.getItem(key));
  } catch {
    return blankDraft();
  }
}
export function downloadMaterial(material: Material) {
  const blob = new Blob([JSON.stringify(material.content, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${material.id}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function OrderedAnswer({
  item,
  value,
  onChange,
}: {
  item: PracticeItem;
  value: number[];
  onChange: (indices: number[], answer: string) => void;
}) {
  const tokens = item.tokens ?? [];
  const shift = (item.id.length % Math.max(1, tokens.length - 1)) + 1;
  const pool = tokens.map((text, id) => ({ text, id }));
  const shuffled = [...pool.slice(shift), ...pool.slice(0, shift)];
  return (
    <div className="word-order">
      <div className="word-order-answer" aria-label="Ваше предложение">
        {value.length ? (
          value.map((index, position) => (
            <button
              type="button"
              key={index}
              aria-label={`Убрать слово ${tokens[index]}`}
              onClick={() => {
                const next = value.filter((_, i) => i !== position);
                onChange(next, next.map((i) => tokens[i]).join(" "));
              }}
            >
              {tokens[index]}
              <X size={12} />
            </button>
          ))
        ) : (
          <span>Нажимайте слова в нужном порядке</span>
        )}
      </div>
      <div className="word-order-pool">
        {shuffled.map((token) => (
          <button
            type="button"
            key={token.id}
            disabled={value.includes(token.id)}
            onClick={() => {
              const next = [...value, token.id];
              onChange(next, next.map((i) => tokens[i]).join(" "));
            }}
          >
            {token.text}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="text-button"
        disabled={!value.length}
        onClick={() => onChange([], "")}
      >
        <RotateCcw size={13} />
        Очистить предложение
      </button>
    </div>
  );
}
function Practice({
  task,
  draft,
  update,
}: {
  task: PracticeTask;
  draft: Draft;
  update: (update: (previous: Draft) => Draft) => void;
}) {
  const checked = !!draft.checked[task.id];
  const answered = task.items.filter(
    (item) =>
      !!draft.answers[`${task.id}.${item.id}`]?.trim() &&
      (task.type !== "order" ||
        draft.orders[`${task.id}.${item.id}`]?.length === item.tokens?.length),
  ).length;
  const correct = task.items.filter((item) =>
    isCorrectAnswer(
      draft.answers[`${task.id}.${item.id}`] ?? "",
      item,
      task.type,
    ),
  ).length;
  const set = (key: string, answer: string, indices?: number[]) =>
    update((previous) => ({
      ...previous,
      answers: { ...previous.answers, [key]: answer },
      checked: { ...previous.checked, [task.id]: false },
      orders: indices
        ? { ...previous.orders, [key]: indices }
        : previous.orders,
    }));
  return (
    <section className="material-practice" aria-labelledby={`task-${task.id}`}>
      <div className="practice-heading">
        <div>
          <h3 id={`task-${task.id}`}>{task.title}</h3>
          <p>{task.instruction}</p>
        </div>
        <span>
          {task.items.length} {task.items.length === 1 ? "вопрос" : "вопроса"}
        </span>
      </div>
      {task.items.map((item, index) => {
        const key = `${task.id}.${item.id}`;
        const value = draft.answers[key] ?? "";
        const correctItem = isCorrectAnswer(value, item, task.type);
        return (
          <fieldset
            className={`practice-question ${checked ? (correctItem ? "answer-correct" : "answer-incorrect") : ""}`}
            key={key}
          >
            <legend>
              <span>{index + 1}</span>
              {item.prompt}
            </legend>
            {task.type === "choice" ? (
              <div className="practice-options">
                {item.options?.map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      name={key}
                      checked={value === option}
                      onChange={() => set(key, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : task.type === "match" ? (
              <select
                aria-label={`Ответ: ${item.prompt}`}
                value={value}
                onChange={(event) => set(key, event.target.value)}
              >
                <option value="">Выберите соответствие</option>
                {item.options?.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : task.type === "order" ? (
              <OrderedAnswer
                item={item}
                value={draft.orders[key] ?? []}
                onChange={(indices, answer) => set(key, answer, indices)}
              />
            ) : (
              <input
                aria-label={`Ответ: ${item.prompt}`}
                value={value}
                maxLength={300}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                onChange={(event) => set(key, event.target.value)}
              />
            )}
            {checked && (
              <div className="practice-feedback">
                <strong>
                  {correctItem
                    ? "Верно"
                    : `Один верный ответ: ${item.answers[0]}`}
                </strong>
                <p>{item.explanation}</p>
              </div>
            )}
          </fieldset>
        );
      })}
      <div className="practice-check-row">
        <button
          className="primary"
          disabled={answered !== task.items.length}
          onClick={() =>
            update((previous) => ({
              ...previous,
              checked: { ...previous.checked, [task.id]: true },
            }))
          }
        >
          <Check size={17} />
          Проверить
        </button>
        <span role="status">
          {checked
            ? `${correct} из ${task.items.length} верно`
            : `Заполнено ${answered} из ${task.items.length}`}
        </span>
      </div>
    </section>
  );
}
function InputBlock({
  material,
  draft,
  update,
}: {
  material: Material;
  draft: Draft;
  update: (update: (previous: Draft) => Draft) => void;
}) {
  const [visible, setVisible] = useState(true);
  const [voice, setVoice] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const refresh = () =>
      setVoice(
        speechSynthesis
          .getVoices()
          .some((v) => v.lang.toLowerCase().startsWith("en")),
      );
    refresh();
    speechSynthesis.addEventListener("voiceschanged", refresh);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", refresh);
      speechSynthesis.cancel();
    };
  }, []);
  const speak = () => {
    if (!voice) {
      setNotice(
        "На устройстве нет английского голоса. Учитель может прочитать текст вслух.",
      );
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(material.content.input.text);
    utterance.lang = "en-GB";
    utterance.rate = 0.85;
    utterance.voice =
      speechSynthesis.getVoices().find((v) => v.lang === "en-GB") ??
      speechSynthesis.getVoices().find((v) => v.lang.startsWith("en")) ??
      null;
    speechSynthesis.speak(utterance);
  };
  const input = material.content.input;
  return (
    <>
      <div className="material-section-intro">
        <h2>{input.title}</h2>
        <p>{input.instruction}</p>
      </div>
      <div className="model-actions">
        <button className="secondary" onClick={() => setVisible(!visible)}>
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}{" "}
          {visible ? "Скрыть текст для аудирования" : "Показать текст"}
        </button>
        <button className="secondary" onClick={speak}>
          <Volume2 size={16} />
          Голос устройства
        </button>
      </div>
      {notice && (
        <p className="library-notice" role="status">
          {notice}
        </p>
      )}
      {visible ? (
        <div className={`material-input ${input.format}`} lang="en">
          {input.text}
        </div>
      ) : (
        <div className="hidden-input">
          <BookOpen size={24} />
          <p>
            Сначала послушайте учителя или голос устройства. Текст можно открыть
            для проверки.
          </p>
        </div>
      )}
      <p className="material-helper">
        Аудиозаписи нет: текст читает учитель или доступный английский голос
        устройства. Повторное прослушивание разрешено.
      </p>
      <Practice task={input.questions} draft={draft} update={update} />
    </>
  );
}
function TeacherKeys({ material }: { material: Material }) {
  const l = material.content;
  return (
    <details className="material-teacher-keys">
      <summary>
        <Eye size={17} />
        Ключи и рекомендации учителю
      </summary>
      <div>
        <h3>Как провести урок</h3>
        <ul>
          {l.teacherNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        {[l.input.questions, ...l.practice].map((task) => (
          <section key={task.id}>
            <h3>{task.title}</h3>
            <ol>
              {task.items.map((item) => (
                <li key={item.id}>
                  <strong>{item.answers.join(" / ")}</strong> —{" "}
                  {item.explanation}
                </li>
              ))}
            </ol>
          </section>
        ))}
        <p>
          Письмо и речь проверяйте по критериям задачи. Образцы открытых ответов
          — примеры, допустимы другие корректные варианты.
        </p>
      </div>
    </details>
  );
}

export default function MaterialStudy({
  material,
  teacher,
  onBack,
}: {
  material: Material;
  teacher: boolean;
  onBack: () => void;
}) {
  const [stage, setStage] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const key = materialPracticeKey(material.id, material.version, teacher);
  const [draft, setDraft] = useState<Draft>(() => loadDraft(key));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(draft));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [key, draft]);
  const l = material.content;
  const MATERIAL_STAGES = materialStages(l.duration);
  const current = MATERIAL_STAGES[stage];
  const go = (index: number) => {
    setStage(index);
    requestAnimationFrame(() => {
      const heading = document.getElementById("material-stage-title");
      heading?.scrollIntoView({ block: "start", behavior: "instant" });
      heading?.focus({ preventScroll: true });
    });
  };
  const openPractice = () => {
    const url = new URL(location.origin);
    url.searchParams.set("mode", "student");
    url.searchParams.set("view", "material");
    url.searchParams.set("material", material.id);
    return url.toString();
  };
  return (
    <article
      className={`material-study ${teacher ? "" : "material-student-preview"}`}
    >
      <div className="material-study-toolbar">
        <button className="text-button" onClick={onBack}>
          <ArrowLeft size={17} />
          {teacher ? "В библиотеку" : "В учебную комнату"}
        </button>
        <span>{teacher ? "ПРЕДПРОСМОТР УРОКА" : "ЛИЧНАЯ ПРАКТИКА"}</span>
      </div>
      <header className="material-study-heading">
        <div className="material-tags">
          <span className="material-level">{l.level}</span>
          {l.sequence && (
            <span>Урок {String(l.sequence).padStart(2, "0")}</span>
          )}
          <span>
            <Clock3 size={14} />
            {l.duration} мин · ориентир
          </span>
        </div>
        <h1>{l.title}</h1>
        <p>{l.subtitle}</p>
        <div className="material-skill-tags">
          {l.skills.map((skill) => (
            <span key={skill}>{MATERIAL_SKILLS[skill]}</span>
          ))}
        </div>
        <div className="material-can-do">
          <TargetMark />
          <div>
            <small>ЦЕЛЬ УРОКА</small>
            <p lang="en">{l.goal}</p>
          </div>
        </div>
        {teacher && (
          <div className="material-reader-actions">
            <a
              className="primary"
              href={openPractice()}
              target="_blank"
              rel="noopener"
            >
              <ExternalLink size={16} />
              Открыть практику ученика
            </a>
            <button
              className="secondary"
              onClick={() => downloadMaterial(material)}
            >
              <Download size={16} />
              Экспорт JSON
            </button>
          </div>
        )}
      </header>
      <p
        className={`material-local-status ${storageError ? "library-error" : ""}`}
        role="status"
      >
        {storageError
          ? "Не удалось сохранить ответы в браузере. Не закрывайте страницу до завершения практики."
          : "Ответы сохраняются только в этом браузере. Эта практика пока не назначена ученику и не отправляет результаты учителю."}
      </p>
      {teacher && <TeacherKeys material={material} />}
      <div className="material-study-layout">
        <aside className="material-plan" aria-label="План урока">
          <h2>План урока</h2>
          <p>{l.duration} минут · с учителем</p>
          <nav>
            {MATERIAL_STAGES.map((item, index) => (
              <button
                key={item.id}
                className={index === stage ? "active" : ""}
                aria-current={index === stage ? "step" : undefined}
                onClick={() => go(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                <small>{item.minutes} мин</small>
              </button>
            ))}
          </nav>
          <p className="material-helper">
            Время — ориентир. Меняйте темп и объём повторения по готовности
            ученика.
          </p>
          {confirmReset ? (
            <div className="material-reset-confirm">
              <p>
                Очистить ответы и черновики только этого урока в этом браузере?
              </p>
              <button
                className="danger-button"
                onClick={() => {
                  setDraft(blankDraft());
                  setConfirmReset(false);
                }}
              >
                Очистить
              </button>
              <button
                className="text-button"
                onClick={() => setConfirmReset(false)}
              >
                Отмена
              </button>
            </div>
          ) : (
            <button
              className="text-button"
              onClick={() => setConfirmReset(true)}
            >
              <RotateCcw size={14} />
              Начать практику заново
            </button>
          )}
        </aside>
        <div className="material-stage-content">
          <div className="material-stage-overline">
            ЭТАП {stage + 1} ИЗ {MATERIAL_STAGES.length}{" "}
            <ChevronRight size={13} />
            {current.minutes} мин
          </div>
          <h2 id="material-stage-title" tabIndex={-1}>
            {current.title}
          </h2>
          {current.id === "retrieval" && (
            <>
              <p className="material-section-description">
                Сначала попробуйте вспомнить без подсказки. Потом откройте
                пример. Личный ответ может отличаться.
              </p>
              <div className="retrieval-cards">
                {l.retrieval.map((item, index) => (
                  <div key={index}>
                    <span>
                      {String(index + 1).padStart(2, "0")}
                      {item.fromLesson
                        ? ` · повтор урока ${item.fromLesson}`
                        : " · пробуем с помощью учителя"}
                    </span>
                    <h3>{item.prompt}</h3>
                    <details>
                      <summary>Открыть пример ответа</summary>
                      <p lang="en">{item.answer}</p>
                    </details>
                  </div>
                ))}
              </div>
            </>
          )}
          {current.id === "language" && (
            <>
              <div className="vocabulary-grid">
                {l.vocabulary.map((word) => (
                  <div key={word.term}>
                    <strong lang="en">{word.term}</strong>
                    <span>{word.meaning}</span>
                    <p lang="en">{word.example}</p>
                  </div>
                ))}
              </div>
              <div className="material-rule">
                <span>ЯЗЫКОВОЙ ФОКУС</span>
                <h3>{l.language.focus}</h3>
                <p>{l.language.explanation}</p>
                <ul lang="en">
                  {l.language.examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
                <div className="material-pitfall">
                  <strong>На что обратить внимание</strong>
                  <p>{l.language.pitfall}</p>
                </div>
              </div>
              <section className="material-pronunciation">
                <h3>
                  <Volume2 size={18} />
                  Произношение
                </h3>
                <p>{l.language.pronunciation}</p>
              </section>
            </>
          )}
          {current.id === "input" && (
            <InputBlock material={material} draft={draft} update={setDraft} />
          )}
          {current.id === "practice" && (
            <>
              <p className="material-section-description">
                Завершите блок, проверьте ответы и прочитайте объяснения. После
                изменения ответа блок можно проверить снова.
              </p>
              {l.practice.map((task) => (
                <Practice
                  key={task.id}
                  task={task}
                  draft={draft}
                  update={setDraft}
                />
              ))}
            </>
          )}
          {current.id === "speaking" && (
            <>
              <p className="material-task-situation">{l.speaking.situation}</p>
              <ol className="material-task-steps">
                {l.speaking.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="speaking-support">
                <h3>Фразы-подсказки</h3>
                {l.speaking.support.map((phrase) => (
                  <span key={phrase} lang="en">
                    {phrase}
                  </span>
                ))}
              </div>
              <div className="material-success">
                <h3>Как понять, что задача выполнена</h3>
                <ul>
                  {l.speaking.success.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={17} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <details className="sample-answer">
                <summary>Один возможный диалог</summary>
                <p lang="en">{l.speaking.model}</p>
              </details>
              {teacher && (
                <p className="teacher-task-note">
                  Учителю: {l.speaking.teacherNote}
                </p>
              )}
              <p className="material-helper">
                Один ученик работает с учителем, который меняет роли. Для
                самостоятельной практики можно произнести обе роли.
                Автоматического оценивания речи нет.
              </p>
            </>
          )}
          {current.id === "writing" && (
            <>
              <p className="material-task-situation">{l.writing.instruction}</p>
              <label className="material-writing-label">
                Ваш текст
                <textarea
                  rows={7}
                  value={draft.writing}
                  maxLength={6000}
                  placeholder="Write your answer here…"
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      writing: event.target.value,
                    }))
                  }
                />
              </label>
              <div className="material-success">
                <h3>Проверьте свой текст</h3>
                <ul>
                  {l.writing.checklist.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={17} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <details className="sample-answer">
                <summary>Посмотреть пример после своей попытки</summary>
                <p lang="en">{l.writing.model}</p>
              </details>
              <p className="material-helper">
                Свободный текст оценивает учитель по критериям. Совпадение с
                образцом не требуется.
              </p>
            </>
          )}
          {current.id === "exit" && (
            <>
              <p className="material-section-description">
                Попробуйте выполнить цель ещё раз без текста. Отметьте то, что
                уже получается; это самооценка, а не итоговый балл CEFR.
              </p>
              <div className="material-exit">
                {l.exit.map((item, index) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={draft.exit[index] ?? false}
                      onChange={(event) =>
                        setDraft((previous) => {
                          const exit = [...previous.exit];
                          exit[index] = event.target.checked;
                          return { ...previous, exit };
                        })
                      }
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              <p className="material-task-situation">
                Выберите один трудный момент и повторите его после короткой
                обратной связи учителя.
              </p>
            </>
          )}
          {current.id === "homework" && (
            <>
              <p className="material-task-situation">
                {l.homework.instruction}
              </p>
              <ol className="material-task-steps">
                {l.homework.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="homework-review">
                <Clock3 size={20} />
                <p>{l.homework.review}</p>
              </div>
              <label className="material-writing-label">
                Черновик домашней практики
                <textarea
                  rows={7}
                  value={draft.homework}
                  maxLength={6000}
                  placeholder="Your homework notes…"
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      homework: event.target.value,
                    }))
                  }
                />
              </label>
              <details className="sample-answer">
                <summary>Пример результата</summary>
                <p lang="en">{l.homework.model}</p>
              </details>
              <p className="material-helper">
                На уроке отведите 2 минуты на объяснение. Сама домашняя работа
                рассчитана примерно на 10–15 минут и выполняется отдельно.
              </p>
            </>
          )}
          <div className="material-stage-footer">
            <button
              className="secondary"
              disabled={!stage}
              onClick={() => go(stage - 1)}
            >
              <ArrowLeft size={16} />
              Назад
            </button>
            {stage < MATERIAL_STAGES.length - 1 ? (
              <button className="primary" onClick={() => go(stage + 1)}>
                Далее: {MATERIAL_STAGES[stage + 1].title}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button className="secondary" onClick={() => go(0)}>
                <RotateCcw size={16} />
                Вернуться к повторению
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
function TargetMark() {
  return (
    <span className="can-do-mark">
      <CheckCircle2 size={23} />
    </span>
  );
}

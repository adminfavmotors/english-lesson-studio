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
  restoreMaterialDraft,
} from "./material-practice";
import type { MaterialDraft as Draft } from "./material-practice";
import { APP_LOCALE, APP_LANGUAGE } from "./app-language";
import "./materials.css";

function loadDraft(material: Material, teacher: boolean): Draft {
  try {
    return restoreMaterialDraft(
      (key) => localStorage.getItem(key),
      material.id,
      material.version,
      teacher,
    );
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
      <div className="word-order-answer" aria-label="Your sentence">
        {value.length ? (
          value.map((index, position) => (
            <button
              type="button"
              key={index}
              aria-label={`Remove word ${tokens[index]}`}
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
          <span>Choose the words in the correct order</span>
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
        Clear sentence
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
          {task.items.length}{" "}
          {task.items.length === 1 ? "question" : "questions"}
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
                aria-label={`Answer: ${item.prompt}`}
                value={value}
                onChange={(event) => set(key, event.target.value)}
              >
                <option value="">Choose a match</option>
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
                aria-label={`Answer: ${item.prompt}`}
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
                    ? "Correct"
                    : `Correct answer: ${item.answers[0]}`}
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
          Check answers
        </button>
        <span role="status">
          {checked
            ? `${correct} of ${task.items.length} correct`
            : `${answered} of ${task.items.length} answered`}
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
        "An English voice is not available on this device. You can read the text or ask your teacher to read it aloud.",
      );
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(material.content.input.text);
    utterance.lang = APP_LOCALE;
    utterance.rate = 0.85;
    utterance.voice =
      speechSynthesis.getVoices().find((v) => v.lang === APP_LOCALE) ??
      speechSynthesis.getVoices().find((v) => v.lang.startsWith(APP_LANGUAGE)) ??
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
          {visible ? "Hide text" : "Show text"}
        </button>
        <button className="secondary" onClick={speak}>
          <Volume2 size={16} />
          Read aloud
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
            Listen to your teacher or select Read aloud. Then select Show text to check what you heard.
          </p>
        </div>
      )}
      <p className="material-helper">
        Select Read aloud to hear an English device voice, or ask your teacher to read the text. A recorded audio track is not included.
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
        Answer keys and teacher notes
      </summary>
      <div>
        <h3>Teaching notes</h3>
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
          Use the checklists to review speaking and writing. Model answers
          are examples; other correct answers are welcome.
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
  const [draft, setDraft] = useState<Draft>(() => loadDraft(material, teacher));
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
          {teacher ? "Back to lesson library" : "Back to classroom"}
        </button>
        <span>{teacher ? "LESSON PREVIEW" : "STUDENT PRACTICE"}</span>
      </div>
      <header className="material-study-heading">
        <div className="material-tags">
          <span className="material-level">{l.level}</span>
          {l.sequence && (
            <span>Lesson {String(l.sequence).padStart(2, "0")}</span>
          )}
          <span>
            <Clock3 size={14} />
            {l.duration} min · suggested
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
            <small>LESSON GOAL</small>
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
              Open student practice
            </a>
            <button
              className="secondary"
              onClick={() => downloadMaterial(material)}
            >
              <Download size={16} />
              Download lesson JSON
            </button>
          </div>
        )}
      </header>
      <p
        className={`material-local-status ${storageError ? "library-error" : ""}`}
        role="status"
      >
        {storageError
          ? "Could not save answers in this browser. Keep the page open until you finish."
          : teacher
            ? "Preview answers are saved only in this browser. They do not affect student practice."
            : "Your answers are saved only in this browser. Results are not shared with your teacher yet."}
      </p>
      {teacher && <TeacherKeys material={material} />}
      <div className="material-study-layout">
        <aside className="material-plan" aria-label="Lesson plan">
          <h2>Lesson plan</h2>
          <p>{l.duration} minutes · with your {teacher ? "student" : "teacher"}</p>
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
                <small>{item.minutes} min</small>
              </button>
            ))}
          </nav>
          <p className="material-helper">
            {teacher
              ? "Times are a guide. Adjust the pace and review to suit your student."
              : "Times are a guide. Work at your own pace and ask your teacher for help."}
          </p>
          {confirmReset ? (
            <div className="material-reset-confirm">
              <p>
                Clear all answers, writing and homework drafts for this lesson in this browser?
              </p>
              <button
                className="danger-button"
                onClick={() => {
                  setDraft(blankDraft());
                  setConfirmReset(false);
                }}
              >
                Clear practice
              </button>
              <button
                className="text-button"
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="text-button"
              onClick={() => setConfirmReset(true)}
            >
              <RotateCcw size={14} />
              Reset practice
            </button>
          )}
        </aside>
        <div className="material-stage-content">
          <div className="material-stage-overline">
            STEP {stage + 1} OF {MATERIAL_STAGES.length}{" "}
            <ChevronRight size={13} />
            {current.minutes} min
          </div>
          <h2 id="material-stage-title" tabIndex={-1}>
            {current.title}
          </h2>
          {current.id === "retrieval" && (
            <>
              <p className="material-section-description">
                Try to remember without help. Then open the example. Your own
                answer can be different.
              </p>
              <div className="retrieval-cards">
                {l.retrieval.map((item, index) => (
                  <div key={index}>
                    <span>
                      {String(index + 1).padStart(2, "0")}
                      {item.fromLesson
                        ? `  · review lesson ${item.fromLesson}`
                        : "  · try with your teacher"}
                    </span>
                    <h3>{item.prompt}</h3>
                    <details>
                      <summary>Show an example answer</summary>
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
                <span>LANGUAGE FOCUS</span>
                <h3>{l.language.focus}</h3>
                <p>{l.language.explanation}</p>
                <ul lang="en">
                  {l.language.examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
                <div className="material-pitfall">
                  <strong>Watch out</strong>
                  <p>{l.language.pitfall}</p>
                </div>
              </div>
              <section className="material-pronunciation">
                <h3>
                  <Volume2 size={18} />
                  Pronunciation
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
                Answer each question, check your answers and read the feedback.
                You can change an answer and check again.
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
                <h3>Useful phrases</h3>
                {l.speaking.support.map((phrase) => (
                  <span key={phrase} lang="en">
                    {phrase}
                  </span>
                ))}
              </div>
              <div className="material-success">
                <h3>Speaking checklist</h3>
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
                <summary>Example dialogue</summary>
                <p lang="en">{l.speaking.model}</p>
              </details>
              {teacher && (
                <p className="teacher-task-note">
                  Teacher note: {l.speaking.teacherNote}
                </p>
              )}
              <p className="material-helper">
                Work with your teacher, who plays the other roles. For solo
                practice, you can say both parts. Speaking is not graded
                automatically.
              </p>
            </>
          )}
          {current.id === "writing" && (
            <>
              <p className="material-task-situation">{l.writing.instruction}</p>
              <label className="material-writing-label">
                Your writing
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
                <h3>Check your writing</h3>
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
                <summary>Show an example answer</summary>
                <p lang="en">{l.writing.model}</p>
              </details>
              <p className="material-helper">
                Your teacher reviews your writing using the task criteria. Your
                answer does not need to match the example.
              </p>
            </>
          )}
          {current.id === "exit" && (
            <>
              <p className="material-section-description">
                Try the main task again without looking at the text. Tick what
                you can do. Use this checklist to reflect on your progress.
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
                Choose one difficult point to practise again after feedback from
                your teacher.
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
                Homework draft
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
                <summary>Example answer</summary>
                <p lang="en">{l.homework.model}</p>
              </details>
              <p className="material-helper">
                {teacher
                  ? "Use this stage to explain the homework. Allow 10–15 minutes after the lesson for the student to complete it."
                  : "Allow 10–15 minutes after the lesson to complete your homework."}
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
              Back
            </button>
            {stage < MATERIAL_STAGES.length - 1 ? (
              <button className="primary" onClick={() => go(stage + 1)}>
                Next: {MATERIAL_STAGES[stage + 1].title}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button className="secondary" onClick={() => go(0)}>
                <RotateCcw size={16} />
                Back to warm-up
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

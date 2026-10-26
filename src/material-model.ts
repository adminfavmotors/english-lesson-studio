export const MATERIAL_SKILLS = {
  grammar: "Грамматика",
  vocabulary: "Лексика",
  reading: "Чтение",
  listening: "Аудирование",
  speaking: "Разговорная речь",
  writing: "Письмо",
  spelling: "Орфография",
  pronunciation: "Произношение",
} as const;
export type MaterialSkill = keyof typeof MATERIAL_SKILLS;
export type PracticeItem = {
  id: string;
  prompt: string;
  answers: string[];
  options?: string[];
  tokens?: string[];
  explanation: string;
};
export type PracticeTask = {
  id: string;
  type: "choice" | "gap" | "order" | "match";
  title: string;
  instruction: string;
  items: PracticeItem[];
};
export type MaterialContent = {
  schemaVersion: 1;
  title: string;
  subtitle: string;
  level: string;
  topic: string;
  skills: MaterialSkill[];
  duration: number;
  sequence: number | null;
  goal: string;
  vocabulary: { term: string; meaning: string; example: string }[];
  language: {
    focus: string;
    explanation: string;
    examples: string[];
    pitfall: string;
    pronunciation: string;
  };
  input: {
    title: string;
    format: "dialogue" | "text" | "notice" | "menu" | "message" | "schedule";
    text: string;
    instruction: string;
    questions: PracticeTask;
  };
  retrieval: { prompt: string; answer: string; fromLesson: number | null }[];
  practice: PracticeTask[];
  speaking: {
    situation: string;
    steps: string[];
    support: string[];
    success: string[];
    model: string;
    teacherNote: string;
  };
  writing: { instruction: string; model: string; checklist: string[] };
  exit: string[];
  homework: {
    instruction: string;
    steps: string[];
    model: string;
    review: string;
  };
  teacherNotes: string[];
};
export type Material = {
  id: string;
  owner_id: string | null;
  title: string;
  subtitle: string;
  level: string;
  topic: string;
  skills: MaterialSkill[];
  duration: number;
  sequence: number | null;
  content: MaterialContent;
  version: number;
  created_at: string;
  updated_at: string;
};
export type MaterialSummary = Omit<Material, "content">;
export const MATERIAL_STAGES = [
  { id: "retrieval", title: "Вспоминаем", minutes: 4 },
  { id: "language", title: "Язык урока", minutes: 8 },
  { id: "input", title: "Читаем и слушаем", minutes: 7 },
  { id: "practice", title: "Практикуемся", minutes: 10 },
  { id: "speaking", title: "Говорим", minutes: 8 },
  { id: "writing", title: "Пишем", minutes: 4 },
  { id: "exit", title: "Проверяем цель", minutes: 2 },
  { id: "homework", title: "Домашняя практика", minutes: 2 },
] as const;
export function materialStages(duration: number) {
  const stages = MATERIAL_STAGES.map((stage) => ({
    ...stage,
    minutes: Math.max(1, Math.floor((stage.minutes * duration) / 45)),
  }));
  const priority = MATERIAL_STAGES.map((stage, index) => ({
    index,
    fraction: ((stage.minutes * duration) / 45) % 1,
  })).sort((a, b) => b.fraction - a.fraction);
  let remaining =
    duration - stages.reduce((sum, stage) => sum + stage.minutes, 0);
  for (let i = 0; remaining > 0; i++, remaining--)
    stages[priority[i % priority.length].index].minutes++;
  return stages;
}
export function normalizeAnswer(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.!?]+$/, "")
    .trim();
}
export function isCorrectAnswer(
  value: string,
  item: PracticeItem,
  type: PracticeTask["type"] = "gap",
) {
  return (
    typeof value === "string" &&
    !!value.trim() &&
    item.answers.some((answer) =>
      type === "choice" || type === "match"
        ? value === answer
        : normalizeAnswer(answer) === normalizeAnswer(value),
    )
  );
}
export function materialId(sequence: number) {
  return `a1-${String(sequence).padStart(2, "0")}`;
}
export function validateMaterial(value: unknown): string[] {
  const errors: string[] = [];
  if (!value || typeof value !== "object" || Array.isArray(value))
    return ["Нужен JSON-объект урока."];
  const m = value as Record<string, unknown>;
  const text = (v: unknown, max = 6000) =>
    typeof v === "string" && !!v.trim() && v.length <= max;
  const list = (v: unknown, min = 1, max = 30) =>
    Array.isArray(v) &&
    v.length >= min &&
    v.length <= max &&
    v.every((x) => text(x));
  if (m.schemaVersion !== 1) errors.push("schemaVersion должен быть 1.");
  for (const key of ["title", "subtitle", "topic", "goal"])
    if (!text(m[key], 300)) errors.push(`Проверьте ${key}.`);
  if (!["A1", "A2", "B1", "B2", "C1", "C2"].includes(String(m.level)))
    errors.push("Уровень: A1–C2.");
  if (
    !Number.isInteger(m.duration) ||
    Number(m.duration) < 15 ||
    Number(m.duration) > 180
  )
    errors.push("Длительность: 15–180 минут.");
  if (
    !(
      m.sequence === null ||
      (Number.isInteger(m.sequence) &&
        Number(m.sequence) >= 1 &&
        Number(m.sequence) <= 999)
    )
  )
    errors.push("sequence: номер урока или null.");
  if (
    !Array.isArray(m.skills) ||
    !m.skills.length ||
    m.skills.length > 8 ||
    m.skills.some((s) => !Object.hasOwn(MATERIAL_SKILLS, String(s)))
  )
    errors.push("Укажите навыки из схемы.");
  if (
    !Array.isArray(m.vocabulary) ||
    m.vocabulary.length < 3 ||
    m.vocabulary.length > 20 ||
    m.vocabulary.some(
      (v) =>
        !v ||
        typeof v !== "object" ||
        !text(v.term, 120) ||
        !text(v.meaning, 240) ||
        !text(v.example, 500),
    )
  )
    errors.push("Нужны 3–20 слов/фраз с переводом и примером.");
  const language = m.language as MaterialContent["language"];
  if (
    !language ||
    !text(language.focus, 200) ||
    !text(language.explanation) ||
    !list(language.examples) ||
    !text(language.pitfall) ||
    !text(language.pronunciation)
  )
    errors.push(
      "Заполните language: фокус, объяснение, примеры, типичную ошибку и произношение.",
    );
  const ids = new Set<string>();
  const task = (t: PracticeTask | undefined) => {
    if (
      !t ||
      !["choice", "gap", "order", "match"].includes(t.type) ||
      !text(t.id, 80) ||
      !text(t.title, 200) ||
      !text(t.instruction) ||
      !Array.isArray(t.items) ||
      !t.items.length ||
      t.items.length > 20
    ) {
      errors.push("Некорректный блок упражнений.");
      return;
    }
    if (ids.has(t.id)) errors.push("ID блоков должны быть уникальны.");
    ids.add(t.id);
    const itemIds = new Set<string>();
    for (const item of t.items) {
      if (
        !item ||
        !text(item.id, 80) ||
        itemIds.has(item.id) ||
        !text(item.prompt, 2000) ||
        !list(item.answers, 1, 8) ||
        !text(item.explanation, 1200)
      ) {
        errors.push(`Проверьте вопросы в ${t.id}.`);
        continue;
      }
      itemIds.add(item.id);
      if (
        ["choice", "match"].includes(t.type) &&
        (!list(item.options, 2, 12) ||
          !item.answers.every((a) => item.options?.includes(a)))
      )
        errors.push(`Ответ должен быть среди вариантов в ${t.id}.`);
      if (
        t.type === "order" &&
        (!list(item.tokens, 2, 30) ||
          !isCorrectAnswer((item.tokens ?? []).join(" "), item))
      )
        errors.push(`tokens должны образовывать правильный ответ в ${t.id}.`);
    }
  };
  const input = m.input as MaterialContent["input"];
  if (
    !input ||
    !text(input.title, 200) ||
    !text(input.text, 10000) ||
    !text(input.instruction) ||
    !["dialogue", "text", "notice", "menu", "message", "schedule"].includes(
      input.format,
    )
  )
    errors.push("Нужен исходный текст input.");
  else task(input.questions);
  if (!Array.isArray(m.practice) || !m.practice.length || m.practice.length > 6)
    errors.push("Нужны 1–6 практических блоков.");
  else m.practice.forEach((t) => task(t));
  if (
    !Array.isArray(m.retrieval) ||
    m.retrieval.length < 2 ||
    m.retrieval.length > 8 ||
    m.retrieval.some(
      (r) =>
        !r ||
        !text(r.prompt) ||
        !text(r.answer) ||
        !(
          r.fromLesson === null ||
          (Number.isInteger(r.fromLesson) &&
            r.fromLesson > 0 &&
            r.fromLesson <= 999)
        ),
    )
  )
    errors.push("Заполните повторение retrieval.");
  const speaking = m.speaking as MaterialContent["speaking"];
  if (
    !speaking ||
    !text(speaking.situation) ||
    !list(speaking.steps) ||
    !list(speaking.support) ||
    !list(speaking.success) ||
    !text(speaking.model) ||
    !text(speaking.teacherNote)
  )
    errors.push("Заполните разговорную задачу speaking.");
  const writing = m.writing as MaterialContent["writing"];
  if (
    !writing ||
    !text(writing.instruction) ||
    !text(writing.model) ||
    !list(writing.checklist)
  )
    errors.push("Заполните письменную задачу writing.");
  const homework = m.homework as MaterialContent["homework"];
  if (
    !homework ||
    !text(homework.instruction) ||
    !list(homework.steps) ||
    !text(homework.model) ||
    !text(homework.review)
  )
    errors.push("Заполните homework.");
  if (!list(m.exit, 2, 6) || !list(m.teacherNotes, 1, 8))
    errors.push("Нужны критерии цели и заметки учителю.");
  if (new TextEncoder().encode(JSON.stringify(value)).length > 100000)
    errors.push("Один урок — не более 100 КБ JSON без форматирования.");
  return [...new Set(errors)];
}

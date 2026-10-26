export const MATERIAL_SKILLS = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  reading: "Reading",
  listening: "Listening",
  speaking: "Speaking",
  writing: "Writing",
  spelling: "Spelling",
  pronunciation: "Pronunciation",
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
  { id: "retrieval", title: "Recall", minutes: 4 },
  { id: "language", title: "Language focus", minutes: 8 },
  { id: "input", title: "Read and listen", minutes: 7 },
  { id: "practice", title: "Practise", minutes: 10 },
  { id: "speaking", title: "Speak", minutes: 8 },
  { id: "writing", title: "Write", minutes: 4 },
  { id: "exit", title: "Check your goal", minutes: 2 },
  { id: "homework", title: "Home practice", minutes: 2 },
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
    return ["Provide a lesson as a JSON object."];
  const m = value as Record<string, unknown>;
  const text = (v: unknown, max = 6000) =>
    typeof v === "string" && !!v.trim() && v.length <= max;
  const list = (v: unknown, min = 1, max = 30) =>
    Array.isArray(v) &&
    v.length >= min &&
    v.length <= max &&
    v.every((x) => text(x));
  if (m.schemaVersion !== 1) errors.push("schemaVersion must be 1.");
  for (const key of ["title", "subtitle", "topic", "goal"])
    if (!text(m[key], 300)) errors.push(`Check ${key}.`);
  if (!["A1", "A2", "B1", "B2", "C1", "C2"].includes(String(m.level)))
    errors.push("Choose a level from A1 to C2.");
  if (
    !Number.isInteger(m.duration) ||
    Number(m.duration) < 15 ||
    Number(m.duration) > 180
  )
    errors.push("Duration must be between 15 and 180 minutes.");
  if (
    !(
      m.sequence === null ||
      (Number.isInteger(m.sequence) &&
        Number(m.sequence) >= 1 &&
        Number(m.sequence) <= 999)
    )
  )
    errors.push("sequence must be a lesson number or null.");
  if (
    !Array.isArray(m.skills) ||
    !m.skills.length ||
    m.skills.length > 8 ||
    m.skills.some((s) => !Object.hasOwn(MATERIAL_SKILLS, String(s)))
  )
    errors.push("Choose skills supported by the schema.");
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
    errors.push("Include 3–20 words or phrases with a meaning and example.");
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
      "Complete language: focus, explanation, examples, a common mistake and pronunciation.",
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
      errors.push("Invalid practice block.");
      return;
    }
    if (ids.has(t.id)) errors.push("Practice block IDs must be unique.");
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
        errors.push(`Check the questions in ${t.id}.`);
        continue;
      }
      itemIds.add(item.id);
      if (
        ["choice", "match"].includes(t.type) &&
        (!list(item.options, 2, 12) ||
          !item.answers.every((a) => item.options?.includes(a)))
      )
        errors.push(`The answer must be one of the options in ${t.id}.`);
      if (
        t.type === "order" &&
        (!list(item.tokens, 2, 30) ||
          !isCorrectAnswer((item.tokens ?? []).join(" "), item))
      )
        errors.push(`tokens must form a correct answer in ${t.id}.`);
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
    errors.push("Provide the source text in input.");
  else task(input.questions);
  if (!Array.isArray(m.practice) || !m.practice.length || m.practice.length > 6)
    errors.push("Include 1–6 practice blocks.");
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
    errors.push("Complete the retrieval section.");
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
    errors.push("Complete the speaking task.");
  const writing = m.writing as MaterialContent["writing"];
  if (
    !writing ||
    !text(writing.instruction) ||
    !text(writing.model) ||
    !list(writing.checklist)
  )
    errors.push("Complete the writing task.");
  const homework = m.homework as MaterialContent["homework"];
  if (
    !homework ||
    !text(homework.instruction) ||
    !list(homework.steps) ||
    !text(homework.model) ||
    !text(homework.review)
  )
    errors.push("Complete the homework section.");
  if (!list(m.exit, 2, 6) || !list(m.teacherNotes, 1, 8))
    errors.push("Include goal criteria and teacher notes.");
  if (new TextEncoder().encode(JSON.stringify(value)).length > 100000)
    errors.push("A lesson must be no larger than 100 KB of compact JSON.");
  return [...new Set(errors)];
}

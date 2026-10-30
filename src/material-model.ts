export const MATERIAL_SKILLS = {
  reading: "Reading",
  listening: "Listening",
  speaking: "Speaking",
  writing: "Writing",
} as const;
export type MaterialSkill = keyof typeof MATERIAL_SKILLS;
export const MATERIAL_LANGUAGE_FOCUS = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  pronunciation: "Pronunciation",
  spelling_punctuation: "Spelling and punctuation",
} as const;
export type MaterialLanguageFocus = keyof typeof MATERIAL_LANGUAGE_FOCUS;
export const LEGACY_MATERIAL_SKILLS = {
  ...MATERIAL_SKILLS,
  grammar: "Grammar", vocabulary: "Vocabulary",
  spelling: "Spelling", pronunciation: "Pronunciation",
} as const;
export type MaterialClassification =
  | { classification_status: "reviewed"; skills: MaterialSkill[];
      language_focus: MaterialLanguageFocus[]; legacy_skills: null }
  | { classification_status: "needs_review"; skills: null;
      language_focus: null; legacy_skills: (keyof typeof LEGACY_MATERIAL_SKILLS)[] };
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
export type MaterialCatalogue = MaterialClassification & {
  title: string;
  subtitle: string;
  level: string;
  topic: string;
  duration: number;
  sequence: number | null;
};
export const MATERIAL_CATALOGUE_FIELDS = [
  "title", "subtitle", "level", "topic", "skills", "duration", "sequence",
  "language_focus", "classification_status", "legacy_skills",
] as const;
export type MaterialContent = {
  schemaVersion: 2;
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
export type MaterialDocument = {
  catalogue: MaterialCatalogue;
  content: MaterialContent;
};
type MaterialRecord = {
  id: string;
  owner_id: string | null;
  version: number;
  catalogue_version: number;
  created_at: string;
  updated_at: string;
};
export type Material = MaterialCatalogue & MaterialRecord & { content: MaterialContent };
export type MaterialSummary = MaterialCatalogue & MaterialRecord;
export const MATERIAL_STAGES = [
  { id: "retrieval", title: "Warm-up", minutes: 4 },
  { id: "language", title: "Language focus", minutes: 8 },
  { id: "input", title: "Read and listen", minutes: 7 },
  { id: "practice", title: "Practise", minutes: 10 },
  { id: "speaking", title: "Speak", minutes: 8 },
  { id: "writing", title: "Write", minutes: 4 },
  { id: "exit", title: "Self-check", minutes: 2 },
  { id: "homework", title: "Homework", minutes: 2 },
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
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

export function materialCatalogue(value: MaterialCatalogue): MaterialCatalogue {
  return {
    title: value.title,
    subtitle: value.subtitle,
    level: value.level,
    topic: value.topic,
    skills: value.skills,
    language_focus: value.language_focus,
    classification_status: value.classification_status,
    legacy_skills: value.legacy_skills,
    duration: value.duration,
    sequence: value.sequence,
  } as MaterialCatalogue;
}

export function materialDocument(material: Material): MaterialDocument {
  return { catalogue: materialCatalogue(material), content: material.content };
}

export function validateMaterialCatalogue(value: unknown): string[] {
  if (!record(value)) return ["Provide the lesson catalogue description."];
  const errors: string[] = [];
  for (const key of ["title", "subtitle", "topic"])
    if (
      typeof value[key] !== "string" ||
      !value[key].trim() ||
      value[key].length > 300
    )
      errors.push(`Check ${key}.`);
  if (!["A1", "A2", "B1", "B2", "C1", "C2"].includes(String(value.level)))
    errors.push("Choose a level from A1 to C2.");
  if (
    !Number.isInteger(value.duration) ||
    Number(value.duration) < 15 ||
    Number(value.duration) > 180
  )
    errors.push("Duration must be between 15 and 180 minutes.");
  if (!(value.sequence === null || (
    Number.isInteger(value.sequence) && Number(value.sequence) >= 1 && Number(value.sequence) <= 999
  )))
    errors.push("sequence must be a lesson number or null.");
  const facet = (items: unknown, labels: Record<string, string>, unique = true) =>
    Array.isArray(items) && items.length <= Object.keys(labels).length &&
    items.every(item => typeof item === "string" && Object.hasOwn(labels, item)) &&
    (!unique || new Set(items).size === items.length);
  if (value.classification_status === "reviewed") {
    if (!facet(value.skills, MATERIAL_SKILLS))
      errors.push("Skills must contain distinct values: Reading, Listening, Speaking or Writing.");
    if (!facet(value.language_focus, MATERIAL_LANGUAGE_FOCUS))
      errors.push("Language focus must contain distinct supported language features.");
    if (value.legacy_skills !== null)
      errors.push("A reviewed classification must not include previous mixed tags.");
    if (Array.isArray(value.skills) && Array.isArray(value.language_focus) &&
        value.skills.length + value.language_focus.length === 0)
      errors.push("Choose at least one supported skill or language focus before marking the classification as reviewed.");
  } else if (value.classification_status === "needs_review") {
    if (value.skills !== null || value.language_focus !== null)
      errors.push("Leave Skills and Language focus as null until the previous classification has been reviewed.");
    if (!facet(value.legacy_skills, LEGACY_MATERIAL_SKILLS, false) ||
        !(value.legacy_skills as unknown[])?.length)
      errors.push("Keep the previous supported tags for classification review.");
  } else errors.push('classification_status must be "reviewed" or "needs_review".');
  return errors;
}

export function validateMaterialDocument(value: unknown): string[] {
  if (!record(value)) return ["Provide a lesson as a JSON object."];
  const errors = [
    ...validateMaterialCatalogue(value.catalogue),
    ...validateMaterialContent(value.content),
  ];
  // Classification has its own small, controlled bounds. Adding those fields
  // must not make a previously valid near-limit lesson impossible to reimport.
  let budgetValue = value;
  if (record(value.catalogue)) {
    const catalogue = { ...value.catalogue };
    if (catalogue.classification_status === "needs_review") catalogue.skills = catalogue.legacy_skills;
    for (const key of ["classification_status", "language_focus", "legacy_skills"]) delete catalogue[key];
    budgetValue = { ...value, catalogue };
  }
  if (new TextEncoder().encode(JSON.stringify(budgetValue)).length > 100000)
    errors.push("Lesson content and its description must be no larger than 100 KB of compact JSON.");
  return [...new Set(errors)];
}

// Previous flat files and separated documents are converted at the import boundary.
// Old mixed tags are preserved as evidence, never treated as a reviewed classification.
export function readMaterialDocument(value: unknown): {
  document: MaterialDocument | null;
  errors: string[];
} {
  let document = value;
  if (record(value) && value.schemaVersion === 1) {
    if (["classification_status", "language_focus", "legacy_skills"].some(key => Object.hasOwn(value, key)))
      return { document: null, errors: ["Keep classification fields in the catalogue of a current lesson document."] };
    const catalogue = Object.fromEntries(
      ["title", "subtitle", "level", "topic", "skills", "duration", "sequence"]
        .map(key => [key, value[key]]),
    );
    const content = Object.fromEntries(
      Object.entries(value).filter(([key]) =>
        !MATERIAL_CATALOGUE_FIELDS.some(field => field === key)),
    );
    document = { catalogue, content: { ...content, schemaVersion: 2 } };
  }
  const previousCatalogue = record(document) && record(document.catalogue) ? document.catalogue : null;
  if (record(document) && previousCatalogue &&
      !["classification_status", "language_focus", "legacy_skills"]
        .some(key => Object.hasOwn(previousCatalogue, key))) {
    const catalogue = previousCatalogue;
    document = { ...document, catalogue: { ...catalogue,
      skills: null, language_focus: null, classification_status: "needs_review",
      legacy_skills: catalogue.skills,
    } };
  }
  const errors = validateMaterialDocument(document);
  return { document: errors.length ? null : (document as MaterialDocument), errors };
}

export function validateMaterialContent(value: unknown): string[] {
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
  if (m.schemaVersion !== 2) errors.push("Content schemaVersion must be 2.");
  if (!text(m.goal, 300)) errors.push("Check goal.");
  if (MATERIAL_CATALOGUE_FIELDS.some(key => Object.hasOwn(m, key)))
    errors.push("Keep catalogue fields outside lesson content.");
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
  return [...new Set(errors)];
}

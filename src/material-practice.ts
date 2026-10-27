import compatibilityData from "./data/a1-draft-compatibility.json" with { type: "json" };

type DraftCompatibility = {
  version: number;
  fromVersions: number[];
  resetTasks?: string[];
};
const draftCompatibility: Record<string, DraftCompatibility> = compatibilityData;

export type MaterialDraft = {
  answers: Record<string, string>;
  checked: Record<string, boolean>;
  orders: Record<string, number[]>;
  writing: string;
  homework: string;
  exit: boolean[];
};
export const blankMaterialDraft = (): MaterialDraft => ({
  answers: {},
  checked: {},
  orders: {},
  writing: "",
  homework: "",
  exit: [],
});
export const materialPracticeKey = (
  id: string,
  version: number,
  teacher: boolean,
) =>
  `lessonstudio.practice.v1.${teacher ? "teacher" : "student"}.${id}.${version}`;
export function parseMaterialDraft(raw: string | null): MaterialDraft {
  const draft = blankMaterialDraft();
  if (!raw || raw.length > 100000) return draft;
  try {
    const v = JSON.parse(raw);
    if (!v || typeof v !== "object" || Array.isArray(v)) return draft;
    if (v.answers && typeof v.answers === "object")
      draft.answers = Object.fromEntries(
        Object.entries(v.answers).filter(
          ([key, value]) =>
            key.length <= 180 &&
            typeof value === "string" &&
            value.length <= 300,
        ),
      ) as Record<string, string>;
    if (v.checked && typeof v.checked === "object")
      draft.checked = Object.fromEntries(
        Object.entries(v.checked).filter(
          ([key, value]) => key.length <= 80 && typeof value === "boolean",
        ),
      ) as Record<string, boolean>;
    if (v.orders && typeof v.orders === "object")
      draft.orders = Object.fromEntries(
        Object.entries(v.orders).filter(
          ([key, value]) =>
            key.length <= 180 &&
            Array.isArray(value) &&
            value.length <= 30 &&
            new Set(value).size === value.length &&
            value.every((i) => Number.isInteger(i) && i >= 0 && i < 30),
        ),
      ) as Record<string, number[]>;
    draft.writing =
      typeof v.writing === "string" ? v.writing.slice(0, 6000) : "";
    draft.homework =
      typeof v.homework === "string" ? v.homework.slice(0, 6000) : "";
    draft.exit = Array.isArray(v.exit) ? v.exit.slice(0, 6).map(Boolean) : [];
  } catch {
    /* damaged local data starts a fresh practice */
  }
  return draft;
}

// Reuse only reviewed content revisions. Learner writing is never rewritten.
export function restoreMaterialDraft(
  read: (key: string) => string | null,
  id: string,
  version: number,
  teacher: boolean,
): MaterialDraft {
  const current = read(materialPracticeKey(id, version, teacher));
  if (current !== null) return parseMaterialDraft(current);
  const compatibility = draftCompatibility[id];
  if (!compatibility || version !== compatibility.version)
    return blankMaterialDraft();
  for (const previous of compatibility.fromVersions) {
    const raw = read(materialPracticeKey(id, previous, teacher));
    if (raw === null) continue;
    const draft = parseMaterialDraft(raw);
    for (const task of compatibility.resetTasks ?? []) {
      delete draft.checked[task];
      for (const entries of [draft.answers, draft.orders])
        for (const key of Object.keys(entries))
          if (key === task || key.startsWith(`${task}.`)) delete entries[key];
    }
    return draft;
  }
  return blankMaterialDraft();
}

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  isCorrectAnswer,
  MATERIAL_STAGES,
  materialStages,
  materialId,
  normalizeAnswer,
  validateMaterial,
} from "../src/material-model.ts";
import type { MaterialContent } from "../src/material-model.ts";
import {
  materialPracticeKey,
  parseMaterialDraft,
  restoreMaterialDraft,
} from "../src/material-practice.ts";
const lessons = JSON.parse(
  fs.readFileSync(
    new URL("../src/data/a1-lessons.json", import.meta.url),
    "utf8",
  ),
) as MaterialContent[];
test("the A1 collection contains thirty complete, ordered and distinct original lessons", () => {
  assert.equal(lessons.length, 30);
  assert.equal(new Set(lessons.map((l) => l.title)).size, 30);
  assert.equal(new Set(lessons.map((l) => l.input.text)).size, 30);
  assert.equal(new Set(lessons.map((l) => l.speaking.situation)).size, 30);
  for (const [index, l] of lessons.entries()) {
    assert.equal(l.sequence, index + 1);
    assert.equal(l.level, "A1");
    assert.deepEqual(validateMaterial(l), [], `Lesson ${index + 1}`);
    assert.equal(
      materialId(index + 1),
      `a1-${String(index + 1).padStart(2, "0")}`,
    );
  }
});
test("each lesson has retrieval, vocabulary, comprehension, practice, output and homework", () => {
  assert.equal(
    MATERIAL_STAGES.reduce((n, s) => n + s.minutes, 0),
    45,
  );
  let items = 0;
  let words = 0;
  const types = new Set<string>();
  const skills = new Set<string>();
  for (const l of lessons) {
    assert.equal(l.duration, 45);
    assert.equal(l.vocabulary.length, 6);
    words += l.vocabulary.length;
    assert.equal(l.retrieval.length, 3);
    for (const r of l.retrieval)
      assert.ok(
        r.fromLesson === null || r.fromLesson < l.sequence!,
        "Recall only introduced lessons",
      );
    for (const t of [l.input.questions, ...l.practice]) {
      types.add(t.type);
      items += t.items.length;
      for (const item of t.items)
        assert.ok(isCorrectAnswer(item.answers[0], item, t.type));
    }
    for (const skill of l.skills) skills.add(skill);
    assert.ok(l.speaking.steps.length >= 3);
    assert.ok(l.writing.checklist.length >= 3);
    assert.ok(l.homework.steps.length >= 3);
  }
  assert.equal(items, 300);
  assert.equal(words, 180);
  assert.deepEqual([...types].sort(), ["choice", "gap", "match", "order"]);
  assert.equal(skills.size, 8);
});

test("built-in course text has no Cyrillic language regressions", () => {
  const versions = JSON.parse(
    fs.readFileSync(
      new URL("../src/data/a1-versions.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(Object.keys(versions).length, lessons.length);
  for (const lesson of lessons) {
    assert.ok(
      Number.isInteger(versions[materialId(lesson.sequence!)]) &&
        versions[materialId(lesson.sequence!)] >= 2,
    );
    const walk = (value: unknown, path: string) => {
      if (typeof value === "string")
        assert.equal(
          /[\u0400-\u04ff]/u.test(value),
          false,
          `Non-English text in lesson ${lesson.sequence}: ${path}`,
        );
      else if (Array.isArray(value))
        value.forEach((entry, index) => walk(entry, `${path}.${index}`));
      else if (value && typeof value === "object")
        for (const [key, entry] of Object.entries(value))
          walk(entry, `${path}.${key}`);
    };
    walk(lesson, "lesson");
  }
});
test("choice grading respects case and punctuation when those are being taught", () => {
  const capitalization = lessons[26].practice[0].items[0];
  assert.equal(
    isCorrectAnswer("I study on Friday.", capitalization, "choice"),
    true,
  );
  assert.equal(
    isCorrectAnswer("i study on friday.", capitalization, "choice"),
    false,
  );
  const punctuation = lessons[26].practice[0].items[1];
  assert.equal(
    isCorrectAnswer("Are you free on Friday?", punctuation, "choice"),
    true,
  );
  assert.equal(
    isCorrectAnswer("Are you free on Friday.", punctuation, "choice"),
    false,
  );
});
test("imported lesson plans fit every supported duration and keep all eight stages", () => {
  for (let duration = 15; duration <= 180; duration++) {
    const plan = materialStages(duration);
    assert.equal(plan.length, 8);
    assert.equal(
      plan.reduce((sum, stage) => sum + stage.minutes, 0),
      duration,
    );
    assert.ok(plan.every((stage) => stage.minutes >= 1));
  }
  assert.deepEqual(materialStages(45), MATERIAL_STAGES);
});
test("short answers allow harmless whitespace, terminal punctuation and apostrophe variants", () => {
  const negative = lessons[11].practice[0].items[3];
  assert.ok(isCorrectAnswer("  DON'T  ", negative, "gap"));
  assert.ok(isCorrectAnswer("don’t.", negative, "gap"));
  assert.equal(normalizeAnswer("  I’m   Anna. "), "i'm anna");
  assert.equal(isCorrectAnswer("", negative), false);
});
test("JSON import rejects incomplete lessons and invalid question keys", () => {
  assert.ok(validateMaterial(null).length);
  assert.ok(validateMaterial([]).length);
  assert.ok(validateMaterial({ title: "Empty lesson" }).length);
  const invalid = structuredClone(lessons[0]);
  invalid.input.questions.items[0].answers = ["Not an option"];
  assert.ok(
    validateMaterial(invalid).some((e) => e.includes("one of the options")),
  );
  const broken = structuredClone(lessons[4]);
  broken.practice[1].items[0].tokens = ["wrong", "sentence"];
  assert.ok(validateMaterial(broken).some((e) => e.includes("tokens")));
});
test("all incorrect choice options in the course are actually graded incorrect", () => {
  for (const l of lessons)
    for (const task of [l.input.questions, ...l.practice])
      if (task.type === "choice" || task.type === "match")
        for (const item of task.items)
          for (const option of item.options ?? [])
            assert.equal(
              isCorrectAnswer(option, item, task.type),
              item.answers.includes(option),
              `${l.sequence}: ${item.prompt}: ${option}`,
            );
});
test("teacher preview, student practice, material and revision have independent drafts", () => {
  assert.notEqual(
    materialPracticeKey("a1-01", 1, true),
    materialPracticeKey("a1-01", 1, false),
  );
  assert.notEqual(
    materialPracticeKey("a1-01", 1, false),
    materialPracticeKey("a1-02", 1, false),
  );
  assert.notEqual(
    materialPracticeKey("a1-01", 1, false),
    materialPracticeKey("a1-01", 2, false),
  );
});
test("damaged practice storage cannot inject non-string answers or invalid word indices", () => {
  assert.deepEqual(parseMaterialDraft("{").answers, {});
  const draft = parseMaterialDraft(
    JSON.stringify({
      answers: { ok: "am", bad: 12 },
      orders: { ok: [1, 0], bad: [999], duplicate: [1, 1] },
      writing: "Hello",
      homework: "Practice",
      exit: [true, false],
    }),
  );
  assert.deepEqual(draft.answers, { ok: "am" });
  assert.deepEqual(draft.orders, { ok: [1, 0] });
  assert.equal(draft.writing, "Hello");
});

test("reviewed content revisions preserve work and clear only a replaced activity", () => {
  const versions = JSON.parse(fs.readFileSync(new URL("../src/data/a1-versions.json", import.meta.url), "utf8"));
  const previous = {
    answers: { "description-meaning.1": "Old selected option", "have-got.1": "have" },
    checked: { "description-meaning": true, "have-got": true },
    orders: { "description-meaning.1": [1, 0], sentence: [1, 0] },
    writing: "My original writing — Олена",
    homework: "My original homework",
    exit: [true, false],
  };
  for (const previousVersion of [1, 2]) {
    const storage = new Map([
      [materialPracticeKey("a1-19", previousVersion, false), JSON.stringify(previous)],
    ]);
    const read = (key: string) => storage.get(key) ?? null;
    const version = versions["a1-19"];
    const draft = restoreMaterialDraft(read, "a1-19", version, false);
    assert.equal(draft.writing, previous.writing);
    assert.equal(draft.homework, previous.homework);
    assert.deepEqual(draft.orders, { sentence: [1, 0] });
    assert.deepEqual(draft.exit, previous.exit);
    assert.deepEqual(draft.answers, { "have-got.1": "have" });
    assert.deepEqual(draft.checked, { "have-got": true });
    assert.deepEqual(restoreMaterialDraft(read, "a1-19", version + 1, false).answers, {});
    assert.deepEqual(restoreMaterialDraft(read, "a1-19", version, true).answers, {});
    storage.set(materialPracticeKey("a1-19", version, false), "{}");
    assert.deepEqual(
      restoreMaterialDraft(read, "a1-19", version, false).answers,
      {},
      "An existing current draft, including a reset, takes priority",
    );
  }
});
test("every compatibility entry matches the published revision and lists older revisions explicitly", () => {
  const compatibility = JSON.parse(fs.readFileSync(new URL("../src/data/a1-draft-compatibility.json", import.meta.url), "utf8"));
  const versions = JSON.parse(fs.readFileSync(new URL("../src/data/a1-versions.json", import.meta.url), "utf8"));
  assert.deepEqual(Object.keys(compatibility).sort(), Object.keys(versions).sort());
  for (const [id, entry] of Object.entries(compatibility) as [string, {version: number; fromVersions: number[]}][]) {
    assert.equal(entry.version, versions[id]);
    assert.equal(new Set(entry.fromVersions).size, entry.fromVersions.length);
    assert.deepEqual(entry.fromVersions, [...entry.fromVersions].sort((a, b) => b - a));
    assert.ok(entry.fromVersions.every(v => Number.isInteger(v) && v >= 1 && v < entry.version));
    const old = JSON.stringify({ answers: { "unrelated.1": "original" }, writing: "Keep this writing" });
    const latest = entry.fromVersions[0];
    const restored = restoreMaterialDraft(key => key === materialPracticeKey(id, latest, false) ? old : null, id, entry.version, false);
    assert.equal(restored.answers["unrelated.1"], "original");
    assert.equal(restored.writing, "Keep this writing");
  }
  assert.deepEqual(restoreMaterialDraft(() => null, "private-lesson", 1, false).answers, {});
});

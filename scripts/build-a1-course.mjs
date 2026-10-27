import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { validateMaterial, MATERIAL_SKILLS } from "../src/material-model.ts";
import first from "./a1/content-01-05.mjs";
import second from "./a1/content-06-10.mjs";
import third from "./a1/content-11-15.mjs";
import fourth from "./a1/content-16-20.mjs";
import fifth from "./a1/content-21-25.mjs";
import sixth from "./a1/content-26-30.mjs";
const lessons = [...first, ...second, ...third, ...fourth, ...fifth, ...sixth];
if (lessons.length !== 30) throw new Error("Expected 30 lessons");
for (const [index, lesson] of lessons.entries()) {
  const errors = validateMaterial(lesson);
  if (errors.length)
    throw new Error(`Lesson ${index + 1}: ${errors.join("; ")}`);
  if (lesson.sequence !== index + 1) throw new Error("Invalid sequence");
}
const directory = fileURLToPath(new URL("../src/data/", import.meta.url));
fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(
  directory + "a1-lessons.json",
  JSON.stringify(lessons, null, 2) + "\n",
);
const tasks = lessons.reduce((sum, l) => sum + l.practice.length + 1, 0);
const items = lessons.reduce(
  (sum, l) =>
    sum +
    l.practice.reduce((n, t) => n + t.items.length, 0) +
    l.input.questions.items.length,
  0,
);
console.log(
  JSON.stringify({
    lessons: lessons.length,
    practiceBlocks: tasks,
    checkedItems: items,
    vocabulary: lessons.reduce((n, l) => n + l.vocabulary.length, 0),
  }),
);
const docs = fileURLToPath(new URL("../docs/", import.meta.url));
fs.mkdirSync(docs, { recursive: true });
const overview =
  "# A1: first conversations\n\n30 original lessons for one learner and a teacher, with everyday contexts suitable mainly for teenagers and adults. Each lesson suggests 45 minutes: 22.5 contact hours in total. This is a learning collection, not a guarantee of reaching A1. The teacher adjusts pace and review to the learner.\n\nEach lesson includes a warm-up (4 min), language and 6 useful words or phrases (8), a source text and comprehension (7), practice (10), speaking (8), writing (4), a self-check (2) and a homework briefing (2). Homework takes about 10–15 minutes outside the lesson.\n\nThe collection contains " +
  tasks +
  " checked practice blocks, " +
  items +
  " closed questions, 180 vocabulary entries with English meanings and examples, 30 speaking tasks, 30 writing tasks and 30 homework tasks. All lesson instructions, explanations, feedback and teacher notes are in English.\n\n| No. | Lesson | Topic | Main skills | Communication goal |\n|---|---|---|---|---|\n";
const table = lessons
  .map(
    (l) =>
      `| ${l.sequence} | [${l.title}](https://english-lesson-studio.vercel.app/teacher/materials/a1-${String(l.sequence).padStart(2, "0")}) | ${l.topic} | ${l.skills.map((s) => MATERIAL_SKILLS[s]).join(", ")} | ${l.goal} |`,
  )
  .join("\n");
fs.writeFileSync(
  docs + "A1-CURRICULUM.md",
  overview +
    table +
    "\n\nTeaching approach and limitations: [A1-METHODOLOGY.md](A1-METHODOLOGY.md).\n",
);

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
  "# A1: первые уверенные разговоры\n\n30 оригинальных уроков для индивидуального занятия учителя с учеником, преимущественно в подростковых и взрослых повседневных контекстах. Ориентир — 45 минут на урок; это 22,5 контактных часа, а не гарантия освоения уровня. Темп и необходимое число повторений определяет учитель.\n\nВ каждом уроке: повторение из памяти (4 мин), язык и 6 речевых единиц (8), исходный текст и понимание (7), практика (10), разговорная задача (8), письмо (4), самооценка (2), объяснение домашней практики (2). Домашняя работа выполняется отдельно, примерно 10–15 минут.\n\nКоллекция: " +
  tasks +
  " проверяемых блоков, " +
  items +
  " закрытых вопросов, 180 слов и фраз с переводом и примером, 30 разговорных задач, 30 письменных задач и 30 домашних работ.\n\n| № | Урок | Тема | Основной фокус | Коммуникативная цель |\n|---|---|---|---|---|\n";
const table = lessons
  .map(
    (l) =>
      `| ${l.sequence} | [${l.title}](https://english-lesson-studio.vercel.app/?mode=teacher&view=assignments&material=a1-${String(l.sequence).padStart(2, "0")}) | ${l.topic} | ${l.skills.map((s) => MATERIAL_SKILLS[s]).join(", ")} | ${l.goal} |`,
  )
  .join("\n");
fs.writeFileSync(
  docs + "A1-CURRICULUM.md",
  overview +
    table +
    "\n\nМетодические основания и ограничения: [A1-METHODOLOGY.md](A1-METHODOLOGY.md).\n",
);

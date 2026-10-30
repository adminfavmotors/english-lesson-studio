import fs from "node:fs";
import { assertReviewedA1 } from "./a1/classification-review.mjs";
const lessons = JSON.parse(
  fs.readFileSync(
    new URL("../src/data/a1-lessons.json", import.meta.url),
    "utf8",
  ),
);
assertReviewedA1(lessons);
const start = Number(process.argv[2] || 0),
  count = Number(process.argv[3] || 5);
const quote = (value) => "'" + value.replaceAll("'", "''") + "'";
const columns = "title,subtitle,level,topic,skills,language_focus,classification_status,legacy_skills,duration,sequence,content";
const rows = lessons
  .slice(start, start + count)
  .map(
    ({ catalogue: c, content }) =>
      `(${quote("a1-" + String(c.sequence).padStart(2, "0"))},null,${[c.title,c.subtitle,c.level,c.topic].map(quote).join(",")},${quote(JSON.stringify(c.skills))}::jsonb,${quote(JSON.stringify(c.language_focus))}::jsonb,'reviewed',null,${c.duration},${c.sequence},${quote(JSON.stringify(content))}::jsonb)`,
  );
process.stdout.write(
  `insert into public.lesson_materials(id,owner_id,${columns}) values\n` +
    rows.join(",\n") +
    "\non conflict(id) do update set " +
    columns.split(",").map(column => `${column}=excluded.${column}`).join(",") +
    " where public.lesson_materials.owner_id is null and row(" +
    columns.split(",").map(column => `public.lesson_materials.${column}`).join(",") +
    ") is distinct from row(" +
    columns.split(",").map(column => `excluded.${column}`).join(",") + ");\n",
);

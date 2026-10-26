import fs from "node:fs";
const lessons = JSON.parse(
  fs.readFileSync(
    new URL("../src/data/a1-lessons.json", import.meta.url),
    "utf8",
  ),
);
const start = Number(process.argv[2] || 0),
  count = Number(process.argv[3] || 5);
const quote = (value) => "'" + value.replaceAll("'", "''") + "'";
const rows = lessons
  .slice(start, start + count)
  .map(
    (l) =>
      `(${quote("a1-" + String(l.sequence).padStart(2, "0"))},null,${quote(JSON.stringify(l))}::jsonb)`,
  );
process.stdout.write(
  "insert into public.lesson_materials(id,owner_id,content) values\n" +
    rows.join(",\n") +
    "\non conflict(id) do update set content=excluded.content where public.lesson_materials.owner_id is null;\n",
);

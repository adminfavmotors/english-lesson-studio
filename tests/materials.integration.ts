import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { backend } from "../src/backend.config.ts";

test("the public database serves the same thirty complete A1 lessons as the packaged course", async () => {
  const lessons = JSON.parse(
    fs.readFileSync(
      new URL("../src/data/a1-lessons.json", import.meta.url),
      "utf8",
    ),
  );
  const versions = JSON.parse(
    fs.readFileSync(
      new URL("../src/data/a1-versions.json", import.meta.url),
      "utf8",
    ),
  );
  const response = await fetch(
    `${backend.url}/rest/v1/lesson_materials?select=id,owner_id,content,version&owner_id=is.null&order=sequence.asc`,
    {
      headers: { apikey: backend.publishableKey },
      signal: AbortSignal.timeout(20000),
    },
  );
  assert.equal(response.status, 200);
  const rows = await response.json();
  assert.equal(rows.length, 30);
  for (const [index, row] of rows.entries()) {
    assert.equal(row.id, `a1-${String(index + 1).padStart(2, "0")}`);
    assert.equal(row.owner_id, null);
    assert.equal(
      row.version,
      versions[row.id],
      `Packaged version differs for ${row.id}`,
    );
    assert.deepEqual(
      row.content,
      lessons[index],
      `Database content differs for ${row.id}`,
    );
  }
});

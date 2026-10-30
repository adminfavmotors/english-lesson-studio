import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { testDatabase } from './helpers/test-database.ts';

test('migrations and access checks run in an isolated Postgres database', async t => {
  const db = await testDatabase();
  try {
    for (const name of ['students.database.sql', 'materials.database.sql', 'material-classification.database.sql', 'workspace-access.database.sql', 'student-invitations.database.sql']) {
      await t.test(name, async () => {
        const results = await db.exec(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));
        assert.ok(results.some(result => result.rows.some(row => String(row.result).startsWith('PASS:'))));
      });
    }
  } finally { await db.close(); }
});

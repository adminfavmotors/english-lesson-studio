import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';

export async function testDatabase(options: {
  beforeMigration?: (db: PGlite, name: string) => Promise<void>;
  seedLibrary?: boolean;
  throughMigration?: string;
} = {}) {
  const db = new PGlite({ extensions: { pgcrypto } });
  try {
    // Minimal Supabase Auth surface; this database never contacts Supabase.
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth; create schema extensions;
      create extension pgcrypto with schema extensions;
      create table auth.users(id uuid primary key,aud text,role text,email text,email_confirmed_at timestamptz,raw_user_meta_data jsonb);
      create function auth.uid() returns uuid language sql stable as $$
        select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid;
      $$;
      grant usage on schema auth,public,extensions to anon,authenticated;
      grant execute on function auth.uid() to anon,authenticated;
    `);
    const directory = new URL('../../supabase/migrations/', import.meta.url);
    for (const name of fs.readdirSync(directory).filter(name => name.endsWith('.sql')).sort()) {
      await options.beforeMigration?.(db, name);
      await db.exec(fs.readFileSync(new URL(name, directory), 'utf8'));
      if (options.throughMigration === name) break;
    }
    if (options.seedLibrary !== false) {
      const lessons = JSON.parse(fs.readFileSync(new URL('../../src/data/a1-lessons.json', import.meta.url), 'utf8'));
      for (const {catalogue: c, content} of lessons) {
        const fields = [...Object.keys(c), 'content'];
        const values = [...Object.values(c), content].map(value => Array.isArray(value) || (value && typeof value === 'object') ? JSON.stringify(value) : value);
        await db.query(`insert into public.lesson_materials(id,owner_id,${fields.join(',')}) values($1,null,${fields.map((_,i) => '$'+(i+2)).join(',')})`,
          [`a1-${String(c.sequence).padStart(2,'0')}`, ...values]);
      }
    }
    return db;
  } catch (error) { await db.close(); throw error; }
}

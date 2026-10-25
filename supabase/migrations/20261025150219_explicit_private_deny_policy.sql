-- Access goes through capability-checked RPCs, never direct table operations.
create policy "No direct client access" on lesson_private.sessions for all to anon, authenticated using (false) with check (false);

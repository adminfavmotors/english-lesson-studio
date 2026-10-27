# Product language

English is the source language of Lesson Studio. Author the interface, errors,
accessibility labels, lesson content and teacher guidance directly in natural
English. Use British English consistently (for example, colour, favourite and
practise). Keep learner instructions short and appropriate to the lesson level.

Use `src/app-language.ts` for the application's language and display locale.
The browser's preferred language must not change the product language. Keep
lesson time zones separate from the interface locale.

Use Materials for the service menu and Lesson library for the collection page.
Distinguish teacher previews, student practice saved in a browser, and shared
lessons. Labels must describe the action a control actually performs. Write
role-specific guidance, actionable empty states and inline English validation
messages. Keep developer setup instructions out of learner-facing screens.

Do not introduce a Russian source layer, runtime translation or a language
switcher. When other languages are requested, add explicit localisations based
on the English source. User-written names, notes and answers retain their
original text; never translate or rewrite them automatically.

# Workspace boundaries

Teacher pages live under `/teacher/`; student pages live under `/student/`.
Keep their navigation and entry components separate. New internal links use
canonical paths; old root URLs redirect for compatibility. Query parameters
never change the workspace of a canonical path. A shared lesson's server
response, not cached state or a URL role, determines its invitation access.

Routing does not replace account authorisation or RLS. Browser-only classroom
drafts and broadcast channels are isolated by workspace; shared sessions
synchronise through their existing invitation credentials. Existing email
confirmation return URLs remain a compatibility bridge until provider URL
configuration is updated in the authentication work.

All workspace routes now require a confirmed Supabase account. Trust only the
server-managed `workspace_members` role. Never derive privileges from an email
typed in a form, user metadata, a query parameter or browser storage. Students
receive invitations to individual shared lessons; the library is teacher-only.
Keep the A1 authoring snapshot out of browser imports and public build chunks.
See `docs/ACCOUNT-ACCESS.md` for the current rules and remaining work.

# Shared interface styles

`src/main.tsx` imports only `src/app.css` for product styles. Keep every page's
CSS in that static entry so navigation cannot change stylesheet order. Define
colours and the interface font only in `src/theme.css`; use semantic tokens in
component styles. Shared buttons and form controls belong in `foundation.css`.
Do not add route-level CSS imports, page-specific palettes or override tails.
Use `AppLink` for internal links. Invitation, account callback and cross-workspace
navigation intentionally reload to initialise isolated stores and credentials.

# Lesson changes

The editable A1 sources are `scripts/a1/content-*.mjs`. Run `npm run content:build`
after editing them. Design activities around communication and understanding
English in context. Use translation exercises only when explicitly requested.

Keep question IDs stable when their meaning and grading remain compatible.
Give a changed activity a new ID. Only restore old drafts through the explicitly
reviewed revisions in `src/data/a1-draft-compatibility.json`; preserve unrelated
answers and learner writing. Keep the shared database content, built-in snapshot
and revision manifests in sync when publishing a content revision.

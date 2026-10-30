# Change discipline

Work one step at a time: each step delivers one precise, agreed change. Keep
the scope focused; do not bundle unrelated fixes or start the next change
without the owner's next instruction.

Understand the root cause and the affected architecture before editing. Make
one coherent solution in the implementation that owns the behaviour. Do not
mask symptoms with workarounds, duplicate logic, extra override layers or
patches layered over a flawed design.

When replacing a flawed implementation, remove the superseded code and its
obsolete branches or styles as part of that change. Do not leave competing
implementations in place. Preserve user data and required compatibility through
an explicit migration where needed. Verify the intended behaviour and relevant
regression risks before calling the step complete.

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

# Catalogue development direction

Lesson Studio is intended to become an open service for independent teachers
with trial and paid access and an author catalogue. The first teacher workspace
is a pilot, not a permanent single-teacher product boundary. Current account
authorisation remains in force until a separately agreed onboarding change.

When changing the library model, distinguish reusable activities, lessons,
courses/methodologies and personal collections. Use CEFR-aligned facets and a
controlled vocabulary. Keep material identity, revisions, authorship, private
ownership, access entitlements and actual teaching use distinct. Previewing or
opening a page must not implicitly become a payable use. Do not implement
unagreed billing, payout or ranking rules as part of library work.

The agreed future stage, repeat-use payout principle and unresolved rules are
recorded in the local `internal-docs/10-platform-and-author-catalogue.md`.

Definitions, assignment rules and the runtime contract for Skills and Language
focus are in `docs/MATERIAL-CLASSIFICATION.md`. Use the reviewed A1 mapping;
never infer a reviewed classification from old mixed tags or section headings.
Preserve unreviewed legacy tags explicitly, independently of account permissions.

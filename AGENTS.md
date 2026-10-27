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

# Lesson changes

The editable A1 sources are `scripts/a1/content-*.mjs`. Run `npm run content:build`
after editing them. Design activities around communication and understanding
English in context. Use translation exercises only when explicitly requested.

Keep question IDs stable when their meaning and grading remain compatible.
Give a changed activity a new ID. Only restore old drafts through the explicitly
reviewed revisions in `src/data/a1-draft-compatibility.json`; preserve unrelated
answers and learner writing. Keep the shared database content, built-in snapshot
and revision manifests in sync when publishing a content revision.

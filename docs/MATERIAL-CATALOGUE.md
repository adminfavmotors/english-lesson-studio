# Catalogue descriptions and teaching content

## Contract

`lesson_materials` stores one authoritative catalogue description in its ordinary
columns: `title`, `subtitle`, `level`, `topic`, `skills`, `language_focus`,
`classification_status`, `legacy_skills`, `duration` and `sequence`.
`search_text` is generated from those columns. Teaching content lives in
`content`, uses `schemaVersion: 2`, and contains the goal, vocabulary, language
explanation, source text, activities, criteria, homework and teacher notes.
Catalogue fields cannot also be stored inside teaching content.

The eight-stage lesson plan is unchanged. This work does not introduce separate
activities, an editing interface, authorship payments or account onboarding.

The implemented Skills and Language focus contract, including pending legacy
classifications, is specified in [MATERIAL-CLASSIFICATION](MATERIAL-CLASSIFICATION.md).
It is verified locally and awaits a coordinated release.

## Independent revisions

- `version` changes only when `content` changes. Browser draft keys continue to
  use the material ID, this teaching revision and the existing workspace scope.
- `catalogue_version` changes only when catalogue columns change.
- A combined edit changes both counters; a no-op changes neither counter.
- `updated_at` records a row change. It is not the identity of a teaching revision.
- Both counters remain server-managed. Teacher writes still require the existing
  teacher membership and ownership RLS. The studio collection remains read-only
  to ordinary teachers; private imports retain their owner and favourites.

Future catalogue editors should use `catalogue_version` for optimistic checks.
Teaching-content edits should check `version`; edits of both parts should check
both. Catalogue changes must not add draft-compatibility exceptions. A genuine
change to a question or grading continues to require the reviewed content
compatibility rules. The learning goal remains in teaching content because
changing its meaning can change the activity being taught.

`schemaVersion` identifies the content format. It is independent of the
material's teaching revision. Converting the schema does not require discarding
learner answers when the actual activities and marking are unchanged.

## Authoring, import and export

Native JSON documents have two sections:

```text
{
  "catalogue": { title, subtitle, level, topic, skills, language_focus,
                 classification_status, legacy_skills, duration, sequence },
  "content": { "schemaVersion": 2, goal, vocabulary, language, ... }
}
```

This is a shape illustration, not a complete JSON template. Download a lesson
from the library for a complete validated example. Exports contain catalogue
and content only, without database IDs, ownership, revision counters or timestamps.
Imports create a private material and clear its course sequence, as before.

Previously downloaded flat schema-1 files and earlier separated schema-2 files
are explicitly converted at the file import boundary. Mixed tags are retained
for classification review. The player and database use only the current
separated contract. Invalid old files still receive validation errors.

Editable A1 sources remain in `scripts/a1/content-*.mjs`. Their shared authoring
helper emits the separated document. Run `npm run content:build` to validate and
rebuild the snapshot and curriculum. The A1 snapshot is not imported into public
application chunks. `npm run content:seed:sql` prints a studio-only upsert for the
separated columns and content. Repeating an identical seed changes neither
counter; a catalogue-only seed does not advance the teaching revision.

## Migration and release

The concrete baseline, local release bundle and recovery procedure are recorded
in [MATERIAL-RELEASE](MATERIAL-RELEASE.md).

`20261029204914_separate_material_catalogue.sql` converts the existing generated
catalogue columns to ordinary columns without changing their values, removes
their copies from content, and replaces the unconditional revision trigger.
During that conversion it preserves IDs, teaching versions, owners, favourites,
creation dates and last-update dates. Initial catalogue revisions are 1.

The catalogue migration, `20261030180952_separate_material_facets.sql`, and
the final frontend must be released together, in that migration order.
The old frontend
expects catalogue fields inside content, and the new frontend expects the new
database contract. Prepare and verify the frontend build before applying the
migration, then publish that build in the same release. Already open old pages
must reload. This is not a zero-downtime compatibility bridge.

The migration file does not apply itself to the working database. Do not reseed
the collection merely to perform the migration: existing content is converted
in place, including private materials. Rolling back only the frontend after
conversion would restore an incompatible client.

## Verification

- `npm test`: document and classification validation, both legacy conversions,
  near-limit imports, exports, existing grading
  and explicit draft compatibility.
- `npm run test:database`: all migrations and account-access SQL, independent
  counters, classification states, invalid metadata/content rejection, private
  ownership, populated-library upgrades and exact-review guards with rollback.
- `npm run test:catalogue:browser`: combined facets, pagination, real library,
  player, saved writing, a catalogue edit and reload, JSON download, validation
  errors, and current/legacy imports using isolated SQL
  with synthetic Auth fixtures. No request reaches the working database.
- `npm run build`: TypeScript and the production frontend.

Local verification does not establish that a migration has been applied or that
real email delivery and user-account onboarding have been tested.

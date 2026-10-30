# Catalogue release and recovery

Prepared on 30 October 2026. This document prepares the release; it does not
authorise or perform database changes, publication, rollback or a Git push.

## Recorded baseline and candidate

- Repository: `adminfavmotors/english-lesson-studio`.
- Baseline commit: `53c6e380285247c170889efbca0b96b6a364c6ae`.
- Supabase project: `susbugetsyencnqdtvua`.
- Vercel project: `prj_PcrQ5f27mvGLc8DALwKfou1d1rja`.
- Vercel team: `team_Ti9tsJADXcxMkBXIIZwqWLah`.
- Production alias: `https://english-lesson-studio.vercel.app`.
- Baseline production deployment: `dpl_2JHrfNHkJKUjoM4QmQCuvp8M1muX`, READY,
  sourced from the baseline commit.
- Baseline migration history: nine applied migrations. The working library
  still has generated catalogue columns and flat schema-1 content.
- Local baseline tag: `pre-catalogue-release-2026-10-30`.
- Candidate branch: `release/catalogue-classification-2026-10-30`.
- Candidate tag: `catalogue-classification-2026-10-30`. Resolve the tag to the
  exact commit before release; the local manifest also records its full SHA.

These identifiers were inspected through the connected services. Refresh them
at the actual release: a previously recorded deployment is not proof that
production still points to it. Do not push this candidate to the production
branch during preparation; Git integration can publish it automatically.

The local recovery directory is
`.release-backups/catalogue-2026-10-30.local/`. It is excluded by the existing
`*.local` rule. Do not commit its snapshots or archives. The manifest records
hashes of its snapshots, verification report, tested Vite output, Git bundle
and private project documentation archive. The Git bundle contains the old
and candidate source histories; the private documentation is separate.

To recover source code from the bundle, clone its candidate branch into a new
directory, then select the candidate or baseline tag as required:

```text
git clone --branch release/catalogue-classification-2026-10-30 <bundle-path> <new-directory>
```

The bundle is self-contained; this command needs no GitHub access. The manifest
and checksum file identify the exact archived candidate and baseline commits.

`materials-before-release.json` is a scoped snapshot of all material rows,
favourites, generated-column definitions, grants, policies, the revision
function and migration history. A separate schema file records constraints
and indexes. It is not a full Supabase backup: Auth accounts, invitations,
student/session records and browser storage are outside its scope. The Vite
archive is a `dist` build, not a Vercel Build Output package for `--prebuilt`.

## Prepared checks

The candidate must pass:

```text
npm run content:build
npm test
npm run test:database
npm run test:recovery
npm run test:catalogue:browser
npm run build
```

The recovery suite exercises rollback after the first migration or both,
including later edits, new private imports, favourites, teaching revisions,
drafts, generated columns, grants and account isolation. It also checks refusal
of unknown later migrations and refusal of a conversion that would lose data.

The captured snapshot can be checked independently, entirely offline:

```powershell
node --experimental-strip-types scripts/release/verify-material-backup.mjs '.release-backups/catalogue-2026-10-30.local/materials-before-release.json'
```

That verifier restores the snapshot in an in-memory PostgreSQL database,
applies both forward migrations and exercises recovery. It does not contact
Supabase or Vercel. A successful result verifies the captured material data
and the recovery script; it does not claim a full provider disaster restore.

## Actual release: a separately authorised step

1. Reconfirm project, team, active deployment and exact candidate commit.
   Capture fresh material/favourite/schema/history snapshots and verify them.
   Keep material writes paused through the database/client transition.
2. Apply `20261029204914_separate_material_catalogue.sql`, then
   `20261030180952_separate_material_facets.sql`. Record the exact provider
   migration versions as well as the names `separate_material_catalogue` and
   `separate_material_facets`. The provider may assign timestamps different
   from local filenames. Do not repair unrelated historical timestamps merely
   to make a CLI push pass; the baseline session migration already has a
   different provider timestamp.
3. Publish the exact candidate with the matching frontend in the same release
   window. Check the complete teacher-library flow and require old open pages
   to reload. Retain material writes paused if the contracts do not match.

Do not run the studio seed as a substitute for either migration. The migrations
convert existing rows, preserving IDs, owners, teaching versions and favourites.
The second migration rejects studio content or catalogue values that differ
from the editorial review.

## Recovery decision and order

Prefer a verified forward repair when it can restore service without another
format transition. If the old client must be restored:

1. Keep material writes paused. Save and hash a **fresh current** material,
   favourite and schema/history snapshot, even if the release just failed.
   The pre-release snapshot alone cannot contain subsequent imports or edits.
2. If neither migration committed, leave the database unchanged and restore
   the baseline frontend deployment if necessary.
3. If the first migration or both committed, run the reviewed
   [restore-material-catalogue.sql](../scripts/release/restore-material-catalogue.sql)
   through the selected project's administrative SQL connection. The script
   owns one transaction and locks only the material table during conversion.
   It is an operational recovery script, outside automatic migrations.
4. Confirm the old generated-column contract and teaching revisions, then
   return production traffic to the recorded baseline deployment and verify
   its alias and readiness. Re-enable material writes only when database and
   frontend contracts match. Existing pages must reload.

Vercel's rollback operation changes production traffic to a selected deployment;
use the inspected project/team and baseline deployment ID. It does not execute
the separate database recovery. See [Vercel rollback](https://vercel.com/docs/cli/rollback).
This preparation step does not invoke that operation.

The SQL converts **current** rows into the old format. It keeps newly imported
materials, current teaching content, question IDs, owner IDs, teaching versions,
timestamps and favourites. Reviewed facets combine into old mixed tags, with
`spelling_punctuation` represented as `spelling`; pending rows retain their
original mixed tags. Richer classification and catalogue revision metadata
remain in the fresh recovery snapshot because the old contract cannot store
them separately. It does not overwrite all rows with the older snapshot.

The script restores the baseline checks, generated columns, indexes, revision
trigger and writable-column surface; it keeps teacher/owner RLS and removes
only the two agreed migration-history names in the same transaction. Unknown
later migrations, inconsistent history or a conversion that cannot fit the old
contract stop recovery before data is discarded. A database error leaves the
transaction aborted: issue `ROLLBACK` before inspecting or retrying.

After a rollback, reconcile current material/classification data with the fresh
snapshot before another forward release. Do not blindly reapply a migration
whose original catalogue-hash guards no longer match the restored mixed tags.
The initial snapshot and the local bundle are single-machine recovery assets;
off-device copies and provider-wide backups are separate operations.

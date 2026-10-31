# Public entry and account access

Official Clerk components at `/login` own registration, sign-in, email
verification, recovery and sessions. The public homepage links to that account
page. Lesson Studio does not implement password handling.

**Release status:** this implementation is prepared on the Clerk migration
branch. The production Supabase database and deployed frontend have not been
switched. Follow [CLERK-CUTOVER](CLERK-CUTOVER.md) before publishing; installing
the SDK or applying SQL alone does not complete the change.

## Authentication and teaching access

Supabase's official Custom OIDC Third-Party Auth integration verifies Clerk's
signed session tokens through the main origin's `/__clerk` discovery endpoint.
The database additionally pins the exact Clerk issuer and allowed app
origins, requires an active session ID and Clerk's verified-email claim, and rejects old
Supabase Auth tokens. Roles always come from `public.workspace_members`.
Client metadata, a typed email address, a query parameter and browser storage
cannot grant teaching access.

`WorkspaceAuth` requests `workspace_account` before importing a workspace. Its
private, transactional provisioning function maps the immutable Clerk user ID
to the application's stable UUID. The SDK supplies a current session token on
every API request, including shared-lesson requests. A changed account remounts
its workspace; sign-out is handled by Clerk.

## Existing accounts and the first owner

The migration copies the existing account UUIDs and verified email state into
`lesson_private.accounts`, changes foreign keys to that internal identity table,
and retains memberships, material ownership, favourites and roster connections.
It removes the superseded Supabase signup trigger. It does not rewrite lesson
content, revisions, answers or local learner drafts.

An existing email identity can be claimed once through a verified email from
the pinned Clerk instance. After binding, the Clerk user ID determines identity:
changing an email or registering another account with the old address cannot
transfer the UUID or role. The server-managed first-owner reservation retains
its one-time semantics. New confirmed accounts receive a student membership;
open teacher onboarding is a separately agreed change.

Supabase passwords are not copied into Clerk. Existing users complete Clerk's
account setup or use the configured email-code method; ownership and
teaching permissions are preserved independently of the old password.

## Invitation return links

Lesson and student-invitation secrets remain in this tab's `sessionStorage`.
Clerk hash routing runs only at the clean, same-origin `/login` URL, for sign-in,
sign-up and sign-out. Once authenticated, Lesson Studio restores the validated
internal destination and removes the saved return. The server still checks the
account and invitation independently. If another browser is used or the tab's
storage is lost, reopen the original invitation after signing in.

## Personal student invitations

The implementation in `20261027205743_student_account_invitations.sql`
links a roster card to a confirmed student account after explicit acceptance.
This migration must be applied before publishing the updated frontend; its
presence in the repository alone does not change the working database.

In the student profile, the teacher creates a personal invitation for the card's
email address, copies the link and shares it themselves. Creating the link does
not send an email. The link uses `/student/connect#invite=<secret>`; only a hash
of its 256-bit secret is stored in the private invitations table. It expires
after seven days. Replacing or revoking it invalidates the previous link.
Editing the contact email or archiving the card also invalidates pending links;
restoring the card does not reactivate them.

The server checks the current membership and the confirmed email from the
verified Clerk session before revealing the student name or accepting an
invitation. A different
account, a teacher account or an unconfirmed account cannot accept. The stable internal
account ID is written by the RPC, never by a roster form. A student can have one
linked card per teacher. Repeated acceptance by the same account is idempotent;
changing contact details never transfers an existing account connection.
Unlinking an accepted connection is not part of this step.

The student home reads only its own connection names and dates through a
dedicated RPC. Students receive no SELECT permission on `teacher_students`,
whose private teacher notes stay protected. Connections do not grant library
access or alter account roles or existing shared-lesson credentials.

Existing accounts can sign in on the invitation page. Signing out there keeps
the personal link so the student can switch accounts. New users confirm their
email through Clerk’s account setup. The original invitation is restored
from the same tab or reopened manually; its secret never enters Clerk’s URLs.

## Materials and shared lessons

Only trusted teachers can read the studio collection and their own imported
materials, manage their roster and use favourites. The A1 source snapshot stays
available for authoring and seeding, but is no longer imported by application
code or emitted as a public content chunk. A connection failure shows a retry
message; it never falls back to an unrestricted copy of the collection.

Catalogue fields and teaching content have independent server-managed revisions.
The same teacher/owner RLS protects both; owners cannot write revision counters
or transfer ownership. See [MATERIAL-CATALOGUE](MATERIAL-CATALOGUE.md) for the
separated contract, JSON compatibility and coordinated migration/frontend release.

Students see an invitation-based learning home. They cannot browse the library
or open arbitrary material IDs. Teachers can still preview a student material.
Named material assignments, homework delivery and binding a shared textbook
lesson invitation to an individual student account are future work.

Shared textbook lessons require both a confirmed account and a valid lesson
capability. A teacher capability also requires a trusted teacher membership.
Only teachers can create sessions. Capabilities remain in URL fragments. Anyone
with a student account and the complete student invitation can join that lesson,
so the invitation should still be shared only with the intended learner.

The original textbook implementation/image and previously published source
copies are not a confidential content store. This change protects current
account operations and database library access; it cannot revoke downloaded
copies or make a public Git repository private. Confidential licensed assets
will require authenticated storage delivery as a separate change.

## Verification

- `npm run test:database` includes the historical pre-cutover access contract and
  the current Clerk migration contract. The latter checks stable UUIDs and
  ownership, pinned issuer/origin, verified-email claims, email reuse, membership
  escalation denial, existing/new student connections and anonymous denial.
- `npm run test:accounts:browser` uses the real configured Clerk development
  component to check the embedded entry and invitation-secret isolation.
  It creates no accounts and sends no confirmation emails.
- Catalogue and invitation browser tests use an explicitly test-only Clerk
  session fixture with the real migrated SQL and RLS. They do not replace the
  real-provider production acceptance test.


- `npm test` checks routing, role decisions and existing lesson behaviour.
- `tests/workspace-access.database.sql` retains the historical Supabase Auth
  contract. `tests/clerk-accounts.integration.ts` verifies the new cutover and
  current Clerk access contract in an isolated database.
- Existing roster and materials SQL checks use explicit synthetic teacher roles.
- `npm run test:database` applies every local migration to an isolated PGlite
  Postgres database and runs the roster, materials, account-access and personal
  invitation SQL suites. Its minimal Auth schema is a fixture for the historical migrations, not a
  replacement authentication provider. It never connects to the working project.
- `npm run test:invitations:browser` runs the real UI and SQL in separate browser
  contexts with local Auth fixtures and intercepted API requests. It checks link
  creation/replacement/revocation, rejection of the wrong email, account switching,
  acceptance, reload and connection visibility, including 375px layouts. It uses
  installed Microsoft Edge on this Windows workspace. Screenshots are saved in
  the ignored `invitation-qa.local/` folder. This does not verify real email delivery.
- `npm run test:library` always tests anonymous denial. Supply a temporary
  `LESSON_TEST_ACCESS_TOKEN` for teacher/source equivalence and `test:cloud`.
  Never commit tokens or real passwords. Authenticated cloud checks create a
  shared test session; clean it administratively after the run.

Security advisor checks supplement these tests; they are not a full audit.

# Public entry and account access

The public homepage describes Lesson Studio and links to `/login`. It never
loads the lesson library. One email/password form serves every account. Google
sign-in is not enabled yet; it needs provider configuration in Supabase.

`AuthenticatedApp` loads the Auth client only for sign-in and workspace routes.
It waits for the `workspace_role` RPC before importing a workspace. Changing a
URL, cached role or user-editable metadata cannot grant teacher access. All
permissions are enforced independently by database grants and RLS.

## First owner account

An administrator reserves the owner's email in the non-exposed
`lesson_private.workspace_owner` table. The address is not included in the
frontend or repository. The owner registers through the ordinary form and
confirms their email. An Auth trigger binds the reserved address to that Auth
user's immutable ID and provisions a teacher membership. The reservation is
claimed once: later email changes cannot transfer the role to a new account.
Deleting the owner requires an explicit administrative reassignment first.

Other confirmed accounts receive a student membership. Unconfirmed accounts
receive none. Clients can only read their own membership; they cannot insert,
update or delete roles. Future teachers must be provisioned administratively.

Registration uses the existing Supabase email provider and confirmation flow.
SMTP delivery limits still apply. Provider return URLs use the existing legacy
allow-list bridge, which the router canonicalises before consuming Auth tokens.
No messages are sent by migrations or QA fixtures.

## Materials and shared lessons

Only trusted teachers can read the studio collection and their own imported
materials, manage their roster and use favourites. The A1 source snapshot stays
available for authoring and seeding, but is no longer imported by application
code or emitted as a public content chunk. A connection failure shows a retry
message; it never falls back to an unrestricted copy of the collection.

Students see an invitation-based learning home. They cannot browse the library
or open arbitrary material IDs. Teachers can still preview a student material.
Named material assignments, homework delivery and binding an invitation to an
individual student account are future work.

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

- `npm test` checks routing, role decisions and existing lesson behaviour.
- `tests/workspace-access.database.sql` tests owner confirmation and one-time
  binding, spoofed metadata, self-upgrade denial, membership isolation, private
  notes, student library denial, account plus invitation checks and anonymous
  denial. All fixtures are rolled back.
- Existing roster and materials SQL checks use explicit synthetic teacher roles.
- `npm run test:library` always tests anonymous denial. Supply a temporary
  `LESSON_TEST_ACCESS_TOKEN` for teacher/source equivalence and `test:cloud`.
  Never commit tokens or real passwords. Authenticated cloud checks create a
  shared test session; clean it administratively after the run.

Security advisor checks supplement these tests; they are not a full audit.

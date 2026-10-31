# Clerk hosted-account cutover

Status: implementation prepared and locally verified; **not deployed**. Production
still uses the previous Supabase email account flow. Do not publish this branch
until the provider, database and frontend are configured together.

## Provider contract

Use a dedicated Lesson Studio Clerk application and its Account Portal. Keep
email verification required. Configure these **session-token** custom claims:

```json
{
  "role": "authenticated",
  "email": "{{user.primary_email_address}}",
  "email_verified": "{{user.email_verified}}"
}
```

Keep the standard active-session claims (`sid`, `sts`) and 60-second token lifetime. Use Clerk's built-in
verified email fields, never unsafe metadata. The PostgreSQL `authenticated`
claim grants no teaching role; `workspace_members` remains authoritative.

Enable Supabase's native Clerk Third-party Auth integration with the **production
instance's** domain. Do not use the deprecated Supabase JWT template or share a
Supabase signing secret with Clerk.

Development instances use different identities and keys. Test against isolated
SQL, as the browser suites do. Do not bind production accounts to a development
Clerk user ID. Clerk production requires an owned domain and its DNS records;
the Vercel-generated `vercel.app` address alone does not satisfy this requirement.

## Data migration

`20261031104633_clerk_workspace_accounts.sql` copies account UUIDs into a private
internal table, retains teaching roles, and redirects all ownership/connection
foreign keys. It replaces each current policy/default/function that depended on
`auth.uid()` with the private Clerk-to-UUID lookup. Supabase Auth users remain
for historical recovery; the active application no longer trusts their tokens
or uses their signup trigger.

An email from the migration snapshot can claim its old UUID once, after Clerk
verifies it. Subsequent email changes never rebind an existing identity. New
accounts receive the student role. Administrator-assigned teacher memberships
and the original one-time owner reservation remain server-managed.

Passwords are not migrated. Existing users complete Clerk's hosted account setup
or use its email-code sign-in. Do not tell them that their old Supabase password
has been imported. Deleting a Clerk account does not grant its stored UUID to a
new account with the same email; reassignment requires explicit administration.

## Coordinated publication

1. Complete the production Clerk instance, DNS, required verified email, session
   claims, application home/return URLs and Supabase Third-party Auth integration.
   Use exact HTTPS return paths and app origins. Lesson Studio returns through
   `/login`; the provider's Account Portal owns its sign-in and sign-up pages.
   If the frontend moves from `vercel.app` to a new origin, first arrange an
   explicit transfer of existing browser-only practice/drafts. Browser storage
   cannot move across origins through a redirect. Keep the old origin available
   for that reviewed transfer and preserve old lesson/invitation links. Transfer
   only learner data, never old Auth tokens or cached permissions. The SQL
   migration preserves server data; it is not a cross-origin browser migration.
2. Take a fresh private backup of account IDs/email verification, memberships,
   owner reservation, material ownership/revisions, favourites, roster and
   connections. Record the deployed commit and all current provider settings.
3. Prepare a frontend build with the production public key in
   `VITE_CLERK_PUBLISHABLE_KEY`. Never expose `CLERK_SECRET_KEY` through a `VITE_`
   variable. Vercel production builds reject development or missing public keys.
4. In a controlled cutover, apply the migration and provision the private
   `lesson_private.clerk_settings` singleton with the exact production issuer
   and app origins. Until that row exists, every Clerk account operation fails
   closed. Applying the migration also rejects old Supabase sessions, so do not
   apply it separately from the prepared frontend switch.
5. Publish the prepared frontend and verify an existing teacher and a new
   student through the real Account Portal, then verify data ownership, roster,
   favourites, shared lessons and invitation acceptance. Test sign-out and
   sign-in on both desktop and a phone. This is required before declaring the
   production cutover complete.
6. Disable further Supabase email/password account entry in provider settings
   after acceptance. The application already rejects those old sessions; no
   old password form or runtime fallback remains in this source.

Issuer/origin configuration is an administrative operation, never a browser RPC:

```sql
-- Replace both literals with reviewed production values before running.
insert into lesson_private.clerk_settings(singleton,issuer,allowed_origins)
values(true,'https://clerk.your-owned-domain.example',
  array['https://your-owned-domain.example']);
```

Do not enable a broad wildcard or an unreviewed origin. New accounts and existing
users must be tested against the actual configured issuer, not just a locally
constructed JWT. Supabase verifies signatures and expiration; our private lookup
additionally requires the pinned issuer, authorized party, session ID and a
boolean verified-email claim.

## Recovery

Keep the previous frontend and provider settings and the fresh backup available.
Before any Clerk activity, a coordinated database/provider/frontend restoration
can use that reviewed baseline. After Clerk sign-ins or writes, do not restore an
old data snapshot blindly: it could lose new accounts or learner data. Preserve
current internal UUIDs and ownership and prepare an explicit reverse identity
migration. A frontend-only rollback cannot restore Supabase authentication after
this database cutover.

The catalogue recovery script intentionally rejects later migration history;
it is not an authentication rollback.

## Verification

```powershell
npm test
npm run test:database
npm run test:invitations:browser
npm run test:catalogue:browser
npm run test:accounts:browser
npm run build
```

The database suite tests the new account contract and preserved data, alongside
explicitly historical migration tests. The invitation and catalogue suites use
offline Clerk session fixtures with real migrated SQL/RLS. The account-portal
suite uses actual Clerk development pages, creates no users and sends no mail.
Production acceptance and real email delivery are separate checks.

Sources: [Clerk Account Portal](https://clerk.com/docs/guides/account-portal/getting-started),
[native Supabase integration](https://supabase.com/docs/guides/auth/third-party/clerk),
[session claims](https://clerk.com/docs/guides/sessions/customize-session-tokens),
[production requirements](https://clerk.com/docs/guides/development/deployment/production).

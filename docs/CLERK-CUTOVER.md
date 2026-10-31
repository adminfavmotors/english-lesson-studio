# Clerk account cutover

Status: official components and identity migration prepared. The main origin's
proxy and Supabase Custom OIDC are configured. The database/frontend switch
must be completed together. See ACCOUNT-ACCESS.md for the access model.

## Provider contract

The dedicated Lesson Studio production instance owns registration, sign-in,
email verification, recovery and sessions. `/login` mounts the official Clerk
`SignIn` component with combined sign-up and hash routing. Lesson Studio has no
password handling or fallback authentication. British English is explicit;
the display locale comes from `src/app-language.ts`.

The production origin is `https://english-lesson-studio.vercel.app`. Vercel's
Node.js routing middleware forwards `/__clerk` with the official
`@clerk/backend/proxy` handler. It uses the canonical origin and Vercel's client
IP and removes client-supplied Cloudflare IP headers. Responses are not cached.
Keep these production variables on the main Vercel project:

- `VITE_CLERK_PUBLISHABLE_KEY`: browser publishable key, `pk_live_`.
- `CLERK_PUBLISHABLE_KEY`: the same publishable key for the server proxy.
- `CLERK_SECRET_KEY`: server-only Vercel Secret, never a `VITE_` variable.
- `CLERK_PROXY_ORIGIN`: the exact production origin above.

`.vercelignore` excludes local credentials, backups and internal notes from
CLI uploads. Inspect `vercel deploy --dry --json` before uploading a working
copy. Never include local key files in deployment archives.

Require verified email and configure these session-token custom claims:

```json
{
  "role": "authenticated",
  "email": "{{user.primary_email_address}}",
  "email_verified": "{{user.email_verified}}"
}
```

Keep standard active-session claims (`sid`, `sts`) and the 60-second lifetime.
The actual `email_verified` claim is a boolean. The database `authenticated`
role grants no teaching privileges; `workspace_members` owns those. Google
OAuth stays disabled until its production credentials are configured. Clerk
manages password/email-code access. Provider paths are `/`, `/login`, `/login`,
`/login` for home, sign-in, sign-up and sign-out respectively.

## Supabase verification

The actual issuer is **`https://english-lesson-studio.vercel.app/__clerk`**.
Discovery and signing keys are available at:

- `/__clerk/.well-known/openid-configuration`
- `/__clerk/.well-known/jwks.json`

Configure Supabase **Third-Party Auth → Custom OIDC** with that exact issuer.
The native Clerk CLI validator accepts host-only issuers and cannot represent
this path. Custom OIDC is the official discovery integration. Never bypass a
validator, label the provider as another service, use the old Supabase JWT
template or share Supabase signing secrets with Clerk.

Supabase verifies signature and expiry. Private SQL settings additionally pin
the exact issuer/origin, require an authenticated Clerk user, an active session
ID/status and verified email. Probe-origin tokens cannot satisfy this contract.
Development keys and identities stay separate from production.

## Identity and invitation migration

`20261031104633_clerk_workspace_accounts.sql` copies existing UUIDs and verified
email state into private accounts, preserving memberships, ownership,
favourites, roster and connections. It replaces Auth-dependent policies,
defaults and functions and removes the signup trigger. Historical Supabase Auth
users remain; their tokens no longer authorise application operations.

A verified Clerk email can claim an existing snapshot identity once. Thereafter
the immutable Clerk user ID determines identity. Changing/reusing an email
cannot transfer a UUID or privileges. New confirmed accounts receive a student
role. Open teacher onboarding remains a separate change. Supabase passwords are
not imported: existing users complete Clerk access with the same verified email.

Before `/login`, the app saves a validated internal return and invitation
fragment in this tab's session storage. Only a clean `/login` reaches Clerk.
After server authorisation, the app restores a destination permitted for the
role or opens its canonical workspace home. Clerk hash routing never consumes
a shared lesson or personal invitation secret.

## Coordinated publication

1. Publish the proxy while the old frontend/database continue working. Check
   discovery, JWKS and public Frontend API at the main origin.
2. Configure Custom OIDC. Prove a real signed Clerk token reaches an existing
   RPC and a tampered signature receives 401. Before the migration, the legacy
   UUID lookup can reject a Clerk subject after signature verification.
3. Take a fresh private snapshot of accounts, memberships, owner reservation,
   materials/revisions, favourites, roster and invitations. Record the deployed
   commit and provider settings. Keep the origin to preserve browser drafts.
4. Stage the production frontend with `vercel deploy --prod --skip-domain`.
   Production builds reject development or missing publishable keys.
5. Apply the migration and configure the private singleton below, then promote
   the staged build. SQL and frontend form one cutover: the migration rejects
   old Supabase sessions immediately.
6. Check signed-in student and controlled teacher access, anonymous denial,
   role separation, preserved data, sign-out, reload and invitation return.
   Do not impersonate existing users. Local SQL tests separately verify legacy
   binding and ownership preservation.
7. Disable Supabase email entry after acceptance. Remove disposable QA identities
   and their own rows, preserving real accounts and data.

Settings are administrative, never a browser RPC:

```sql
insert into lesson_private.clerk_settings(singleton,issuer,allowed_origins)
values(true,'https://english-lesson-studio.vercel.app/__clerk',
  array['https://english-lesson-studio.vercel.app']);
```

Never allow wildcard origins. Before this row exists, account operations fail
closed. A frontend-only rollback cannot restore old Supabase access. After new
account activity, preserve current UUIDs/data and use an explicit reverse
migration; never restore an old snapshot over new writes. Catalogue recovery
scripts are not authentication rollback tools.

## Verification and limits

Run `npm test`, `npm run test:database`, `npm run test:invitations:browser`,
`npm run test:catalogue:browser`, `npm run test:accounts:browser` and
`npm run build`. These cover routing, migrated SQL/RLS, stable UUIDs, email
reuse, escalation denial, invitations, catalogue and the real development
Clerk component. The entry browser test creates no accounts or emails and
checks invitation isolation. Offline fixtures never enter the product build.

The owner completed real registration/email verification on the separate probe
`lesson-studio-clerk-check.vercel.app`. It has no lesson-data connection and its
`/account` page intentionally ends the check. Main-site acceptance is separate.
Provider-domain provisioning uses Clerk Platform API, currently labelled
private beta. Earlier Account Portal/DNS research remains in local internal notes.

Sources: [official proxy implementation](https://github.com/clerk/javascript/blob/b5803ea35adc20272b664e9ef9e4250eef5bb555/packages/backend/src/proxy.ts),
[provider-domain API](https://clerk.com/docs/guides/development/errors/platform-api#proxyurlrequiredforproviderdomain),
[Supabase Custom OIDC](https://supabase.com/docs/guides/auth/third-party/custom-oidc),
[Clerk session claims](https://clerk.com/docs/guides/sessions/customize-session-tokens).

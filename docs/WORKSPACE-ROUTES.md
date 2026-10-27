# Teacher and student workspaces

| Address | Screen |
|---|---|
| `/` | Public service homepage |
| `/login` | Shared account sign-in and registration |
| `/teacher/materials` | Teacher lesson library |
| `/teacher/materials/:id` | Teacher lesson preview and answer keys |
| `/teacher/students` | Teacher-owned roster |
| `/teacher/classroom` | Teacher textbook classroom and lesson controls |
| `/student/classroom` | Student learning home, or invited shared classroom |
| `/student/connect` | Accept a personal invitation linking an account to a student profile |
| `/student/lessons/:id` | Student material view; currently available as a teacher preview |

`/teacher` and `/student` resolve to their respective start pages. A canonical
path determines the interface; `mode` or `view` query parameters cannot switch
it. Unknown pages stay within the requested workspace and offer its own return
link. New internal links use these paths. Old root URLs redirect without losing
material IDs, lesson invitation fragments or email confirmation tokens.

`TeacherWorkspace` owns teacher service navigation. `StudentWorkspace` has no
teacher service menu or role switch. `Classroom` shares exercise components but
receives a fixed workspace role from its entry component. Teacher previews open
student practice at a separate student URL in a new tab.

## Shared lessons

Invitation links use the matching `/teacher/classroom` or `/student/classroom`
path. Capabilities stay in the URL fragment. The server verifies the capability
and returns its role before the classroom opens. A valid invitation opened at
the other workspace's address redirects to its verified workspace. Cached work
never grants a role before verification. Teacher service links do not carry
lesson capabilities to account or library pages.

## Local drafts

The textbook classroom uses separate storage and broadcast channels for teacher
and student. The former single browser draft is copied once into independent
snapshots, preserving existing work and leaving the original key untouched.
Existing role drafts and resets take priority. Subsequent local edits remain
within that workspace. Cross-workspace sharing uses the explicit shared lesson.
Material practice already uses role-specific draft keys, which remain unchanged.

## Account access

Personal account invitations use `/student/connect#invite=<secret>`, separately
from shared classroom `session`/`access` credentials. They require a confirmed
student account with the invited email and explicit acceptance. Cross-page
navigation reloads when the personal secret is present. An account switch on
this page preserves the invitation; email confirmation keeps the existing
provider return URL and asks the student to reopen the personal invitation.

Every workspace route requires a confirmed account and a server-managed role.
Students opening teacher URLs are sent to their own learning home. The teacher
library is protected by RLS and has no packaged offline fallback. Shared lessons
also require a valid invitation. See [ACCOUNT-ACCESS.md](ACCOUNT-ACCESS.md) for the
owner bootstrap, access rules, checks and remaining work.

The existing email confirmation return URL remains compatible with the current
provider allow-list. It redirects to `/teacher/students` before the Auth client
processes its tokens. Both callback formats reject lesson invitation credentials.

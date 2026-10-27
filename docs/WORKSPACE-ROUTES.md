# Teacher and student workspaces

| Address | Screen |
|---|---|
| `/` | Separate teacher and student entry links |
| `/teacher/materials` | Teacher lesson library |
| `/teacher/materials/:id` | Teacher lesson preview and answer keys |
| `/teacher/students` | Teacher-owned roster and account entry |
| `/teacher/classroom` | Teacher textbook classroom and lesson controls |
| `/student/classroom` | Student textbook classroom |
| `/student/lessons/:id` | Student practice for one material |

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

## Account access is a separate step

These routes separate screens and browser state. They do not establish teacher
account entitlements or student memberships. Existing Supabase account access,
RLS and invitation validation remain in place. Google sign-in, trusted account
roles and student invitations are subsequent authentication work.

The existing email confirmation return URL remains compatible with the current
provider allow-list. It redirects to `/teacher/students` before the Auth client
processes its tokens. Both callback formats reject lesson invitation credentials.

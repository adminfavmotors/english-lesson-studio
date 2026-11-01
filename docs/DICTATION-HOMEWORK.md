# Assigned dictation homework

Published on the main Lesson Studio site on 1 November 2026. The Studio material
ID is `dictation-in-the-news`, teaching revision 1 and catalogue revision 1.
The original 30 A1 materials, their revisions and existing memberships are
unchanged. The recording is intentionally pending the next agreed audio step.

`Dictation: In the News` is a separate A2 material format, not a schema-2 lesson
filled with unrelated sections. Its editable source is
`scripts/materials/dictation-in-the-news.json`. The fifteen sentences and their
order follow the supplied specification. Skills: Listening; language focus:
Spelling and punctuation, Vocabulary. More demanding news vocabulary may need
teacher preparation; this is supported practice, not a CEFR placement test.

## Teacher and student flow

1. In Materials, search for the dictation, open it and select **Assign homework**.
2. Select an active/non-archived student with a connected student account. If
   needed, send their personal account invitation from Students first. A roster
   contact email by itself cannot grant homework access.
3. The assignment appears under Homework in that student's profile and in the
   student's learning space. The teacher can also copy its student link.
4. The student signs in, completes the words and selects **Send to teacher**.
   Answers save automatically while working. A failed save remains visible and
   the student can retry with Save answers. Keep the tab open until it says
   All answers saved; an offline queue is not implemented.
5. The teacher opens the assignment, checks answers and assistance use, adds
   optional feedback and selects **Mark as reviewed**. The student sees the
   same review and feedback on reopening/refreshing the assignment.

Statuses describe workflow, not ability or a paid use:

| Stored status | Label | Indicator | Transition |
| --- | --- | --- | --- |
| `not_completed` | Not completed | Red | Assignment created; includes saved partial work |
| `completed` | Completed | Green | Student explicitly submits a finished dictation |
| `reviewed` | Reviewed | Blue | Assigning teacher explicitly saves the review |

Shown words count towards finishing and are reported separately from correct
answers without Show. Hint usage is also visible. Opening a page never marks
homework complete or reviewed. Submitted answers are read-only. Returning work
for another attempt, due dates, reminders and billing are not part of this flow.

## Data and access

`20261101113733_assigned_dictation_homework.sql` adds a private homework table,
bounded dictation validation and authorised RPCs. RLS denies direct client
access. Only the assigning teacher and the assigned connected student can read
an assignment. Only that student can save/submit; only that teacher can review.
Existing Clerk signature/issuer/origin verification and stable UUID mapping
remain authoritative. The server response determines the homework workspace.
Canonical links use `/teacher/homework/<uuid>` and `/student/homework/<uuid>`;
the UUID alone grants no access and the student library remains closed.

Each assignment freezes the material ID, teaching revision, catalogue description
and content. Later library edits cannot change its words, grading or existing
answers. A separate assignment can use a later revision. Material identity,
content revision, assignment and review are separate records. Existing A1
materials, revisions, local drafts and shared lesson sessions are unchanged.

The server grades word values against the snapshot and checks full completion.
It never accepts a client-supplied score or workflow status. Case and both
apostrophes are ignored; punctuation is provided. Assistance metadata is for
teacher guidance, not examination security: the browser needs the answers to
offer local checking and Show. Reset starts the current unsubmitted attempt
again. Version checks prevent stale devices from overwriting saved work;
conflicts retain the local answers and require an explicit reload of saved work.
Save requests are serialised so a slow response cannot overwrite newer typing.
Creation and submission retries are idempotent.

Student/teacher lists show the latest 100 assignments and refresh on opening,
window focus or Refresh homework. They are not a realtime push notification.

## Audio, deliberately a later step

The supplied specification requested standalone HTML, anonymous entry and
memory-only progress. The owner's project request requires assigned, persistent
work and teacher review, so the activity uses the existing React/Clerk/Supabase
application and shared design tokens instead. There is no second standalone app.

The hosted recording has not yet been supplied. `audioUrl` is `null`, the native
audio controls are present and an honest message directs the learner to Browser
voice or their teacher. Sentence speech uses the application locale and rate
0.7 without autoplay. Availability depends on the device's English voices.
Local MP3/M4A/AAC/MP4/WebM/OGG/WAV files up to 30 MB play through object URLs;
they are not uploaded. Old object URLs are revoked. Reset does not reset audio.

When the owner provides audio, publish it with correct Content-Type and HTTP
Range support and set the reviewed hosted URL. Existing assignments have frozen
content: attaching the recording to them requires an explicit audio-only update,
not recreating assignments or changing their words/revisions silently. Hosting,
Range/iOS playback and actual recording acceptance belong to that next step.

## Publication and verification

The migration is additive for the existing frontend. Stage the new frontend,
back up the affected data, apply the migration, promote the build and seed the
new material with `npm run content:seed:dictation` (prints SQL only). Seed after
the frontend supports schema 3. Keep this source out of browser imports; content
comes from the teacher library or the authorised assignment response.

Run `npm test`, `npm run test:database`, `npm run test:homework:browser`,
`npm run test:invitations:browser`, `npm run test:catalogue:browser` and
`npm run build`. Database tests cover ownership, anonymous/other-account denial,
snapshots, concurrency, invalid values, submission locking and review visibility.
The homework browser test executes real migrated SQL/RLS with separate offline
Clerk fixtures and covers the complete flow, reload, hints and mobile layout.
It never contacts the working database. Production checks use disposable accounts
and must remove only their own homework and roster data afterwards.

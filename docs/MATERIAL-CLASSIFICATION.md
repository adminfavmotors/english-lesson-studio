# Skills and Language focus: editorial rules

Specification version: 1. Decision date: 30 October 2026.

Status: implemented and verified locally on 30 October 2026 in the model,
validation, imports, authoring and filters; not yet released to the working
database or website. Definitions are point 1. Point 2's original editorial
review is recorded in [A1-CLASSIFICATION-REVIEW](A1-CLASSIFICATION-REVIEW.md).
The runtime contract below records point 3.

## Two independent facets

**Skills** describes the communicative practice a learner undertakes. Its
teacher-facing question is: "Which language skills does the material practise?"

**Language focus** describes the language features deliberately taught or
practised. Its teacher-facing question is: "Which language features does the
material focus on?"

A material may have several values in either facet. Neither facet implies a
value in the other. Grammar practice does not automatically count as Writing;
Speaking does not automatically imply Pronunciation. A reviewed material can
have no applicable value in one facet. For example, a spelling exercise may
have a Language focus without communicative Skills, while a discussion may
practise Speaking without teaching a particular language feature.

Level, topic, communicative function, response format and resource type remain
separate concepts. A cafe is a topic, ordering a drink is a communicative
purpose, and choosing an option is a response format. None is a Skill or a
Language focus.

The Council of Europe distinguishes communicative activities from linguistic
competence. The four Skills below are our initial catalogue vocabulary, not
the complete CEFR model: CEFR also describes interaction and mediation.
These project rules do not assign CEFR levels or certify alignment with a
descriptor. See the [CEFR activities and strategies](https://rm.coe.int/chapter-3-communicative-language-activities-and-strategies/1680a084b4)
and [CEFR communicative competences](https://rm.coe.int/chapter-5-communicative-language-competences/1680a084c3).

## Controlled vocabulary

Concept IDs below are the accepted values in their respective catalogue
facets. Labels use the English product source.

### Skills

| Concept ID | Preferred label | Assign when the learner deliberately practises… | Insufficient evidence on its own |
|---|---|---|---|
| `reading` | Reading | Understanding written messages: finding information, interpreting meaning or following written directions. | Reading interface instructions, isolated grammar examples or a word list. |
| `listening` | Listening | Understanding spoken messages for a stated purpose, using an available recording, a prepared teacher delivery or an explicitly designed live exchange. | A dialogue printed on screen, an audio attachment without a comprehension purpose, or pair work alone. |
| `speaking` | Speaking | Expressing information, ideas or intentions orally, including a meaningful short response or an exchange with another person. | Repeating sounds or words, reading aloud, or naming a grammar form without a communicative purpose. |
| `writing` | Writing | Composing a written message to communicate meaning, including a short personal response, note or message. | Typing a choice, filling a grammar gap, copying a model, spelling a word or writing a closed comprehension answer. |

A short text can support Reading and a short message can support Writing.
Length and the presence of a text box do not decide the classification.
Reading aloud can additionally support Speaking when a separate communicative
task requires the learner to convey meaning; pronunciation practice alone
does not establish it.

### Language focus

| Concept ID | Preferred label | Assign when instruction and practice deliberately address… | Insufficient evidence on its own |
|---|---|---|---|
| `grammar` | Grammar | Grammatical forms, sentence patterns and their meanings or use. | Grammatically correct language appearing in the material. |
| `vocabulary` | Vocabulary | Word and phrase meanings, retrieval, appropriate use, collocations or useful chunks. | Topic words appearing in a text or an optional glossary alone. |
| `pronunciation` | Pronunciation | Speech sounds, sound contrasts, word or sentence stress, rhythm or intonation, through perception or production. | Any audio, oral answer or instruction to read aloud. |
| `spelling_punctuation` | Spelling and punctuation | Word spelling, capitalisation or punctuation through targeted practice or explicit feedback criteria. | Written output, automatic spellchecking or a general expectation of correct writing. |

The combined Spelling and punctuation label is a project choice for the initial
catalogue. Pronunciation concerns intelligibility and conveying meaning; it
does not require imitation of a particular accent. The CEFR competence scales
inform these distinctions; they do not prescribe our four catalogue labels.

## Evidence required for a tag

The following are Lesson Studio editorial decisions. They are not additional
requirements claimed on behalf of CEFR.

1. Identify the intended learning outcome from the goal and the actual task.
   Check what learners must do, the materials available to them and how success
   can be recognised. A title or an old tag is not sufficient evidence.
2. Point to a specific, required activity and its instructions. The activity
   must practise the proposed skill or language feature, rather than merely
   use it to reach another objective. Teacher feedback and observable task
   outcomes count; automatic marking is not required.
3. Confirm that necessary resources and delivery instructions exist in that
   version. Listening may use a recording or a prepared teacher-read script;
   a live exchange must specify what the listener needs to understand or do.
   An unspecified suggestion to "read something aloud" is insufficient.
4. Tag the material being catalogued. For a whole lesson, select its deliberate
   teaching focuses, supported by a coherent required activity. Do not take
   the union of every incidental action across its stages. A warm-up, exit
   question or optional extension does not by itself establish a lesson focus.
   A separately catalogued activity would be judged on its own objective.
5. Use the same evidence standard for each additional value. There is no
   arbitrary minimum duration, word count or two-tag limit. All four Skills
   require four supported claims, not the presence of four section headings.
6. Record an editorial justification: the material and teaching revision,
   proposed values, activity or section references and a short reason for
   each. This is evidence for the later review, not a new learner-facing field
   or database feature introduced by this document.
7. Where evidence is missing or contradictory, mark the editorial review as
   needing review. Do not invent an objective, resource or tag, rewrite a
   learner's work, or treat an unreviewed material as having no relevant focus.

For validated data, each facet is a set of zero to four distinct IDs
from its own vocabulary; order does not express importance. An empty set means
"reviewed: no applicable value", not "unknown". How review status is stored
is defined below; missing legacy data must not silently become a reviewed
empty set. A material with no supported value in either facet needs editorial
review before new classification is considered complete.

## Boundary examples

These are invented editorial examples, not a classification of existing A1
lessons. Only the activities described in each row are assumed to exist.

| Activity and intended outcome | Skills | Language focus | Reason |
|---|---|---|---|
| Choose the correct form of *be* in isolated sentences. | None | Grammar | The task checks form selection, not written communication. |
| Read a menu and find a drink within a stated budget; no vocabulary teaching is included. | Reading | None | Meaning is needed to make a decision; a cafe topic does not establish vocabulary instruction. |
| Hear a supplied recording and identify the speaker's destination; no specific language feature is taught. | Listening | None | The task explicitly requires understanding speech. |
| Follow a supplied teacher-read announcement and choose the matching departure time. | Listening | None | A usable script and a listening purpose are supplied; a recording is unnecessary. |
| Read a dialogue silently and identify what the customer ordered. | Reading | None | Understanding written dialogue does not establish Listening. |
| Practise food phrases, then order a drink in a role-play; assess appropriate phrase use. | Speaking | Vocabulary | Meaningful oral exchange and phrase use are deliberate focuses; Listening is not inferred automatically. |
| Compose a short invitation using practised future forms; feedback addresses the message and those forms. | Writing | Grammar | Communicative writing and grammatical use have separate evidence. |
| Identify word stress from supplied word recordings, then repeat the words. | None | Pronunciation | Sound-feature practice does not by itself establish message comprehension or communicative Speaking. |
| Correct capital letters and punctuation in supplied sentences. | None | Spelling and punctuation | The focus is written conventions, not composing a message. |
| Read an email, then write a reply answering its questions; no specific language feature is taught. | Reading, Writing | None | Both understanding and written communication have explicit purposes. |

## Vocabulary ownership and change rules

- Use only the preferred labels above for displayed category names. Their
  concept IDs are stable; a wording correction must not silently change a
  concept's meaning. Skills and Language focus are separate namespaces.
- Synonyms may later help search, but do not create duplicate categories.
  Labels such as "oral practice" need an explicit reviewed relationship to a
  concept before use; they do not become accepted import values automatically.
- New concepts, changes in meaning and merges require a separate agreed change
  with a definition, scope boundaries, examples and the effects on existing
  classifications. Do not add free-form tags or a catch-all Other category.
- Preserve the original legacy values for the explicit mapping review. Existing
  `grammar`, `vocabulary`, `spelling` or section names are clues, not approved
  new assignments. The 30 studio lessons use only the explicit editorial mapping.
- Older JSON formats are converted at import, with previous tags retained for
  review. Classification changes do not change teaching revisions or saved
  answer keys.

The distinction between an identifier, a preferred label, a definition and a
scope note follows the vocabulary-management approach described in the
[W3C SKOS Primer](https://www.w3.org/TR/skos-primer/#seclabel)
and its [documentation notes](https://www.w3.org/TR/skos-primer/#secdocumentation).
This is an editorial convention; RDF or a SKOS service is not required.

## Runtime and JSON contract

The catalogue has two explicit classification states:

| Field | Reviewed | Needs review |
|---|---|---|
| `classification_status` | `"reviewed"` | `"needs_review"` |
| `skills` | Array of zero to four distinct Skill IDs | `null` |
| `language_focus` | Array of zero to four distinct Language focus IDs | `null` |
| `legacy_skills` | `null` | Original mixed tags, preserved in their original order |

Reviewed arrays cannot both be empty. A single empty array means no applicable
focus in that facet after review. SQL `NULL` represents an unreviewed facet;
JSON documents use `null`. `legacy_skills` accepts the previous eight-value
vocabulary, including `spelling`, with its existing one-to-eight limit.
Duplicates in old evidence are preserved; new reviewed arrays reject duplicates.
Review status describes editorial classification, not account permissions,
moderation approval, ownership, publication or access entitlements.

For example, a current catalogue contains these classification fields:

```json
{
  "classification_status": "reviewed",
  "skills": ["reading", "listening", "speaking", "writing"],
  "language_focus": ["vocabulary"],
  "legacy_skills": null
}
```

This is a classification fragment, not a complete import file. The surrounding
document still has `catalogue` and schema-2 teaching `content`. Classification
fields are not stored in `content`. Download a lesson JSON for a full example.
Content schema version and teaching revision do not advance for this change.

Previously downloaded flat schema-1 files and separated schema-2 files without
the new classification fields remain importable. Their old `skills` become
`legacy_skills`; the two new facets are `null` and status is `needs_review`.
They are not automatically matched to the studio review or relabelled as
reviewed, even if their title resembles a built-in lesson. Current reviewed
and pending exports round-trip through the same current contract. Partial or
malformed new classification is rejected rather than treated as an older file.

The existing 100 KB compact-JSON content/description budget excludes the new,
separately bounded classification metadata. For pending files it counts the
original mixed tags in the previous `skills` position. This preserves near-limit
separated files and their new exports. The UI's 150 KB uploaded-file limit and
the database content limit remain in place.

## Library behaviour

Skills and Language focus have independent single-value filters. When both
are selected, a lesson must match both. These combine with level, topic, text
search and the selected collection. A filter change returns to the first page;
Clear filters clears both facets together with the other filters.

Cards and lesson headings show separate labelled groups, including every
assigned value. A reviewed empty facet displays None. Pending materials remain
available by title, topic, level and collection with Classification needs review;
they do not match a selected Skill or Language focus. Teacher previews also
show their previous tags. This step does not add a classification editor.

The authoring sources specify both facets directly. The build checks each
lesson against the frozen editorial review and its teaching version, content
hash and original description. It does not override source metadata with a
second runtime tag list. The generated snapshot, curriculum and SQL seed carry
the same explicit classification.

## Migration and verification

`20261030180952_separate_material_facets.sql` follows
`20261029204914_separate_material_catalogue.sql`. It checks the exact teaching
version, content and original description before applying each reviewed studio
assignment. A mismatch aborts the migration transaction. Unrecognised studio
materials and private imports retain their original tags in the pending state.

Only the catalogue revision advances during reclassification. IDs, ownership,
teaching content and versions, favourites, creation dates and draft keys remain
unchanged. A metadata update changes `updated_at`; a no-op changes neither
timestamp nor counter. The existing teacher/owner RLS remains authoritative;
the new metadata columns have only the existing scoped insert/update grants.

Verification covers controlled values and empty/pending states, both older JSON
formats, near-limit imports, the populated migration, mismatch rollback,
unchanged drafts and seed no-ops, server constraints and RLS, combined browser
filters, pagination, import errors, downloads and responsive layouts. Run
`npm test`, `npm run test:database`, `npm run test:catalogue:browser` and
`npm run build`.

The migrations and final frontend require a coordinated release. Local
verification does not apply either migration or publish a build. See the
release procedure in MATERIAL-CATALOGUE below.

For the catalogue/content boundary and independent revision rules, see
[MATERIAL-CATALOGUE](MATERIAL-CATALOGUE.md).

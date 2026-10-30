# A1 classification review: Skills and Language focus

Review version: 1. Date: 30 October 2026 (Europe/Warsaw).

**Status: all 30 lessons reviewed; the mapping is implemented locally and
awaits release.** This report records point 2's original editorial decisions.
Point 3 subsequently introduced them in authoring, validation and the library;
see [MATERIAL-CLASSIFICATION](MATERIAL-CLASSIFICATION.md). The working database
and website have not been migrated. No private imports are covered by this mapping.

The authoritative decision register is [a1-classification-review.json](a1-classification-review.json).
This readable report is derived from that register. Definitions and controlled
values are in [MATERIAL-CLASSIFICATION](MATERIAL-CLASSIFICATION.md).

## Evidence and scope

The review covers each learning goal, vocabulary, language explanation and
pronunciation guidance, model text and comprehension questions, retrieval,
checked practice, speaking situation and outcomes, writing task and criteria,
exit check, homework and teacher notes. The compiled snapshot was compared
with all six editable source modules and matched exactly.

Each decision is pinned to the local manifest teaching revision and hashes
of that material's content and original catalogue. The register also records
source-file hashes from before implementation. The JSON register remains a
frozen review snapshot; its historical status is not a live deployment status.
Per-material hashes and versions are migration preconditions, not
evidence that the working database already contains the new classification.
Changed content or catalogue values must be reconciled with the review before
applying its proposal; an ID alone is insufficient.

Evidence paths below are JSON Pointers relative to a lesson's `content` in
`src/data/a1-lessons.json`. Arrays use zero-based indexes. Existing question
IDs, answer keys and revision/draft manifests are unchanged.

## How the rules were applied

- Whole-lesson tags describe deliberate focuses, not every skill used briefly.
  The generic opening model says read or listen and has three comprehension
  questions. That common block alone is not used to assign either Skill.
- Reading is supported where a further task explicitly requires written
  information: gifts, a menu, identifying descriptions, departures or dates.
- Listening requires an explicit comprehension outcome, such as obtaining
  hidden preferences, following directions, selecting a shared option or
  checking a communicated record. Hearing feedback or answering an ordinary
  checking question alone is not enough. The specified teacher-led exchange
  or teacher delivery is part of this evidence; no recording is assumed.
- Writing requires an independent, purposeful written product. A new profile,
  message, guide, route or usable travel note qualifies. Prescribed number
  spelling, question-form drills and copying a help card do not become a
  Writing focus merely because they appear in the Write stage.
- Every lesson has pronunciation guidance by construction. That is not
  sufficient for a lesson-level Pronunciation tag. Lessons 2 and 15 include
  specific sound contrasts, practice and success/feedback evidence.
- A required orthographic practice block or functional spelling target is
  distinguished from a single spelling item or a general capital-letter
  reminder. Grammar inflections do not automatically receive a spelling tag.
- Vocabulary includes deliberately taught functional chunks. An existing
  word list is not by itself enough; lessons 11 and 12 retain a grammatical
  focus. Chunks taught without separate structural analysis do not
  automatically add Grammar, as in lessons 14, 24, 27, 28 and 29.
- No tag quotas are used to make the catalogue appear more varied. All 30
  lessons have an evidenced Speaking task. That describes this oral-first
  collection; it is not a rule for future materials.

## Review totals

| Facet | Concept | Lessons |
|---|---|---:|
| Skills | Reading | 5 |
| Skills | Listening | 23 |
| Skills | Speaking | 30 |
| Skills | Writing | 26 |
| Language focus | Grammar | 24 |
| Language focus | Vocabulary | 28 |
| Language focus | Pronunciation | 2 |
| Language focus | Spelling and punctuation | 5 |

All 91 original tag values have an explicit decision in the register:
retain within Skills, reclassify into Language focus, or remove with a reason.
12 legacy assignments are removed from the proposal; 64 new assignments
are supported by independent evidence. Counts are multi-label and do not
sum to 30. Removed labels may still describe supporting practice; removal
means they are not a focus for indexing the complete lesson.

## Proposed mapping

| Material / revision | Lesson | Original mixed tags | Proposed Skills | Proposed Language focus |
|---|---|---|---|---|
| a1-01 / 4 | Hello! Nice to meet you | Speaking, Vocabulary, Pronunciation | Speaking, Writing | Grammar, Vocabulary |
| a1-02 / 2 | Names, letters and numbers | Spelling, Listening, Pronunciation | Listening, Speaking | Vocabulary, Pronunciation, Spelling and punctuation |
| a1-03 / 2 | Where are you from? | Grammar, Speaking, Vocabulary | Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-04 / 3 | My contact card | Writing, Spelling, Listening | Listening, Speaking, Writing | Grammar, Vocabulary, Spelling and punctuation |
| a1-05 / 3 | People in my family | Vocabulary, Speaking, Grammar | Speaking, Writing | Grammar, Vocabulary |
| a1-06 / 2 | What is this? | Grammar, Spelling, Vocabulary | Speaking, Writing | Grammar, Vocabulary |
| a1-07 / 3 | Colours and favourite things | Vocabulary, Grammar, Speaking | Reading, Listening, Speaking, Writing | Grammar, Vocabulary, Spelling and punctuation |
| a1-08 / 3 | My home | Grammar, Vocabulary, Reading | Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-09 / 2 | Where is my key? | Grammar, Listening, Speaking | Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-10 / 3 | My morning | Vocabulary, Grammar, Speaking | Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-11 / 3 | A day in her life | Grammar, Reading, Writing | Speaking, Writing | Grammar |
| a1-12 / 2 | Do you study every day? | Grammar, Speaking, Listening | Listening, Speaking | Grammar |
| a1-13 / 3 | Food I like | Vocabulary, Grammar, Speaking | Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-14 / 2 | At the café | Speaking, Listening, Vocabulary | Reading, Listening, Speaking, Writing | Vocabulary |
| a1-15 / 3 | How much is it? | Listening, Spelling, Speaking | Listening, Speaking | Grammar, Vocabulary, Pronunciation, Spelling and punctuation |
| a1-16 / 3 | Places in my town | Vocabulary, Reading, Grammar | Speaking, Writing | Grammar, Vocabulary |
| a1-17 / 3 | Turn left at the café | Listening, Speaking, Vocabulary | Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-18 / 2 | What can you do? | Grammar, Speaking, Pronunciation | Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-19 / 3 | People and their things | Grammar, Vocabulary, Reading | Reading, Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-20 / 3 | What are you doing now? | Grammar, Speaking, Listening | Speaking, Writing | Grammar, Vocabulary |
| a1-21 / 2 | Weather and seasons | Vocabulary, Speaking, Listening | Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-22 / 3 | How do you feel? | Vocabulary, Speaking, Listening | Speaking, Writing | Grammar, Vocabulary |
| a1-23 / 2 | Clothes that fit | Vocabulary, Speaking, Grammar | Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-24 / 3 | A ticket, please | Listening, Reading, Speaking | Reading, Listening, Speaking, Writing | Vocabulary |
| a1-25 / 3 | Free time and hobbies | Speaking, Vocabulary, Grammar | Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-26 / 2 | Days, dates and appointments | Listening, Spelling, Speaking | Reading, Listening, Speaking, Writing | Grammar, Vocabulary |
| a1-27 / 2 | A short message | Writing, Spelling, Reading | Listening, Speaking, Writing | Vocabulary, Spelling and punctuation |
| a1-28 / 2 | Sorry, again, please! | Listening, Speaking, Pronunciation | Listening, Speaking | Vocabulary |
| a1-29 / 3 | At a guesthouse | Speaking, Writing, Listening | Listening, Speaking, Writing | Vocabulary |
| a1-30 / 4 | My first day in a new town | Speaking, Writing, Reading, Listening | Listening, Speaking, Writing | Grammar, Vocabulary |

## Lesson-by-lesson evidence

### a1-01 — Hello! Nice to meet you

Teaching revision: 4. Authoring source:
[content-01-05.mjs](../scripts/a1/content-01-05.mjs).

- **Skill — Speaking:** Introduce yourself, ask a name and respond to a greeting in a second round without the model.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Compose a new-person message with a greeting, your name and a question; this is not gap completion.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** I am / I'm is explicitly explained, practised and checked in the learner's own message.
  Evidence: `/language/explanation`, `/practice/0/items/0`, `/practice/0/items/1`, `/writing/checklist/1`.
- **Language focus — Vocabulary:** Greeting and introduction chunks are taught, matched to replies and used to meet another person.
  Evidence: `/vocabulary`, `/practice/1`, `/speaking/support`.

Legacy mapping:
- **Speaking** → Skills: Speaking.
- **Vocabulary** → Language focus: Vocabulary.
- **Pronunciation** → removed from lesson-level indexing. Greeting stress and the contraction are short modelling support. There is no separate required sound task or phonological success outcome at lesson level.

Editorial notes:
- The opening model and its three questions support the introduction; they do not independently establish Reading or Listening as lesson focuses.

### a1-02 — Names, letters and numbers

Teaching revision: 2. Authoring source:
[content-01-05.mjs](../scripts/a1/content-01-05.mjs).

- **Skill — Listening:** Understand dictated names and numbers with the text hidden, write them and check against the key.
  Evidence: `/goal`, `/speaking/teacherNote`, `/exit/1`.
- **Skill — Speaking:** Give a name and class number to another person, then correct a deliberately mistaken detail.
  Evidence: `/speaking/steps`, `/speaking/success`.
- **Language focus — Vocabulary:** Number words zero to twenty are explicitly taught, retrieved and used to communicate a class number.
  Evidence: `/language/explanation`, `/practice/0`, `/speaking/steps/2`.
- **Language focus — Pronunciation:** Contrasting letter names has explicit sound models, a sound-to-letter question and planned teacher feedback on difficult names.
  Evidence: `/language/pronunciation`, `/practice/1/items/1`, `/teacherNotes/0`, `/homework/steps/2`.
- **Language focus — Spelling and punctuation:** Letter order and number-word spelling are central targets in the exercises and the name-spelling form.
  Evidence: `/goal`, `/practice/0`, `/practice/1/items/0`, `/writing/checklist`.

Legacy mapping:
- **Spelling** → Language focus: Spelling and punctuation.
- **Listening** → Skills: Listening.
- **Pronunciation** → Language focus: Pronunciation.

Editorial notes:
- The small form reinforces letter order and number spelling; its prescribed number words do not establish a separate communicative Writing focus.
- Letter-name perception supports Pronunciation; Listening is justified separately by the hidden-text name-and-number dictation.

### a1-03 — Where are you from?

Teaching revision: 2. Authoring source:
[content-01-05.mjs](../scripts/a1/content-01-05.mjs).

- **Skill — Listening:** Find out the teacher's country and use that newly heard information to introduce the teacher to another person.
  Evidence: `/speaking/steps/1`, `/speaking/steps/3`, `/speaking/model`.
- **Skill — Speaking:** Ask and give country information, then introduce a third person using the information gathered.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Compose profiles of yourself and a made-up person with names, countries and a language.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Choose am, are and is for different people and apply from + country in personal descriptions.
  Evidence: `/language/explanation`, `/practice/0`, `/speaking/success/1`.
- **Language focus — Vocabulary:** Country and language names are distinguished through matching and used to communicate origin and language.
  Evidence: `/vocabulary`, `/practice/1`, `/speaking/success/2`.

Legacy mapping:
- **Grammar** → Language focus: Grammar.
- **Speaking** → Skills: Speaking.
- **Vocabulary** → Language focus: Vocabulary.

Editorial notes:
- Capital-letter guidance in the profile is a supporting convention, not an independent spelling/punctuation teaching sequence.
- Listening is based on the oral information relay, not on the generic read-or-listen input instruction.

### a1-04 — My contact card

Teaching revision: 3. Authoring source:
[content-01-05.mjs](../scripts/a1/content-01-05.mjs).

- **Skill — Listening:** Listen to the completed form, identify inaccurate information and correct the recorded details; dictation allows repetitions.
  Evidence: `/speaking/steps/2`, `/speaking/steps/3`, `/teacherNotes/1`.
- **Skill — Speaking:** Supply information from a hidden card so the teacher can complete an accurate contact form.
  Evidence: `/speaking/situation`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Enter chosen fictional contact information into the appropriate form fields and add an age statement.
  Evidence: `/goal`, `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Be for age is explicitly contrasted with have, practised in sentence selection and checked in the completed form.
  Evidence: `/language/explanation`, `/practice/0/items/3`, `/writing/checklist/2`.
- **Language focus — Vocabulary:** Contact-field meanings and the spoken email-address chunks at/dot are taught and used in the information exchange.
  Evidence: `/vocabulary`, `/practice/0`, `/speaking/steps/0`.
- **Language focus — Spelling and punctuation:** Accurate names, address spelling and the @/dot conventions are checked as part of producing a usable contact record.
  Evidence: `/practice/1/items/1`, `/speaking/steps/1`, `/writing/checklist/0`, `/writing/checklist/1`.

Legacy mapping:
- **Writing** → Skills: Writing.
- **Spelling** → Language focus: Spelling and punctuation.
- **Listening** → Skills: Listening.

Editorial notes:
- Unlike lesson 2's spelling worksheet, completing a usable five-field contact record is the explicit whole-lesson goal.
- The supplied form is the model; no separate Reading focus is inferred merely from its field labels.

### a1-05 — People in my family

Teaching revision: 3. Authoring source:
[content-01-05.mjs](../scripts/a1/content-01-05.mjs).

- **Skill — Speaking:** Introduce at least three chosen people and answer a name-checking question so the listener understands who they are.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Create a diagram description with original names and relationships, rather than copying a model.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Possessive determiners, This is and person/reference forms are taught, manipulated and checked in descriptions.
  Evidence: `/language/explanation`, `/practice/0`, `/practice/1`, `/writing/checklist/1`.
- **Language focus — Vocabulary:** Relationship words are deliberately selected and used to explain who the people on a diagram are.
  Evidence: `/vocabulary`, `/speaking/steps/0`, `/speaking/success/0`.

Legacy mapping:
- **Vocabulary** → Language focus: Vocabulary.
- **Speaking** → Skills: Speaking.
- **Grammar** → Language focus: Grammar.

Editorial notes:
- Hearing another introduction is not followed by a separate comprehension outcome; Listening is not added for conversation alone.

### a1-06 — What is this?

Teaching revision: 2. Authoring source:
[content-06-10.mjs](../scripts/a1/content-06-10.mjs).

- **Skill — Speaking:** Request classroom items and correct a wrong physical choice so the teacher packs the intended bag.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Produce a personal lesson-item list and two descriptions identifying the chosen objects and quantities.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Articles, singular/plural agreement and this/these are explicitly practised and checked in original descriptions.
  Evidence: `/language/explanation`, `/practice/0`, `/practice/1/items/0`, `/writing/checklist`.
- **Language focus — Vocabulary:** Classroom-object words are taught and must be selected to request the intended items.
  Evidence: `/vocabulary`, `/speaking/steps/0`, `/speaking/steps/3`.

Legacy mapping:
- **Grammar** → Language focus: Grammar.
- **Spelling** → removed from lesson-level indexing. One umbrella-spelling choice and a homework checking reminder are supporting accuracy work, not a separate lesson-level orthographic focus.
- **Vocabulary** → Language focus: Vocabulary.

Editorial notes:
- Plural -s is treated as grammatical number here. A grammar ending does not automatically add Spelling and punctuation.

### a1-07 — Colours and favourite things

Teaching revision: 3. Authoring source:
[content-06-10.mjs](../scripts/a1/content-06-10.mjs).

- **Skill — Reading:** Use the gifts and their colours in the supplied text to choose an appropriate item; the text remains a decision resource.
  Evidence: `/input/text`, `/speaking/steps/1`.
- **Skill — Listening:** Discover a hidden colour preference, choose a gift and revise the choice after the teacher changes that information.
  Evidence: `/speaking/steps/0`, `/speaking/steps/3`, `/speaking/teacherNote`.
- **Skill — Speaking:** Ask about a preference and propose a suitable gift with a short reason.
  Evidence: `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Describe three selected gifts and state who each gift is for.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Adjective order and it is / they are are taught, reconstructed and applied to new gifts.
  Evidence: `/language/explanation`, `/practice/0`, `/writing/checklist`.
- **Language focus — Vocabulary:** Colour and preference meanings determine the learner's gift choice.
  Evidence: `/vocabulary`, `/speaking/success/0`, `/speaking/steps/1`.
- **Language focus — Spelling and punctuation:** A required multi-item block explicitly retrieves missing letters in blue, green and white with spelling feedback.
  Evidence: `/practice/1/title`, `/practice/1/items/0`, `/practice/1/items/1`, `/practice/1/items/2`.

Legacy mapping:
- **Vocabulary** → Language focus: Vocabulary.
- **Grammar** → Language focus: Grammar.
- **Speaking** → Skills: Speaking.

Editorial notes:
- All four Skills have separate task evidence here; the four labels are not inferred from the lesson's section headings.
- The spelling block is more substantial than the isolated umbrella item in lesson 6.

### a1-08 — My home

Teaching revision: 3. Authoring source:
[content-06-10.mjs](../scripts/a1/content-06-10.mjs).

- **Skill — Listening:** Understand the teacher's description of the drawn plan, detect a wrong quantity or object and correct it.
  Evidence: `/speaking/steps/2`, `/speaking/steps/3`, `/speaking/success/2`.
- **Skill — Speaking:** Describe a fictional home so another person can draw its rooms and furniture.
  Evidence: `/goal`, `/speaking/situation`, `/speaking/steps/1`.
- **Skill — Writing:** Compose a four-sentence description of a chosen home with rooms, furniture and quantities.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** There is / there are and quantity agreement receive explicit practice and feedback criteria.
  Evidence: `/language/explanation`, `/practice/0`, `/writing/checklist`.
- **Language focus — Vocabulary:** Room and furniture meanings are taught, checked and needed to communicate the plan.
  Evidence: `/vocabulary`, `/practice/1/items/1`, `/speaking/success/0`.

Legacy mapping:
- **Grammar** → Language focus: Grammar.
- **Vocabulary** → Language focus: Vocabulary.
- **Reading** → removed from lesson-level indexing. The flat description is an opening model with alternative delivery. The later outcomes are communicating and checking a plan, not independently using a written guide.

### a1-09 — Where is my key?

Teaching revision: 2. Authoring source:
[content-06-10.mjs](../scripts/a1/content-06-10.mjs).

- **Skill — Listening:** Follow location information to find objects, with an explicit hidden-text teacher-read dialogue and role reversal.
  Evidence: `/goal`, `/speaking/steps/3`, `/teacherNotes/0`, `/teacherNotes/1`.
- **Skill — Speaking:** Give unseen object locations clearly enough for another person to find or draw them.
  Evidence: `/speaking/steps`, `/speaking/success/2`.
- **Skill — Writing:** Compose three location clues that help someone find objects in the chosen scene.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Where is / where are and be before a location phrase are explicitly practised and checked.
  Evidence: `/language/explanation`, `/practice/0`, `/writing/checklist/1`.
- **Language focus — Vocabulary:** Three or more place expressions must be understood and selected to locate the intended objects.
  Evidence: `/vocabulary`, `/practice/1`, `/speaking/success/0`.

Legacy mapping:
- **Grammar** → Language focus: Grammar.
- **Listening** → Skills: Listening.
- **Speaking** → Skills: Speaking.

### a1-10 — My morning

Teaching revision: 3. Authoring source:
[content-06-10.mjs](../scripts/a1/content-06-10.mjs).

- **Skill — Listening:** Understand a proposed lesson time and compare it with the routine to choose and confirm a suitable time.
  Evidence: `/speaking/steps/1`, `/speaking/steps/2`, `/speaking/steps/3`.
- **Skill — Speaking:** Describe morning actions with times and negotiate an appropriate lesson time.
  Evidence: `/goal`, `/speaking/steps/0`, `/speaking/success`.
- **Skill — Writing:** Create a four-line routine timetable with chosen actions and times that a reader can follow.
  Evidence: `/writing/instruction`, `/writing/checklist/1`.
- **Language focus — Grammar:** Present simple without am and at + time are explained, contrasted and checked in the routine.
  Evidence: `/language/explanation`, `/practice/1/items/2`, `/writing/checklist/0`, `/writing/checklist/2`.
- **Language focus — Vocabulary:** Routine chunks and clock-time expressions receive dedicated retrieval and meaning checks.
  Evidence: `/vocabulary`, `/practice/0`, `/practice/1/items/0`, `/practice/1/items/1`.

Legacy mapping:
- **Vocabulary** → Language focus: Vocabulary.
- **Grammar** → Language focus: Grammar.
- **Speaking** → Skills: Speaking.

Editorial notes:
- The initial schedule is a model; no separate Reading tag is added for its presence.

### a1-11 — A day in her life

Teaching revision: 3. Authoring source:
[content-11-15.mjs](../scripts/a1/content-11-15.mjs).

- **Skill — Speaking:** Give an ordered oral description of a fictional person's day and improve it after feedback.
  Evidence: `/goal`, `/speaking/steps/2`, `/speaking/success`.
- **Skill — Writing:** Compose four sentences about another person's routine and contrast them with your own.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Third-person forms, including has and goes, are the deliberate teaching and feedback focus across both output tasks.
  Evidence: `/language/explanation`, `/practice/0`, `/practice/1`, `/writing/checklist`.

Legacy mapping:
- **Grammar** → Language focus: Grammar.
- **Reading** → removed from lesson-level indexing. The opening biography is a model. Profile details can be looked at or dictated; the main outcome is producing a routine description, not a separate reading task.
- **Writing** → Skills: Writing.

Editorial notes:
- The word list supports the routine description; the checked blocks target verb forms rather than a separate lexical objective. Vocabulary is not added automatically.
- Verb -s/-es and studies are grammatical inflections here; they do not establish Spelling and punctuation as a separate focus.

### a1-12 — Do you study every day?

Teaching revision: 2. Authoring source:
[content-11-15.mjs](../scripts/a1/content-11-15.mjs).

- **Skill — Listening:** Use answers from a different, unseen schedule to identify the day when both people are free.
  Evidence: `/speaking/steps/1`, `/speaking/steps/2`, `/speaking/teacherNote`.
- **Skill — Speaking:** Ask and answer routine questions to agree on a shared free day.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Language focus — Grammar:** Do/does, basic verbs after does and negative/short-answer forms are systematically practised and checked.
  Evidence: `/language/explanation`, `/practice/0`, `/practice/1`, `/writing/checklist`.

Legacy mapping:
- **Grammar** → Language focus: Grammar.
- **Speaking** → Skills: Speaking.
- **Listening** → Skills: Listening.

Editorial notes:
- Writing three question-and-answer pairs is controlled form practice; it does not form a separate written-message outcome.
- Frequency expressions support the interview. The teacher notes explicitly allow treating them as ready-to-use support while retaining the question-form focus.

### a1-13 — Food I like

Teaching revision: 3. Authoring source:
[content-11-15.mjs](../scripts/a1/content-11-15.mjs).

- **Skill — Listening:** Understand the partner's food preferences and use them to choose two foods that both people like.
  Evidence: `/speaking/steps/0`, `/speaking/steps/2`, `/speaking/success/2`.
- **Skill — Speaking:** Ask about preferences, state likes and dislikes and agree on a shared breakfast.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Compose a food-preference message with personal choices and a question for the teacher.
  Evidence: `/writing/instruction`, `/writing/checklist/0`.
- **Language focus — Grammar:** Like / don't like, Do you like and general-preference plurals are taught and checked in meaningful output.
  Evidence: `/language/explanation`, `/practice/0`, `/writing/checklist`.
- **Language focus — Vocabulary:** Food meanings receive a dedicated matching task and determine the shared breakfast choices.
  Evidence: `/vocabulary`, `/practice/1`, `/speaking/steps/0`.

Legacy mapping:
- **Vocabulary** → Language focus: Vocabulary.
- **Grammar** → Language focus: Grammar.
- **Speaking** → Skills: Speaking.

### a1-14 — At the café

Teaching revision: 2. Authoring source:
[content-11-15.mjs](../scripts/a1/content-11-15.mjs).

- **Skill — Reading:** Read menu items and prices to select food and a drink within the stated budget.
  Evidence: `/input/text`, `/speaking/situation`, `/speaking/steps/1`.
- **Skill — Listening:** Respond to the server and adapt an order when an item is unavailable; the provided script also has explicit listening delivery.
  Evidence: `/speaking/steps/2`, `/speaking/steps/3`, `/teacherNotes/1`.
- **Skill — Speaking:** Make a polite order, answer the server and choose an alternative when needed.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Compose an order intended for a cafe worker, naming the requested items politely.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Vocabulary:** Food words and ordering/refusal chunks are explicitly taught and selected for communicative functions.
  Evidence: `/vocabulary`, `/practice/0`, `/teacherNotes/0`.

Legacy mapping:
- **Speaking** → Skills: Speaking.
- **Listening** → Skills: Listening.
- **Vocabulary** → Language focus: Vocabulary.

Editorial notes:
- Ordering frames are taught as complete chunks; the teacher notes explicitly defer detailed would analysis. Grammar is not added for word-order reconstruction alone.
- The brief I like / I'd like sound model supports ordering; it is not an independent pronunciation task.

### a1-15 — How much is it?

Teaching revision: 3. Authoring source:
[content-11-15.mjs](../scripts/a1/content-11-15.mjs).

- **Skill — Listening:** Hear prices in a changed order, check an uncertain price and choose items that fit the budget.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success/1`, `/teacherNotes/1`.
- **Skill — Speaking:** Ask prices, repeat a total and communicate a purchase choice within the available money.
  Evidence: `/speaking/steps/0`, `/speaking/steps/2`, `/speaking/success`.
- **Language focus — Grammar:** How much is / are is explicitly contrasted, practised for singular/plural items and checked in a new question.
  Evidence: `/language/explanation`, `/practice/1/items/0`, `/practice/1/items/1`, `/writing/checklist/2`.
- **Language focus — Vocabulary:** Tens and compound number words are taught and used to communicate prices and a total.
  Evidence: `/vocabulary`, `/language/explanation`, `/practice/1/items/2`, `/speaking/steps/2`.
- **Language focus — Pronunciation:** The thirteen/thirty stress contrast has explicit comparison and repetition, a hearing/saying success outcome and teacher practice.
  Evidence: `/language/pronunciation`, `/speaking/success/1`, `/homework/steps/2`.
- **Language focus — Spelling and punctuation:** A complete required block practises price-word spelling, with explicit forty/fifty checks.
  Evidence: `/practice/0`, `/language/pitfall`, `/writing/checklist/1`.

Legacy mapping:
- **Listening** → Skills: Listening.
- **Spelling** → Language focus: Spelling and punctuation.
- **Speaking** → Skills: Speaking.

Editorial notes:
- Making price labels and a price question chiefly practises number spelling and the question form; there is no separate composed written-message focus.
- All four language focuses have distinct evidence; no arbitrary two-tag cap is applied.

### a1-16 — Places in my town

Teaching revision: 3. Authoring source:
[content-16-20.mjs](../scripts/a1/content-16-20.mjs).

- **Skill — Speaking:** Describe a fictional neighbourhood and answer questions that help the teacher choose a place to visit.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Compose a street guide describing available places, an absent place and a location relationship.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** There is / isn't, Is there and short answers receive explicit practice and guide-writing criteria.
  Evidence: `/language/explanation`, `/practice/0`, `/writing/checklist`.
- **Language focus — Vocabulary:** Place meanings are matched and then used to explain what the neighbourhood offers.
  Evidence: `/vocabulary`, `/practice/1`, `/speaking/success/0`.

Legacy mapping:
- **Vocabulary** → Language focus: Vocabulary.
- **Reading** → removed from lesson-level indexing. The neighbourhood notice is the initial model. The independent tasks produce a new oral description and written guide; they do not require using the original written guide.
- **Grammar** → Language focus: Grammar.

Editorial notes:
- Ordinary questions during the neighbourhood conversation do not independently establish a Listening focus.

### a1-17 — Turn left at the café

Teaching revision: 3. Authoring source:
[content-16-20.mjs](../scripts/a1/content-16-20.mjs).

- **Skill — Listening:** Follow the partner's route information on a different map and check a turn that is unclear.
  Evidence: `/goal`, `/speaking/steps/1`, `/speaking/steps/2`, `/speaking/success/2`.
- **Skill — Speaking:** Ask for a route and give two-step directions that match the drawn plan.
  Evidence: `/speaking/steps/1`, `/speaking/steps/3`, `/speaking/success`.
- **Skill — Writing:** Compose three route instructions whose turns and landmarks guide someone through the chosen plan.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Verb-first imperatives and at + landmark are explicitly taught and checked in route instructions.
  Evidence: `/language/explanation`, `/practice/1/items/0`, `/practice/1/items/1`, `/writing/checklist/0`.
- **Language focus — Vocabulary:** Direction and landmark expressions are matched by meaning and used to convey the route.
  Evidence: `/vocabulary`, `/practice/0`, `/practice/1/items/3`, `/speaking/support`.

Legacy mapping:
- **Listening** → Skills: Listening.
- **Speaking** → Skills: Speaking.
- **Vocabulary** → Language focus: Vocabulary.

Editorial notes:
- A drawn map is not automatically a Reading task. Left/right perception serves route comprehension rather than a separate phonological target.

### a1-18 — What can you do?

Teaching revision: 2. Authoring source:
[content-16-20.mjs](../scripts/a1/content-16-20.mjs).

- **Skill — Listening:** Learn a character's abilities from answers and allocate jobs; changed character information requires a new decision.
  Evidence: `/speaking/steps/0`, `/speaking/steps/2`, `/speaking/teacherNote`.
- **Skill — Speaking:** Ask and state abilities, choose who will do jobs and request help.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Create an ability profile for a character and add a request for help.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Can/can't, basic verbs after can and question/short-answer forms are explicitly practised.
  Evidence: `/language/explanation`, `/practice/0`, `/practice/1`, `/writing/checklist`.
- **Language focus — Vocabulary:** Ability verbs have taught meanings and must be selected to match people with cooking, driving and computer jobs.
  Evidence: `/vocabulary`, `/speaking/situation`, `/speaking/steps/2`.

Legacy mapping:
- **Grammar** → Language focus: Grammar.
- **Speaking** → Skills: Speaking.
- **Pronunciation** → removed from lesson-level indexing. Weak can and a clear negative support the ability message. The required task checks abilities and help, without a separate sound-identification or pronunciation-feedback outcome.

### a1-19 — People and their things

Teaching revision: 3. Authoring source:
[content-16-20.mjs](../scripts/a1/content-16-20.mjs).

- **Skill — Reading:** A required matching task explicitly asks the learner to reread the character descriptions and identify people from their details.
  Evidence: `/input/text`, `/practice/1/instruction`, `/practice/1/items`.
- **Skill — Listening:** In the reversed guessing role, identify the character from the partner's clues and check a detail.
  Evidence: `/speaking/situation`, `/speaking/steps/2`, `/speaking/steps/3`, `/speaking/model`.
- **Skill — Speaking:** Give identifying clues without naming the person so the listener can select the intended character.
  Evidence: `/goal`, `/speaking/steps/1`, `/speaking/success`.
- **Skill — Writing:** Compose an identifying description of a fictional person with appearance, possessions and colour details.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Be for description and have/has got for possession are contrasted and checked in original descriptions.
  Evidence: `/language/explanation`, `/practice/0`, `/writing/checklist`.
- **Language focus — Vocabulary:** Appearance and possession words must be interpreted and selected to distinguish three characters.
  Evidence: `/vocabulary`, `/practice/1/items`, `/speaking/steps/1`.

Legacy mapping:
- **Grammar** → Language focus: Grammar.
- **Vocabulary** → Language focus: Vocabulary.
- **Reading** → Skills: Reading.

Editorial notes:
- Reading is supported by a separate explicit rereading task, not only by the opening text.

### a1-20 — What are you doing now?

Teaching revision: 3. Authoring source:
[content-16-20.mjs](../scripts/a1/content-16-20.mjs).

- **Skill — Speaking:** Describe actions being mimed or represented on scene cards and ask about what is happening now.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Compose a current-action message about three people.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Be + -ing and the distinction between now and regular habits are explicitly explained and checked.
  Evidence: `/language/explanation`, `/practice/0`, `/practice/1`, `/writing/checklist`.
- **Language focus — Vocabulary:** Recognise pictured or mimed activities and select the appropriate action words to communicate them.
  Evidence: `/vocabulary`, `/speaking/steps/0`, `/speaking/teacherNote`.

Legacy mapping:
- **Grammar** → Language focus: Grammar.
- **Speaking** → Skills: Speaking.
- **Listening** → removed from lesson-level indexing. The opening message has alternative delivery, while the core task uses visible mime or scene cards. No separate heard-information outcome is specified.

Editorial notes:
- Reading and writing appear as vocabulary meanings in this lesson; those words do not themselves establish the corresponding Skills.

### a1-21 — Weather and seasons

Teaching revision: 2. Authoring source:
[content-21-25.mjs](../scripts/a1/content-21-25.mjs).

- **Skill — Listening:** Understand two spoken weather descriptions, choose a suitable place and revise the plan after a changed detail.
  Evidence: `/speaking/steps/0`, `/speaking/steps/2`, `/speaking/steps/3`, `/speaking/success/1`.
- **Skill — Speaking:** Describe weather, check a detail and choose a place and activity for a meeting.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Compose a three-sentence weather message giving a place and an action.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** It is + adjective, is raining/snowing and in + season have explicit form practice and message criteria.
  Evidence: `/language/explanation`, `/practice/1`, `/writing/checklist`.
- **Language focus — Vocabulary:** Weather meanings are matched and used to decide whether an indoor or outdoor activity fits.
  Evidence: `/vocabulary`, `/practice/0`, `/speaking/steps/2`.

Legacy mapping:
- **Vocabulary** → Language focus: Vocabulary.
- **Speaking** → Skills: Speaking.
- **Listening** → Skills: Listening.

### a1-22 — How do you feel?

Teaching revision: 3. Authoring source:
[content-21-25.mjs](../scripts/a1/content-21-25.mjs).

- **Skill — Speaking:** Communicate a chosen feeling and make a clear request for a simple need.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Compose two short messages that each connect a feeling to an appropriate request.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Be with feeling adjectives and have with a headache are explicitly contrasted, practised and checked.
  Evidence: `/language/explanation`, `/practice/0`, `/writing/checklist/0`, `/writing/checklist/1`.
- **Language focus — Vocabulary:** Feeling words and suitable request chunks are matched by meaning and used to express a need.
  Evidence: `/vocabulary`, `/practice/1`, `/speaking/success/0`.

Legacy mapping:
- **Vocabulary** → Language focus: Vocabulary.
- **Speaking** → Skills: Speaking.
- **Listening** → removed from lesson-level indexing. The generic script and a checking question support the learner's own request. They do not form a separate task to obtain and use new heard information at lesson level.

Editorial notes:
- The thirsty sound model is pronunciation support; the required task and criteria focus on feelings, requests and be/have.

### a1-23 — Clothes that fit

Teaching revision: 2. Authoring source:
[content-21-25.mjs](../scripts/a1/content-21-25.mjs).

- **Skill — Listening:** Understand the price and detect a wrong colour or size in the assistant's offer, then correct the order.
  Evidence: `/speaking/steps/1`, `/speaking/steps/2`, `/speaking/steps/3`, `/speaking/success/2`.
- **Skill — Speaking:** Ask for clothes in a chosen size and colour, check the price and request to try the item on.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Compose a shop message asking for two selected items to be kept, without relying on a picture.
  Evidence: `/writing/instruction`, `/writing/checklist/2`.
- **Language focus — Grammar:** This/these agreement and size-colour-noun order are taught and checked in original requests.
  Evidence: `/language/explanation`, `/practice/0`, `/writing/checklist/0`, `/writing/checklist/1`.
- **Language focus — Vocabulary:** Clothes, size labels and try it on are taught and needed to communicate the intended purchase.
  Evidence: `/vocabulary`, `/practice/0/items/2`, `/speaking/success/0`.

Legacy mapping:
- **Vocabulary** → Language focus: Vocabulary.
- **Speaking** → Skills: Speaking.
- **Grammar** → Language focus: Grammar.

Editorial notes:
- The block called clothes-spelling mostly retrieves whole clothing/size words; its T-shirt hyphen reminder alone does not establish a lesson-level orthographic focus.

### a1-24 — A ticket, please

Teaching revision: 3. Authoring source:
[content-21-25.mjs](../scripts/a1/content-21-25.mjs).

- **Skill — Reading:** Use the written departure table to retrieve the 10:00 fare and verify the numbers in a travel note.
  Evidence: `/input/text`, `/practice/1/items/0`, `/writing/checklist/1`.
- **Skill — Listening:** Obtain time, fare and platform from a ticket seller's initially unseen timetable and repeat the details to check them.
  Evidence: `/speaking/situation`, `/speaking/steps/1`, `/speaking/steps/2`.
- **Skill — Speaking:** Request a ticket and ask questions to choose a suitable departure and check travel details.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Create a usable four-detail travel note for the chosen journey, selecting and organising destination, time, fare and platform.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Vocabulary:** Travel words, single/return meanings and useful ticket questions are taught as functional chunks.
  Evidence: `/vocabulary`, `/practice/0`, `/practice/1/items/1`, `/teacherNotes/0`.

Legacy mapping:
- **Listening** → Skills: Listening.
- **Reading** → Skills: Reading.
- **Speaking** → Skills: Speaking.

Editorial notes:
- The travel note records a chosen journey for later use, rather than spelling prescribed number words as in lesson 15.
- The notes prioritise ready-to-use questions; incidental to/from guidance does not make Grammar a separate lesson focus.

### a1-25 — Free time and hobbies

Teaching revision: 3. Authoring source:
[content-21-25.mjs](../scripts/a1/content-21-25.mjs).

- **Skill — Listening:** Use the partner's answers to find a genuinely shared interest, or choose an alternative when the characters have none.
  Evidence: `/speaking/steps/0`, `/speaking/steps/2`, `/speaking/teacherNote`.
- **Skill — Speaking:** Ask about hobbies, state preferences and agree on a shared activity, day and place.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Compose a hobby profile with positive and negative preferences and a question for another person.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** Like + -ing is explicitly contrasted with be + -ing and checked in questions and profiles.
  Evidence: `/language/explanation`, `/practice/0`, `/practice/1`, `/writing/checklist/0`.
- **Language focus — Vocabulary:** Hobby expressions, including listening to music, must be retrieved and selected to find a shared activity.
  Evidence: `/vocabulary`, `/practice/0/items/2`, `/speaking/success/0`.

Legacy mapping:
- **Speaking** → Skills: Speaking.
- **Vocabulary** → Language focus: Vocabulary.
- **Grammar** → Language focus: Grammar.

Editorial notes:
- The phrase reading or listening to music names a hobby; its presence does not establish Reading or Listening. Listening is justified separately by the shared-interest task.

### a1-26 — Days, dates and appointments

Teaching revision: 2. Authoring source:
[content-26-30.mjs](../scripts/a1/content-26-30.mjs).

- **Skill — Reading:** Retrieve a date from the supplied calendar and check that the written confirmation matches its day/date information.
  Evidence: `/input/text`, `/practice/1/items/0`, `/writing/checklist/0`.
- **Skill — Listening:** Understand two spoken appointment options and check each day, date and time before choosing.
  Evidence: `/speaking/steps/0`, `/speaking/steps/1`, `/speaking/success/1`.
- **Skill — Speaking:** Choose an appointment and repeat all three details so both people agree on the same time.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Compose a confirmation message for the chosen lesson date and time.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** On + day/date and at + time receive explicit explanation, gap practice and confirmation-message checks.
  Evidence: `/language/explanation`, `/practice/0/items/0`, `/practice/0/items/1`, `/writing/checklist`.
- **Language focus — Vocabulary:** Day names and ordinal date expressions are taught, retrieved and used to identify the appointment.
  Evidence: `/vocabulary`, `/practice/0/items/2`, `/practice/0/items/3`, `/speaking/steps/1`.

Legacy mapping:
- **Listening** → Skills: Listening.
- **Spelling** → removed from lesson-level indexing. One Wednesday-spelling question and a reminder support calendar use. The main practice and message criteria concern correct appointment information and on/at.
- **Speaking** → Skills: Speaking.

Editorial notes:
- This fictional timetable does not establish a current date, calendar year or real lesson time zone.

### a1-27 — A short message

Teaching revision: 2. Authoring source:
[content-26-30.mjs](../scripts/a1/content-26-30.mjs).

- **Skill — Listening:** Check the place/time in a spoken invitation and correct a wrong detail when the teacher reads the reply back.
  Evidence: `/speaking/situation`, `/speaking/steps/0`, `/speaking/steps/3`.
- **Skill — Speaking:** Give an oral acceptance or alternative and dictate a complete reply with a clear place and time.
  Evidence: `/speaking/steps/1`, `/speaking/steps/2`, `/speaking/success`.
- **Skill — Writing:** Compose a meeting message with greeting, place, time, question and ending, then an invitation and a changed-detail reply.
  Evidence: `/goal`, `/writing/instruction`, `/writing/checklist`, `/homework/instruction`.
- **Language focus — Vocabulary:** Invitation, agreement, refusal and message-ending chunks are explicitly taught and selected for their functions.
  Evidence: `/vocabulary`, `/practice/0/items/2`, `/practice/0/items/3`, `/speaking/support`.
- **Language focus — Spelling and punctuation:** Capital letters and question marks are explicit lesson targets with required correction choices and output criteria.
  Evidence: `/language/explanation`, `/practice/0/items/0`, `/practice/0/items/1`, `/writing/checklist/1`, `/writing/checklist/2`.

Legacy mapping:
- **Writing** → Skills: Writing.
- **Spelling** → Language focus: Spelling and punctuation.
- **Reading** → removed from lesson-level indexing. The written exchange is the opening model. The later incoming invitation is explicitly spoken; independent work focuses on producing and checking replies, not reading an incoming message.

Editorial notes:
- Message organisation and ready-to-use Let’s/Are you free chunks do not alone establish a separate grammatical teaching focus.

### a1-28 — Sorry, again, please!

Teaching revision: 2. Authoring source:
[content-26-30.mjs](../scripts/a1/content-26-30.mjs).

- **Skill — Listening:** Recover four dictated booking details, request clarification and verify that the important information is understood.
  Evidence: `/speaking/situation`, `/speaking/steps`, `/speaking/success`, `/teacherNotes/1`.
- **Skill — Speaking:** Use at least two repair strategies, request spelling and repeat a number to check it during a real exchange.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success/0`.
- **Language focus — Vocabulary:** Repair chunks are explicitly matched to communication problems, retrieved and used to resolve them.
  Evidence: `/vocabulary`, `/practice/0`, `/practice/1`, `/speaking/support`.

Legacy mapping:
- **Listening** → Skills: Listening.
- **Speaking** → Skills: Speaking.
- **Pronunciation** → removed from lesson-level indexing. Stress and checking intonation are delivery guidance. The required success outcomes are repair strategies and accurate booking details, without a separate phonological task.

Editorial notes:
- The help card retrieves existing phrases and the dictated notes record heard details; neither establishes an independent composed Writing message.
- Asking for spelling is a communication strategy here, not an orthographic teaching sequence.

### a1-29 — At a guesthouse

Teaching revision: 3. Authoring source:
[content-26-30.mjs](../scripts/a1/content-26-30.mjs).

- **Skill — Listening:** Obtain and check room and breakfast information; changing the room number requires understanding a new detail.
  Evidence: `/speaking/steps/2`, `/speaking/success/1`, `/teacherNotes/1`.
- **Skill — Speaking:** Check in, give registration information and ask chosen questions about the room and breakfast.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Complete a guest card with chosen details and write questions for the receptionist about needed information.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Vocabulary:** Guesthouse words and familiar question/request chunks are selected by meaning and used for check-in functions.
  Evidence: `/vocabulary`, `/practice/0`, `/practice/1`, `/speaking/support`.

Legacy mapping:
- **Speaking** → Skills: Speaking.
- **Writing** → Skills: Writing.
- **Listening** → Skills: Listening.

Editorial notes:
- The lesson consolidates familiar questions in a new setting; it does not add an independent question-formation or grammatical contrast task. Grammar is not inferred from familiar forms appearing in a role-play.
- Name capitals and spelling at check-in are supporting conventions and communication strategies, not separate spelling/punctuation targets.

### a1-30 — My first day in a new town

Teaching revision: 4. Authoring source:
[content-26-30.mjs](../scripts/a1/content-26-30.mjs).

- **Skill — Listening:** Obtain prices, directions and a lesson time across short exchanges, asking for repetition where needed.
  Evidence: `/speaking/situation`, `/speaking/steps/1`, `/speaking/steps/2`, `/speaking/steps/3`, `/speaking/success/1`.
- **Skill — Speaking:** Handle four short practical scenes and improve a difficult exchange after feedback.
  Evidence: `/goal`, `/speaking/steps`, `/speaking/success`.
- **Skill — Writing:** Create three written pieces with distinct communicative purposes: a profile, a cafe order and a lesson-time message.
  Evidence: `/writing/instruction`, `/writing/checklist`.
- **Language focus — Grammar:** A dedicated review block deliberately selects be, third-person forms, can + basic verb and there is for their meanings.
  Evidence: `/language/explanation`, `/practice/0`, `/language/pitfall`.
- **Language focus — Vocabulary:** A dedicated function-choice block retrieves requests, place questions and repair chunks for the practical scenes.
  Evidence: `/vocabulary`, `/practice/1`, `/speaking/support`.

Legacy mapping:
- **Speaking** → Skills: Speaking.
- **Writing** → Skills: Writing.
- **Reading** → removed from lesson-level indexing. The new-student text is the opening model; the independent scenes are oral and the portfolio is learner-authored. No separate written-information task supports a Reading focus.
- **Listening** → Skills: Listening.

Editorial notes:
- An end-of-course review is not automatically tagged with every Skill and Language focus, and it is not A1 certification.

## Applying this review later

The JSON register is an editorial artefact, not an importable lesson or a live
database state. Its values are introduced through the local
model/validation/import/filter implementation and its guarded migration for
the studio collection. Publication remains a coordinated release step.
Do not reinterpret arbitrary private imports using this 30-lesson register.
Do not infer the same classifications from an old tag name alone.

Classification changes preserve the reviewed teaching content and its
version. They must not reset answers or create new draft-compatibility
exceptions. If implementing a tag would require changing an activity, that
is a separate content decision and must be reviewed again. See
[MATERIAL-CATALOGUE](MATERIAL-CATALOGUE.md).

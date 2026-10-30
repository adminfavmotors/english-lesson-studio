import {
  vocab,
  recall,
  choice,
  gaps,
  order,
  match,
  model,
  makeLesson,
} from "./helpers.mjs";
export default [
  makeLesson({
    n: 26,
    title: "Days, dates and appointments",
    subtitle: "Arrange a date and time to meet",
    topic: "Dates and appointments",
    skills: ["reading", "listening", "speaking", "writing"],
    languageFocus: ["grammar", "vocabulary"],
    goal: "I can check a simple appointment date and time.",
    vocabulary: vocab(
      [
        "Monday",
        "the day after Sunday and before Tuesday",
        "On Monday at six.",
      ],
      [
        "Tuesday",
        "the day after Monday and before Wednesday",
        "The class is on Tuesday.",
      ],
      [
        "Wednesday",
        "the day after Tuesday and before Thursday",
        "On Wednesday, please.",
      ],
      ["date", "the day and month when something happens", "What is the date?"],
      ["first", "1st; number one in an order", "The first of May."],
      ["second", "2nd; number two in an order", "The second of May."],
    ),
    language: {
      focus: "on + day/date; at + time; basic dates",
      explanation:
        "Use on for a day or date: on Monday, on the first of May. Use at for a time: at six. Read 1 May as the first of May, 2 May as the second of May and 3 May as the third of May. In this lesson, practise dates 1–3 and familiar days.",
      examples: [
        "The class is on Tuesday.",
        "On the second of May at six.",
        "Is Monday good?",
      ],
      pitfall:
        "Say on Monday but at six. Write the d in Wednesday, even though you usually do not hear it.",
      pronunciation:
        "Wednesday usually has two syllables: WENZ-day. Listen to first, second and third. Match them with 1, 2 and 3.",
    },
    input: model(
      "Two lesson times",
      "schedule",
      "ENGLISH LESSONS\nMonday, 1 May — 18:00\nTuesday, 2 May — 17:30\nWednesday, 3 May — 19:00\n\nAnna: Tuesday is good for me.\nTeacher: The second of May at half past five.\nAnna: Yes, thank you.",
      [
        [
          "Which day does Anna choose?",
          ["Monday", "Tuesday", "Wednesday"],
          1,
          "Anna chooses Tuesday.",
        ],
        [
          "What is the date?",
          ["1 May", "2 May", "3 May"],
          1,
          "Tuesday, 2 May.",
        ],
        [
          "What time is the lesson?",
          ["5:30 p.m.", "6:00 p.m.", "7:00 p.m."],
          0,
          "17:30 = half past five in the afternoon.",
        ],
      ],
    ),
    retrieval: recall(
      ["Read the time 9:30 aloud.", "Nine thirty. / Half past nine.", 24],
      ["Ask about a lesson on Monday.", "Do you study on Monday?", 12],
      ["Name a hobby two people share.", "We like walking.", 25],
    ),
    practice: [
      gaps("appointment-prepositions", "Complete the appointment", [
        ["The class is ___ Monday.", "on", "Use on before a day."],
        ["The lesson is ___ six.", "at", "Use at before a time."],
        ["1 May: the ___ of May", "first", "Use first for date 1."],
        ["2 May: the ___ of May", "second", "Use second for date 2."],
      ]),
      choice("calendar-reading", "Read the calendar", [
        [
          "Wednesday in this timetable is…",
          ["1 May", "2 May", "3 May"],
          2,
          "The table says Wednesday, 3 May.",
        ],
        [
          "17:30 is…",
          [
            "half past five in the afternoon",
            "half past seven in the morning",
            "five o’clock",
          ],
          0,
          "17:30 = 5:30 p.m.",
        ],
        [
          "Choose the correct spelling.",
          ["Wensday", "Wednesday", "Wednsday"],
          1,
          "The correct spelling is Wednesday.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "You and your teacher have different free times for your next lesson.",
      steps: [
        "Your teacher gives two options from the timetable.",
        "Check the day, date and time of each option.",
        "Choose a suitable option.",
        "Repeat all three details in one phrase.",
      ],
      support: [
        "Is Tuesday good?",
        "What time?",
        "The second of May?",
        "On Tuesday at…",
      ],
      success: [
        "I give the correct day and date.",
        "I repeat the time to check it.",
        "We both understand the same lesson time.",
      ],
      model: "Tuesday is good. The second of May at half past five. Thank you.",
      teacherNote:
        "The timetable is fictional and has no current year attached. Keep it as a language task rather than adding it to a real calendar.",
    },
    writing: {
      instruction: "Write a short message to confirm the lesson you choose.",
      model:
        "English lesson: Tuesday, 2 May, 17:30. The lesson is on Tuesday at half past five.",
      checklist: [
        "My day and date match the table.",
        "I use on before a day.",
        "I use at before a time.",
      ],
    },
    exit: [
      "I can check the day of a lesson.",
      "I can understand dates 1–3.",
      "I can confirm a date and time.",
    ],
    homework: {
      instruction: "Make three made-up calendar notes.",
      steps: [
        "Use Monday, Tuesday and Wednesday with dates 1–3.",
        "Write each time in digits and words.",
        "Tomorrow, read one note to your teacher without showing the text.",
      ],
      model: "Wednesday, 3 May, 19:00 — on Wednesday at seven.",
    },
    teacherNotes: [
      "Add month names as the learner needs them. Do not require all twelve at once.",
      "Real lesson arrangements also need an agreed time zone. This fictional task practises the language only.",
    ],
  }),
  makeLesson({
    n: 27,
    title: "A short message",
    subtitle: "Write a clear message about a meeting",
    topic: "Messages",
    skills: ["listening", "speaking", "writing"],
    languageFocus: ["vocabulary", "spelling_punctuation"],
    goal: "I can write a short message with a greeting, a simple plan and a question.",
    vocabulary: vocab(
      ["Hi…", "a friendly greeting at the start of a message", "Hi, Anna!"],
      [
        "Are you free?",
        "ask if someone has time to do something",
        "Are you free on Friday?",
      ],
      [
        "Let’s…",
        "use this to suggest doing something together",
        "Let’s meet at six.",
      ],
      [
        "meet",
        "come together at an agreed place and time",
        "Let’s meet at the café.",
      ],
      [
        "See you",
        "a friendly way to finish before meeting again",
        "See you on Friday.",
      ],
      [
        "Sorry",
        "a polite word when you cannot do something or make a mistake",
        "Sorry, I work on Friday.",
      ],
    ),
    language: {
      focus: "short message structure; capitals and punctuation",
      explanation:
        "A short message can have a greeting, a reason or suggestion, a question and an ending. Start I, names and days with capital letters. Use Let’s meet… as a phrase to suggest a meeting.",
      examples: [
        "Hi, Eva!",
        "Are you free on Friday?",
        "Let’s meet at six. See you!",
      ],
      pitfall:
        "End a question with ?. Always write I with a capital letter. Start Friday with a capital too. Keep the message short and friendly.",
      pronunciation:
        "Pause between sentences when you read a message aloud. Listen to how See you joins together. Copy your teacher’s model.",
    },
    input: model(
      "A message to a classmate",
      "message",
      "Hi, Eva!\nAre you free on Friday? Let’s meet at the café near the park at six. I like this café.\nSee you!\nAnna\n\nEva: Hi, Anna. Yes, Friday at six is good. See you!",
      [
        [
          "Who writes the first message?",
          ["Anna", "Eva", "Ben"],
          0,
          "Anna signs the first message.",
        ],
        [
          "Where do they meet?",
          ["At the station", "At the café near the park", "At school"],
          1,
          "Let’s meet at the café near the park.",
        ],
        [
          "Does Eva agree?",
          ["Yes", "No", "She does not answer"],
          0,
          "Yes, Friday at six is good.",
        ],
      ],
    ),
    retrieval: recall(
      ["Confirm a lesson time.", "On Tuesday at six.", 26],
      ["Say where the café is.", "It is near the park.", 16],
      ["Ask about a hobby.", "Do you like reading?", 25],
    ),
    practice: [
      choice("message-punctuation", "Choose a clear message", [
        [
          "Correct capital letters:",
          ["i study on friday.", "I study on Friday.", "I Study on friday."],
          1,
          "Start I and Friday with capital letters.",
        ],
        [
          "A question:",
          [
            "Are you free on Friday?",
            "Are you free on Friday.",
            "Are you free on Friday,",
          ],
          0,
          "End a question with a question mark.",
        ],
        [
          "A friendly ending:",
          ["See you!", "What price?", "Turn left!"],
          0,
          "See you is a natural ending for a friendly message.",
        ],
        [
          "A proposal:",
          ["Let’s meet at six.", "I’m six.", "I have Friday."],
          0,
          "Let’s meet suggests a meeting.",
        ],
      ]),
      order("message-order", "Build the key sentences", [
        ["Are you free on Friday?", "Are + you + free + day."],
        ["Let’s meet at the café.", "Put the verb meet after Let’s."],
        ["See you on Friday.", "Use See you + on + a day."],
      ]),
    ],
    speaking: {
      situation:
        "Your teacher gives you a short spoken invitation. Reply aloud, then in writing.",
      steps: [
        "Check the place and time.",
        "Say yes, or suggest another familiar day.",
        "Say a short reply for your teacher to write.",
        "Your teacher reads the reply. Correct one wrong detail.",
      ],
      support: ["Yes, … is good.", "Sorry, I work on…", "At six?", "See you!"],
      success: [
        "My reply makes it clear if I agree.",
        "The place and time are correct.",
        "My reply has a greeting and ending.",
      ],
      model:
        "Hi, Anna. Yes, Friday at six is good. At the café near the park? See you!",
      teacherNote:
        "Review the meaning and completeness of the open reply. Other answers can be correct without matching the model exactly.",
    },
    writing: {
      instruction:
        "Write to a friend about a meeting. Include a greeting, place, time, question and ending. Three to five short sentences are enough.",
      model:
        "Hi, Ben! Are you free on Monday? Let’s meet at the park at five. Is five good? See you!",
      checklist: [
        "I give a clear place and time.",
        "I start I, names and days with capital letters.",
        "I put ? at the end of questions.",
      ],
    },
    exit: [
      "I can write a short, clear message.",
      "I can agree or say no politely.",
      "I can check important capital letters.",
    ],
    homework: {
      instruction: "Write an invitation and a reply that changes one detail.",
      steps: [
        "Invite someone to a familiar activity.",
        "Reply as a friend. Suggest a different time.",
        "The next day, read both messages aloud.",
      ],
      model: "Hi! Let’s meet at six. — Hi! Sorry, seven is good for me.",
    },
    teacherNotes: [
      "Keep the messages as practice drafts; no real messages need to be sent.",
      "If Let’s is difficult, a short suggestion such as Café on Friday at six? is sufficient.",
    ],
  }),
  makeLesson({
    n: 28,
    title: "Sorry, again, please!",
    subtitle: "Ask for repetition and check important details",
    topic: "Communication strategies",
    skills: ["listening", "speaking"],
    languageFocus: ["vocabulary"],
    goal: "I can ask someone to repeat, speak slowly or spell a word.",
    vocabulary: vocab(
      [
        "Again, please",
        "ask someone to say something one more time",
        "Again, please.",
      ],
      ["Slowly, please", "ask someone not to speak so fast", "Slowly, please."],
      [
        "I don’t understand",
        "say that the meaning is not clear to you",
        "Sorry, I don’t understand.",
      ],
      [
        "Can you repeat that?",
        "ask to hear the same words again",
        "Can you repeat that, please?",
      ],
      [
        "Is that right?",
        "ask if the information is correct",
        "Platform two. Is that right?",
      ],
      [
        "How do you spell it?",
        "ask for the letters of a word",
        "How do you spell it?",
      ],
    ),
    language: {
      focus: "repair phrases; checking by repetition",
      explanation:
        "You do not need to understand everything the first time. Use a short, polite phrase to stop and ask. Check one detail, then repeat it to make sure it is right. Use Can you…? as a request phrase.",
      examples: [
        "Sorry, can you repeat that?",
        "Slowly, please.",
        "Fifteen pounds. Is that right?",
      ],
      pitfall:
        "If an important detail is not clear, ask again before saying yes. Check the word, number or time you need.",
      pronunciation:
        "Speak calmly and clearly. Make SLOW stronger in Slowly, please. Your voice can go up when you check Fifteen? Listen to your teacher’s model.",
    },
    input: model(
      "Checking a ticket",
      "dialogue",
      "Clerk: The train is at nine thirty. Platform three. Fifteen pounds.\nVisitor: Sorry, can you repeat that?\nClerk: Nine thirty. Platform three.\nVisitor: Platform three. Is that right?\nClerk: Yes.\nVisitor: And fifteen pounds?\nClerk: Yes, fifteen.",
      [
        [
          "Which detail does the visitor check first?",
          ["The platform", "The city name", "The weather"],
          0,
          "After the repetition, the traveller checks Platform three.",
        ],
        [
          "How much is the ticket?",
          ["Fifty pounds", "Fifteen pounds", "Five pounds"],
          1,
          "The ticket seller confirms fifteen.",
        ],
        [
          "Which phrase asks for repetition?",
          ["Can you repeat that?", "See you!", "I like trains."],
          0,
          "Repeat that asks someone to say the words again.",
        ],
      ],
    ),
    retrieval: recall(
      ["Ask the time of a train.", "What time is the train?", 24],
      ["Ask someone to spell a name.", "How do you spell your name?", 2],
      ["Say the numbers 15 and 50.", "Fifteen. Fifty.", 15],
    ),
    practice: [
      match("repair-functions", "Choose the useful phrase", [
        [
          "You need the letters.",
          "How do you spell it?",
          "Ask for the letters when you need to write a word.",
        ],
        [
          "The person speaks too fast.",
          "Slowly, please.",
          "This asks the speaker not to speak so fast.",
        ],
        [
          "You want to check the number.",
          "Is that right?",
          "After hearing the detail again, check that it is correct.",
        ],
      ]),
      gaps("repair-phrases", "Complete the polite request", [
        ["Can you ___ that?", "repeat", "Repeat means say something again."],
        ["___, please. (not so fast)", "Slowly", "Slowly means not fast."],
        [
          "I don’t ___. (the meaning is not clear to me)",
          "understand",
          "I don’t understand tells the speaker that the message is not clear to you.",
        ],
        [
          "Is that ___? (correct)",
          "right",
          "Is that right? asks if the information is correct.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Your teacher dictates a made-up booking with a name, time, price and number.",
      steps: [
        "Write the four details. Ask to hear them again when needed.",
        "Ask your teacher to spell the name.",
        "Repeat a number to check it.",
        "Change roles. Correct one wrong detail you hear.",
      ],
      support: [
        "Sorry, again, please.",
        "How do you spell it?",
        "Fifteen?",
        "Is that right?",
      ],
      success: [
        "I use at least two ways to check information.",
        "I get the name and numbers right.",
        "I ask when a detail is not clear.",
      ],
      model:
        "A: Mia, six thirty, fifteen pounds, room two.\nB: Mia. How do you spell it? Six thirty? Fifteen pounds. Is that right?",
      teacherNote:
        "Begin at an understandable pace. Increase difficulty only after success. The aim is to help the learner repair communication, not to confuse them.",
    },
    writing: {
      instruction:
        "Make a help card with four phrases for a difficult conversation.",
      model:
        "Sorry, I don’t understand.\nCan you repeat that?\nSlowly, please.\nIs that right?",
      checklist: [
        "My phrases are polite.",
        "Each phrase helps me check a different thing.",
        "I end questions with ?.",
      ],
    },
    exit: [
      "I can ask someone to repeat.",
      "I can ask someone to speak more slowly.",
      "I can check a number or spelling.",
    ],
    homework: {
      instruction: "Practise checking three made-up details.",
      steps: [
        "Choose a name, time and price.",
        "Write a request or checking question for each detail.",
        "In the next lesson, ask your teacher to dictate new details.",
      ],
      model: "Eva? E–V–A? At five? Twenty pounds? Is that right?",
    },
    teacherNotes: [
      "Repairing a misunderstanding is an A1 communication skill, not a sign of failure.",
      "Check that all important details are understood after the clarification questions.",
    ],
  }),
  makeLesson({
    n: 29,
    title: "At a guesthouse",
    subtitle: "Check in and ask about your stay",
    topic: "Places to stay",
    skills: ["listening", "speaking", "writing"],
    languageFocus: ["vocabulary"],
    goal: "I can give simple registration details and ask about a room and breakfast.",
    vocabulary: vocab(
      [
        "room",
        "a space in a building where you can stay or sleep",
        "Room twelve.",
      ],
      ["key", "something you use to open a lock", "Here is your key."],
      ["breakfast", "the first meal of the day", "What time is breakfast?"],
      [
        "Wi-Fi",
        "a way to connect to the internet without a cable",
        "Is there Wi-Fi?",
      ],
      [
        "reception",
        "the desk where guests arrive and ask for help",
        "The key is at reception.",
      ],
      [
        "one night",
        "a stay for one night, not two or more",
        "A room for one night, please.",
      ],
    ),
    language: {
      focus: "registration questions; What time / Where / Is there",
      explanation:
        "Use familiar questions in a new place: What’s your surname? What time is breakfast? Where is my room? Is there Wi-Fi? Say A room for one night, please.",
      examples: [
        "My surname is Green.",
        "What time is breakfast?",
        "Is there Wi-Fi?",
      ],
      pitfall:
        "Choose the question for the information you need: Where for a place, What time for a time and Is there for something available.",
      pronunciation:
        "Room has a long /uː/ sound. Breakfast usually has two syllables. Repeat What time is breakfast? as one phrase.",
    },
    input: model(
      "Welcome to the guesthouse",
      "dialogue",
      "Receptionist: Hello. Your surname, please?\nGuest: Green. G–R–E–E–N.\nReceptionist: Room twelve. Here is your key.\nGuest: Thank you. What time is breakfast?\nReceptionist: At eight.\nGuest: Is there Wi-Fi?\nReceptionist: Yes. The information is in your room.",
      [
        [
          "What is the guest’s surname?",
          ["Green", "Brown", "White"],
          0,
          "The guest gives the surname Green.",
        ],
        ["Which room?", ["Two", "Twelve", "Twenty"], 1, "Room twelve."],
        [
          "When is breakfast?",
          ["At seven", "At nine", "At eight"],
          2,
          "The receptionist answers At eight.",
        ],
      ],
    ),
    retrieval: recall(
      ["Spell a surname aloud.", "Green: G–R–E–E–N.", 4],
      ["Ask someone to repeat a number.", "Can you repeat that, please?", 28],
      ["Say that the key is inside the bag.", "The key is in the bag.", 9],
    ),
    practice: [
      choice("guesthouse-questions", "Ask the right question", [
        [
          "You need the breakfast time.",
          [
            "Where is breakfast?",
            "What time is breakfast?",
            "How much is your name?",
          ],
          1,
          "Use What time to ask about time.",
        ],
        [
          "You need the room location.",
          [
            "Where is my room?",
            "How old is my room?",
            "What colour is my name?",
          ],
          0,
          "Use Where to ask about a place.",
        ],
        [
          "You want to know about Wi-Fi.",
          ["Is there Wi-Fi?", "Are Wi-Fi?", "I Wi-Fi?"],
          0,
          "Use Is there…? to ask if something is available.",
        ],
        [
          "You did not hear the room number.",
          ["See you!", "Again, please.", "I like blue."],
          1,
          "Ask for repetition when a detail is not clear.",
        ],
      ]),
      gaps("registration", "Complete the registration", [
        [
          "A room for one ___, please.",
          "night",
          "One night is a stay for one night only.",
        ],
        [
          "My ___ is Green. (family name)",
          "surname",
          "Surname means family name.",
        ],
        [
          "What ___ is breakfast?",
          "time",
          "What time asks when something happens.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Your teacher works at a guesthouse. Check in using made-up details.",
      steps: [
        "Ask for a room for one night.",
        "Give your surname. Spell it if needed.",
        "Check the room number and breakfast time.",
        "Ask one question about a place or Wi-Fi.",
      ],
      support: [
        "A room for one night, please.",
        "My surname is…",
        "What time is…?",
        "Where is…?",
      ],
      success: [
        "My registration details are clear.",
        "I check the room number and time.",
        "I can ask at least one question of my own.",
      ],
      model:
        "A room for one night, please. My surname is Green. Room twelve? What time is breakfast? Is there Wi-Fi?",
      teacherNote:
        "Use fictional details without real documents, bookings or payment information. This task brings familiar forms together in a practical situation.",
    },
    writing: {
      instruction:
        "Complete a guest card. Write two questions for the receptionist.",
      model:
        "Name: Eva Green\nCountry: Poland\nRoom: 12\nWhat time is breakfast?\nIs there Wi-Fi?",
      checklist: [
        "I start names and countries with capital letters.",
        "I write the correct room number.",
        "My questions ask for the information I need.",
      ],
    },
    exit: [
      "I can give simple check-in details.",
      "I can check the breakfast time.",
      "I can ask a question about a room.",
    ],
    homework: {
      instruction: "Prepare another check-in with a new character.",
      steps: [
        "Change the name, country and room number.",
        "Write three questions.",
        "Tomorrow, role-play the check-in without reading the dialogue.",
      ],
      model: "My name is Tom White. Room twenty? Where is the room?",
    },
    teacherNotes: [
      "Use the language already learned rather than adding many new rules.",
      "A second attempt with a different room number checks transfer to a new situation.",
    ],
  }),
  makeLesson({
    n: 30,
    title: "My first day in a new town",
    subtitle: "Use everyday English in a new town",
    topic: "Putting it together",
    skills: ["listening", "speaking", "writing"],
    languageFocus: ["grammar", "vocabulary"],
    goal: "I can handle several very short everyday exchanges with a helpful partner.",
    vocabulary: vocab(
      [
        "introduce myself",
        "say your name and a little about yourself",
        "I can introduce myself.",
      ],
      [
        "check",
        "look or ask again to make sure something is right",
        "Check the time.",
      ],
      ["ask", "use words to get information from someone", "Ask about the price."],
      ["choose", "decide which one you want", "Choose a café."],
      ["repeat", "say or do something again", "Repeat the important number."],
      [
        "next step",
        "the next thing you plan to do or learn",
        "My next step is speaking practice.",
      ],
    ),
    language: {
      focus: "review: be, present simple, can, there is, polite questions",
      explanation:
        "Choose a form for your message: I am… for who you are; I study… for a habit; I can… for an ability; There is… for something in a place; Can I have…? for a request. Ask again if you do not understand. This is review, not a test of the whole A1 level.",
      examples: [
        "I’m Eva. I’m from Poland.",
        "I study English on Monday.",
        "Can I have a tea, please?",
      ],
      pitfall:
        "Choose the meaning first. Do not join all the forms: I am can study → I can study.",
      pronunciation:
        "Make important details clear: names, times, prices and directions. Repeat a key number to check it after a request.",
    },
    input: model(
      "A new student’s day",
      "text",
      "My name is Eva Green. I’m from Poland. I study English on Monday. Today I am in York. There is a café near the station. I have a tea there. It is two pounds. My class starts at ten. The school is next to the park. My teacher is Ben.",
      [
        [
          "How much is the tea?",
          ["£10", "£2", "£20"],
          1,
          "It is two pounds gives the price of the tea.",
        ],
        [
          "When does the class start?",
          ["At ten", "At two", "At seven"],
          0,
          "My class starts at ten.",
        ],
        [
          "Where is the school?",
          ["Behind the station", "In the café", "Next to the park"],
          2,
          "The school is next to the park.",
        ],
      ],
    ),
    retrieval: recall(
      [
        "Introduce yourself. Give your country and one hobby.",
        "I’m Anna. I’m from Ukraine. I like reading.",
        25,
      ],
      [
        "Ask the price. Repeat it to check it.",
        "How much is it? Fifteen pounds?",
        15,
      ],
      ["Ask someone to speak more slowly.", "Slowly, please.", 28],
    ),
    practice: [
      gaps("review-forms", "Choose the useful form", [
        ["I ___ from Poland.", "am", "Use be to say where a person is from."],
        [
          "She ___ English every day. (study)",
          "studies",
          "After she, study becomes studies.",
        ],
        ["I can ___ a computer.", "use", "Use the basic verb after can."],
        [
          "There ___ a café near the station.",
          "is",
          "For one café, use there is.",
        ],
      ]),
      choice("review-functions", "Choose the phrase for the situation", [
        [
          "You need a tea.",
          ["Can I have a tea, please?", "I am tea.", "Do tea you?"],
          0,
          "This is a polite request.",
        ],
        [
          "You need the station location.",
          [
            "How old is the station?",
            "Where is the station?",
            "What name is the station?",
          ],
          1,
          "Where asks about a place.",
        ],
        [
          "You did not understand the price.",
          ["I like prices.", "See you!", "Can you repeat that, please?"],
          2,
          "Ask the speaker to repeat information you do not understand.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Try four short scenes with your teacher: meeting someone, ordering in a café, asking for directions and checking a lesson time.",
      steps: [
        "Introduce yourself to a new teacher and name one hobby.",
        "Order a drink and ask the price.",
        "Ask for directions to a school on a made-up map.",
        "Confirm the day and time of a lesson.",
        "Choose one difficult scene. Listen to feedback and try it again.",
      ],
      support: [
        "I’m… / I’m from…",
        "Can I have…?",
        "Where is…?",
        "On Monday at…",
        "Again, please.",
      ],
      success: [
        "I can communicate the important details in four scenes.",
        "I can ask for help or repetition when needed.",
        "I can improve one scene after feedback.",
      ],
      model:
        "Hello. I’m Eva. I like reading. Can I have a tea, please? How much is it? Where is the school? Monday at ten? Thank you.",
      teacherNote:
        "Play the different roles yourself; a second learner is not required. Allow help, repetition and slow speech. Success does not mean error-free language.",
    },
    writing: {
      instruction:
        "Make a small portfolio: a short profile, a café order and a message about a lesson time.",
      model:
        "I’m Eva. I’m from Poland. I like walking.\nA tea and a sandwich, please.\nHi, Ben. Monday at ten is good. See you!",
      checklist: [
        "Each piece has a clear purpose.",
        "I start names, I and days with capital letters.",
        "A reader can understand my questions and requests.",
      ],
    },
    exit: [
      "I can say what I do well in simple conversations.",
      "I can choose one topic to review.",
      "I can ask for help when I do not understand.",
    ],
    homework: {
      instruction:
        "Choose three pieces of work you like best. Decide on a next step.",
      steps: [
        "Choose a profile, a message and a written dialogue.",
        "Underline two phrases you can now say without help.",
        "Write one next learning goal. Discuss it with your teacher.",
      ],
      model:
        "I can order a drink. I can give my name. My next step: ask questions about a daily routine.",
    },
    teacherNotes: [
      "Do not present this lesson result as official CEFR A1 certification.",
      "Plan the next learning cycle around observed needs rather than automatically raising the learner’s level.",
    ],
  }),
];

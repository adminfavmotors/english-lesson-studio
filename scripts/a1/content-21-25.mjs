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
    n: 21,
    title: "Weather and seasons",
    subtitle: "Talk about the weather and choose an activity",
    topic: "Weather",
    skills: ["vocabulary", "speaking", "listening"],
    goal: "I can describe familiar weather and choose a suitable everyday activity.",
    vocabulary: vocab(
      ["sunny", "with a lot of sun", "It is sunny."],
      ["rainy", "with a lot of rain", "It is rainy today."],
      ["cold", "having a low temperature", "It is cold."],
      ["warm", "a little hot in a pleasant way", "It is warm in May."],
      ["windy", "with a lot of moving air", "It is windy."],
      ["snowing", "snow is falling now", "It is snowing now."],
    ),
    language: {
      focus: "It is + weather adjective; It is raining/snowing",
      explanation:
        "Use it to describe the weather: It is cold. For rain or snow falling now, say It is raining or It is snowing. The seasons are spring, summer, autumn and winter. Usually use in before a season.",
      examples: [
        "It is sunny today.",
        "It is raining now.",
        "It is cold in winter.",
      ],
      pitfall:
        "Remember it: Is cold → It is cold. Snowing describes something happening. Cold describes the weather.",
      pronunciation:
        "Weather starts with /w/ and has /ð/ in the middle. Round your lips for /w/. Copy your teacher, then say the whole phrase: What’s the weather like?",
    },
    input: model(
      "Two messages about the weather",
      "message",
      "Eva: It is sunny and warm here today. I am walking in the park.\nBen: It is cold here. It is raining now. I am at home. I am reading a book.\nEva: In winter, it is often cold here too.",
      [
        [
          "What is the weather like for Eva today?",
          ["Sunny and warm", "Cold and rainy", "Snowy"],
          0,
          "Eva writes sunny and warm.",
        ],
        [
          "Where is Ben?",
          ["In the park", "At home", "At the station"],
          1,
          "Ben writes I am at home.",
        ],
        [
          "What is Ben doing?",
          ["Cooking", "Reading", "Driving"],
          1,
          "I am reading a book.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say that you are reading now.", "I am reading now.", 20],
      ["Say that the park is near your home.", "The park is near my home.", 16],
      ["Name your favourite colour.", "My favourite colour is green.", 7],
    ),
    practice: [
      match("weather-meaning", "Match the weather", [
        ["with lots of sun", "sunny", "Sunny means there is a lot of sun."],
        [
          "with lots of moving air",
          "windy",
          "Windy means the air is moving strongly.",
        ],
        [
          "with a low temperature",
          "cold",
          "Cold means the temperature is low.",
        ],
      ]),
      gaps("weather-forms", "Complete the weather report", [
        [
          "___ is warm today.",
          "It",
          "Use it as the subject in a weather sentence.",
        ],
        ["It ___ snowing now.", "is", "For snow falling now, use is snowing."],
        ["It is cold ___ winter.", "in", "Use in before a season."],
        [
          "It is ___. (rain is falling now)",
          "raining",
          "Raining means rain is falling.",
        ],
      ]),
    ],
    speaking: {
      situation: "Choose a place for a short meeting: a park or a café.",
      steps: [
        "Your teacher describes the weather in two places.",
        "Ask a question to check one detail.",
        "Choose a place and a simple activity.",
        "The weather changes in the next round. Change your plan.",
      ],
      support: [
        "What’s the weather like?",
        "It is…",
        "The café, please.",
        "I am reading / walking.",
      ],
      success: [
        "I can describe the weather with it is.",
        "I can understand my teacher’s description.",
        "I can choose a suitable place.",
      ],
      model: "It is cold and rainy. The café is good. It is warm in the café.",
      teacherNote:
        "Keep the focus on current weather and a simple choice. A detailed forecast or future tense is not required.",
    },
    writing: {
      instruction:
        "Write a three-sentence message about the weather, a place and an action.",
      model: "It is sunny today. I am in the park. I am reading a book.",
      checklist: [
        "I use it in my weather sentence.",
        "I use be + -ing for an action happening now.",
        "I name the place clearly.",
      ],
    },
    exit: [
      "I can name three kinds of weather.",
      "I can understand a short weather message.",
      "I can choose a simple activity for a situation.",
    ],
    homework: {
      instruction: "Make three weather cards for made-up situations.",
      steps: [
        "Write the weather and a place on each card.",
        "Add one action by a person.",
        "Tomorrow, describe the cards using key words without reading full sentences.",
      ],
      model: "Cold, snowy, home → It is cold. It is snowing. I am at home.",
    },
    teacherNotes: [
      "Use fictional weather situations rather than a live forecast.",
      "For listening practice, change just one weather detail at a time.",
    ],
  }),
  makeLesson({
    n: 22,
    title: "How do you feel?",
    subtitle: "Describe how you feel and ask for help",
    topic: "How you feel",
    skills: ["vocabulary", "speaking", "listening"],
    goal: "I can say how I feel and ask for a simple thing I need.",
    vocabulary: vocab(
      ["tired", "feeling that you need to rest or sleep", "I am tired."],
      ["hungry", "feeling that you want to eat", "I am hungry."],
      ["thirsty", "feeling that you want a drink", "I am thirsty."],
      ["happy", "feeling good or pleased", "She is happy."],
      ["cold", "feeling that you need warmer clothes", "I am cold."],
      ["a headache", "pain in your head", "I have a headache."],
    ),
    language: {
      focus: "I am + feeling; I have a…; Can I have…?",
      explanation:
        "Use be with tired, hungry, thirsty, happy and cold. Say I have a headache with have. Then say what you need, for example Can I have some water?",
      examples: [
        "I am thirsty.",
        "I have a headache.",
        "Can I have some water, please?",
      ],
      pitfall:
        "Say I am hungry, not I have hungry. Say I have a headache, not I am a headache.",
      pronunciation:
        "Make the first syllable stronger in hungry and happy. In thirsty, use /θ/: put your tongue gently between your teeth and let air out without your voice. Copy your teacher.",
    },
    input: model(
      "A short break",
      "dialogue",
      "Teacher: How do you feel?\nAnna: I am tired and thirsty.\nTeacher: A short break?\nAnna: Yes, please. Can I have some water?\nTeacher: Of course.\nAnna: Thank you. I am hungry too. My sandwich is in my bag.",
      [
        [
          "How does Anna feel?",
          ["Happy and cold", "Tired and thirsty", "Only hungry"],
          1,
          "The first answer is tired and thirsty.",
        ],
        [
          "What does Anna ask for?",
          ["Coffee", "A book", "Water"],
          2,
          "Can I have some water?",
        ],
        [
          "Where is her sandwich?",
          ["In her bag", "On the teacher’s table", "At home"],
          0,
          "My sandwich is in my bag.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say that the weather outside is cold.", "It is cold.", 21],
      ["Ask for water politely.", "Water, please.", 14],
      ["Say where the bag is.", "It is under the table.", 9],
    ),
    practice: [
      gaps("feelings", "Choose am or have", [
        ["I ___ tired.", "am", "Use tired with be."],
        [
          "I ___ a headache.",
          "have",
          "The complete phrase is have a headache.",
        ],
        ["I ___ hungry.", "am", "Use hungry with be."],
        ["I ___ thirsty.", "am", "Use thirsty with be."],
      ]),
      match("needs", "Match the feeling and the request", [
        [
          "I am thirsty.",
          "Water, please.",
          "In this role-play, a thirsty person asks for water.",
        ],
        [
          "I am hungry.",
          "A sandwich, please.",
          "A hungry person wants something to eat.",
        ],
        [
          "I am tired.",
          "A short break, please.",
          "A tired person may ask for a break.",
        ],
      ]),
    ],
    speaking: {
      situation: "In a lesson, you need a short break or a simple thing.",
      steps: [
        "Choose a made-up feeling.",
        "Tell your teacher how you feel.",
        "Ask for water, food or a break.",
        "Your teacher checks your request. Say yes or correct the detail.",
      ],
      support: [
        "I am…",
        "I have a…",
        "Can I have…?",
        "Yes, please. / No, thank you.",
      ],
      success: [
        "I can name the feeling correctly.",
        "I can make a clear request.",
        "I can answer a checking question.",
      ],
      model:
        "I am thirsty. Can I have some water, please? Yes, water. Thank you.",
      teacherNote:
        "Use a fictional language role-play. Do not ask for real medical details or give treatment or medicine advice.",
    },
    writing: {
      instruction:
        "Write two short messages. Give a feeling and a request in each.",
      model:
        "I am tired. A short break, please.\nI am thirsty. Can I have some water?",
      checklist: [
        "I use be with hungry and tired.",
        "I use have with a headache.",
        "My request is polite.",
      ],
    },
    exit: [
      "I can say how I feel in a simple situation.",
      "I can ask for a break or some water.",
      "I can choose am or have in familiar phrases.",
    ],
    homework: {
      instruction: "Make three pairs: a feeling and a request.",
      steps: [
        "Use made-up situations.",
        "First, say the feeling from memory.",
        "Then add a suitable request.",
      ],
      model: "Hungry → I am hungry. Can I have a sandwich, please?",
    },
    teacherNotes: [
      "Let the learner choose comfortable, neutral feelings such as happy, tired or thirsty.",
      "Check that the request is understandable before reviewing be/have.",
    ],
  }),
  makeLesson({
    n: 23,
    title: "Clothes that fit",
    subtitle: "Choose clothes in the right colour and size",
    topic: "Clothes and shopping",
    skills: ["vocabulary", "speaking", "grammar"],
    goal: "I can ask for a familiar item of clothing in a colour and size.",
    vocabulary: vocab(
      ["T-shirt", "a light top with short sleeves", "A blue T-shirt, please."],
      [
        "jacket",
        "a short coat worn over other clothes",
        "This jacket is black.",
      ],
      [
        "shoes",
        "things you wear on your feet outside",
        "These shoes are white.",
      ],
      ["small", "size S", "A small T-shirt."],
      ["medium", "size M", "Medium, please."],
      ["large", "size L", "Have you got a large jacket?"],
    ),
    language: {
      focus: "this/these; size + colour + noun; requests",
      explanation:
        "Use this for one thing and these for more than one. Put size and colour before the item: a medium blue T-shirt. Ask Can I try it on? when you want to put the item on before buying it.",
      examples: [
        "This jacket is black.",
        "These shoes are white.",
        "Can I have a medium blue T-shirt?",
      ],
      pitfall:
        "Say These shoes, not These shoe. Put the size and colour before the item.",
      pronunciation:
        "In T-shirt, say the letter name /tiː/, then shirt. Shoes starts with /ʃ/. Listen to how it is different from /s/.",
    },
    input: model(
      "In a clothes shop",
      "dialogue",
      "Customer: A blue T-shirt, please.\nAssistant: Small, medium or large?\nCustomer: Medium, please.\nAssistant: This blue T-shirt is twenty pounds.\nCustomer: Can I try it on?\nAssistant: Yes, of course.",
      [
        [
          "What does the customer want?",
          ["A jacket", "A T-shirt", "Shoes"],
          1,
          "The first request is for a blue T-shirt.",
        ],
        ["Which size?", ["Small", "Large", "Medium"], 2, "Medium, please."],
        ["How much is it?", ["£12", "£20", "£30"], 1, "Twenty pounds."],
      ],
    ),
    retrieval: recall(
      ["Ask the price.", "How much is it?", 15],
      ["Name the colour of a clear sky.", "Blue.", 7],
      ["Say that the weather is cold today.", "It is cold today.", 21],
    ),
    practice: [
      choice("clothes-forms", "Choose the right phrase", [
        [
          "Two shoes:",
          [
            "This shoes is white.",
            "These shoes are white.",
            "These shoe is white.",
          ],
          1,
          "Use a plural: these shoes are.",
        ],
        [
          "A correct request:",
          [
            "A blue medium T-shirt.",
            "A medium blue T-shirt, please.",
            "A T-shirt medium blue.",
          ],
          1,
          "Put the size first, then the colour, then the item.",
        ],
        [
          "You want to put it on before buying.",
          [
            "Can I try it on?",
            "What is your name?",
            "Do you work here every day?",
          ],
          0,
          "Try it on means put clothes on to check the fit.",
        ],
        [
          "One jacket:",
          ["This jacket", "These jacket", "This jackets"],
          0,
          "Use This with one thing.",
        ],
      ]),
      gaps("clothes-spelling", "Complete the words", [
        ["A blue T-___", "shirt", "Write T-shirt with a hyphen."],
        ["S, M, L: small, ___, large", "medium", "M = medium."],
        [
          "These ___ are black. (things you wear on your feet)",
          "shoes",
          "Shoes is a plural.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Your teacher is a shop assistant. You want a T-shirt in a particular colour and size.",
      steps: [
        "Choose a colour and size. Do not show your notes to your teacher.",
        "Ask for the item and check the price.",
        "Your teacher offers one wrong detail.",
        "Say the colour or size you want. Ask to try the item on.",
      ],
      support: [
        "A … T-shirt, please.",
        "Medium, please.",
        "No, blue, please.",
        "Can I try it on?",
      ],
      success: [
        "I can name an item, size and colour.",
        "I can correct a wrong option.",
        "I can understand the price.",
      ],
      model: "A medium green T-shirt, please. How much is it? Can I try it on?",
      teacherNote:
        "Use a fictional character and size labels S/M/L. The learner does not need to discuss their body measurements.",
    },
    writing: {
      instruction:
        "Write a message to a shop. Ask the shop to keep two items for you.",
      model:
        "Hello. A medium blue T-shirt and a large black jacket, please. How much are they?",
      checklist: [
        "I put size and colour before the item.",
        "I choose this or these correctly when I use them.",
        "My request is clear without a picture.",
      ],
    },
    exit: [
      "I can name familiar clothes.",
      "I can check a size and colour.",
      "I can ask to try something on.",
    ],
    homework: {
      instruction: "Make three clothing order cards.",
      steps: [
        "Use different colours and sizes.",
        "Read each order as a customer.",
        "The next day, answer Small, medium or large? without looking.",
      ],
      model: "A small white T-shirt. A large green jacket.",
    },
    teacherNotes: [
      "Review prices and requests from lessons 14–15.",
      "Accept neutral request forms with Can I have… and I’d like….",
    ],
  }),
  makeLesson({
    n: 24,
    title: "A ticket, please",
    subtitle: "Buy a ticket and check travel details",
    topic: "Travel",
    skills: ["listening", "reading", "speaking"],
    goal: "I can ask for a simple ticket and check a departure time and price.",
    vocabulary: vocab(
      [
        "ticket",
        "a document or pass that lets you travel",
        "A ticket to York, please.",
      ],
      [
        "train",
        "a long vehicle that travels on railway tracks",
        "The train is at nine.",
      ],
      [
        "bus",
        "a large road vehicle that carries many passengers",
        "The bus is at ten.",
      ],
      [
        "single",
        "for a journey in one direction only",
        "A single ticket, please.",
      ],
      [
        "return",
        "for a journey to a place and back again",
        "A return ticket, please.",
      ],
      [
        "platform",
        "the place at a station where you wait beside a train",
        "Platform two.",
      ],
    ),
    language: {
      focus: "a ticket to…; What time…?; short travel questions",
      explanation:
        "Use to for your destination: to York. Ask A single ticket to York, please. Use separate short questions to check the time, price and platform.",
      examples: [
        "A ticket to York, please.",
        "What time is the train?",
        "Which platform?",
      ],
      pitfall:
        "For a destination, use to: a ticket to York. From tells us where a journey starts.",
      pronunciation:
        "Make the first syllable stronger in ticket. Say the whole time: nine thirty. Repeat important information to check it.",
    },
    input: model(
      "At the station",
      "schedule",
      "TRAINS TO YORK\n9:30 — £15 — platform 2\n10:00 — £20 — platform 4\n\nCustomer: A single ticket to York, please.\nClerk: The next train is at nine thirty. Fifteen pounds. Platform two.",
      [
        [
          "Where is the customer going?",
          ["Leeds", "York", "London"],
          1,
          "A ticket to York.",
        ],
        [
          "When is the next train?",
          ["9:30", "10:30", "9:00"],
          0,
          "The next train is at nine thirty.",
        ],
        [
          "Which platform for the 9:30 train?",
          ["Four", "Three", "Two"],
          2,
          "The table and the dialogue both say platform 2.",
        ],
      ],
    ),
    retrieval: recall(
      ["Read the price £15 aloud.", "Fifteen pounds.", 15],
      ["Ask where the station is.", "Where is the station?", 17],
      ["Read the time 9:30 aloud.", "Half past nine. / Nine thirty.", 10],
    ),
    practice: [
      gaps("ticket-phrases", "Complete the request", [
        ["A ticket ___ York, please.", "to", "To shows the destination."],
        [
          "What ___ is the train?",
          "time",
          "Ask What time to find out when something happens.",
        ],
        [
          "A ___ ticket, please. (one way only)",
          "single",
          "Single means for a journey in one direction only.",
        ],
        [
          "Which ___? (the place to wait beside the train)",
          "platform",
          "A platform is where you wait beside a train at a station.",
        ],
      ]),
      choice("travel-details", "Check the details", [
        [
          "The 10:00 train costs…",
          ["£15", "£20", "£10"],
          1,
          "The timetable gives £20 for the 10:00 train.",
        ],
        [
          "A return ticket is…",
          ["only one way", "there and back", "a bus stop"],
          1,
          "A return ticket includes a journey back.",
        ],
        [
          "To check a time, say…",
          ["Nine thirty?", "How old are you?", "It is blue."],
          0,
          "Repeat the time to check that you heard it correctly.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Your teacher sells tickets from a timetable you cannot see at first.",
      steps: [
        "Ask for a ticket to York.",
        "Check the time, price and platform.",
        "Repeat the three details to check them.",
        "Choose a different train if the first time is not suitable.",
      ],
      support: [
        "A single ticket to…, please.",
        "What time is the train?",
        "How much is it?",
        "Platform two?",
      ],
      success: [
        "I can name the destination.",
        "I can check the time and price.",
        "I can repeat the platform number to check it.",
      ],
      model:
        "A ticket to York, please. What time is the train? Nine thirty? How much is it? Platform two? Thank you.",
      teacherNote:
        "Use a fictional journey with one route and two departures. Complex fares and real bookings are unnecessary for this A1 goal.",
    },
    writing: {
      instruction:
        "Write a travel note with four details: destination, time, price and platform.",
      model: "To: York\nTime: 9:30\nPrice: £15\nPlatform: 2",
      checklist: [
        "I put the four details in the correct places.",
        "I check my numbers against the timetable.",
        "I start the town name with a capital letter.",
      ],
    },
    exit: [
      "I can ask for a simple ticket.",
      "I can understand a time and price.",
      "I can check a platform number.",
    ],
    homework: {
      instruction:
        "Make a fictional timetable with two departures. Prepare a request for a ticket seller.",
      steps: [
        "Write the times, prices and platform numbers.",
        "Choose a train and say your request aloud.",
        "Tomorrow, try to remember the four travel details without looking.",
      ],
      model: "A single ticket to Leeds, please. Ten o’clock? Twenty pounds?",
    },
    teacherNotes: [
      "Teach the useful question phrases as chunks before analysing every question word.",
      "Accept both half past nine and nine thirty.",
    ],
  }),
  makeLesson({
    n: 25,
    title: "Free time and hobbies",
    subtitle: "Find a hobby you have in common",
    topic: "Free time",
    skills: ["speaking", "vocabulary", "grammar"],
    goal: "I can talk about a few hobbies and find a shared interest.",
    vocabulary: vocab(
      ["reading", "spending time with a book or text", "I like reading."],
      ["walking", "going somewhere on foot", "She likes walking."],
      [
        "listening to music",
        "hearing songs and other music",
        "I like listening to music.",
      ],
      [
        "playing football",
        "kicking a ball in a team game",
        "He likes playing football.",
      ],
      [
        "watching films",
        "looking at movies on a screen",
        "I like watching films.",
      ],
      [
        "free time",
        "time when you do not have to work or study",
        "What do you do in your free time?",
      ],
    ),
    language: {
      focus: "like + -ing; Do you like…?",
      explanation:
        "To name an activity after like, use -ing: I like reading. This is a preference, not an action happening now. There is no am, is or are here. Ask Do you like walking?",
      examples: [
        "I like reading.",
        "She likes watching films.",
        "Do you like listening to music?",
      ],
      pitfall:
        "Say I like reading, not I am like reading. For an action happening now, say I am reading now.",
      pronunciation:
        "The t in listening is silent. Listen to listen and listening. Repeat the whole phrase listening to music.",
    },
    input: model(
      "A hobby board",
      "notice",
      "FIND A SHARED HOBBY\nEva likes reading and walking.\nBen likes playing football and listening to music.\nMia likes walking and watching films.\nOn Sunday, Eva and Mia walk in the park together.",
      [
        [
          "What do Eva and Mia both like?",
          ["Walking", "Football", "Music"],
          0,
          "Both people like walking.",
        ],
        [
          "Who likes music?",
          ["Eva", "Ben", "Mia"],
          1,
          "Ben likes listening to music.",
        ],
        [
          "When do Eva and Mia walk together?",
          ["Monday", "Friday", "Sunday"],
          2,
          "The last line says On Sunday.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say that you are reading right now.", "I am reading now.", 20],
      ["Ask a question about a food preference.", "Do you like apples?", 13],
      ["Say that you can swim.", "I can swim.", 18],
    ),
    practice: [
      gaps("hobby-forms", "Complete the hobby", [
        [
          "I like ___. (read)",
          "reading",
          "Name the activity after like with an -ing form.",
        ],
        ["She ___ walking.", "likes", "Use likes after she."],
        [
          "I like listening ___ music.",
          "to",
          "The complete phrase is listen to music.",
        ],
        ["___ you like watching films?", "Do", "With you, ask Do you like…?"],
      ]),
      choice("hobby-or-now", "Choose the meaning", [
        [
          "A hobby:",
          ["I like reading.", "I am reading now.", "I have a book now."],
          0,
          "Like reading tells us about a preference.",
        ],
        [
          "An action right now:",
          [
            "He likes football.",
            "He is playing football.",
            "He can play football.",
          ],
          1,
          "Is playing describes an action happening now.",
        ],
        [
          "Correct music phrase:",
          ["listening music", "listen music", "listening to music"],
          2,
          "Use to after listen before music.",
        ],
      ]),
    ],
    speaking: {
      situation: "Find an activity that both you and your teacher enjoy.",
      steps: [
        "Ask three questions with Do you like…?",
        "Say what activities you enjoy.",
        "Choose one activity you both like.",
        "Check a day and a simple place for the activity.",
      ],
      support: ["Do you like…?", "I like… too.", "On Sunday?", "In the park?"],
      success: [
        "I can ask about three activities.",
        "I can separate a preference from an action happening now.",
        "I can find a shared interest.",
      ],
      model:
        "A: Do you like walking?\nB: Yes, I do.\nA: I like walking too. In the park on Sunday?\nB: Yes.",
      teacherNote:
        "Aim for a meaningful shared choice. If the characters have no interests in common, let them choose a neutral alternative.",
    },
    writing: {
      instruction:
        "Write a hobby profile: two activities you like, one you do not like and a question.",
      model:
        "I like reading and walking. I don’t like playing football. Do you like watching films?",
      checklist: [
        "I use an -ing activity after like.",
        "I include to in listening to music.",
        "I start my question with Do.",
      ],
    },
    exit: [
      "I can name some hobbies.",
      "I can ask about interests.",
      "I can find an activity to do with someone.",
    ],
    homework: {
      instruction: "Make a Hobbies for a new friend card.",
      steps: [
        "List three interests for your character.",
        "Add one question to ask a new person.",
        "The next day, talk about your character with he or she.",
      ],
      model:
        "She likes reading. She likes listening to music. Does she like walking?",
    },
    teacherNotes: [
      "Participation in a real event is not required.",
      "Review familiar questions, times and place words during the task.",
    ],
  }),
];

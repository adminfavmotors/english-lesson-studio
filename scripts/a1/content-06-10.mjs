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
    n: 6,
    title: "What is this?",
    subtitle: "Name everyday objects and ask for what you need",
    topic: "Everyday objects",
    skills: ["grammar", "spelling", "vocabulary"],
    goal: "I can name everyday objects and ask for a classroom item.",
    vocabulary: vocab(
      [
        "book",
        "pages with words or pictures, held together",
        "This is a book.",
      ],
      ["pen", "something you write with", "A pen, please."],
      ["bag", "something you use to carry things", "It is my bag."],
      [
        "phone",
        "something you use to call or send messages",
        "This is a phone.",
      ],
      ["key", "something you use to open a lock", "These are keys."],
      [
        "umbrella",
        "something you hold over your head in the rain",
        "It is an umbrella.",
      ],
    ),
    language: {
      focus: "a/an; this is / these are; regular plurals",
      explanation:
        "For one thing, say a book or an umbrella. Use an before a vowel sound. For more than one, usually add -s: books. Use This is for one thing and These are for more than one.",
      examples: ["This is a pen.", "It is an umbrella.", "These are books."],
      pitfall:
        "Do not use a before a plural: books, not a books. Choose a or an by the sound at the start of the next word.",
      pronunciation:
        "In a book, make BOOK stronger. Listen to the endings: books /s/, pens /z/. Repeat after your teacher.",
    },
    input: model(
      "On the desk",
      "dialogue",
      "Eva: What is this?\nTom: It is a book.\nEva: And these?\nTom: These are keys.\nEva: Is this your bag?\nTom: Yes. My phone is in the bag.",
      [
        [
          "What is the first object?",
          ["A phone", "A book", "An umbrella"],
          1,
          "Tom says a book.",
        ],
        [
          "What are the small objects?",
          ["Keys", "Pens", "Bags"],
          0,
          "These are keys.",
        ],
        [
          "Where is the phone?",
          ["In the book", "In the bag", "On the keys"],
          1,
          "My phone is in the bag.",
        ],
      ],
    ),
    retrieval: recall(
      ["Introduce a female friend.", "This is my friend.", 5],
      ["Say her name.", "Her name is Eva.", 5],
      ["Say the number 15.", "Fifteen.", 2],
    ),
    practice: [
      gaps("articles", "Complete the labels", [
        ["___ book", "a", "Book starts with a consonant sound, so use a."],
        [
          "___ umbrella",
          "an",
          "Umbrella starts with a vowel sound, so use an.",
        ],
        ["one pen, two ___", "pens", "For this regular plural, add -s."],
        ["This ___ my phone.", "is", "This means one thing, so use is."],
      ]),
      choice("objects", "Choose the correct label", [
        [
          "Two books:",
          ["This is a book.", "These are books.", "These is books."],
          1,
          "For more than one thing, use these are.",
        ],
        [
          "One key:",
          ["an key", "a keys", "a key"],
          2,
          "Key starts with /k/. For one, say a key.",
        ],
        [
          "Choose the correct spelling.",
          ["umbrellla", "umbrella", "umbrel"],
          1,
          "Check the spelling: umbrella has two l letters.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Your teacher packs a bag as you speak. Use real things or word cards.",
      steps: [
        "Name three things you need.",
        "Your teacher chooses one wrong thing.",
        "Correct it: This is a pen, not a key.",
        "Ask politely: A book, please.",
      ],
      support: ["What is this?", "This is a…", "These are…", "A pen, please."],
      success: [
        "I can name three things.",
        "I can talk about one thing and more than one.",
        "I can correct a wrong choice.",
      ],
      model:
        "A: A book, please.\nB: This book?\nA: Yes, thank you. And two pens, please.",
      teacherNote:
        "Change the objects and quantities in the second round so the learner needs to adapt the dialogue.",
    },
    writing: {
      instruction:
        "List five things for a lesson. Add two sentences with this or these.",
      model:
        "a book, a pen, a bag, two keys, a phone\nThis is my bag. These are my keys.",
      checklist: [
        "I use a or an for one thing.",
        "I add -s to a regular plural when needed.",
        "I choose is or are correctly.",
      ],
    },
    exit: [
      "I can name things for a lesson.",
      "I can choose a or an with familiar words.",
      "I can ask for one thing or more than one.",
    ],
    homework: {
      instruction: "Write labels for five things near you.",
      steps: [
        "Try to write the words from memory first.",
        "Check the spelling and a or an.",
        "Tomorrow, describe one thing for your teacher to guess.",
      ],
      model: "This is a book. These are pens.",
    },
    teacherNotes: [
      "Introduce regular plurals only at this stage.",
      "For an online lesson, hold up one object at a time. Pictures are optional.",
    ],
  }),
  makeLesson({
    n: 7,
    title: "Colours and favourite things",
    subtitle: "Describe colours and choose a gift",
    topic: "Colours and preferences",
    skills: ["vocabulary", "grammar", "speaking"],
    goal: "I can describe familiar objects by colour and choose a simple gift.",
    vocabulary: vocab(
      ["red", "the colour of a tomato", "a red bag"],
      ["blue", "the colour of a clear daytime sky", "a blue pen"],
      ["green", "the colour of grass", "a green book"],
      ["black", "a very dark colour", "a black phone"],
      ["white", "the colour of snow", "a white cup"],
      ["favourite", "the one you like best", "My favourite colour is blue."],
    ),
    language: {
      focus: "adjective + noun; It is / They are",
      explanation:
        "Put a colour before a thing: a blue bag. Do not add -s to the colour: red pens. Use it for one thing and they for more than one.",
      examples: [
        "It is a green book.",
        "They are red pens.",
        "My favourite colour is blue.",
      ],
      pitfall:
        "Say a blue bag, not a bag blue. Say blue books, not blues books.",
      pronunciation:
        "Black and blue start with /bl/. Say both sounds together. Do not add a vowel between them.",
    },
    input: model(
      "A small gift shop",
      "text",
      "Three gifts are on the table. The book is green. The bag is red. The pens are blue. Ben’s favourite colour is blue. Eva’s favourite colour is red. The white cup is for Tom.",
      [
        [
          "Which gift is green?",
          ["The bag", "The book", "The cup"],
          1,
          "The book is green.",
        ],
        [
          "What colour are the pens?",
          ["Red", "White", "Blue"],
          2,
          "The pens are blue.",
        ],
        [
          "Who likes red?",
          ["Eva", "Ben", "Tom"],
          0,
          "Eva’s favourite colour is red.",
        ],
      ],
    ),
    retrieval: recall(
      ["Put a or an before umbrella and say the phrase.", "An umbrella.", 6],
      ["Say that these keys belong to you.", "These are my keys.", 6],
      ["Introduce your brother.", "This is my brother.", 5],
    ),
    practice: [
      order("colour-order", "Describe the objects", [
        ["It is a blue bag.", "Put the colour blue before bag."],
        ["They are red pens.", "Use They are for more than one thing."],
        [
          "My favourite colour is green.",
          "Favourite colour is one thing, so use is.",
        ],
      ]),
      gaps("colour-spelling", "Write the missing letters", [
        ["bl___ (the colour of a clear sky)", "ue", "Blue: b-l-u-e."],
        ["gr___n (the colour of grass)", "ee", "Green has ee in the middle."],
        ["wh___e (the colour of snow)", "it", "White: w-h-i-t-e."],
        [
          "Two red ___ (things you write with)",
          "pens",
          "Do not change red. Add -s to pen: red pens.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Choose a gift for someone. Only your teacher knows the favourite colour.",
      steps: [
        "Ask What is his/her favourite colour?",
        "Choose a gift from the three things in the text.",
        "Give one short reason for your choice.",
        "Your teacher changes the favourite colour. Suggest a different gift.",
      ],
      support: [
        "What is her favourite colour?",
        "A red bag.",
        "It is blue.",
        "This is for Ben.",
      ],
      success: [
        "I can find out the favourite colour.",
        "I can suggest a suitable gift.",
        "I put the colour before the object.",
      ],
      model:
        "A: What is Ben’s favourite colour?\nB: Blue.\nA: Blue pens for Ben.\nB: Good idea.",
      teacherNote:
        "Create an information gap: keep the colour preference hidden until the learner asks.",
    },
    writing: {
      instruction: "Describe three gifts. Say who each gift is for.",
      model:
        "This is a red bag for Eva. These are blue pens for Ben. This is a white cup for Tom.",
      checklist: [
        "I put a colour before each object.",
        "I use it with is and they with are.",
        "I do not add -s to colours.",
      ],
    },
    exit: [
      "I can name some common colours.",
      "I can describe a familiar object.",
      "I can ask what someone likes best.",
    ],
    homework: {
      instruction: "Describe three things in your favourite colour.",
      steps: [
        "Use real or made-up things.",
        "Write three sentences.",
        "Tomorrow, say the sentences without reading. Then check the word order.",
      ],
      model:
        "My favourite colour is green. This is a green bag. These are green pens.",
    },
    teacherNotes: [
      "Accept favourite colours beyond the list. Introduce one extra word at a time when needed.",
      "Review whether the gift fits the preference before correcting word order.",
    ],
  }),
  makeLesson({
    n: 8,
    title: "My home",
    subtitle: "Talk about rooms and furniture",
    topic: "Home",
    skills: ["grammar", "vocabulary", "reading"],
    goal: "I can say what rooms and basic furniture there are in a home.",
    vocabulary: vocab(
      ["kitchen", "a room where people cook", "There is a kitchen."],
      ["bedroom", "a room where people sleep", "There are two bedrooms."],
      ["bathroom", "a room with a bath or shower", "The bathroom is small."],
      [
        "living room",
        "a room where people sit and relax",
        "There is a sofa in the living room.",
      ],
      [
        "table",
        "a piece of furniture with a flat top, used for meals or work",
        "There is a table.",
      ],
      ["chair", "a seat for one person", "There are four chairs."],
    ),
    language: {
      focus: "There is / There are; a / two / three",
      explanation:
        "Use There is for one thing or room. Use There are for more than one. Say There is a table or There are two chairs.",
      examples: [
        "There is a kitchen.",
        "There are two bedrooms.",
        "There are four chairs.",
      ],
      pitfall:
        "Use There is a table, not There are a table. There is tells us something is in a place. It is tells us about a thing we already know.",
      pronunciation:
        "Listen for there’s: the short form of there is. You can use the full form when you speak.",
    },
    input: model(
      "A small flat",
      "text",
      "My flat is small. There is a kitchen and a bathroom. There are two bedrooms. In the living room, there is a table and a sofa. There are four chairs. The kitchen is white.",
      [
        [
          "How many bedrooms are there?",
          ["One", "Two", "Four"],
          1,
          "There are two bedrooms.",
        ],
        [
          "What is in the living room?",
          ["A table and a sofa", "Two kitchens", "A bathroom"],
          0,
          "There is a table and a sofa in the living room.",
        ],
        [
          "What colour is the kitchen?",
          ["Green", "Blue", "White"],
          2,
          "The kitchen is white.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say your favourite colour.", "My favourite colour is blue.", 7],
      ["Describe one blue thing.", "It is a blue bag.", 7],
      [
        "Complete the phrase: two ___ (chair). You can look at the word list.",
        "Two chairs.",
        6,
      ],
    ),
    practice: [
      gaps("there", "Complete the home description", [
        ["There ___ a kitchen.", "is", "For one room, use there is."],
        ["There ___ two bedrooms.", "are", "For two rooms, use there are."],
        ["There is ___ table.", "a", "For one table, say a table."],
        ["There are four ___. (chair)", "chairs", "Use a plural after four."],
      ]),
      choice("home-meaning", "Check the description", [
        [
          "Choose the correct sentence.",
          [
            "There is two chairs.",
            "There are two chairs.",
            "There are a chair.",
          ],
          1,
          "Use There are with a plural.",
        ],
        [
          "Which room is for sleeping?",
          ["A bedroom", "A kitchen", "A bathroom"],
          0,
          "A bedroom is a room for sleeping.",
        ],
        [
          "There is a sofa. How many sofas?",
          ["One", "Two", "Three"],
          0,
          "There is a sofa talks about one sofa.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Describe a made-up flat. Your teacher draws a simple plan as you speak.",
      steps: [
        "Choose two or three rooms.",
        "Say how many rooms there are. Describe the things in one room.",
        "Your teacher describes the plan with one mistake.",
        "Correct the number or the object.",
      ],
      support: ["There is a…", "There are two…", "In the living room…"],
      success: [
        "I can name rooms.",
        "I can describe one thing and more than one.",
        "I can correct a mistake in the plan.",
      ],
      model:
        "There are two bedrooms. There is a kitchen. In the living room, there is a table. There are three chairs.",
      teacherNote:
        "A fictional home works well. The learner does not need to describe their real home.",
    },
    writing: {
      instruction:
        "Write four sentences about a made-up home. Include rooms and furniture.",
      model:
        "There is a kitchen. There are two bedrooms. There is a table in the kitchen. There are four chairs.",
      checklist: [
        "I use There is for one thing.",
        "I use There are for more than one.",
        "I use a plural after a number greater than one.",
      ],
    },
    exit: [
      "I can name common rooms.",
      "I can say what there is in a home.",
      "I can choose between there is and there are.",
    ],
    homework: {
      instruction: "Draw a small plan. Add five short labels or sentences.",
      steps: [
        "Include two rooms and three objects.",
        "Show how many of each thing there are.",
        "In the next lesson, describe the plan without showing it to your teacher.",
      ],
      model: "There is a bedroom. There are two chairs.",
    },
    teacherNotes: [
      "Avoid introducing many irregular plurals at once.",
      "Connect this lesson with colours: a white kitchen, a blue chair.",
    ],
  }),
  makeLesson({
    n: 9,
    title: "Where is my key?",
    subtitle: "Find things using simple descriptions",
    topic: "Where things are",
    skills: ["grammar", "listening", "speaking"],
    goal: "I can ask where a familiar object is and understand a simple location.",
    vocabulary: vocab(
      ["in", "inside something", "The key is in the bag."],
      ["on", "touching the top of something", "The phone is on the table."],
      ["under", "below something", "The book is under the chair."],
      [
        "next to",
        "very near; at the side of something",
        "The bag is next to the sofa.",
      ],
      ["behind", "at the back of something", "The chair is behind the table."],
      [
        "between",
        "in the middle of two things",
        "The key is between the books.",
      ],
    ),
    language: {
      focus: "Where is / Where are; prepositions of place",
      explanation:
        "Ask Where is…? about one thing. Ask Where are…? about more than one. Answer with a place word: The key is on the table.",
      examples: [
        "Where is my phone?",
        "It is under the book.",
        "The keys are in the bag.",
      ],
      pitfall:
        "Remember is or are: The key in the bag → The key is in the bag.",
      pronunciation:
        "In Where is my key?, make KEY stronger. To correct a place, make that word stronger: ON the table. Copy your teacher.",
    },
    input: model(
      "Before class",
      "dialogue",
      "Ben: Where is my phone?\nMia: It is on the table, next to the book.\nBen: Thank you. And where are my keys?\nMia: They are in your bag.\nBen: Is my pen in the bag too?\nMia: No. It is under the chair.",
      [
        [
          "Where is the phone?",
          ["Under the chair", "On the table", "In the bag"],
          1,
          "It is on the table.",
        ],
        [
          "Where are the keys?",
          ["In the bag", "Behind the chair", "On the sofa"],
          0,
          "They are in your bag.",
        ],
        [
          "What is under the chair?",
          ["The phone", "The book", "The pen"],
          2,
          "The last line tells us where the pen is.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say that there is a kitchen in a home.", "There is a kitchen.", 8],
      ["Say that there are two chairs.", "There are two chairs.", 8],
      ["Name one thing in a bag.", "A pen.", 6],
    ),
    practice: [
      gaps("location", "Complete the location", [
        [
          "The phone ___ on the table.",
          "is",
          "A phone is one thing, so use is.",
        ],
        ["The keys ___ in the bag.", "are", "Keys is a plural, so use are."],
        [
          "Ask about one key: Where ___ my key?",
          "is",
          "For one key, ask Where is…?",
        ],
        [
          "The book is next ___ the phone.",
          "to",
          "The complete phrase is next to.",
        ],
      ]),
      match("prepositions", "Match the locations", [
        ["below the table", "under the table", "Under means below something."],
        ["inside the bag", "in the bag", "In means inside something."],
        [
          "at the back of the chair",
          "behind the chair",
          "Behind means at the back of something.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Put three things in different places. Your teacher needs to find the same places from your words.",
      steps: [
        "Use a pen, book and key, or imagine where they are.",
        "Answer your teacher’s Where is…? questions without showing the objects.",
        "Your teacher draws or describes the places.",
        "Compare the result. Then change roles.",
      ],
      support: ["It is on…", "It is under…", "It is next to…"],
      success: [
        "I can use at least three place words.",
        "I remember is or are.",
        "A listener can find the things from my words.",
      ],
      model:
        "The pen is on the book. The key is under the chair. The phone is next to the bag.",
      teacherNote:
        "Review open descriptions yourself: correctness depends on the scene the learner chooses, so an automatic answer key would not fit.",
    },
    writing: {
      instruction: "Write three clues to help someone find things in a room.",
      model:
        "The key is in the bag. The bag is under the table. The phone is next to the book.",
      checklist: [
        "I name an object and another thing near it.",
        "I use is or are before the place word.",
        "My place words match the scene.",
      ],
    },
    exit: [
      "I can ask where a thing is.",
      "I can understand in, on and under.",
      "I can explain a place without showing it.",
    ],
    homework: {
      instruction: "Make a short Find the key game.",
      steps: [
        "Draw a scene with four objects.",
        "Write three clues.",
        "The next day, look only at the picture. Try to remember the place words.",
      ],
      model: "The key is under the book. The book is on the table.",
    },
    teacherNotes: [
      "For listening practice, read the dialogue while the text is hidden. Then show it for checking.",
      "Allow repetition and checking questions. The goal is to find the object, rather than understand perfectly after one hearing.",
    ],
  }),
  makeLesson({
    n: 10,
    title: "My morning",
    subtitle: "Talk about your morning and tell the time",
    topic: "Daily routines",
    skills: ["vocabulary", "grammar", "speaking"],
    goal: "I can describe a simple morning routine and say basic times.",
    vocabulary: vocab(
      ["get up", "leave your bed and start the day", "I get up at seven."],
      ["have breakfast", "eat your morning meal", "I have breakfast at eight."],
      [
        "go to work",
        "travel to the place where you work",
        "I go to work at nine.",
      ],
      ["study", "spend time learning", "I study English."],
      ["at seven", "at 7:00", "I get up at seven."],
      ["half past seven", "7:30", "Breakfast is at half past seven."],
    ),
    language: {
      focus: "Present simple with I/you; at + time",
      explanation:
        "For regular actions, use I or you with the basic verb: I get up. You study. Use at before a time. Seven o’clock is 7:00; half past seven is 7:30. These actions happen regularly.",
      examples: [
        "I get up at seven.",
        "I have breakfast at half past seven.",
        "I study English at eight.",
      ],
      pitfall:
        "Do not put am before an action verb here: I am get up → I get up.",
      pronunciation:
        "Join the sounds in get up. Make the action and time stronger: GET UP at SEVEN. Listen and repeat.",
    },
    input: model(
      "Leo’s morning note",
      "schedule",
      "MY MORNING\n7:00 — I get up.\n7:30 — I have breakfast.\n8:00 — I study English.\n9:00 — I go to work.\nMy bag is next to the door.",
      [
        [
          "When does Leo get up?",
          ["At seven", "At eight", "At nine"],
          0,
          "The timetable says get up at 7:00.",
        ],
        [
          "What is at half past seven?",
          ["Work", "Breakfast", "English"],
          1,
          "7:30 — breakfast.",
        ],
        [
          "Where is the bag?",
          ["Under the chair", "On the bed", "Next to the door"],
          2,
          "The last line says next to the door.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say where the phone is.", "It is on the table.", 9],
      ["Name two rooms.", "A kitchen and a bedroom.", 8],
      ["Say the number 8.", "Eight.", 2],
    ),
    practice: [
      gaps("routine", "Complete the morning", [
        ["I ___ up at seven.", "get", "The complete phrase is get up."],
        [
          "I have ___ at eight.",
          "breakfast",
          "Have breakfast means eat your morning meal.",
        ],
        [
          "I go ___ work at nine.",
          "to",
          "Go to work means travel to your workplace.",
        ],
        ["I study English ___ eight.", "at", "Use at before a time."],
      ]),
      choice("time", "Read the time", [
        [
          "7:30",
          ["Seven o’clock", "Half past seven", "Half past eight"],
          1,
          "Half past seven = 7:30.",
        ],
        [
          "8:00",
          ["Eight o’clock", "Half past eight", "Nine o’clock"],
          0,
          "8:00 = eight o’clock.",
        ],
        [
          "Choose a routine sentence.",
          [
            "I am get up at seven.",
            "I get up at seven.",
            "I is get up at seven.",
          ],
          1,
          "After I, use the action verb without am.",
        ],
      ]),
    ],
    speaking: {
      situation: "Choose a time for a short morning lesson with your teacher.",
      steps: [
        "Say three things you usually do in the morning. Give the times.",
        "Your teacher suggests a lesson time.",
        "Say what you usually do at that time.",
        "Choose a good time. Repeat it to check.",
      ],
      support: [
        "I get up at…",
        "I have breakfast at…",
        "English at eight, please.",
      ],
      success: [
        "I can describe three actions.",
        "I can say a time with o’clock and half past.",
        "I can choose a suitable time.",
      ],
      model:
        "I get up at seven. I have breakfast at half past seven. I study English at eight. Eight is good.",
      teacherNote:
        "Do not require full do/does questions yet. Ask What time? with support from a timetable.",
    },
    writing: {
      instruction:
        "Write a four-line morning timetable. It can be real or made up.",
      model:
        "7:00 — I get up.\n7:30 — I have breakfast.\n8:00 — I study.\n9:00 — I go to work.",
      checklist: [
        "I use I with an action verb.",
        "My times are clear and easy to follow.",
        "I use at before a time in a sentence.",
      ],
    },
    exit: [
      "I can describe my morning.",
      "I can say times with o’clock and half past.",
      "I can agree on a lesson time.",
    ],
    homework: {
      instruction: "Prepare a short My morning talk using four clock times.",
      steps: [
        "Draw four clocks showing different times and write an action for each.",
        "Say the sentences without reading.",
        "Tomorrow, review three place words from lesson 9.",
      ],
      model: "I get up at eight. I have breakfast at half past eight.",
    },
    teacherNotes: [
      "Use the learner’s needs: work can become school. Keep the vocabulary load small.",
      "Give a short second attempt after feedback instead of a long rule explanation.",
    ],
  }),
];

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
    n: 11,
    title: "A day in her life",
    subtitle: "Describe a daily routine",
    topic: "Daily routines",
    skills: ["speaking", "writing"],
    languageFocus: ["grammar"],
    goal: "I can describe another person’s routine with simple sentences.",
    vocabulary: vocab(
      ["works", "does a job regularly", "She works in a café."],
      ["lives", "has a home in a place", "He lives in Leeds."],
      ["starts", "begins an activity", "She starts work at nine."],
      ["finishes", "ends an activity", "He finishes at five."],
      [
        "goes home",
        "travels back to the place where they live",
        "She goes home at six.",
      ],
      [
        "watches TV",
        "looks at programmes on a television",
        "He watches TV in the evening.",
      ],
    ),
    language: {
      focus: "Present simple: he/she + -s / -es",
      explanation:
        "For regular actions with he or she, change the verb: work → works, live → lives, go → goes, watch → watches. Have becomes has. After a consonant, y changes: study → studies. Compare I work and she works.",
      examples: [
        "I work. She works.",
        "He goes home at five.",
        "She has breakfast at eight.",
      ],
      pitfall: "Say She works, not She work. With I, do not add -s: I work.",
      pronunciation:
        "Listen to the endings: works /s/, lives /z/, watches /ɪz/. Watches has an extra syllable. Repeat the three words after your teacher.",
    },
    input: model(
      "Mia’s working day",
      "text",
      "Mia lives in York. She works in a café. She gets up at seven and has breakfast at eight. She starts work at nine. She finishes at five and goes home. In the evening, she watches TV.",
      [
        [
          "Where does Mia work?",
          ["In a café", "At a school", "In a shop"],
          0,
          "She works in a café.",
        ],
        [
          "When does she start work?",
          ["At five", "At eight", "At nine"],
          2,
          "She starts work at nine.",
        ],
        [
          "What does she do in the evening?",
          ["She works", "She watches TV", "She goes to school"],
          1,
          "The last line says watches TV.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say what time you get up.", "I get up at seven.", 10],
      ["Read the time 7:30 aloud.", "Half past seven.", 10],
      ["Say where she is from.", "She is from Poland.", 3],
    ),
    practice: [
      gaps("third-person", "Complete the verbs", [
        ["She ___ in York. (live)", "lives", "Add -s to this verb after she."],
        ["He ___ to work at nine. (go)", "goes", "Go → goes."],
        [
          "Mia ___ breakfast at eight. (have)",
          "has",
          "After she, have becomes has.",
        ],
        ["He ___ TV in the evening. (watch)", "watches", "Watch → watches."],
      ]),
      order("day-order", "Build a description", [
        ["She starts work at nine.", "Use She + starts + work + a time."],
        ["He goes home at five.", "Go becomes goes. Say home without to."],
        ["I live in York.", "Do not add -s after I."],
      ]),
    ],
    speaking: {
      situation:
        "Your teacher chooses a made-up person. Prepare a short description of that person’s day.",
      steps: [
        "Find out the name and town.",
        "Look at the timetable, or ask your teacher to give you the times.",
        "Describe four actions with he or she.",
        "Listen to feedback. Then try again without the timetable.",
      ],
      support: ["He lives in…", "She starts at…", "He goes home at…"],
      success: [
        "I use he or she.",
        "I add -s or -es when needed.",
        "I describe the day in a clear order.",
      ],
      model:
        "This is Eva. She lives in Leeds. She starts work at eight. She finishes at four. She goes home at five.",
      teacherNote:
        "You can dictate a profile: Eva, Leeds, start 8:00, finish 4:00, home 5:00. Focus on a few useful endings rather than correcting all forms at once.",
    },
    writing: {
      instruction:
        "Write four sentences about the person’s day. Then write one sentence about yourself.",
      model:
        "Ben lives in York. He works in a café. He starts at nine. He goes home at five. I start work at eight.",
      checklist: [
        "I use the right verb form after he or she.",
        "I change have to has when needed.",
        "I do not add -s after I.",
      ],
    },
    exit: [
      "I can describe another person’s routine.",
      "I can choose between I work and she works.",
      "I can give two important times in a day.",
    ],
    homework: {
      instruction:
        "Use your timetable from lesson 10. Write about a made-up person instead of yourself.",
      steps: [
        "Change I to he or she.",
        "Check verb endings and has/goes.",
        "The next day, describe your day and the other person’s day in turn.",
      ],
      model: "I get up at seven. → She gets up at seven.",
    },
    teacherNotes: [
      "Give separate feedback on the message and the language forms.",
      "For a regular action, say she works without a form of be.",
    ],
  }),
  makeLesson({
    n: 12,
    title: "Do you study every day?",
    subtitle: "Ask and answer questions about habits",
    topic: "Habits",
    skills: ["listening", "speaking"],
    languageFocus: ["grammar"],
    goal: "I can ask simple questions about routines and give short answers.",
    vocabulary: vocab(
      ["every day", "on all days", "I study every day."],
      ["usually", "on most days or most times", "I usually get up at seven."],
      ["sometimes", "on some days or at some times", "I sometimes watch TV."],
      ["never", "not at any time", "I never work on Sunday."],
      [
        "on Monday",
        "on the first day of the working week",
        "I study on Monday.",
      ],
      ["at the weekend", "on Saturday and Sunday", "I study at the weekend."],
    ),
    language: {
      focus: "Do/Does questions; don’t/doesn’t",
      explanation:
        "Ask Do you work? with you and Does she work? with she. After does, use the basic verb without -s. For no, say I don’t work or She doesn’t work. Put usually or sometimes before the action verb.",
      examples: [
        "Do you study every day?",
        "Yes, I do. No, I don’t.",
        "Does she work on Monday?",
      ],
      pitfall:
        "Say Does she work?, not Does she works? The -s is already in does.",
      pronunciation:
        "Listen to don’t and doesn’t as short words. Make the main action clear: Do you STUDY every day?",
    },
    input: model(
      "A study routine",
      "dialogue",
      "Tom: Do you study English every day?\nEva: No, I don’t. I study on Monday and Friday.\nTom: Does Ben study with you?\nEva: Yes, he does. He usually starts at six.\nTom: Do you work at the weekend?\nEva: No. I never work on Sunday.",
      [
        [
          "When does Eva study?",
          ["Every day", "On Monday and Friday", "Only on Sunday"],
          1,
          "Eva names Monday and Friday.",
        ],
        [
          "Does Ben study with Eva?",
          ["Yes, he does", "No, he doesn’t", "The text does not say"],
          0,
          "Eva answers Yes, he does.",
        ],
        [
          "Does Eva work on Sunday?",
          ["Yes", "No", "Sometimes"],
          1,
          "She never works on Sunday.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say that she works in a café.", "She works in a café.", 11],
      ["Say that he goes home at five.", "He goes home at five.", 11],
      ["Read the time 6:00 aloud.", "Six o’clock.", 10],
    ),
    practice: [
      gaps("do-does", "Complete the questions", [
        ["___ you study English?", "Do", "Use do with you."],
        ["___ she work on Monday?", "Does", "Use does with she."],
        [
          "Does he ___ in York? (live)",
          "live",
          "After does, use the basic verb without -s.",
        ],
        [
          "I ___ work on Sunday.",
          ["don’t", "don't"],
          "For a negative with I, use don’t.",
        ],
      ]),
      choice("short-answers", "Choose the answer", [
        [
          "Does Ben study here?",
          ["Yes, he do.", "Yes, he does.", "Yes, he is study."],
          1,
          "Use does again in the short answer.",
        ],
        [
          "Do you work here?",
          ["No, I don’t.", "No, I doesn’t.", "No, I not work."],
          0,
          "Use don’t with I.",
        ],
        [
          "Choose the correct question.",
          ["Does she watches TV?", "Do she watch TV?", "Does she watch TV?"],
          2,
          "Does + she + watch.",
        ],
      ]),
    ],
    speaking: {
      situation: "Find a good day to practise English with your teacher.",
      steps: [
        "Ask three questions about work and study on different days.",
        "Answer your teacher’s questions too.",
        "Find a day when you are both free.",
        "Try one difficult question again.",
      ],
      support: [
        "Do you work on…?",
        "Do you study at…?",
        "Yes, I do. / No, I don’t.",
      ],
      success: [
        "I can ask at least three questions.",
        "I can give short answers.",
        "I can find a suitable day.",
      ],
      model:
        "A: Do you work on Friday?\nB: Yes, I do. Do you study on Sunday?\nA: No, I don’t. Sunday is good.",
      teacherNote:
        "Give yourself and the learner different schedules. They should find the shared free day by asking questions.",
    },
    writing: {
      instruction:
        "Write three questions about habits. Add a short answer to each.",
      model:
        "Do you study on Monday? Yes, I do.\nDoes Eva work on Sunday? No, she doesn’t.\nDo you watch TV? Sometimes.",
      checklist: [
        "I start each question with Do or Does.",
        "I use the verb without -s after does.",
        "Each answer matches its question.",
      ],
    },
    exit: [
      "I can ask about a habit.",
      "I can give a short yes or no answer.",
      "I can choose do or does.",
    ],
    homework: {
      instruction: "Prepare a short interview with four questions.",
      steps: [
        "Make two questions with you and two with he or she.",
        "Answer as a made-up person.",
        "Tomorrow, try to remember the questions without your notes.",
      ],
      model: "Does Tom study every day? No, he doesn’t.",
    },
    teacherNotes: [
      "Never already makes a negative meaning: I never work, without don’t.",
      "If usually and sometimes distract from the question forms, teach them as short ready-to-use phrases.",
    ],
  }),
  makeLesson({
    n: 13,
    title: "Food I like",
    subtitle: "Talk about food and preferences",
    topic: "Food",
    skills: ["listening", "speaking", "writing"],
    languageFocus: ["grammar", "vocabulary"],
    goal: "I can say which foods I like and ask about someone’s preferences.",
    vocabulary: vocab(
      [
        "bread",
        "food you often cut into slices and eat with butter",
        "I like bread.",
      ],
      ["rice", "small grains that you cook in water", "I like rice."],
      [
        "eggs",
        "food with a shell and a yellow and white part inside",
        "I don’t like eggs.",
      ],
      ["apples", "round fruit, often red or green", "Do you like apples?"],
      ["water", "a clear drink with no colour", "Water, please."],
      [
        "coffee",
        "a drink made from roasted beans, often served hot",
        "She likes coffee.",
      ],
    ),
    language: {
      focus: "like / don’t like; Do you like…?",
      explanation:
        "Say I like… for food you enjoy. Say I don’t like… for food you do not enjoy. Use a plural for a general preference: I like apples. We usually do not count bread, rice, water or coffee as separate things in these sentences.",
      examples: ["I like rice.", "I don’t like eggs.", "Do you like coffee?"],
      pitfall:
        "For a general preference, say I like apples, not I like apple. Do not add -s to rice.",
      pronunciation:
        "In like coffee, make the food or drink word stronger. In don’t like, make sure the listener hears don’t.",
    },
    input: model(
      "Breakfast choices",
      "text",
      "Anna likes bread and eggs for breakfast. She drinks water. Ben likes apples and rice. He doesn’t like eggs. Eva likes coffee and bread. She doesn’t like rice.",
      [
        [
          "Who doesn’t like eggs?",
          ["Anna", "Ben", "Eva"],
          1,
          "Ben doesn’t like eggs.",
        ],
        [
          "What does Anna drink?",
          ["Coffee", "Water", "Tea"],
          1,
          "She drinks water.",
        ],
        ["Who likes coffee?", ["Eva", "Ben", "Anna"], 0, "Eva likes coffee."],
      ],
    ),
    retrieval: recall(
      [
        "Ask if the other person studies every day.",
        "Do you study every day?",
        12,
      ],
      ["Give a short negative answer.", "No, I don’t.", 12],
      ["Say what time you have breakfast.", "I have breakfast at eight.", 10],
    ),
    practice: [
      gaps("food-likes", "Complete the preferences", [
        [
          "I ___ apples. (I enjoy eating them.)",
          "like",
          "Use like for a positive preference.",
        ],
        [
          "I ___ like eggs. (I do not enjoy eating them.)",
          ["don’t", "don't"],
          "Use don’t like for a negative preference.",
        ],
        ["___ you like rice?", "Do", "Start a question with you using Do."],
        ["She ___ coffee. (like)", "likes", "Use likes after she."],
      ]),
      match("food-words", "Match the food", [
        [
          "food often eaten in slices",
          "bread",
          "Bread is food you can eat in slices.",
        ],
        [
          "small grains cooked in water",
          "rice",
          "Rice is a food made of small grains.",
        ],
        [
          "round red or green fruit",
          "apples",
          "Apples is the plural of apple.",
        ],
      ]),
    ],
    speaking: {
      situation: "Choose a breakfast that both you and your teacher like.",
      steps: [
        "Ask about three foods from the list.",
        "Say two foods you like or do not like.",
        "Choose two foods you both like.",
        "Say what you do not want for breakfast.",
      ],
      support: [
        "Do you like…?",
        "I like…",
        "I don’t like…",
        "Bread and apples for breakfast.",
      ],
      success: [
        "I can ask about food preferences.",
        "I can say what I like and do not like.",
        "I can find a choice that works for both people.",
      ],
      model:
        "A: Do you like eggs?\nB: No, I don’t. I like bread.\nA: I like bread too. Bread and apples?",
      teacherNote:
        "Preferences can be fictional. Keep this as a language task rather than nutrition advice.",
    },
    writing: {
      instruction:
        "Write four lines: two foods you like and two you do not like. Add a question for your teacher.",
      model:
        "I like apples. I like bread. I don’t like eggs. I don’t like coffee. Do you like rice?",
      checklist: [
        "I use like and don’t like to show my meaning.",
        "I use the plurals apples and eggs.",
        "I start my question with Do.",
      ],
    },
    exit: [
      "I can name six foods or drinks.",
      "I can say what food I like.",
      "I can choose food that two people like.",
    ],
    homework: {
      instruction: "Make a food preference card for a made-up guest.",
      steps: [
        "Choose three foods the guest likes and two the guest does not like.",
        "Write sentences with he or she.",
        "Review do/does from lesson 12. Ask two questions about the guest.",
      ],
      model:
        "Eva likes bread. She doesn’t like rice. Does she like coffee? Yes, she does.",
    },
    teacherNotes: [
      "Do not introduce the full countable/uncountable system at once.",
      "Repeat the breakfast choice task with different preferences.",
    ],
  }),
  makeLesson({
    n: 14,
    title: "At the café",
    subtitle: "Order food and drinks",
    topic: "At a café",
    skills: ["reading", "listening", "speaking", "writing"],
    languageFocus: ["vocabulary"],
    goal: "I can order a drink and a simple snack politely.",
    vocabulary: vocab(
      ["tea", "a drink made with hot water and leaves", "A tea, please."],
      ["sandwich", "food between two slices of bread", "A sandwich, please."],
      ["menu", "a list of food and drinks you can order", "The menu, please."],
      ["I’d like…", "a polite way to say what you want", "I’d like a coffee."],
      ["please", "a word that makes a request polite", "Water, please."],
      [
        "Anything else?",
        "a question to ask if someone wants more",
        "Anything else? No, thank you.",
      ],
    ),
    language: {
      focus: "I’d like…; Can I have…?; polite short replies",
      explanation:
        "Use I’d like… or Can I have…? to order politely. In a café, a coffee or a tea can mean one cup. To finish your order, say That’s all, thank you.",
      examples: [
        "I’d like a sandwich, please.",
        "Can I have a tea?",
        "That’s all, thank you.",
      ],
      pitfall:
        "I like coffee tells us about a general preference. To order now, say I’d like a coffee.",
      pronunciation:
        "Keep the short /d/ in I’d like. Listen as your teacher compares I like and I’d like. Repeat both phrases.",
    },
    input: model(
      "A café menu and order",
      "menu",
      "MENU\nTea — £2\nCoffee — £3\nSandwich — £5\nWater — £1\n\nCustomer: I’d like a tea and a sandwich, please.\nServer: Anything else?\nCustomer: No, thank you.",
      [
        [
          "What drink does the customer order?",
          ["Coffee", "Tea", "Water"],
          1,
          "The customer orders a tea.",
        ],
        [
          "What food does the customer order?",
          ["A sandwich", "Rice", "Eggs"],
          0,
          "The customer orders a sandwich.",
        ],
        [
          "How much is the tea?",
          ["£1", "£2", "£3"],
          1,
          "The menu says Tea — £2.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say that you like coffee.", "I like coffee.", 13],
      ["Ask if your teacher likes bread.", "Do you like bread?", 13],
      ["Say the number 5.", "Five.", 2],
    ),
    practice: [
      choice("order-phrases", "Choose the café phrase", [
        [
          "You want to order now.",
          ["I’d like a coffee, please.", "I coffee.", "I’m coffee."],
          0,
          "Use I’d like before the food or drink you want.",
        ],
        [
          "The server asks Anything else? You need nothing more.",
          ["Yes, I’m Ben.", "No, thank you.", "I’m from Poland."],
          1,
          "Say No, thank you for a polite refusal.",
        ],
        [
          "You want the menu.",
          ["The menu, please.", "Menu is my name.", "I menu."],
          0,
          "This is a short, polite request.",
        ],
        [
          "Choose a polite order.",
          ["Give coffee!", "Can I have a tea, please?", "I tea now."],
          1,
          "Can I have… please? is a polite way to order.",
        ],
      ]),
      order("cafe-order", "Build an order", [
        [
          "I would like a sandwich, please.",
          "I would like is the full form of I’d like.",
        ],
        ["Can I have a coffee?", "Start this question with Can I have."],
        ["No, thank you.", "Use thank you to finish a short reply politely."],
      ]),
    ],
    speaking: {
      situation:
        "Your teacher works in a café. Use the menu to order. You have £8.",
      steps: [
        "Ask for the menu.",
        "Choose food and a drink for £8 or less.",
        "Answer Anything else?",
        "In the next round, one item is not available. Choose something else.",
      ],
      support: [
        "The menu, please.",
        "I’d like…",
        "Can I have…?",
        "That’s all, thank you.",
      ],
      success: [
        "My order is clear.",
        "I use please and thank you.",
        "I choose something from the menu.",
      ],
      model:
        "A: Can I have a coffee and a sandwich, please?\nB: Anything else?\nA: No, thank you.",
      teacherNote:
        "After the first attempt, give one language correction. Repeat with a new order. Help the learner choose lower-priced menu items if needed.",
    },
    writing: {
      instruction: "Write a short order to give to a café worker.",
      model:
        "Hello. I’d like a tea and a sandwich, please. That’s all, thank you.",
      checklist: [
        "I use an ordering phrase for what I want now.",
        "I name the food or drink.",
        "My request is polite.",
      ],
    },
    exit: [
      "I can ask for a menu.",
      "I can order food and a drink.",
      "I can answer Anything else?",
    ],
    homework: {
      instruction: "Make a menu with four familiar items. Write two orders.",
      steps: [
        "Give the items simple prices up to 10.",
        "Write two different orders.",
        "The next day, say both orders without reading.",
      ],
      model: "Tea £2; coffee £3. Can I have a tea, please?",
    },
    teacherNotes: [
      "Teach ordering phrases as complete chunks. A detailed explanation of would is not needed.",
      "Read the provided script for listening practice. A recorded audio file is not supplied.",
    ],
  }),
  makeLesson({
    n: 15,
    title: "How much is it?",
    subtitle: "Ask about prices and choose what to buy",
    topic: "Shopping",
    skills: ["listening", "speaking"],
    languageFocus: ["grammar", "vocabulary", "pronunciation", "spelling_punctuation"],
    goal: "I can ask about prices and understand simple whole-number prices up to one hundred.",
    vocabulary: vocab(
      [
        "price",
        "the amount of money you pay for something",
        "What is the price?",
      ],
      ["pounds", "British money; £", "It is ten pounds."],
      ["cheap", "not costing much money", "This bag is cheap."],
      ["expensive", "costing a lot of money", "This phone is expensive."],
      ["thirty", "30", "It is thirty pounds."],
      ["fifty", "50", "The price is fifty pounds."],
    ),
    language: {
      focus: "How much is/are…?; numbers 20–100",
      explanation:
        "For one thing, ask How much is the bag? For more than one, ask How much are the pens? Numbers: twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred. Join other numbers with a hyphen: twenty-one, thirty-five.",
      examples: [
        "How much is this bag?",
        "It is twenty pounds.",
        "How much are these pens?",
      ],
      pitfall:
        "Write forty without u. Write fifty with fif-. Listen for the difference between thirteen and thirty.",
      pronunciation:
        "Compare thir-TEEN and THIR-ty with your teacher. First listen to a slow price. Then repeat it in a full sentence.",
    },
    input: model(
      "Three price labels",
      "notice",
      "SHOP\nBlue bag — £20\nBlack bag — £35\nWhite phone — £90\nThree pens — £10\n\nCustomer: How much is the blue bag?\nSeller: Twenty pounds.",
      [
        [
          "How much is the blue bag?",
          ["£35", "£20", "£90"],
          1,
          "Blue bag — £20.",
        ],
        [
          "Which bag is more expensive?",
          ["The black bag", "The blue bag", "They have the same price"],
          0,
          "£35 is more than £20. The prices show the comparison; you do not need to memorise more expensive yet.",
        ],
        [
          "How much are three pens?",
          ["£3", "£30", "£10"],
          2,
          "Three pens — £10.",
        ],
      ],
    ),
    retrieval: recall(
      ["Order a tea.", "I’d like a tea, please.", 14],
      ["Say that you do not want anything else.", "No, thank you.", 14],
      ["Describe a blue bag.", "It is a blue bag.", 7],
    ),
    practice: [
      gaps("price-spelling", "Write the prices in words", [
        ["30 = ___", "thirty", "Thirty: t-h-i-r-t-y."],
        ["40 = ___", "forty", "Write forty without u."],
        ["50 = ___", "fifty", "Fifty starts with fif-."],
        [
          "100 = ___",
          ["one hundred", "a hundred"],
          "100 — one hundred / a hundred.",
        ],
      ]),
      choice("price-questions", "Ask the price", [
        [
          "One bag:",
          [
            "How much is the bag?",
            "How much are the bag?",
            "How old is the bag?",
          ],
          0,
          "One bag needs is.",
        ],
        [
          "Three pens:",
          [
            "How much is these pens?",
            "How much are these pens?",
            "What name are the pens?",
          ],
          1,
          "Use are with a plural.",
        ],
        [
          "35 is…",
          ["thirteen-five", "thirty-five", "fifty-three"],
          1,
          "35 = thirty-five.",
        ],
      ]),
    ],
    speaking: {
      situation: "You have £40. Choose a bag and keep enough money for pens.",
      steps: [
        "Ask the prices of two bags and three pens.",
        "Choose items you can buy with your money.",
        "Repeat the total price in words.",
        "Ask your teacher to repeat one price so you can check it.",
      ],
      support: [
        "How much is…?",
        "How much are…?",
        "Twenty pounds.",
        "Again, please.",
      ],
      success: [
        "I can ask about prices.",
        "I can hear and say different tens.",
        "I can choose items within my budget.",
      ],
      model:
        "The blue bag is twenty pounds. The pens are ten pounds. Thirty pounds. The blue bag, please.",
      teacherNote:
        "Assess clear communication of prices. Allow written digits and calculations on paper when needed.",
    },
    writing: {
      instruction:
        "Make three price labels with digits and words. Write a question about one price.",
      model:
        "Bag: £20 — twenty pounds.\nPhone: £90 — ninety pounds.\nPens: £10 — ten pounds.\nHow much is the bag?",
      checklist: [
        "The written number matches the digits.",
        "I spell forty and fifty correctly when I use them.",
        "I choose is or are correctly in my question.",
      ],
    },
    exit: [
      "I can ask about prices.",
      "I can understand familiar tens up to 100.",
      "I can repeat a price to check it.",
    ],
    homework: {
      instruction: "Make five price labels for a shop at home.",
      steps: [
        "Use three numbers such as 20 or 40 and two numbers such as 21 or 35.",
        "Hide the words. Read the digits aloud.",
        "Practise thirteen and thirty with your teacher.",
      ],
      model: "£40 — forty pounds; £25 — twenty-five pounds.",
    },
    teacherNotes: [
      "Avoid complex prices with decimal amounts; they are not needed for this goal.",
      "Change the order of the price labels during listening so the learner has to listen for the price.",
    ],
  }),
];

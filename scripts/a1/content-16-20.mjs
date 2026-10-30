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
    n: 16,
    title: "Places in my town",
    subtitle: "Talk about places nearby",
    topic: "Town",
    skills: ["speaking", "writing"],
    languageFocus: ["grammar", "vocabulary"],
    goal: "I can name common places and say what there is near my home.",
    vocabulary: vocab(
      [
        "supermarket",
        "a large shop selling food and other things",
        "There is a supermarket.",
      ],
      [
        "bank",
        "a place where people keep and get money",
        "The bank is near the café.",
      ],
      ["park", "an outdoor place with grass and trees", "There is a park."],
      ["station", "a place where trains or buses stop", "The station is big."],
      ["pharmacy", "a shop where people get medicine", "There is a pharmacy."],
      ["near", "not far from a place or thing", "The park is near my home."],
    ),
    language: {
      focus: "There is / isn’t; Is there…?; near",
      explanation:
        "Ask Is there a…? to find out about a place. Answer Yes, there is or No, there isn’t. Near my home means not far from the place where I live.",
      examples: [
        "Is there a park?",
        "Yes, there is.",
        "There isn’t a bank near my home.",
      ],
      pitfall:
        "In a question, put is before there: Is there a café? Use there in the short answer, not it.",
      pronunciation:
        "In pharmacy, ph sounds like /f/. In station, -tion sounds like /ʃən/. Listen and repeat after your teacher.",
    },
    input: model(
      "A neighbourhood guide",
      "notice",
      "WELCOME TO GREEN STREET\nThere is a supermarket near the station. There is a café next to the park. There is a pharmacy behind the bank. There isn’t a school on Green Street.",
      [
        [
          "What is near the station?",
          ["A supermarket", "A school", "A park"],
          0,
          "The supermarket is near the station.",
        ],
        [
          "Where is the pharmacy?",
          ["Next to the park", "Behind the bank", "In the café"],
          1,
          "The pharmacy is behind the bank.",
        ],
        [
          "Is there a school on Green Street?",
          ["Yes, there is", "No, there isn’t", "There are two"],
          1,
          "There isn’t a school.",
        ],
      ],
    ),
    retrieval: recall(
      ["Ask the price of a bag.", "How much is the bag?", 15],
      ["Say that there is a kitchen.", "There is a kitchen.", 8],
      [
        "Say a two-word phrase meaning very near, at the side of something.",
        "Next to.",
        9,
      ],
    ),
    practice: [
      gaps("town-questions", "Complete the town guide", [
        ["___ there a park?", "Is", "Put is before there in this question."],
        ["Yes, there ___.", "is", "The short answer is Yes, there is."],
        [
          "There ___ a bank. (negative)",
          ["isn’t", "isn't"],
          "Use there isn’t for a negative.",
        ],
        [
          "The café is ___ my home. (not far from)",
          "near",
          "Near means not far from.",
        ],
      ]),
      match("town-places", "Choose the place", [
        ["You buy food here.", "supermarket", "You buy food in a supermarket."],
        [
          "You wait for a train here.",
          "station",
          "You wait for a train at a station.",
        ],
        [
          "You can walk among trees here.",
          "park",
          "A park is an outdoor place with grass and trees.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Your teacher chooses a place to visit in your made-up neighbourhood.",
      steps: [
        "Name three places in the neighbourhood.",
        "Answer two Is there…? questions.",
        "Say where one place is.",
        "Ask what your teacher wants: a café, park or shop.",
      ],
      support: ["There is a…", "There isn’t a…", "Is there a…?", "It is near…"],
      success: [
        "I can name three places.",
        "I can answer an Is there…? question.",
        "I can say where a place is.",
      ],
      model:
        "There is a park near my home. There is a café next to the park. There isn’t a station.",
      teacherNote:
        "Let the learner choose a fictional neighbourhood without sharing an exact home address.",
    },
    writing: {
      instruction:
        "Write a short street guide. Describe three places that are there and one that is not.",
      model:
        "There is a bank. There is a park near the bank. There is a café. There isn’t a station.",
      checklist: [
        "I use there is.",
        "I include one negative sentence.",
        "I use near or next to to describe one place.",
      ],
    },
    exit: [
      "I can name places in a town.",
      "I can ask if a place is nearby.",
      "I can give simple information to help someone find a place.",
    ],
    homework: {
      instruction:
        "Draw a street with five places. Write three questions about it.",
      steps: [
        "Label the places in English.",
        "Write questions with Is there…?",
        "In the next lesson, help your teacher complete a blank plan by answering questions.",
      ],
      model: "Is there a park near the station? Yes, there is.",
    },
    teacherNotes: [
      "Review place words from lesson 9.",
      "For new vocabulary, check meaning before spelling.",
    ],
  }),
  makeLesson({
    n: 17,
    title: "Turn left at the café",
    subtitle: "Ask for and follow simple directions",
    topic: "Directions",
    skills: ["listening", "speaking", "writing"],
    languageFocus: ["grammar", "vocabulary"],
    goal: "I can ask where a place is and follow a few simple directions with help.",
    vocabulary: vocab(
      ["turn left", "change direction to the left", "Turn left at the café."],
      [
        "turn right",
        "change direction to the right",
        "Turn right at the bank.",
      ],
      ["go straight", "continue ahead without turning", "Go straight."],
      ["stop", "do not move any further", "Stop at the station."],
      [
        "opposite",
        "on the other side, facing something",
        "The park is opposite the bank.",
      ],
      [
        "Excuse me",
        "a polite way to get someone’s attention",
        "Excuse me. Where is the station?",
      ],
    ),
    language: {
      focus: "imperatives; Where is…?; at + landmark",
      explanation:
        "Start a short instruction with a verb: Go straight. Turn left. Use at for the place to turn: at the bank or café. Start a question to a new person with Excuse me.",
      examples: [
        "Excuse me. Where is the park?",
        "Go straight. Turn right at the bank.",
        "The station is on your left.",
      ],
      pitfall:
        "You do not need you are in an instruction: You are turn left → Turn left.",
      pronunciation:
        "Listen for the difference between left and right. Your teacher gives one step at a time. Show the direction with your hand.",
    },
    input: model(
      "A short route",
      "dialogue",
      "Visitor: Excuse me. Where is the station?\nLocal: Go straight. Turn left at the café. The station is opposite the park.\nVisitor: Left at the café?\nLocal: Yes.\nVisitor: Thank you.",
      [
        [
          "What is the visitor looking for?",
          ["The bank", "The café", "The station"],
          2,
          "The question is Where is the station?",
        ],
        [
          "Where does the visitor turn left?",
          ["At the café", "At the bank", "At the pharmacy"],
          0,
          "Turn left at the café.",
        ],
        [
          "What is opposite the station?",
          ["The supermarket", "The park", "The school"],
          1,
          "The station is opposite the park.",
        ],
      ],
    ),
    retrieval: recall(
      ["Ask if there is a park nearby.", "Is there a park?", 16],
      ["Name the place where people get medicine.", "A pharmacy.", 16],
      ["Say that something is at the back of the bank.", "Behind the bank.", 9],
    ),
    practice: [
      match("directions", "Match the direction", [
        ["to the left side", "left", "Left is this direction: ←."],
        ["to the right side", "right", "Right is this direction: →."],
        [
          "ahead without turning",
          "straight",
          "Straight means ahead without turning.",
        ],
      ]),
      gaps("route", "Complete the route", [
        ["___ straight.", "Go", "Start the instruction with Go."],
        ["Turn left ___ the café.", "at", "Use at to name the place to turn."],
        [
          "___ me. Where is the park?",
          "Excuse",
          "Use Excuse me to get attention politely.",
        ],
        [
          "The bank is ___ the park. (on the other side, facing it)",
          "opposite",
          "Opposite means on the other side, facing something.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "You and your teacher have different versions of a simple street plan.",
      steps: [
        "Draw a crossroads and three places on paper.",
        "Ask your teacher how to get to one place.",
        "Repeat one step to check it.",
        "Change roles. Give directions with two steps.",
      ],
      support: [
        "Excuse me. Where is…?",
        "Go straight.",
        "Turn left/right at…",
        "Left at the café?",
      ],
      success: [
        "My question is clear.",
        "My directions have two steps.",
        "I can check a turn I do not understand.",
      ],
      model: "Go straight. Turn right at the bank. The café is on your left.",
      teacherNote:
        "Directions should match the drawn plan. Review open answers against that plan instead of one fixed text key.",
    },
    writing: {
      instruction:
        "Write three short instructions to show a route on your plan.",
      model: "Go straight. Turn left at the bank. Stop at the café.",
      checklist: [
        "I start instructions with a verb.",
        "Left and right match the plan.",
        "I name the place to turn.",
      ],
    },
    exit: [
      "I can tell left from right.",
      "I can ask for directions.",
      "I can repeat a step to check it.",
    ],
    homework: {
      instruction: "Prepare directions to two places on a made-up map.",
      steps: [
        "Draw a map with one crossroads.",
        "Write two routes.",
        "Tomorrow, look only at the map. Try to say the directions without reading.",
      ],
      model: "Turn right at the park. Go straight. The bank is on your left.",
    },
    teacherNotes: [
      "For A1, use two or three steps, slow speech and as many repetitions as needed.",
      "Keep this practice on the fictional map provided for the lesson.",
    ],
  }),
  makeLesson({
    n: 18,
    title: "What can you do?",
    subtitle: "Talk about skills and ask for help",
    topic: "Abilities",
    skills: ["listening", "speaking", "writing"],
    languageFocus: ["grammar", "vocabulary"],
    goal: "I can say what I can do and ask for simple help.",
    vocabulary: vocab(
      ["swim", "move your body through water", "I can swim."],
      ["cook", "make food ready to eat", "Can you cook?"],
      ["drive", "control a car on the road", "She can drive."],
      ["dance", "move your body to music", "I can’t dance."],
      [
        "help",
        "do something to make a task easier for someone",
        "Can you help me?",
      ],
      ["use a computer", "work with a computer", "He can use a computer."],
    ),
    language: {
      focus: "can / can’t + verb; Can you…?",
      explanation:
        "Can stays the same with he and she. Put a verb without to after it: She can swim. Ask Can you cook? Use Can you help me? to ask for help.",
      examples: ["I can cook.", "She can’t drive.", "Can you help me?"],
      pitfall: "Say She can swim, not She cans swim or She can to swim.",
      pronunciation:
        "In a positive sentence, can is often weak: /kən/. Make the negative in can’t clear. Follow your teacher’s British or American model.",
    },
    input: model(
      "A small team",
      "text",
      "Eva can cook, but she can’t drive. Ben can drive and use a computer. He can’t swim. Mia can swim and dance. Today Eva asks Ben, “Can you help me with the computer?”",
      [
        ["Who can drive?", ["Eva", "Ben", "Mia"], 1, "Ben can drive."],
        ["Who can swim?", ["Mia", "Eva", "Ben"], 0, "Mia can swim; Ben can’t."],
        [
          "What help does Eva need?",
          ["Cooking", "Swimming", "Computer help"],
          2,
          "She asks for help with the computer.",
        ],
      ],
    ),
    retrieval: recall(
      ["Give an instruction to turn left.", "Turn left.", 17],
      ["Get a person’s attention politely.", "Excuse me.", 17],
      ["Ask a question about a habit.", "Do you study every day?", 12],
    ),
    practice: [
      gaps("can-forms", "Complete the abilities", [
        [
          "She ___ swim. (she has this ability)",
          "can",
          "Can is the same for I, you, he, she, we and they.",
        ],
        [
          "He can ___ a car. (he is a driver)",
          "drive",
          "Use the basic verb after can.",
        ],
        ["___ you cook?", "Can", "Put Can before you in a question."],
        [
          "I ___ dance. (negative)",
          ["can’t", "can't"],
          "Use can’t for a negative.",
        ],
      ]),
      choice("can-help", "Choose the correct phrase", [
        [
          "A correct sentence:",
          ["She cans cook.", "She can to cook.", "She can cook."],
          2,
          "Do not add -s to can or put to before the next verb.",
        ],
        [
          "You need help.",
          ["Can you help me, please?", "I am help me.", "Help is you?"],
          0,
          "Can you help me, please? is a polite request.",
        ],
        [
          "Can Ben drive? Positive answer:",
          ["Yes, he does.", "Yes, he can.", "Yes, he is."],
          1,
          "Use can again in the short answer.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Plan a small event. You need people who can cook, drive and use a computer.",
      steps: [
        "Ask your teacher about three things their character can do.",
        "Say two things you or a made-up person can do.",
        "Choose who will do two jobs.",
        "Ask for help with one job.",
      ],
      support: ["Can you…?", "Yes, I can.", "No, I can’t.", "Can you help me?"],
      success: [
        "I can ask questions with can.",
        "I can say what someone can and cannot do.",
        "I can agree on some help.",
      ],
      model:
        "A: Can you cook?\nB: Yes, I can. Can you drive?\nA: No, I can’t. Can you help me?\nB: Yes.",
      teacherNote:
        "Change the character information before the second attempt so the learner needs to communicate a new message.",
    },
    writing: {
      instruction:
        "Write four sentences about a character’s abilities. Add a request for help.",
      model:
        "Mia can swim. She can cook. She can’t drive. She can use a computer. Can you help her?",
      checklist: [
        "I use can without -s.",
        "I use the next verb without to.",
        "I use can’t for a negative.",
      ],
    },
    exit: [
      "I can name three abilities.",
      "I can ask about an ability.",
      "I can ask for help.",
    ],
    homework: {
      instruction: "Make two character cards with different abilities.",
      steps: [
        "For each person, write two sentences with can and one with can’t.",
        "Choose one job for the two people.",
        "Tomorrow, choose the right person for the job. Give a short reason.",
      ],
      model: "Tom can cook. Eva can drive. Tom can’t drive.",
    },
    teacherNotes: [
      "Do not infer a person’s abilities from their accent or speed of response.",
      "The goal is to communicate can and can’t clearly in context.",
    ],
  }),
  makeLesson({
    n: 19,
    title: "People and their things",
    subtitle: "Describe people and their belongings",
    topic: "People and appearance",
    skills: ["reading", "listening", "speaking", "writing"],
    languageFocus: ["grammar", "vocabulary"],
    goal: "I can describe a person with a few simple details and say what they have.",
    vocabulary: vocab(
      ["tall", "having more height than most people", "Ben is tall."],
      ["short", "not tall; not long", "She has short hair."],
      ["long hair", "hair that goes down a long way", "Eva has long hair."],
      [
        "glasses",
        "two lenses worn in front of your eyes to help you see",
        "He has glasses.",
      ],
      ["brown", "the colour of chocolate", "She has brown hair."],
      [
        "has got",
        "use this to say someone has something",
        "Mia has got a blue bag.",
      ],
    ),
    language: {
      focus: "have got / has got; be + adjective",
      explanation:
        "Use I/you have got and he/she has got to talk about something a person has. Use be for a description: He is tall. Do not add -s to hair here: long hair. She has long hair is also correct.",
      examples: [
        "I have got glasses.",
        "She has got brown hair.",
        "He is tall.",
      ],
      pitfall:
        "Say She has got long hair, not She is long hair. Use is for a description such as tall and has got for something a person has.",
      pronunciation:
        "Glasses has two syllables. Copy your teacher’s vowel sounds in brown and short. Do not add a vowel after the final consonant.",
    },
    input: model(
      "Find the new classmate",
      "text",
      "Ben is tall. He has got short brown hair and glasses. His bag is black. Eva has got long brown hair. Her bag is blue. Mia has got short hair and a red bag. She hasn’t got glasses.",
      [
        [
          "Who has got glasses?",
          ["Mia", "Ben", "Eva"],
          1,
          "Ben has got glasses.",
        ],
        [
          "Whose bag is blue?",
          ["Eva’s", "Ben’s", "Mia’s"],
          0,
          "Her bag is blue tells us about Eva’s bag.",
        ],
        [
          "Who has got a red bag?",
          ["Ben", "Eva", "Mia"],
          2,
          "Mia has a red bag.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say that she can swim.", "She can swim.", 18],
      ["Describe a blue bag.", "It is a blue bag.", 7],
      [
        "Say the word that goes before name when you talk about a woman: ___ name.",
        "Her.",
        5,
      ],
    ),
    practice: [
      gaps("have-got", "Complete the descriptions", [
        ["I ___ got glasses.", "have", "Use have got with I."],
        ["She ___ got long hair.", "has", "Use has got with she."],
        ["He ___ tall.", "is", "Tall describes a person. Use is before it."],
        [
          "She has got brown ___.",
          "hair",
          "Do not add -s to hair in this meaning.",
        ],
      ]),
      match("identify-people", "Who is it?", [
        [
          "This person is tall and has got glasses.",
          "Ben",
          "Ben is tall. He has got short brown hair and glasses.",
        ],
        [
          "This person has got long brown hair and a blue bag.",
          "Eva",
          "Eva has got long brown hair. Her bag is blue.",
        ],
        [
          "This person has got short hair and a red bag, but no glasses.",
          "Mia",
          "Mia has got short hair and a red bag. She hasn’t got glasses.",
        ],
      ], "Read about Ben, Eva and Mia again. Match each description to a name."),
    ],
    speaking: {
      situation:
        "Help your teacher find your made-up person from three descriptions.",
      steps: [
        "Choose Ben, Eva or Mia from the text.",
        "Give two clues without saying the name.",
        "Your teacher asks about one detail.",
        "Change roles and choose a different person.",
      ],
      support: ["He is…", "She has got…", "His/Her bag is…"],
      success: [
        "I can describe at least two details.",
        "I can choose between is and has got.",
        "The listener can identify the person.",
      ],
      model: "She has got long brown hair. Her bag is blue. → Eva.",
      teacherNote:
        "Use neutral descriptions of fictional people. Personal judgements about appearance are not needed.",
    },
    writing: {
      instruction:
        "Describe a made-up person. Include hair, glasses, one object and a colour.",
      model:
        "This is Ben. He is tall. He has got short hair and glasses. His bag is black.",
      checklist: [
        "I use is before a description such as tall.",
        "I use has got before something the person has.",
        "I do not add -s to hair.",
      ],
    },
    exit: [
      "I can describe a person with neutral words.",
      "I can choose between be and have got.",
      "I can identify a character from a description.",
    ],
    homework: {
      instruction: "Make two Guess the person cards.",
      steps: [
        "Give three details on each card.",
        "Keep the name hidden until the other person answers.",
        "Review colours from lesson 7 and my/his/her from lesson 5.",
      ],
      model: "He has got glasses. His bag is green. He has got short hair.",
    },
    teacherNotes: [
      "The full have got question system can come later. Focus on descriptions here.",
      "Accept standard have/has without got in open speaking tasks.",
    ],
  }),
  makeLesson({
    n: 20,
    title: "What are you doing now?",
    subtitle: "Say what is happening now",
    topic: "Right now",
    skills: ["speaking", "writing"],
    languageFocus: ["grammar", "vocabulary"],
    goal: "I can describe what people are doing now.",
    vocabulary: vocab(
      [
        "reading",
        "looking at words and understanding them now",
        "She is reading.",
      ],
      ["writing", "putting words on paper or a screen", "I am writing."],
      ["cooking", "making food ready to eat now", "He is cooking."],
      ["working", "doing a job or a task now", "They are working."],
      ["talking", "speaking with someone", "We are talking."],
      ["now", "at this moment", "I am studying now."],
    ),
    language: {
      focus: "am/is/are + verb-ing",
      explanation:
        "For an action happening now, use be + -ing: I am reading, she is reading, they are reading. For writing, remove the final e from write. Ask What are you doing?",
      examples: [
        "I am studying now.",
        "She is cooking.",
        "What are you doing?",
      ],
      pitfall:
        "Remember both parts: I reading → I am reading. She is cook → She is cooking. For a regular habit, say I cook every day.",
      pronunciation:
        "The ending -ing usually ends with /ŋ/. Do not add a separate strong /g/. Copy your teacher: reading, writing, working.",
    },
    input: model(
      "A message from home",
      "message",
      "Hi, Eva! I’m at home. I’m studying English now. Ben is cooking in the kitchen. Mia is reading in the living room. We are not watching TV. What are you doing?\nTom",
      [
        [
          "Who is studying English?",
          ["Tom", "Ben", "Mia"],
          0,
          "Tom signs the message and says I’m studying.",
        ],
        [
          "What is Ben doing?",
          ["Reading", "Cooking", "Watching TV"],
          1,
          "Ben is cooking.",
        ],
        [
          "Are they watching TV?",
          ["Yes", "No", "Only Mia"],
          1,
          "We are not watching TV.",
        ],
      ],
    ),
    retrieval: recall(
      ["Describe a usual morning.", "I get up at seven.", 10],
      ["Say where the kitchen is.", "It is next to the living room.", 9],
      ["Say that she can cook.", "She can cook.", 18],
    ),
    practice: [
      gaps("doing-now", "Complete the action", [
        ["I ___ reading now.", "am", "Use am with I."],
        ["She ___ cooking.", "is", "Use is with she."],
        ["They ___ working.", "are", "Use are with they."],
        [
          "He is ___. (write)",
          "writing",
          "Remove the final e: write → writing.",
        ],
      ]),
      choice("now-or-usually", "Choose the sentence", [
        [
          "Right now:",
          ["I am reading.", "I read every day.", "I can read."],
          0,
          "Am reading describes an action happening now.",
        ],
        [
          "A daily habit:",
          [
            "She is working now.",
            "She works every day.",
            "She working every day.",
          ],
          1,
          "Works every day describes a habit.",
        ],
        [
          "A question about now:",
          ["What are you doing?", "What you doing?", "What do you doing?"],
          0,
          "What + are + you + doing?",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Your teacher acts out activities. Say what is happening. Then change roles.",
      steps: [
        "Describe three things your teacher does on camera or in an imagined scene.",
        "Say what you are doing now.",
        "Ask What are you doing?",
        "After feedback, try again with a new action.",
      ],
      support: ["You are…", "I am…", "He/She is…", "What are you doing?"],
      success: [
        "I remember a form of be.",
        "I use -ing.",
        "I describe an action happening now.",
      ],
      model: "You are writing. I am reading. She is cooking.",
      teacherNote:
        "If a camera is unavailable, give a scene card such as Ben / kitchen / cook. Ask the learner to turn it into a message.",
    },
    writing: {
      instruction: "Write a message about what three people are doing now.",
      model:
        "Hi! I am studying. Ben is cooking. Mia is reading. We are at home.",
      checklist: [
        "I include am, is or are in each verb form.",
        "I add -ing to the action verb.",
        "I use the right form for now and for regular habits.",
      ],
    },
    exit: [
      "I can say what I am doing now.",
      "I can ask what someone is doing.",
      "I can tell the difference between every day and now.",
    ],
    homework: {
      instruction:
        "Write three short notes about made-up actions at different times of day.",
      steps: [
        "Start each note with Now.",
        "Add an action by another person.",
        "The next day, compare one note with a sentence about a regular habit.",
      ],
      model: "Now I am reading. I read in the evening every day.",
    },
    teacherNotes: [
      "Keep this first present continuous lesson small. Practise questions and negatives only in short, familiar forms.",
      "Understanding the difference between now and every day matters more than speaking quickly.",
    ],
  }),
];

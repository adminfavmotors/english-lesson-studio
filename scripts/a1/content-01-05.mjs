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
    n: 1,
    title: "Hello! Nice to meet you",
    subtitle: "Start a conversation and introduce yourself",
    topic: "Introductions",
    skills: ["speaking", "writing"],
    languageFocus: ["grammar", "vocabulary"],
    goal: "I can say hello, give my name and ask someone’s name.",
    vocabulary: vocab(
      ["Hello", "a word to greet someone", "Hello, I’m Mia."],
      ["Hi", "a short, friendly greeting", "Hi, Ben!"],
      [
        "Good morning",
        "a greeting at the start of the day",
        "Good morning, Alex.",
      ],
      ["I’m…", "use this to give your name", "I’m Leo."],
      [
        "What’s your name?",
        "ask someone to tell you their name",
        "Hello. What’s your name?",
      ],
      [
        "Nice to meet you",
        "say this when you meet someone for the first time",
        "Nice to meet you, Sara.",
      ],
    ),
    language: {
      focus: "I am / I’m; What’s your name?",
      explanation:
        "Say I am or I’m before your name: I’m Mia. Ask What’s your name? Listen to the model. Then use your own name.",
      examples: ["I am Mia.", "I’m Ben.", "What’s your name?"],
      pitfall: "Remember am: I Mia → I am Mia. I am and I’m are both correct.",
      pronunciation:
        "Listen and repeat: hel-LO. The second part is stronger. Say I’m as one short sound. Practise slowly, then say the whole phrase.",
    },
    input: model(
      "Two new classmates",
      "dialogue",
      "Mia: Hello. I’m Mia. What’s your name?\nBen: Hi, Mia. I’m Ben.\nMia: Nice to meet you, Ben.\nBen: Nice to meet you too.",
      [
        [
          "Who speaks first?",
          ["Mia", "Ben", "Alex"],
          0,
          "Mia says the first line.",
        ],
        [
          "What is the second person’s name?",
          ["Leo", "Ben", "Sara"],
          1,
          "The second person says I’m Ben.",
        ],
        [
          "What do they say after giving their names?",
          ["Good night", "Nice to meet you", "Thank you for the coffee"],
          1,
          "They say Nice to meet you.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say a greeting you know.", "Hello."],
      ["Try to say your name in English.", "I’m Alex."],
      [
        "What can you say after you tell someone your name?",
        "Nice to meet you.",
      ],
    ),
    practice: [
      gaps("be", "Complete the introductions", [
        ["I ___ Mia.", "am", "Use am after I."],
        ["Hello. I ___ Ben.", "am", "Use I am before a name."],
        ["What’s your ___?", "name", "Use name to ask what someone is called."],
        [
          "Nice to ___ you.",
          "meet",
          "The complete phrase is Nice to meet you.",
        ],
      ]),
      match("replies", "Choose a natural reply", [
        ["Hello. I’m Sara.", "Hi, I’m Leo.", "Say hello and give your name."],
        ["What’s your name?", "I’m Alex.", "The person asks for your name."],
        [
          "Nice to meet you.",
          "Nice to meet you too.",
          "Too means also: it is nice for both people.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "You meet someone in an online lesson. Your teacher is the other person.",
      steps: [
        "Say hello and give your name.",
        "Ask the other person’s name.",
        "Say the name again. Use a friendly phrase to finish.",
        "Change roles. Try again without reading the model.",
      ],
      support: ["Hello. I’m…", "What’s your name?", "Nice to meet you."],
      success: [
        "I can say my name.",
        "I can ask the other person’s name.",
        "I can reply to a greeting.",
      ],
      model:
        "A: Hi. I’m Anna. What’s your name?\nB: I’m Sam.\nA: Nice to meet you, Sam.\nB: Nice to meet you too.",
      teacherNote:
        "Give one phrase as support first. In the second round, hide the text and use a different character name. Correct errors that make the introduction unclear.",
    },
    writing: {
      instruction:
        "Write a short message to a new person. Say hello, give your name and ask for their name.",
      model: "Hello! I’m Anna. What’s your name?",
      checklist: [
        "I start with a greeting.",
        "I use am or ’m after I.",
        "I put a question mark at the end of my question.",
      ],
    },
    exit: [
      "I can say hello without help.",
      "I can give my name and ask for a name.",
      "I can reply Nice to meet you too.",
    ],
    homework: {
      instruction:
        "Make two short introductions: one with Hi and one with Good morning.",
      steps: [
        "Write three lines for each introduction.",
        "Close your notes. Say both introductions.",
        "The next day, try to remember three phrases without looking.",
      ],
      model:
        "Good morning. I’m Kate. What’s your name?\nHi! I’m Kate. Nice to meet you.",
    },
    teacherNotes: [
      "For a complete beginner, use the opening recall as a gentle starting check. Give prompts when needed.",
      "A made-up name is welcome; do not require real personal details.",
      "At the end, repeat the introduction with a new name to check that the learner can use the phrases in a new situation.",
    ],
  }),
  makeLesson({
    n: 2,
    title: "Names, letters and numbers",
    subtitle: "Spell names and say numbers",
    topic: "Personal information",
    skills: ["listening", "speaking"],
    languageFocus: ["vocabulary", "pronunciation", "spelling_punctuation"],
    goal: "I can spell a short name and understand numbers from zero to twenty.",
    vocabulary: vocab(
      ["spell", "say the letters of a word", "Can you spell Sam?"],
      ["letter", "a sign such as A, B or C", "A is a letter."],
      ["number", "a word or sign such as 1, 2 or 3", "My number is ten."],
      ["zero", "0", "Zero, one, two."],
      ["ten", "10", "The number is ten."],
      ["twenty", "20", "Twenty students."],
    ),
    language: {
      focus: "How do you spell…?; numbers 0–20",
      explanation:
        "Ask How do you spell your name? Listen to your teacher say the letters A–Z in small groups. Numbers: zero, one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty.",
      examples: [
        "How do you spell your name?",
        "Sam: S–A–M.",
        "The number is twelve.",
      ],
      pitfall:
        "Check the letters: f-i-f-t-e-e-n. There is only one t in eighteen. Listen first, then write.",
      pronunciation:
        "Listen to the different letter names: A /eɪ/, E /iː/, I /aɪ/. Repeat after your teacher. In thirteen–nineteen, the ending -TEEN is often strong.",
    },
    input: model(
      "At a language school",
      "dialogue",
      "Teacher: What’s your name?\nStudent: Sam.\nTeacher: How do you spell Sam?\nStudent: S–A–M.\nTeacher: Thank you. Your class number is twelve.\nStudent: Twelve. Thank you.",
      [
        [
          "What is the student’s name?",
          ["Tom", "Sam", "Tim"],
          1,
          "The student says Sam.",
        ],
        [
          "How many letters are in Sam?",
          ["Two", "Three", "Four"],
          1,
          "S, A and M are three letters.",
        ],
        [
          "What is the class number?",
          ["Ten", "Twenty", "Twelve"],
          2,
          "The teacher says twelve: 12.",
        ],
      ],
    ),
    retrieval: recall(
      ["Give your name.", "I’m Anna.", 1],
      ["Ask for your teacher’s name.", "What’s your name?", 1],
      [
        "Say a friendly phrase when you meet a new person.",
        "Nice to meet you.",
        1,
      ],
    ),
    practice: [
      gaps("numbers", "Write the number in words", [
        ["7 = ___", "seven", "The word for 7 is seven."],
        ["12 = ___", "twelve", "The word for 12 is twelve."],
        ["15 = ___", "fifteen", "Check the first three letters: fif-."],
        ["20 = ___", "twenty", "The word for 20 is twenty."],
      ]),
      choice("letters", "Check names and letters", [
        [
          "Which spelling is Anna?",
          ["A–N–A", "A–N–N–A", "E–N–N–A"],
          1,
          "Anna has two n letters.",
        ],
        [
          "Which letter sounds /eɪ/?",
          ["A", "E", "I"],
          0,
          "The name of A is /eɪ/.",
        ],
        [
          "What do you ask to check the letters in a name?",
          [
            "How do you spell your name?",
            "What’s your number?",
            "Good morning.",
          ],
          0,
          "Ask How do you spell…? to check the letters.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "You join a class. Your teacher needs to check your name and class number.",
      steps: [
        "Choose a short name. It can be your name or a made-up name.",
        "Say the letters of the name.",
        "Give a number from 0 to 20.",
        "Your teacher repeats one detail with a mistake. Say the correct detail slowly.",
      ],
      support: ["My name is…", "It’s S–A–M.", "No, twelve."],
      success: [
        "The name is written correctly.",
        "The number is correct.",
        "I can repeat the information more slowly.",
      ],
      model:
        "A: My name is Eva.\nB: How do you spell Eva?\nA: E–V–A. My class number is nine.\nB: Five?\nA: No, nine.",
      teacherNote:
        "Dictate one name and number at a time without showing the text. Show the key after the learner writes. Review pronunciation with your own feedback.",
    },
    writing: {
      instruction:
        "Complete a small form: Name, Spelling, Class number. Then write 3, 8 and 14 in words.",
      model:
        "Name: Tom\nSpelling: T–O–M\nClass number: five\nthree, eight, fourteen",
      checklist: [
        "The letters of the name are in the right order.",
        "I write the number as a word.",
        "I try from memory before I check the spelling.",
      ],
    },
    exit: [
      "I can spell a short name aloud.",
      "I can write some numbers from 0 to 20 when I hear them.",
      "I can ask how to spell a name.",
    ],
    homework: {
      instruction: "Make three name cards and five number cards.",
      steps: [
        "Write a name or number on one side. Write its letters or number word on the other side.",
        "Test yourself without looking at the answer.",
        "At the next lesson, ask your teacher to check three difficult letter names.",
      ],
      model: "Eva → E–V–A\n11 → eleven\n18 → eighteen",
    },
    teacherNotes: [
      "Alphabet model: A /eɪ/, B /biː/, C /siː/, D /diː/, E /iː/, F /ef/, G /dʒiː/, H /eɪtʃ/, I /aɪ/, J /dʒeɪ/, K /keɪ/, L /el/, M /em/, N /en/, O /əʊ/, P /piː/, Q /kjuː/, R /ɑː/, S /es/, T /tiː/, U /juː/, V /viː/, W /ˈdʌbəl juː/, X /eks/, Y /waɪ/, Z /zed/.",
      "This is practical spelling work. Learners do not need to memorise IPA. Use your spoken model to teach the letter names.",
    ],
  }),
  makeLesson({
    n: 3,
    title: "Where are you from?",
    subtitle: "Talk about countries and languages",
    topic: "Countries and languages",
    skills: ["listening", "speaking", "writing"],
    languageFocus: ["grammar", "vocabulary"],
    goal: "I can say where I am from and ask someone about their country.",
    vocabulary: vocab(
      ["from", "use this before your home country or town", "I’m from Poland."],
      ["Poland", "a country in Europe", "Ola is from Poland."],
      ["Ukraine", "a country in Europe", "I’m from Ukraine."],
      ["English", "the language used in this course", "I speak English."],
      ["Polish", "the language of Poland", "Ola speaks Polish."],
      ["Ukrainian", "the language of Ukraine", "I speak Ukrainian."],
    ),
    language: {
      focus: "I am, you are, he/she is; from + country",
      explanation:
        "Use I am, you are, he is and she is. Say a country after from. Start language names with a capital letter: English. Learn I speak… as a useful phrase for now.",
      examples: [
        "I’m from Ukraine.",
        "Where are you from?",
        "She is from Poland.",
      ],
      pitfall:
        "Use a country after from and a language after speak: from Poland, speak Polish. Say She is, not She are.",
      pronunciation:
        "In Where are you from?, make WHERE and FROM stronger. In the answer, make the country name clear. Listen and copy your teacher.",
    },
    input: model(
      "New classmates",
      "text",
      "I’m Ola. I’m from Poland. I speak Polish and English. This is Mark. He is from Canada. He speaks English. Our teacher is Nina. She is from Ukraine.",
      [
        [
          "Where is Ola from?",
          ["Canada", "Poland", "Ukraine"],
          1,
          "Ola says I’m from Poland.",
        ],
        [
          "Who is from Canada?",
          ["Nina", "Ola", "Mark"],
          2,
          "This is Mark. He is from Canada.",
        ],
        [
          "Which language does Ola speak?",
          ["Polish", "Italian", "Japanese"],
          0,
          "The text says Polish and English.",
        ],
      ],
    ),
    retrieval: recall(
      ["Ask someone to spell their name.", "How do you spell your name?", 2],
      ["Say the number 12.", "Twelve.", 2],
      ["Say hello and give your name.", "Hello. I’m Anna.", 1],
    ),
    practice: [
      gaps("be-countries", "Complete with am, are or is", [
        ["I ___ from Poland.", "am", "Use am after I."],
        ["You ___ from Ukraine.", "are", "Use are after you."],
        ["She ___ from Canada.", "is", "Use is after she."],
        ["He ___ from Poland.", "is", "Use is after he."],
      ]),
      match("countries-languages", "Match a country and a language", [
        ["Poland", "Polish", "Poland is the country; Polish is the language."],
        [
          "Ukraine",
          "Ukrainian",
          "Ukraine is the country; Ukrainian is the language.",
        ],
        [
          "England",
          "English",
          "England is the country; English is the language.",
        ],
      ]),
    ],
    speaking: {
      situation: "You meet someone on an international online course.",
      steps: [
        "Give your name and country. You can make up the details.",
        "Ask which country your teacher is from.",
        "Name one language you speak.",
        "Tell a new person about your teacher. Use one sentence with he or she.",
      ],
      support: [
        "I’m from…",
        "Where are you from?",
        "He is from… / She is from…",
      ],
      success: [
        "I use from before a country.",
        "I choose am, are or is correctly.",
        "I use different words for a country and a language.",
      ],
      model:
        "A: I’m Eva. I’m from Ukraine. I speak Ukrainian. Where are you from?\nB: I’m from Poland.\nA: This is Ben. He is from Poland.",
      teacherNote:
        "Keep the focus on communication rather than geography. Add country and language names that the learner needs. Accept other correct examples.",
    },
    writing: {
      instruction:
        "Write three sentences about yourself and two about a made-up person. Include a name, country and language.",
      model:
        "I’m Anna. I’m from Poland. I speak Polish. This is Tom. He is from Canada.",
      checklist: [
        "I use I am and he/she is correctly.",
        "I put a country after from.",
        "I start names, countries and languages with capital letters.",
      ],
    },
    exit: [
      "I can ask about a country.",
      "I can say where I and another person are from.",
      "I can start language names with capital letters.",
    ],
    homework: {
      instruction: "Make two cards for made-up people on a course.",
      steps: [
        "Write a name, country and language on each card.",
        "Introduce each person aloud without reading.",
        "Review lesson 2: spell the names.",
      ],
      model:
        "Name: Mia\nCountry: Canada\nLanguage: English\nShe is from Canada.",
    },
    teacherNotes: [
      "Teach I speak as a useful phrase. The full third-person rule comes later.",
      "First check that the message is clear. Then give gentle feedback on the form of be.",
    ],
  }),
  makeLesson({
    n: 4,
    title: "My contact card",
    subtitle: "Complete a simple personal information form",
    topic: "Personal information",
    skills: ["listening", "speaking", "writing"],
    languageFocus: ["grammar", "vocabulary", "spelling_punctuation"],
    goal: "I can fill in a simple form with a name, age, town and email address.",
    vocabulary: vocab(
      ["first name", "Anna in Anna Green", "My first name is Eva."],
      [
        "surname",
        "Green in Anna Green; your family name",
        "My surname is Green.",
      ],
      ["age", "how old you are", "My age is twenty."],
      ["town", "a place where many people live", "My town is York."],
      [
        "email address",
        "an address for sending messages online",
        "My email address is eva@example.com.",
      ],
      [
        "at / dot",
        "say @ as at and . as dot in an email address",
        "Say: eva at example dot com.",
      ],
    ),
    language: {
      focus: "What is your…?; How old are you?",
      explanation:
        "Ask What is your…? or What’s your…? about a name, town or email address. Ask How old are you? about age. Answer I am twenty. Use made-up email addresses for practice.",
      examples: ["What’s your surname?", "How old are you?", "I’m twenty."],
      pitfall:
        "Use am for your age: I am twenty, not I have twenty. In an email address, read @ as at and . as dot.",
      pronunciation:
        "Say an email address in short parts. Pause before at and dot. Speak clearly; speed is not the goal.",
    },
    input: model(
      "A course registration form",
      "notice",
      "FIRST NAME: Eva\nSURNAME: Green\nAGE: 20\nTOWN: York\nEMAIL: eva.green@example.com\nCLASS: 12",
      [
        [
          "What is Eva’s surname?",
          ["York", "Green", "Eva"],
          1,
          "The SURNAME field says Green.",
        ],
        [
          "How old is Eva?",
          ["Twelve", "Twenty", "Ten"],
          1,
          "AGE: 20 — twenty.",
        ],
        [
          "What is her class number?",
          ["Twelve", "Twenty", "Two"],
          0,
          "CLASS: 12.",
        ],
      ],
    ),
    retrieval: recall(
      ["Say where you are from.", "I’m from Poland.", 3],
      ["Say the number 20.", "Twenty.", 2],
      ["Ask someone to spell a name.", "How do you spell your name?", 2],
    ),
    practice: [
      choice("form-fields", "Choose the right question", [
        [
          "You need the surname.",
          ["What’s your surname?", "How old are you?", "Where are you from?"],
          0,
          "A surname is a family name.",
        ],
        [
          "You need the age.",
          [
            "What’s your town?",
            "How old are you?",
            "What’s your email address?",
          ],
          1,
          "Ask How old are you? to find out someone’s age.",
        ],
        [
          "You need the email.",
          [
            "What’s your email address?",
            "What’s your first name?",
            "How do you spell York?",
          ],
          0,
          "An email address is an address for online messages.",
        ],
        [
          "Choose the correct age sentence.",
          ["I have twenty.", "I am twenty.", "I is twenty."],
          1,
          "Use be to talk about age.",
        ],
      ]),
      gaps("contact-spelling", "Check the words", [
        ["first ___", "name", "A first name is a given name, such as Anna."],
        [
          "email ___",
          "address",
          "Check the spelling: address has two d letters.",
        ],
        ["eva ___ example dot com", "at", "Read @ as at."],
      ]),
    ],
    speaking: {
      situation:
        "Your teacher completes a form but cannot see your information card.",
      steps: [
        "Make up a first name, surname, age from 0 to 20, town and email address ending in example.com.",
        "Answer your teacher’s questions. Spell words if you need to.",
        "Listen as your teacher reads the completed form.",
        "Correct any details that are wrong.",
      ],
      support: ["My first name is…", "I’m…", "It’s … at example dot com."],
      success: [
        "Every field in the form is complete.",
        "I use am to give my age.",
        "I can check letters or an email address.",
      ],
      model:
        "A: What’s your surname?\nB: Green. G–R–E–E–N.\nA: How old are you?\nB: I’m twenty.",
      teacherNote:
        "Use fictional details. Do not ask for a real home address, phone number or email address.",
    },
    writing: {
      instruction:
        "Complete five fields in a made-up form. Add one sentence about age.",
      model:
        "First name: Leo\nSurname: White\nAge: 19\nTown: Leeds\nEmail: leo@example.com\nI’m nineteen.",
      checklist: [
        "I put the first name and surname in separate fields.",
        "The email address has @ and a dot.",
        "I use I’m to write about age.",
      ],
    },
    exit: [
      "I can understand the main fields in a form.",
      "I can say a short name and email address for someone to write.",
      "I can check written information.",
    ],
    homework: {
      instruction:
        "Complete a new form from memory. Then read the details aloud.",
      steps: [
        "Use a different made-up name and town.",
        "Hide the model. Write the names of five form fields.",
        "In the next lesson, complete a form as you listen to your teacher.",
      ],
      model:
        "First name: Mia; Surname: Brown; Age: 18; Town: Bath; Email: mia@example.com.",
    },
    teacherNotes: [
      "Assess how accurately the learner communicates information, rather than whether the details are real.",
      "Allow the learner to ask for as many repetitions as needed during dictation.",
    ],
  }),
  makeLesson({
    n: 5,
    title: "People in my family",
    subtitle: "Introduce family and friends",
    topic: "Family",
    skills: ["speaking", "writing"],
    languageFocus: ["grammar", "vocabulary"],
    goal: "I can introduce a few people in my family and say their names.",
    vocabulary: vocab(
      ["mother", "a woman who has a child", "This is my mother."],
      ["father", "a man who has a child", "My father is Tom."],
      ["sister", "a girl or woman who has the same parent or parents as you", "Her sister is Eva."],
      ["brother", "a boy or man who has the same parent or parents as you", "His brother is Ben."],
      [
        "partner",
        "a person you share your life with as a couple",
        "This is my partner.",
      ],
      ["friend", "a person you like and spend time with", "Anna is my friend."],
    ),
    language: {
      focus: "my, your, his, her; This is…",
      explanation:
        "Use my for I, your for you, his for he and her for she. Say This is… to introduce one person. Use ’s after a name to show a family link: Anna’s brother.",
      examples: [
        "This is my sister.",
        "His name is Ben.",
        "Anna’s brother is Leo.",
      ],
      pitfall:
        "Use he or she for a person. Put his or her before a thing or name: She is Eva. Her name is Eva.",
      pronunciation:
        "Say This is my… as one phrase. For /ð/ in this, put the tip of your tongue gently between your teeth and use your voice. Copy your teacher.",
    },
    input: model(
      "Anna’s family",
      "text",
      "My name is Anna. This is my mother, Eva. My father is Tom. Leo is my brother. His friend is Ben. Mia is my sister. Her friend is Sara.",
      [
        [
          "Who is Anna’s father?",
          ["Leo", "Tom", "Ben"],
          1,
          "The text says My father is Tom.",
        ],
        [
          "Who is Leo?",
          ["Anna’s brother", "Anna’s father", "Mia’s friend"],
          0,
          "Leo is my brother.",
        ],
        [
          "Who is Mia’s friend?",
          ["Sara", "Eva", "Tom"],
          0,
          "Her friend is Sara tells us about Mia’s friend.",
        ],
      ],
    ),
    retrieval: recall(
      ["Tell your teacher your surname.", "My surname is Green.", 4],
      ["Say that a woman is from Poland.", "She is from Poland.", 3],
      ["Ask someone’s age.", "How old are you?", 4],
    ),
    practice: [
      gaps("possessives", "Choose the missing word", [
        [
          "I am Anna. This is ___ brother.",
          "my",
          "Use my before a noun when you talk about yourself: my sister.",
        ],
        [
          "He is Leo. ___ friend is Ben.",
          "His",
          "Use his before friend when you are talking about a man or boy.",
        ],
        ["She is Mia. ___ friend is Sara.", "Her", "Use her for she."],
        ["You are Eva. Is this ___ sister?", "your", "Use your for you."],
      ]),
      order("family-sentences", "Introduce people", [
        [
          "This is my mother.",
          "Use This is before one person: This is my mother.",
        ],
        ["Her name is Mia.", "Put Her name before is."],
        ["He is my brother.", "He is + my brother."],
      ]),
    ],
    speaking: {
      situation:
        "Show your teacher a simple diagram of four people close to you or four made-up people.",
      steps: [
        "Choose family, friends or made-up people. You do not need to share private details.",
        "Say each person’s name. Say who each person is.",
        "Your teacher asks you to check one name.",
        "Ask your teacher to introduce two made-up people.",
      ],
      support: ["This is my…", "His name is…", "Her name is…"],
      success: [
        "I can introduce at least three people.",
        "I can use my and his/her.",
        "I can answer a question about a name.",
      ],
      model:
        "This is my friend. Her name is Eva. This is my brother. His name is Leo. Ben is Leo’s friend.",
      teacherNote:
        "Offer friends, fictional characters or a team as an alternative to family. Let the learner finish speaking before reviewing one important form.",
    },
    writing: {
      instruction:
        "Label a diagram of three people. Write one or two sentences about each person.",
      model:
        "This is my sister. Her name is Mia. This is my friend. His name is Ben. My mother is Eva.",
      checklist: [
        "I use This is for one person.",
        "I put His or Her before name.",
        "I start names with capital letters.",
      ],
    },
    exit: [
      "I can introduce three people close to me.",
      "I can choose between he/she and his/her.",
      "I can check a person’s name.",
    ],
    homework: {
      instruction:
        "Prepare a short talk about three people. Try to speak without showing your text.",
      steps: [
        "Write five or six short sentences.",
        "Underline my, his and her.",
        "The next day, speak from memory. Then compare with your notes.",
      ],
      model:
        "This is my friend. Her name is Kate. This is my brother. His name is Sam. My father is Tom.",
    },
    teacherNotes: [
      "Success means that a listener can understand who each person is.",
      "Review be and names from earlier lessons. Limit new vocabulary to the people the learner chooses.",
    ],
  }),
];

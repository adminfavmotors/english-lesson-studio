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
    subtitle: "Знакомимся и начинаем разговор",
    topic: "Знакомство",
    skills: ["speaking", "vocabulary", "pronunciation"],
    goal: "I can say hello, give my name and ask someone’s name.",
    vocabulary: vocab(
      ["Hello", "Здравствуйте / привет", "Hello, I’m Mia."],
      ["Hi", "Привет", "Hi, Ben!"],
      ["Good morning", "Доброе утро", "Good morning, Alex."],
      ["I’m…", "Меня зовут… / я…", "I’m Leo."],
      ["What’s your name?", "Как вас зовут?", "Hello. What’s your name?"],
      ["Nice to meet you", "Приятно познакомиться", "Nice to meet you, Sara."],
    ),
    language: {
      focus: "I am / I’m; What’s your name?",
      explanation:
        "В английском перед именем можно сказать I am или коротко I’m. В вопросе What’s your name? слово what означает «как» в устойчивой фразе знакомства. Начинайте с готовых фраз и затем подставляйте своё имя.",
      examples: ["I am Mia.", "I’m Ben.", "What’s your name?"],
      pitfall:
        "Не опускайте am: I Mia → I am Mia. Оба варианта I am и I’m верны.",
      pronunciation:
        "В hello сильнее второй слог: hel-LO. Произнесите I’m слитно. Послушайте учителя и повторите сначала медленно, затем как одну фразу.",
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
          "Первая реплика принадлежит Mia.",
        ],
        [
          "What is the second person’s name?",
          ["Leo", "Ben", "Sara"],
          1,
          "Вторая реплика: I’m Ben.",
        ],
        [
          "What do they say after giving their names?",
          ["Good night", "Nice to meet you", "Thank you for the coffee"],
          1,
          "Они используют фразу Nice to meet you.",
        ],
      ],
    ),
    retrieval: recall(
      ["Скажите известное вам приветствие.", "Hello."],
      ["Попробуйте назвать себя по-английски.", "I’m Alex."],
      ["Как можно закончить первое знакомство?", "Nice to meet you."],
    ),
    practice: [
      gaps("be", "Complete the introductions", [
        ["I ___ Mia.", "am", "После I нужна форма am."],
        ["Hello. I ___ Ben.", "am", "I am + имя."],
        [
          "What’s your ___?",
          "name",
          "В вопросе о знакомстве употребляем name.",
        ],
        ["Nice to ___ you.", "meet", "Готовая фраза: Nice to meet you."],
      ]),
      match("replies", "Choose a natural reply", [
        [
          "Hello. I’m Sara.",
          "Hi, I’m Leo.",
          "В ответ поздоровайтесь и представьтесь.",
        ],
        ["What’s your name?", "I’m Alex.", "Собеседник спрашивает имя."],
        [
          "Nice to meet you.",
          "Nice to meet you too.",
          "Too здесь означает «тоже».",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Первое знакомство на онлайн-занятии. Учитель играет нового знакомого.",
      steps: [
        "Поздоровайтесь и назовите себя.",
        "Узнайте имя собеседника.",
        "Повторите его имя и завершите знакомство.",
        "Поменяйтесь ролями и повторите без чтения образца.",
      ],
      support: ["Hello. I’m…", "What’s your name?", "Nice to meet you."],
      success: [
        "Назвал своё имя.",
        "Спросил имя собеседника.",
        "Ответил на приветствие.",
      ],
      model:
        "A: Hi. I’m Anna. What’s your name?\nB: I’m Sam.\nA: Nice to meet you, Sam.\nB: Nice to meet you too.",
      teacherNote:
        "Сначала дайте одну реплику-опору. Во втором круге уберите текст и смените имя персонажа. Исправляйте только то, что мешает знакомству.",
    },
    writing: {
      instruction:
        "Напишите короткое сообщение новому знакомому: приветствие, своё имя, вопрос об имени.",
      model: "Hello! I’m Anna. What’s your name?",
      checklist: [
        "Есть приветствие.",
        "После I стоит am или ’m.",
        "Вопрос заканчивается знаком вопроса.",
      ],
    },
    exit: [
      "Я могу поздороваться без подсказки.",
      "Я могу назвать себя и спросить имя.",
      "Я могу ответить Nice to meet you too.",
    ],
    homework: {
      instruction: "Подготовьте два знакомства: неформальное и утреннее.",
      steps: [
        "Напишите по три реплики для каждого знакомства.",
        "Закройте записи и произнесите оба варианта.",
        "На следующий день восстановите три фразы по памяти.",
      ],
      model:
        "Good morning. I’m Kate. What’s your name?\nHi! I’m Kate. Nice to meet you.",
    },
    teacherNotes: [
      "Для абсолютного новичка повторение в начале — мягкая диагностика; разрешены подсказки.",
      "Не требуйте настоящих личных данных: допустимо вымышленное имя.",
      "В конце повторите знакомство с новым именем, чтобы проверить перенос навыка.",
    ],
  }),
  makeLesson({
    n: 2,
    title: "Names, letters and numbers",
    subtitle: "Произносим имя по буквам и называем числа",
    topic: "Личные данные",
    skills: ["spelling", "listening", "pronunciation"],
    goal: "I can spell a short name and understand numbers from zero to twenty.",
    vocabulary: vocab(
      ["spell", "произнести по буквам", "Can you spell Sam?"],
      ["letter", "буква", "A is a letter."],
      ["number", "число / номер", "My number is ten."],
      ["zero", "ноль", "Zero, one, two."],
      ["ten", "десять", "The number is ten."],
      ["twenty", "двадцать", "Twenty students."],
    ),
    language: {
      focus: "How do you spell…?; numbers 0–20",
      explanation:
        "Для уточнения имени используйте How do you spell your name? Учитель вводит названия букв A–Z небольшими группами. Числа: zero, one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty.",
      examples: [
        "How do you spell your name?",
        "Sam: S–A–M.",
        "The number is twelve.",
      ],
      pitfall:
        "В fifteen буквы f-i-f-t-e-e-n; в eighteen не удваивается t. Сначала слушайте, потом записывайте.",
      pronunciation:
        "Различайте названия букв A /eɪ/, E /iː/, I /aɪ/. Учитель произносит и даёт время на повтор. Числа thirteen–nineteen часто имеют сильное окончание -TEEN.",
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
          "Студент отвечает Sam.",
        ],
        [
          "How many letters are in Sam?",
          ["Two", "Three", "Four"],
          1,
          "S, A, M — три буквы.",
        ],
        [
          "What is the class number?",
          ["Ten", "Twenty", "Twelve"],
          2,
          "Учитель называет twelve, то есть 12.",
        ],
      ],
    ),
    retrieval: recall(
      ["Представьтесь.", "I’m Anna.", 1],
      ["Спросите имя учителя.", "What’s your name?", 1],
      ["Скажите «приятно познакомиться».", "Nice to meet you.", 1],
    ),
    practice: [
      gaps("numbers", "Write the number in words", [
        ["7 = ___", "seven", "Число 7 пишется seven."],
        ["12 = ___", "twelve", "Число 12 пишется twelve."],
        ["15 = ___", "fifteen", "Обратите внимание на fif- в fifteen."],
        ["20 = ___", "twenty", "Число 20 пишется twenty."],
      ]),
      choice("letters", "Check names and letters", [
        [
          "Which spelling is Anna?",
          ["A–N–A", "A–N–N–A", "E–N–N–A"],
          1,
          "В Anna две буквы n.",
        ],
        [
          "Which letter sounds /eɪ/?",
          ["A", "E", "I"],
          0,
          "Название A звучит /eɪ/.",
        ],
        [
          "What do you ask to check the letters in a name?",
          [
            "How do you spell your name?",
            "What’s your number?",
            "Good morning.",
          ],
          0,
          "Для написания имени по буквам нужен вопрос How do you spell…?",
        ],
      ]),
    ],
    speaking: {
      situation: "Запись на занятие: учитель не расслышал имя и номер группы.",
      steps: [
        "Назовите короткое имя: своё или вымышленное.",
        "Произнесите его по буквам.",
        "Назовите номер от 0 до 20.",
        "Учитель повторяет с одной ошибкой; вежливо исправьте и повторите.",
      ],
      support: ["My name is…", "It’s S–A–M.", "No, twelve."],
      success: [
        "Имя записано правильно.",
        "Номер совпал.",
        "Я могу повторить информацию медленнее.",
      ],
      model:
        "A: My name is Eva.\nB: How do you spell Eva?\nA: E–V–A. My class number is nine.\nB: Five?\nA: No, nine.",
      teacherNote:
        "Диктуйте по одному имени и числу, не показывая текст. После записи покажите ключ. Не оценивайте голос автоматически.",
    },
    writing: {
      instruction:
        "Запишите мини-анкету: Name, Spelling, Class number. Затем запишите числа 3, 8 и 14 словами.",
      model:
        "Name: Tom\nSpelling: T–O–M\nClass number: five\nthree, eight, fourteen",
      checklist: [
        "Буквы имени стоят в правильном порядке.",
        "Число записано словом.",
        "Написание проверено после попытки по памяти.",
      ],
    },
    exit: [
      "Я могу произнести короткое имя по буквам.",
      "Я могу записать несколько чисел 0–20 на слух.",
      "Я могу попросить уточнить написание имени.",
    ],
    homework: {
      instruction: "Составьте три карточки имён и пять карточек чисел.",
      steps: [
        "На одной стороне напишите имя или цифру, на другой — буквы или слово.",
        "Проверьте себя без подсказки.",
        "Попросите учителя проверить три трудных названия букв в начале следующего урока.",
      ],
      model: "Eva → E–V–A\n11 → eleven\n18 → eighteen",
    },
    teacherNotes: [
      "Алфавит: A /eɪ/, B /biː/, C /siː/, D /diː/, E /iː/, F /ef/, G /dʒiː/, H /eɪtʃ/, I /aɪ/, J /dʒeɪ/, K /keɪ/, L /el/, M /em/, N /en/, O /əʊ/, P /piː/, Q /kjuː/, R /ɑː/, S /es/, T /tiː/, U /juː/, V /viː/, W /ˈdʌbəl juː/, X /eks/, Y /waɪ/, Z /zed/.",
      "Это практическая орфография, а не требование выучить IPA. Названия букв отрабатывайте с голосовой моделью учителя.",
    ],
  }),
  makeLesson({
    n: 3,
    title: "Where are you from?",
    subtitle: "Говорим о странах и языках",
    topic: "Страны и языки",
    skills: ["grammar", "speaking", "vocabulary"],
    goal: "I can say where I am from and ask someone about their country.",
    vocabulary: vocab(
      ["from", "из", "I’m from Poland."],
      ["Poland", "Польша", "Ola is from Poland."],
      ["Ukraine", "Украина", "I’m from Ukraine."],
      ["English", "английский язык / английский", "I speak English."],
      ["Polish", "польский язык / польский", "Ola speaks Polish."],
      ["Ukrainian", "украинский язык / украинский", "I speak Ukrainian."],
    ),
    language: {
      focus: "I am, you are, he/she is; from + country",
      explanation:
        "Выбирайте be по тому, о ком говорите: I am, you are, he is, she is. После from назовите страну. Язык пишется с большой буквы: English. I speak… используем пока как готовую фразу.",
      examples: [
        "I’m from Ukraine.",
        "Where are you from?",
        "She is from Poland.",
      ],
      pitfall:
        "Не смешивайте страну и язык: from Poland, speak Polish. Не говорите She are.",
      pronunciation:
        "В вопросе Where are you from? выделяйте WHERE и FROM. В коротком ответе выделяйте название страны; не нужно одинаково сильно произносить все слова.",
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
          "Ola говорит I’m from Poland.",
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
          "В тексте указаны Polish and English.",
        ],
      ],
    ),
    retrieval: recall(
      ["Попросите произнести имя по буквам.", "How do you spell your name?", 2],
      ["Назовите число 12.", "Twelve.", 2],
      ["Поздоровайтесь и назовите себя.", "Hello. I’m Anna.", 1],
    ),
    practice: [
      gaps("be-countries", "Complete with am, are or is", [
        ["I ___ from Poland.", "am", "После I: am."],
        ["You ___ from Ukraine.", "are", "После you: are."],
        ["She ___ from Canada.", "is", "После she: is."],
        ["He ___ from Poland.", "is", "После he: is."],
      ]),
      match("countries-languages", "Match a country and a language", [
        ["Poland", "Polish", "Страна Poland — язык Polish."],
        ["Ukraine", "Ukrainian", "Страна Ukraine — язык Ukrainian."],
        ["England", "English", "Страна England — язык English."],
      ]),
    ],
    speaking: {
      situation: "Знакомство на международном онлайн-курсе.",
      steps: [
        "Назовите своё имя и страну; допустимы вымышленные данные.",
        "Узнайте страну учителя.",
        "Назовите один язык, на котором говорите.",
        "Представьте учителя третьему человеку одной фразой с he или she.",
      ],
      support: [
        "I’m from…",
        "Where are you from?",
        "He is from… / She is from…",
      ],
      success: [
        "Использую from перед страной.",
        "Выбираю am/are/is.",
        "Различаю страну и язык.",
      ],
      model:
        "A: I’m Eva. I’m from Ukraine. I speak Ukrainian. Where are you from?\nB: I’m from Poland.\nA: This is Ben. He is from Poland.",
      teacherNote:
        "Не превращайте урок в проверку географии. Названия стран и языков давайте по потребности ученика; принимаются другие корректные страны.",
    },
    writing: {
      instruction:
        "Напишите три предложения о себе и два о вымышленном знакомом: имя, страна, язык.",
      model:
        "I’m Anna. I’m from Poland. I speak Polish. This is Tom. He is from Canada.",
      checklist: [
        "I am, he/she is выбраны верно.",
        "После from стоит страна.",
        "Имена, страны и языки начинаются с большой буквы.",
      ],
    },
    exit: [
      "Я могу спросить о стране.",
      "Я могу сказать, откуда я и другой человек.",
      "Я пишу названия языков с большой буквы.",
    ],
    homework: {
      instruction: "Создайте две вымышленные карточки участников курса.",
      steps: [
        "Для каждой напишите имя, страну и язык.",
        "Представьте каждого вслух без чтения.",
        "Повторите слова из урока 2: произнесите имена по буквам.",
      ],
      model:
        "Name: Mia\nCountry: Canada\nLanguage: English\nShe is from Canada.",
    },
    teacherNotes: [
      "Объясняйте I speak как полезную фразу; полное правило третьего лица будет позже.",
      "Сначала ответ должен быть понятен; затем мягко уточните форму be.",
    ],
  }),
  makeLesson({
    n: 4,
    title: "My contact card",
    subtitle: "Заполняем простую анкету",
    topic: "Личные данные",
    skills: ["writing", "spelling", "listening"],
    goal: "I can fill in a simple form with a name, age, town and email address.",
    vocabulary: vocab(
      ["first name", "имя", "My first name is Eva."],
      ["surname", "фамилия", "My surname is Green."],
      ["age", "возраст", "My age is twenty."],
      ["town", "город", "My town is York."],
      [
        "email address",
        "адрес электронной почты",
        "My email address is eva@example.com.",
      ],
      ["at / dot", "«собака» / точка в адресе", "Say: eva at example dot com."],
    ),
    language: {
      focus: "What is your…?; How old are you?",
      explanation:
        "Для имени, фамилии, города и email подходят вопросы What is your…? / What’s your…? О возрасте спрашиваем How old are you? В ответе: I am twenty, а не I have twenty. Для тренировки используйте только вымышленные адреса.",
      examples: ["What’s your surname?", "How old are you?", "I’m twenty."],
      pitfall:
        "Не переводите возраст дословно через have. В email символ @ читается at, точка — dot.",
      pronunciation:
        "Диктуйте адрес частями и делайте паузу перед at и dot. Не стремитесь к скорости: цель — чтобы запись была точной.",
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
          "В поле SURNAME записано Green.",
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
      ["Скажите, откуда вы.", "I’m from Poland.", 3],
      ["Назовите число 20.", "Twenty.", 2],
      ["Попросите уточнить написание имени.", "How do you spell your name?", 2],
    ),
    practice: [
      choice("form-fields", "Choose the right question", [
        [
          "You need the surname.",
          ["What’s your surname?", "How old are you?", "Where are you from?"],
          0,
          "Surname — фамилия.",
        ],
        [
          "You need the age.",
          [
            "What’s your town?",
            "How old are you?",
            "What’s your email address?",
          ],
          1,
          "How old are you? — вопрос о возрасте.",
        ],
        [
          "You need the email.",
          [
            "What’s your email address?",
            "What’s your first name?",
            "How do you spell York?",
          ],
          0,
          "Email address — электронный адрес.",
        ],
        [
          "Choose the correct age sentence.",
          ["I have twenty.", "I am twenty.", "I is twenty."],
          1,
          "Возраст выражаем с be.",
        ],
      ]),
      gaps("contact-spelling", "Check the words", [
        ["first ___", "name", "Имя — first name."],
        ["email ___", "address", "Адрес — address, с двумя d."],
        ["eva ___ example dot com", "at", "Символ @ читается at."],
      ]),
    ],
    speaking: {
      situation: "Учитель заполняет анкету ученика, но не видит его карточку.",
      steps: [
        "Придумайте имя, фамилию, возраст 0–20, город и адрес на example.com.",
        "Отвечайте на вопросы учителя; при необходимости диктуйте буквы.",
        "Учитель читает записанные данные.",
        "Найдите и исправьте одно расхождение.",
      ],
      support: ["My first name is…", "I’m…", "It’s … at example dot com."],
      success: [
        "Все поля анкеты заполнены.",
        "Возраст выражен с am.",
        "Я могу уточнить буквы или адрес.",
      ],
      model:
        "A: What’s your surname?\nB: Green. G–R–E–E–N.\nA: How old are you?\nB: I’m twenty.",
      teacherNote:
        "Не просите настоящее место проживания, телефон или почту. Ученик может выбрать любые вымышленные данные.",
    },
    writing: {
      instruction:
        "Заполните пять полей вымышленной анкеты и добавьте одно предложение о возрасте.",
      model:
        "First name: Leo\nSurname: White\nAge: 19\nTown: Leeds\nEmail: leo@example.com\nI’m nineteen.",
      checklist: [
        "Имя и фамилия разделены.",
        "Email содержит @ и точку.",
        "Возраст в предложении выражен с I’m.",
      ],
    },
    exit: [
      "Я могу понять основные поля анкеты.",
      "Я могу задиктовать короткое имя и email.",
      "Я могу проверить записанные данные.",
    ],
    homework: {
      instruction:
        "Заполните новую анкету по памяти, затем продиктуйте её вслух.",
      steps: [
        "Используйте другое вымышленное имя и город.",
        "Закройте образец и напишите названия пяти полей.",
        "На следующем занятии заполните анкету на слух за учителем.",
      ],
      model:
        "First name: Mia; Surname: Brown; Age: 18; Town: Bath; Email: mia@example.com.",
    },
    teacherNotes: [
      "Оценивайте точность передачи информации, а не реальность данных.",
      "При диктовке разрешайте просить повторить столько раз, сколько нужно.",
    ],
  }),
  makeLesson({
    n: 5,
    title: "People in my family",
    subtitle: "Представляем семью и близких",
    topic: "Семья",
    skills: ["vocabulary", "speaking", "grammar"],
    goal: "I can introduce a few people in my family and say their names.",
    vocabulary: vocab(
      ["mother", "мама", "This is my mother."],
      ["father", "папа", "My father is Tom."],
      ["sister", "сестра", "Her sister is Eva."],
      ["brother", "брат", "His brother is Ben."],
      ["partner", "партнёр / партнёрша", "This is my partner."],
      ["friend", "друг / подруга", "Anna is my friend."],
    ),
    language: {
      focus: "my, your, his, her; This is…",
      explanation:
        "My — мой/моя/мои, your — твой/ваш, his — его, her — её. Эти слова не меняются по роду предмета. This is… помогает представить одного человека. Имя владельца можно выразить через ’s: Anna’s brother.",
      examples: [
        "This is my sister.",
        "His name is Ben.",
        "Anna’s brother is Leo.",
      ],
      pitfall:
        "He и she называют человека, his и her стоят перед существительным: She is Eva. Her name is Eva.",
      pronunciation:
        "Произнесите короткое This is my… как одну фразу. Учитель показывает звук /ð/ в this: кончик языка между зубами, голос включён.",
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
          "В тексте: My father is Tom.",
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
          "Her friend is Sara относится к Mia.",
        ],
      ],
    ),
    retrieval: recall(
      [
        "Назовите фамилию в ответ на вопрос учителя.",
        "My surname is Green.",
        4,
      ],
      ["Скажите о другом человеке: она из Польши.", "She is from Poland.", 3],
      ["Спросите возраст.", "How old are you?", 4],
    ),
    practice: [
      gaps("possessives", "Choose the missing word", [
        [
          "I am Anna. This is ___ brother.",
          "my",
          "После I используем притяжательное my.",
        ],
        ["He is Leo. ___ friend is Ben.", "His", "Перед friend нужно his."],
        [
          "She is Mia. ___ friend is Sara.",
          "Her",
          "Для she притяжательное слово — her.",
        ],
        [
          "You are Eva. Is this ___ sister?",
          "your",
          "Для you используем your.",
        ],
      ]),
      order("family-sentences", "Introduce people", [
        ["This is my mother.", "This is + притяжательное слово + человек."],
        ["Her name is Mia.", "Her name стоит перед is."],
        ["He is my brother.", "He is + my brother."],
      ]),
    ],
    speaking: {
      situation:
        "Вы показываете учителю схему из четырёх близких людей или вымышленных персонажей.",
      steps: [
        "Выберите семью, друзей или вымышленных героев — личные подробности не обязательны.",
        "Назовите каждого и объясните, кто это.",
        "Учитель уточняет одно имя.",
        "Попросите учителя представить двух своих вымышленных героев.",
      ],
      support: ["This is my…", "His name is…", "Her name is…"],
      success: [
        "Представил минимум трёх человек.",
        "Использовал my и his/her.",
        "Ответил на вопрос об имени.",
      ],
      model:
        "This is my friend. Her name is Eva. This is my brother. His name is Leo. Ben is Leo’s friend.",
      teacherNote:
        "Предлагайте альтернативу семейной теме: друзья, персонажи, команда. Не исправляйте каждую паузу; после рассказа верните одну важную форму.",
    },
    writing: {
      instruction:
        "Подпишите схему из трёх человек. Напишите по одному или два предложения о каждом.",
      model:
        "This is my sister. Her name is Mia. This is my friend. His name is Ben. My mother is Eva.",
      checklist: [
        "This is используется для одного человека.",
        "His/her стоит перед name.",
        "Имена начинаются с большой буквы.",
      ],
    },
    exit: [
      "Я могу представить трёх близких людей.",
      "Я различаю he/she и his/her.",
      "Я могу уточнить имя человека.",
    ],
    homework: {
      instruction: "Подготовьте мини-рассказ о трёх людях без показа текста.",
      steps: [
        "Напишите 5–6 коротких предложений.",
        "Подчеркните my, his и her.",
        "На следующий день расскажите по памяти и сравните с записью.",
      ],
      model:
        "This is my friend. Her name is Kate. This is my brother. His name is Sam. My father is Tom.",
    },
    teacherNotes: [
      "Критерий успеха — понятно, кто есть кто.",
      "Возвращайте формы be и имена из предыдущих уроков; новую лексику ограничьте выбранными учеником людьми.",
    ],
  }),
];

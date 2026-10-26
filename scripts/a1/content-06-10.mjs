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
    subtitle: "Называем предметы и просим нужную вещь",
    topic: "Предметы вокруг нас",
    skills: ["grammar", "spelling", "vocabulary"],
    goal: "I can name everyday objects and ask for a classroom item.",
    vocabulary: vocab(
      ["book", "книга", "This is a book."],
      ["pen", "ручка", "A pen, please."],
      ["bag", "сумка", "It is my bag."],
      ["phone", "телефон", "This is a phone."],
      ["key", "ключ", "These are keys."],
      ["umbrella", "зонт", "It is an umbrella."],
    ),
    language: {
      focus: "a/an; this is / these are; regular plurals",
      explanation:
        "Для одного исчисляемого предмета: a book, an umbrella. An выбираем перед гласным звуком. Во множественном числе обычно добавляем -s: books. This is — один предмет; these are — несколько.",
      examples: ["This is a pen.", "It is an umbrella.", "These are books."],
      pitfall:
        "Не ставьте a перед множественным числом: books, не a books. Выбирайте an по звуку, а не только по букве.",
      pronunciation:
        "В a book артикль слабый, главное ударение на BOOK. В books конец /s/, в pens /z/; послушайте и повторите.",
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
          "Tom называет a book.",
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
      ["Представьте свою подругу.", "This is my friend.", 5],
      ["Скажите её имя.", "Her name is Eva.", 5],
      ["Назовите число 15.", "Fifteen.", 2],
    ),
    practice: [
      gaps("articles", "Complete the labels", [
        ["___ book", "a", "Book начинается с согласного звука."],
        ["___ umbrella", "an", "Umbrella начинается с гласного звука."],
        ["one pen, two ___", "pens", "Обычное множественное число: +s."],
        ["This ___ my phone.", "is", "This — один предмет: is."],
      ]),
      choice("objects", "Choose the correct label", [
        [
          "Two books:",
          ["This is a book.", "These are books.", "These is books."],
          1,
          "Для нескольких предметов: these are.",
        ],
        [
          "One key:",
          ["an key", "a keys", "a key"],
          2,
          "Key начинается с /k/, один предмет: a key.",
        ],
        [
          "Choose the correct spelling.",
          ["umbrellla", "umbrella", "umbrel"],
          1,
          "Umbrella пишется с двумя l.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Учитель собирает сумку по вашим инструкциям; используйте реальные вещи или их названия на карточках.",
      steps: [
        "Назовите три нужных предмета.",
        "Учитель намеренно выбирает один неверный предмет.",
        "Уточните: This is a pen, not a key.",
        "Попросите предмет вежливо: A book, please.",
      ],
      support: ["What is this?", "This is a…", "These are…", "A pen, please."],
      success: [
        "Назвал три предмета.",
        "Различил один и несколько предметов.",
        "Исправил неверный выбор.",
      ],
      model:
        "A: A book, please.\nB: This book?\nA: Yes, thank you. And two pens, please.",
      teacherNote:
        "Изменяйте количество и предметы во втором круге, чтобы ученик не просто воспроизводил диалог.",
    },
    writing: {
      instruction:
        "Составьте список из пяти вещей для занятия; добавьте два предложения с this/these.",
      model:
        "a book, a pen, a bag, two keys, a phone\nThis is my bag. These are my keys.",
      checklist: [
        "Для одного предмета есть a/an.",
        "Во множественном числе есть -s, где нужно.",
        "Использованы is и are.",
      ],
    },
    exit: [
      "Я могу назвать вещи для занятия.",
      "Я различаю a и an в знакомых словах.",
      "Я могу попросить один или несколько предметов.",
    ],
    homework: {
      instruction: "Подпишите пять предметов вокруг себя.",
      steps: [
        "Запишите слова сначала по памяти.",
        "Проверьте spelling и артикль.",
        "Завтра попросите учителя угадать один предмет по вашему описанию.",
      ],
      model: "This is a book. These are pens.",
    },
    teacherNotes: [
      "Вводите только регулярное множественное число.",
      "Для screen-only урока учитель держит перед камерой по одному предмету; картинки не обязательны.",
    ],
  }),
  makeLesson({
    n: 7,
    title: "Colours and favourite things",
    subtitle: "Описываем цвет и выбираем подарок",
    topic: "Цвета и предпочтения",
    skills: ["vocabulary", "grammar", "speaking"],
    goal: "I can describe familiar objects by colour and choose a simple gift.",
    vocabulary: vocab(
      ["red", "красный", "a red bag"],
      ["blue", "синий / голубой", "a blue pen"],
      ["green", "зелёный", "a green book"],
      ["black", "чёрный", "a black phone"],
      ["white", "белый", "a white cup"],
      ["favourite", "любимый", "My favourite colour is blue."],
    ),
    language: {
      focus: "adjective + noun; It is / They are",
      explanation:
        "Цвет обычно стоит перед предметом: a blue bag. Прилагательное не меняется во множественном числе: red pens. It заменяет один предмет, they — несколько.",
      examples: [
        "It is a green book.",
        "They are red pens.",
        "My favourite colour is blue.",
      ],
      pitfall:
        "A bag blue → a blue bag. Не добавляйте -s к цвету: blue books, не blues books.",
      pronunciation:
        "Слова black и blue начинаются с /bl/: произнесите оба согласных без дополнительной гласной между ними.",
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
      ["Назовите один зонт с артиклем.", "An umbrella.", 6],
      ["Скажите «это мои ключи».", "These are my keys.", 6],
      ["Представьте своего брата.", "This is my brother.", 5],
    ),
    practice: [
      order("colour-order", "Describe the objects", [
        ["It is a blue bag.", "Цвет blue стоит перед bag."],
        ["They are red pens.", "They are относится к нескольким предметам."],
        [
          "My favourite colour is green.",
          "Favourite colour — подлежащее; после него is.",
        ],
      ]),
      gaps("colour-spelling", "Write the missing letters", [
        ["bl___ (синий)", "ue", "Blue: b-l-u-e."],
        ["gr___n (зелёный)", "ee", "Green пишется с ee."],
        ["wh___e (белый)", "it", "White: w-h-i-t-e."],
        [
          "Two red ___ (ручки)",
          "pens",
          "Прилагательное red не меняется; множественное число у pens.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Вы выбираете подарок человеку, чей любимый цвет знает только учитель.",
      steps: [
        "Спросите: What is his/her favourite colour?",
        "Выберите подарок из трёх предметов текста.",
        "Объясните выбор одной короткой фразой.",
        "Учитель меняет любимый цвет; предложите другой подарок.",
      ],
      support: [
        "What is her favourite colour?",
        "A red bag.",
        "It is blue.",
        "This is for Ben.",
      ],
      success: [
        "Узнал цвет.",
        "Предложил подходящий предмет.",
        "Поставил цвет перед существительным.",
      ],
      model:
        "A: What is Ben’s favourite colour?\nB: Blue.\nA: Blue pens for Ben.\nB: Good idea.",
      teacherNote:
        "Создайте информационный пробел: не сообщайте предпочтение, пока ученик не спросит.",
    },
    writing: {
      instruction: "Опишите три подарка и укажите, для кого они.",
      model:
        "This is a red bag for Eva. These are blue pens for Ben. This is a white cup for Tom.",
      checklist: [
        "Цвет стоит перед названием предмета.",
        "Согласованы it/they и is/are.",
        "Цвета написаны без лишнего -s.",
      ],
    },
    exit: [
      "Я могу назвать основные цвета.",
      "Я могу описать знакомый предмет.",
      "Я могу уточнить предпочтение собеседника.",
    ],
    homework: {
      instruction: "Подготовьте описание трёх вещей своего любимого цвета.",
      steps: [
        "Выберите реальные или вымышленные вещи.",
        "Напишите три предложения.",
        "Завтра произнесите их без чтения и проверьте порядок слов.",
      ],
      model:
        "My favourite colour is green. This is a green bag. These are green pens.",
    },
    teacherNotes: [
      "Допускайте любимые цвета вне списка: добавляйте по одному по запросу.",
      "Проверяйте смысл выбора подарка, затем порядок слов.",
    ],
  }),
  makeLesson({
    n: 8,
    title: "My home",
    subtitle: "Рассказываем о комнатах и мебели",
    topic: "Дом",
    skills: ["grammar", "vocabulary", "reading"],
    goal: "I can say what rooms and basic furniture there are in a home.",
    vocabulary: vocab(
      ["kitchen", "кухня", "There is a kitchen."],
      ["bedroom", "спальня", "There are two bedrooms."],
      ["bathroom", "ванная", "The bathroom is small."],
      ["living room", "гостиная", "There is a sofa in the living room."],
      ["table", "стол", "There is a table."],
      ["chair", "стул", "There are four chairs."],
    ),
    language: {
      focus: "There is / There are; a / two / three",
      explanation:
        "There is сообщает об одном предмете или комнате; there are — о нескольких. После there is можно использовать a/an, после there are — число и множественное число.",
      examples: [
        "There is a kitchen.",
        "There are two bedrooms.",
        "There are four chairs.",
      ],
      pitfall:
        "There are a table → There is a table. Не путайте существование There is… и знакомое It is…",
      pronunciation:
        "Слушайте короткое there’s как вариант there is. В собственной речи можно использовать полную форму.",
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
          "В living room есть table и sofa.",
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
      ["Назовите любимый цвет.", "My favourite colour is blue.", 7],
      ["Опишите одну синюю вещь.", "It is a blue bag.", 7],
      ["Скажите «два стула»; слово chair можно подсмотреть.", "Two chairs.", 6],
    ),
    practice: [
      gaps("there", "Complete the home description", [
        ["There ___ a kitchen.", "is", "Одна комната: there is."],
        ["There ___ two bedrooms.", "are", "Две комнаты: there are."],
        ["There is ___ table.", "a", "Один стол: a table."],
        [
          "There are four ___. (chair)",
          "chairs",
          "После four нужно множественное число.",
        ],
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
          "There are + множественное число.",
        ],
        [
          "Which room is for sleeping?",
          ["A bedroom", "A kitchen", "A bathroom"],
          0,
          "Спальня — bedroom.",
        ],
        [
          "There is a sofa. How many sofas?",
          ["One", "Two", "Three"],
          0,
          "There is a sofa обозначает один диван.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Учитель рисует простой план вымышленной квартиры по вашему описанию.",
      steps: [
        "Выберите две или три комнаты.",
        "Сообщите, сколько их и что в одной комнате.",
        "Учитель пересказывает план с одной ошибкой.",
        "Исправьте количество или предмет.",
      ],
      support: ["There is a…", "There are two…", "In the living room…"],
      success: [
        "Назвал комнаты.",
        "Описал один и несколько предметов.",
        "Исправил ошибку в плане.",
      ],
      model:
        "There are two bedrooms. There is a kitchen. In the living room, there is a table. There are three chairs.",
      teacherNote:
        "Можно описывать вымышленный дом: не требуйте раскрывать устройство реального жилья.",
    },
    writing: {
      instruction:
        "Напишите четыре предложения о вымышленном доме: комнаты и мебель.",
      model:
        "There is a kitchen. There are two bedrooms. There is a table in the kitchen. There are four chairs.",
      checklist: [
        "There is для одного.",
        "There are для нескольких.",
        "После числа — форма множественного числа.",
      ],
    },
    exit: [
      "Я могу назвать основные комнаты.",
      "Я могу сказать, что есть в доме.",
      "Я различаю there is и there are.",
    ],
    homework: {
      instruction: "Нарисуйте небольшой план и подпишите его пятью фразами.",
      steps: [
        "Добавьте две комнаты и три предмета.",
        "Подпишите количество.",
        "На следующем уроке опишите план, не показывая его учителю.",
      ],
      model: "There is a bedroom. There are two chairs.",
    },
    teacherNotes: [
      "Не вводите сразу сложные исключения множественного числа.",
      "Свяжите новый материал с цветами: a white kitchen, a blue chair.",
    ],
  }),
  makeLesson({
    n: 9,
    title: "Where is my key?",
    subtitle: "Находим вещи по описанию",
    topic: "Расположение предметов",
    skills: ["grammar", "listening", "speaking"],
    goal: "I can ask where a familiar object is and understand a simple location.",
    vocabulary: vocab(
      ["in", "в", "The key is in the bag."],
      ["on", "на", "The phone is on the table."],
      ["under", "под", "The book is under the chair."],
      ["next to", "рядом с", "The bag is next to the sofa."],
      ["behind", "за", "The chair is behind the table."],
      ["between", "между", "The key is between the books."],
    ),
    language: {
      focus: "Where is / Where are; prepositions of place",
      explanation:
        "Where is…? — вопрос об одном предмете, Where are…? — о нескольких. В ответе: The key is on the table. Предлог связывает предмет с ориентиром.",
      examples: [
        "Where is my phone?",
        "It is under the book.",
        "The keys are in the bag.",
      ],
      pitfall:
        "Не опускайте is/are: The key in the bag → The key is in the bag.",
      pronunciation:
        "Вопрос Where is my key? произносите с ударением на KEY. В ответе выделите предлог, если именно он исправляет ошибку: ON the table.",
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
          "Последняя реплика относится к pen.",
        ],
      ],
    ),
    retrieval: recall(
      ["Скажите, что в доме есть кухня.", "There is a kitchen.", 8],
      ["Скажите, что есть два стула.", "There are two chairs.", 8],
      ["Назовите один предмет из сумки.", "A pen.", 6],
    ),
    practice: [
      gaps("location", "Complete the location", [
        ["The phone ___ on the table.", "is", "Один телефон: is."],
        [
          "The keys ___ in the bag.",
          "are",
          "Ключи во множественном числе: are.",
        ],
        ["Где мой ключ? Where ___ my key?", "is", "Один ключ: Where is…?"],
        [
          "The book is next ___ the phone.",
          "to",
          "Устойчивый предлог next to.",
        ],
      ]),
      match("prepositions", "Match the locations", [
        ["под столом", "under the table", "Under = под."],
        ["в сумке", "in the bag", "In = внутри."],
        ["за стулом", "behind the chair", "Behind = за предметом."],
      ]),
    ],
    speaking: {
      situation:
        "Ученик расставляет три вещи, а учитель должен восстановить расположение.",
      steps: [
        "Положите ручку, книгу и ключ или выберите их расположение мысленно.",
        "Отвечайте на Where is…? учителя, не показывая вещи.",
        "Учитель рисует или объясняет расположение.",
        "Сравните результат и поменяйтесь ролями.",
      ],
      support: ["It is on…", "It is under…", "It is next to…"],
      success: [
        "Использовал минимум три предлога.",
        "Сохранил is/are.",
        "По описанию можно найти предмет.",
      ],
      model:
        "The pen is on the book. The key is under the chair. The phone is next to the bag.",
      teacherNote:
        "Избегайте автоматической проверки открытого описания: правильность зависит от выбранной учеником сцены.",
    },
    writing: {
      instruction: "Напишите три подсказки к поиску вещей в комнате.",
      model:
        "The key is in the bag. The bag is under the table. The phone is next to the book.",
      checklist: [
        "Есть предмет и ориентир.",
        "Перед предлогом стоит is/are.",
        "Предлоги соответствуют выбранной сцене.",
      ],
    },
    exit: [
      "Я могу спросить, где вещь.",
      "Я понимаю in, on и under.",
      "Я могу объяснить расположение без показа.",
    ],
    homework: {
      instruction: "Составьте мини-квест «Найди ключ».",
      steps: [
        "Нарисуйте сцену с четырьмя предметами.",
        "Напишите три подсказки.",
        "Через день восстановите предлоги по рисунку без текста.",
      ],
      model: "The key is under the book. The book is on the table.",
    },
    teacherNotes: [
      "Для аудирования сначала прочитайте диалог с закрытым текстом, затем откройте для проверки.",
      "Разрешайте повтор и уточнение: цель — найти вещь, а не один раз идеально услышать.",
    ],
  }),
  makeLesson({
    n: 10,
    title: "My morning",
    subtitle: "Рассказываем об утре и времени",
    topic: "Распорядок дня",
    skills: ["vocabulary", "grammar", "speaking"],
    goal: "I can describe a simple morning routine and say basic times.",
    vocabulary: vocab(
      ["get up", "вставать", "I get up at seven."],
      ["have breakfast", "завтракать", "I have breakfast at eight."],
      ["go to work", "идти на работу", "I go to work at nine."],
      ["study", "учиться", "I study English."],
      ["at seven", "в семь часов", "I get up at seven."],
      [
        "half past seven",
        "половина восьмого",
        "Breakfast is at half past seven.",
      ],
    ),
    language: {
      focus: "Present simple with I/you; at + time",
      explanation:
        "Для обычных действий с I/you используйте начальную форму: I get up, you study. Перед временем — at. Seven o’clock = 7:00; half past seven = 7:30. Это привычный распорядок, а не действие прямо сейчас.",
      examples: [
        "I get up at seven.",
        "I have breakfast at half past seven.",
        "I study English at eight.",
      ],
      pitfall:
        "Не добавляйте am перед обычным глаголом: I am get up → I get up.",
      pronunciation:
        "В get up соединяйте слова, не добавляя паузу между ними. В предложении выделяйте действие и время: GET UP at SEVEN.",
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
          "В расписании get up — 7:00.",
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
          "Последняя строка: next to the door.",
        ],
      ],
    ),
    retrieval: recall(
      ["Скажите, где телефон.", "It is on the table.", 9],
      ["Назовите две комнаты.", "A kitchen and a bedroom.", 8],
      ["Назовите число 8.", "Eight.", 2],
    ),
    practice: [
      gaps("routine", "Complete the morning", [
        ["I ___ up at seven.", "get", "Устойчивое сочетание get up."],
        ["I have ___ at eight.", "breakfast", "Have breakfast = завтракать."],
        ["I go ___ work at nine.", "to", "Go to work — идти на работу."],
        ["I study English ___ eight.", "at", "Перед временем используем at."],
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
          "Обычный глагол после I без am.",
        ],
      ]),
    ],
    speaking: {
      situation: "Вы согласовываете короткое утреннее занятие с учителем.",
      steps: [
        "Назовите три обычных утренних действия и время.",
        "Учитель предлагает время занятия.",
        "Скажите, что обычно делаете в это время.",
        "Выберите подходящее время и повторите его для проверки.",
      ],
      support: [
        "I get up at…",
        "I have breakfast at…",
        "English at eight, please.",
      ],
      success: [
        "Описал три действия.",
        "Правильно прочитал целый час и половину.",
        "Назвал подходящее время.",
      ],
      model:
        "I get up at seven. I have breakfast at half past seven. I study English at eight. Eight is good.",
      teacherNote:
        "Пока не требуйте сложных вопросов do/does. Учитель может спрашивать What time? с опорой на расписание.",
    },
    writing: {
      instruction:
        "Составьте собственное или вымышленное утреннее расписание из четырёх строк.",
      model:
        "7:00 — I get up.\n7:30 — I have breakfast.\n8:00 — I study.\n9:00 — I go to work.",
      checklist: [
        "Используются I + глагол.",
        "Время понятно и записано последовательно.",
        "При времени в предложении есть at.",
      ],
    },
    exit: [
      "Я могу описать утро.",
      "Я могу назвать время с o’clock и half past.",
      "Я могу согласовать время занятия.",
    ],
    homework: {
      instruction: "Подготовьте рассказ «Моё утро» по четырём часам.",
      steps: [
        "Нарисуйте четыре времени и подпишите действия.",
        "Произнесите предложения без чтения.",
        "Завтра повторите три предлога места из урока 9.",
      ],
      model: "I get up at eight. I have breakfast at half past eight.",
    },
    teacherNotes: [
      "Используйте реальные потребности ученика: work можно заменить school, но не перегружайте список.",
      "Короткая повторная попытка после обратной связи важнее длинного объяснения правила.",
    ],
  }),
];

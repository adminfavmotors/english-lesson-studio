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
    subtitle: "Описываем обычный день другого человека",
    topic: "Распорядок дня",
    skills: ["grammar", "reading", "writing"],
    goal: "I can describe another person’s routine with simple sentences.",
    vocabulary: vocab(
      ["works", "работает", "She works in a café."],
      ["lives", "живёт", "He lives in Leeds."],
      ["starts", "начинает", "She starts work at nine."],
      ["finishes", "заканчивает", "He finishes at five."],
      ["goes home", "идёт домой", "She goes home at six."],
      ["watches TV", "смотрит телевизор", "He watches TV in the evening."],
    ),
    language: {
      focus: "Present simple: he/she + -s / -es",
      explanation:
        "В обычном действии после he/she глагол меняется: work → works, live → lives, go → goes, watch → watches. Have меняется на has; согласная + y: study → studies. Сравнивайте сначала I work и she works.",
      examples: [
        "I work. She works.",
        "He goes home at five.",
        "She has breakfast at eight.",
      ],
      pitfall: "She work → She works. Но с I форма без -s: I work.",
      pronunciation:
        "В works окончание звучит /s/, в lives — /z/, в watches появляется дополнительный слог /ɪz/. Повторите за учителем три примера.",
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
          "Последняя строка: watches TV.",
        ],
      ],
    ),
    retrieval: recall(
      ["Скажите, когда вы встаёте.", "I get up at seven.", 10],
      ["Прочитайте 7:30.", "Half past seven.", 10],
      ["Скажите, откуда она.", "She is from Poland.", 3],
    ),
    practice: [
      gaps("third-person", "Complete the verbs", [
        ["She ___ in York. (live)", "lives", "После she добавляем -s."],
        ["He ___ to work at nine. (go)", "goes", "Go → goes."],
        ["Mia ___ breakfast at eight. (have)", "has", "Have → has после she."],
        ["He ___ TV in the evening. (watch)", "watches", "Watch → watches."],
      ]),
      order("day-order", "Build a description", [
        ["She starts work at nine.", "She + starts + work + время."],
        ["He goes home at five.", "Go → goes; home без to."],
        ["I live in York.", "После I нет окончания -s."],
      ]),
    ],
    speaking: {
      situation:
        "Учитель выбирает вымышленного человека; вы готовите для него короткую визитку дня.",
      steps: [
        "Узнайте имя и город персонажа.",
        "Посмотрите на его расписание или попросите учителя назвать времена.",
        "Расскажите о четырёх действиях с he/she.",
        "После обратной связи повторите рассказ без расписания.",
      ],
      support: ["He lives in…", "She starts at…", "He goes home at…"],
      success: [
        "Использовал he/she.",
        "Добавил нужные -s/-es.",
        "Передал порядок дня.",
      ],
      model:
        "This is Eva. She lives in Leeds. She starts work at eight. She finishes at four. She goes home at five.",
      teacherNote:
        "Учитель может продиктовать: Eva, Leeds, start 8:00, finish 4:00, home 5:00. Не превращайте речь в тест на все окончания одновременно.",
    },
    writing: {
      instruction:
        "Напишите четыре предложения о дне персонажа, затем одно о себе.",
      model:
        "Ben lives in York. He works in a café. He starts at nine. He goes home at five. I start work at eight.",
      checklist: [
        "После he/she есть нужная форма.",
        "Have заменено на has, где нужно.",
        "После I нет -s.",
      ],
    },
    exit: [
      "Я могу описать чужой распорядок.",
      "Я различаю I work и she works.",
      "Я могу назвать два важных времени дня.",
    ],
    homework: {
      instruction: "Перепишите своё расписание из урока 10 от лица персонажа.",
      steps: [
        "Замените I на he или she.",
        "Проверьте окончания и has/goes.",
        "На следующий день расскажите о себе и персонаже по очереди.",
      ],
      model: "I get up at seven. → She gets up at seven.",
    },
    teacherNotes: [
      "Разделяйте смысловую и языковую обратную связь.",
      "Привычное действие: be перед works не требуется.",
    ],
  }),
  makeLesson({
    n: 12,
    title: "Do you study every day?",
    subtitle: "Задаём вопросы о привычках",
    topic: "Привычки",
    skills: ["grammar", "speaking", "listening"],
    goal: "I can ask simple questions about routines and give short answers.",
    vocabulary: vocab(
      ["every day", "каждый день", "I study every day."],
      ["usually", "обычно", "I usually get up at seven."],
      ["sometimes", "иногда", "I sometimes watch TV."],
      ["never", "никогда", "I never work on Sunday."],
      ["on Monday", "в понедельник", "I study on Monday."],
      ["at the weekend", "на выходных", "I study at the weekend."],
    ),
    language: {
      focus: "Do/Does questions; don’t/doesn’t",
      explanation:
        "Do you work? — вопрос с you/I. Does she work? — с he/she. После does основной глагол без -s. Отрицание: I don’t work; she doesn’t work. Usually/sometimes обычно стоят перед основным глаголом.",
      examples: [
        "Do you study every day?",
        "Yes, I do. No, I don’t.",
        "Does she work on Monday?",
      ],
      pitfall:
        "Does she works? → Does she work? Окончание уже выражено в does.",
      pronunciation:
        "Слушайте don’t и doesn’t как единые короткие слова. В вопросе выделяйте смысловой глагол: Do you STUDY every day?",
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
          "Eva называет Monday and Friday.",
        ],
        [
          "Does Ben study with Eva?",
          ["Yes, he does", "No, he doesn’t", "The text does not say"],
          0,
          "Eva отвечает Yes, he does.",
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
      ["Скажите «она работает в кафе».", "She works in a café.", 11],
      ["Скажите «он идёт домой в пять».", "He goes home at five.", 11],
      ["Прочитайте 6:00.", "Six o’clock.", 10],
    ),
    practice: [
      gaps("do-does", "Complete the questions", [
        ["___ you study English?", "Do", "С you используем do."],
        ["___ she work on Monday?", "Does", "С she используем does."],
        [
          "Does he ___ in York? (live)",
          "live",
          "После does основная форма без -s.",
        ],
        ["I ___ work on Sunday.", ["don’t", "don't"], "Отрицание с I: don’t."],
      ]),
      choice("short-answers", "Choose the answer", [
        [
          "Does Ben study here?",
          ["Yes, he do.", "Yes, he does.", "Yes, he is study."],
          1,
          "Короткий ответ повторяет does.",
        ],
        [
          "Do you work here?",
          ["No, I don’t.", "No, I doesn’t.", "No, I not work."],
          0,
          "С I: don’t.",
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
      situation: "Вы ищете подходящий день для совместной практики с учителем.",
      steps: [
        "Задайте три вопроса о работе и учёбе в разные дни.",
        "Отвечайте на встречные вопросы.",
        "Найдите общий свободный день.",
        "Повторите вопрос, на который сначала было трудно ответить.",
      ],
      support: [
        "Do you work on…?",
        "Do you study at…?",
        "Yes, I do. / No, I don’t.",
      ],
      success: [
        "Задал минимум три вопроса.",
        "Дал короткие ответы.",
        "Нашёл подходящий день.",
      ],
      model:
        "A: Do you work on Friday?\nB: Yes, I do. Do you study on Sunday?\nA: No, I don’t. Sunday is good.",
      teacherNote:
        "Дайте разные расписания вам и ученику; общий день должен быть найден через вопросы.",
    },
    writing: {
      instruction: "Напишите три вопроса о привычках и короткие ответы к ним.",
      model:
        "Do you study on Monday? Yes, I do.\nDoes Eva work on Sunday? No, she doesn’t.\nDo you watch TV? Sometimes.",
      checklist: [
        "В начале вопроса Do или Does.",
        "После does глагол без -s.",
        "Ответ соответствует вопросу.",
      ],
    },
    exit: [
      "Я могу спросить о привычке.",
      "Я могу ответить yes/no без полного повторения.",
      "Я различаю do и does.",
    ],
    homework: {
      instruction: "Подготовьте мини-интервью из четырёх вопросов.",
      steps: [
        "Два вопроса о you, два о he/she.",
        "Ответьте как вымышленный персонаж.",
        "Завтра восстановите вопросы без записей.",
      ],
      model: "Does Tom study every day? No, he doesn’t.",
    },
    teacherNotes: [
      "Never уже выражает отрицание: I never work, без don’t.",
      "Если обычно/иногда мешают основной цели, оставьте их как готовые фразы.",
    ],
  }),
  makeLesson({
    n: 13,
    title: "Food I like",
    subtitle: "Говорим о еде и предпочтениях",
    topic: "Еда",
    skills: ["vocabulary", "grammar", "speaking"],
    goal: "I can say which foods I like and ask about someone’s preferences.",
    vocabulary: vocab(
      ["bread", "хлеб", "I like bread."],
      ["rice", "рис", "I like rice."],
      ["eggs", "яйца", "I don’t like eggs."],
      ["apples", "яблоки", "Do you like apples?"],
      ["water", "вода", "Water, please."],
      ["coffee", "кофе", "She likes coffee."],
    ),
    language: {
      focus: "like / don’t like; Do you like…?",
      explanation:
        "I like… — мне нравится; I don’t like… — не нравится. Для предпочтения в целом часто используем множественное число: I like apples. Bread, rice, water, coffee в этом значении обычно не считаем поштучно.",
      examples: ["I like rice.", "I don’t like eggs.", "Do you like coffee?"],
      pitfall:
        "Для общей любви к яблокам: I like apples, а не I like apple. Не добавляйте -s к rice.",
      pronunciation:
        "В like coffee выделяйте еду/напиток. В don’t like сохраните отрицание, чтобы смысл не превратился в противоположный.",
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
        "Спросите, учится ли собеседник каждый день.",
        "Do you study every day?",
        12,
      ],
      ["Дайте отрицательный короткий ответ.", "No, I don’t.", 12],
      ["Опишите завтрак по времени.", "I have breakfast at eight.", 10],
    ),
    practice: [
      gaps("food-likes", "Complete the preferences", [
        [
          "I ___ apples. (нравятся)",
          "like",
          "Положительное предпочтение: like.",
        ],
        [
          "I ___ like eggs. (не нравятся)",
          ["don’t", "don't"],
          "Отрицание: don’t like.",
        ],
        ["___ you like rice?", "Do", "Вопрос с you начинается с Do."],
        ["She ___ coffee. (like)", "likes", "После she: likes."],
      ]),
      match("food-words", "Match the food", [
        ["хлеб", "bread", "Bread — хлеб."],
        ["рис", "rice", "Rice — рис."],
        ["яблоки", "apples", "Apples — яблоки во множественном числе."],
      ]),
    ],
    speaking: {
      situation: "Составьте общий завтрак для себя и учителя.",
      steps: [
        "Спросите о трёх продуктах из списка.",
        "Сообщите два своих предпочтения.",
        "Выберите два продукта, которые нравятся обоим.",
        "Скажите, что исключаете из завтрака.",
      ],
      support: [
        "Do you like…?",
        "I like…",
        "I don’t like…",
        "Bread and apples for breakfast.",
      ],
      success: [
        "Спросил о предпочтениях.",
        "Выразил положительное и отрицательное отношение.",
        "Выбрал общий вариант.",
      ],
      model:
        "A: Do you like eggs?\nB: No, I don’t. I like bread.\nA: I like bread too. Bread and apples?",
      teacherNote:
        "Предпочтения могут быть вымышленными. Это языковое упражнение, а не рекомендация по питанию.",
    },
    writing: {
      instruction:
        "Напишите четыре строки: два продукта нравятся, два не нравятся. Добавьте вопрос учителю.",
      model:
        "I like apples. I like bread. I don’t like eggs. I don’t like coffee. Do you like rice?",
      checklist: [
        "Like/don’t like передают ваш смысл.",
        "Apples/eggs во множественном числе.",
        "Вопрос начинается с Do.",
      ],
    },
    exit: [
      "Я могу назвать шесть продуктов/напитков.",
      "Я могу сказать, что нравится.",
      "Я могу подобрать общий вариант еды.",
    ],
    homework: {
      instruction: "Составьте карточку предпочтений вымышленного гостя.",
      steps: [
        "Выберите три любимых и два нелюбимых продукта.",
        "Напишите предложения с he/she.",
        "Вернитесь к do/does из урока 12 и задайте два вопроса о госте.",
      ],
      model:
        "Eva likes bread. She doesn’t like rice. Does she like coffee? Yes, she does.",
    },
    teacherNotes: [
      "Не вводите всю систему исчисляемости сразу.",
      "Повторите переговорную задачу с новыми предпочтениями.",
    ],
  }),
  makeLesson({
    n: 14,
    title: "At the café",
    subtitle: "Делаем простой заказ",
    topic: "Кафе",
    skills: ["speaking", "listening", "vocabulary"],
    goal: "I can order a drink and a simple snack politely.",
    vocabulary: vocab(
      ["tea", "чай", "A tea, please."],
      ["sandwich", "сэндвич", "A sandwich, please."],
      ["menu", "меню", "The menu, please."],
      ["I’d like…", "Я бы хотел(а)…", "I’d like a coffee."],
      ["please", "пожалуйста", "Water, please."],
      ["Anything else?", "Что-нибудь ещё?", "Anything else? No, thank you."],
    ),
    language: {
      focus: "I’d like…; Can I have…?; polite short replies",
      explanation:
        "I’d like… и Can I have…? — готовые вежливые способы заказать. В кафе a coffee / a tea могут означать одну порцию напитка. Для завершения: That’s all, thank you.",
      examples: [
        "I’d like a sandwich, please.",
        "Can I have a tea?",
        "That’s all, thank you.",
      ],
      pitfall:
        "I like coffee выражает предпочтение вообще. Для текущего заказа используйте I’d like a coffee.",
      pronunciation:
        "В I’d like сохраняйте короткое /d/ перед like; учитель сравнивает I like и I’d like, чтобы ученик услышал разницу.",
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
          "Заказ: a tea.",
        ],
        [
          "What food does the customer order?",
          ["A sandwich", "Rice", "Eggs"],
          0,
          "Заказ: a sandwich.",
        ],
        ["How much is the tea?", ["£1", "£2", "£3"], 1, "В меню Tea — £2."],
      ],
    ),
    retrieval: recall(
      ["Скажите, что любите кофе.", "I like coffee.", 13],
      ["Спросите, нравится ли учителю хлеб.", "Do you like bread?", 13],
      ["Назовите число 5.", "Five.", 2],
    ),
    practice: [
      choice("order-phrases", "Choose the café phrase", [
        [
          "You want to order now.",
          ["I’d like a coffee, please.", "I coffee.", "I’m coffee."],
          0,
          "I’d like + заказ.",
        ],
        [
          "The server asks Anything else? You need nothing more.",
          ["Yes, I’m Ben.", "No, thank you.", "I’m from Poland."],
          1,
          "Вежливый отказ: No, thank you.",
        ],
        [
          "You want the menu.",
          ["The menu, please.", "Menu is my name.", "I menu."],
          0,
          "Краткая вежливая просьба.",
        ],
        [
          "Choose a polite order.",
          ["Give coffee!", "Can I have a tea, please?", "I tea now."],
          1,
          "Can I have… please? подходит для заказа.",
        ],
      ]),
      order("cafe-order", "Build an order", [
        [
          "I would like a sandwich, please.",
          "I would like — полная форма I’d like.",
        ],
        ["Can I have a coffee?", "Вопрос начинается с Can I have."],
        ["No, thank you.", "Вежливое завершение короткого ответа."],
      ]),
    ],
    speaking: {
      situation:
        "Учитель — сотрудник кафе. Вы заказываете по меню с бюджетом £8.",
      steps: [
        "Попросите меню.",
        "Выберите напиток и еду в пределах £8.",
        "Ответьте на Anything else?",
        "Во втором круге учитель сообщает, что один продукт закончился; выберите другой.",
      ],
      support: [
        "The menu, please.",
        "I’d like…",
        "Can I have…?",
        "That’s all, thank you.",
      ],
      success: [
        "Заказ понятен.",
        "Есть please/thank you.",
        "Выбран вариант из меню.",
      ],
      model:
        "A: Can I have a coffee and a sandwich, please?\nB: Anything else?\nA: No, thank you.",
      teacherNote:
        "После первой попытки дайте одну языковую поправку и повторите с другим заказом. Учитель может заменить sandwich на tea, если бюджета не хватает.",
    },
    writing: {
      instruction: "Напишите короткий заказ для передачи сотруднику кафе.",
      model:
        "Hello. I’d like a tea and a sandwich, please. That’s all, thank you.",
      checklist: [
        "Заказ отличается от общего предпочтения.",
        "Есть название напитка/еды.",
        "Просьба вежливая.",
      ],
    },
    exit: [
      "Я могу попросить меню.",
      "Я могу заказать напиток и еду.",
      "Я могу ответить на Anything else?",
    ],
    homework: {
      instruction:
        "Создайте своё меню из четырёх знакомых позиций и два заказа.",
      steps: [
        "Назначьте простые цены до 10.",
        "Напишите два разных заказа.",
        "Произнесите оба без текста через день.",
      ],
      model: "Tea £2; coffee £3. Can I have a tea, please?",
    },
    teacherNotes: [
      "Фразы заказа вводите как целые блоки, без сложного объяснения would.",
      "Аудирование проводит учитель по исходному тексту; готовая аудиозапись не предполагается.",
    ],
  }),
  makeLesson({
    n: 15,
    title: "How much is it?",
    subtitle: "Уточняем цену и выбираем покупку",
    topic: "Покупки",
    skills: ["listening", "spelling", "speaking"],
    goal: "I can ask a price and understand simple whole-number prices up to one hundred.",
    vocabulary: vocab(
      ["price", "цена", "What is the price?"],
      ["pounds", "фунты", "It is ten pounds."],
      ["cheap", "недорогой", "This bag is cheap."],
      ["expensive", "дорогой", "This phone is expensive."],
      ["thirty", "тридцать", "It is thirty pounds."],
      ["fifty", "пятьдесят", "The price is fifty pounds."],
    ),
    language: {
      focus: "How much is/are…?; numbers 20–100",
      explanation:
        "С одним предметом: How much is the bag? С несколькими: How much are the pens? Числа: twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred. Для составных чисел: twenty-one, thirty-five.",
      examples: [
        "How much is this bag?",
        "It is twenty pounds.",
        "How much are these pens?",
      ],
      pitfall:
        "Forty пишется без u; fifty — с fif-. Не путайте thirteen и thirty.",
      pronunciation:
        "Сравните thir-TEEN и THIR-ty. Сначала учитель диктует медленно, затем повторяет цену в полном предложении.",
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
          "£35 больше £20. Смысл сравнения понятен по ценам; форму more expensive заучивать не нужно.",
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
      ["Закажите чай.", "I’d like a tea, please.", 14],
      ["Ответьте, что больше ничего не нужно.", "No, thank you.", 14],
      ["Опишите синюю сумку.", "It is a blue bag.", 7],
    ),
    practice: [
      gaps("price-spelling", "Write the prices in words", [
        ["30 = ___", "thirty", "Thirty: t-h-i-r-t-y."],
        ["40 = ___", "forty", "Forty без u."],
        ["50 = ___", "fifty", "Fifty начинается с fif-."],
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
          "Одна сумка: is.",
        ],
        [
          "Three pens:",
          [
            "How much is these pens?",
            "How much are these pens?",
            "What name are the pens?",
          ],
          1,
          "Множественное число: are.",
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
      situation: "У вас £40. Нужно выбрать сумку и оставить деньги на ручки.",
      steps: [
        "Уточните цену двух сумок и трёх ручек.",
        "Выберите подходящий набор.",
        "Повторите общую цену словами.",
        "Попросите учителя повторить одну цену для проверки.",
      ],
      support: [
        "How much is…?",
        "How much are…?",
        "Twenty pounds.",
        "Again, please.",
      ],
      success: [
        "Спросил цены.",
        "Различил десятки.",
        "Выбрал покупку в пределах бюджета.",
      ],
      model:
        "The blue bag is twenty pounds. The pens are ten pounds. Thirty pounds. The blue bag, please.",
      teacherNote:
        "Задача проверяет передачу цены; при необходимости разрешите записывать цифры и считать на бумаге.",
    },
    writing: {
      instruction:
        "Составьте три ценника цифрами и словами; напишите вопрос к одному из них.",
      model:
        "Bag: £20 — twenty pounds.\nPhone: £90 — ninety pounds.\nPens: £10 — ten pounds.\nHow much is the bag?",
      checklist: [
        "Число словами совпадает с цифрами.",
        "Forty/fifty написаны верно, если использованы.",
        "В вопросе согласованы is/are.",
      ],
    },
    exit: [
      "Я могу спросить цену.",
      "Я понимаю знакомые десятки до 100.",
      "Я могу повторить цену для проверки.",
    ],
    homework: {
      instruction: "Создайте пять ценников для домашнего магазина.",
      steps: [
        "Используйте три круглых десятка и две составные цены.",
        "Закройте слова и прочитайте цифры вслух.",
        "Повторите различие thirteen/thirty с учителем.",
      ],
      model: "£40 — forty pounds; £25 — twenty-five pounds.",
    },
    teacherNotes: [
      "Не требуйте сложных денежных дробей; они не нужны для этой цели.",
      "Для аудирования меняйте порядок ценников, чтобы ученик действительно слушал.",
    ],
  }),
];

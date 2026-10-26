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
    subtitle: "Обсуждаем погоду и выбираем занятие",
    topic: "Погода",
    skills: ["vocabulary", "speaking", "listening"],
    goal: "I can describe familiar weather and choose a suitable everyday activity.",
    vocabulary: vocab(
      ["sunny", "солнечно", "It is sunny."],
      ["rainy", "дождливо", "It is rainy today."],
      ["cold", "холодно", "It is cold."],
      ["warm", "тепло", "It is warm in May."],
      ["windy", "ветрено", "It is windy."],
      ["snowing", "идёт снег", "It is snowing now."],
    ),
    language: {
      focus: "It is + weather adjective; It is raining/snowing",
      explanation:
        "В описании погоды нужно it: It is cold. Для процесса сейчас: It is raining/snowing. Spring, summer, autumn, winter — времена года; перед ними обычно in.",
      examples: [
        "It is sunny today.",
        "It is raining now.",
        "It is cold in winter.",
      ],
      pitfall:
        "Не пропускайте it: Is cold → It is cold. Snowing описывает процесс, cold — состояние погоды.",
      pronunciation:
        "В weather начальный звук /w/, а th звучит /ð/. Учитель показывает, как губы округляются в /w/; ученик повторяет whole phrase: What’s the weather like?",
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
          "Eva пишет sunny and warm.",
        ],
        [
          "Where is Ben?",
          ["In the park", "At home", "At the station"],
          1,
          "Ben пишет I am at home.",
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
      ["Скажите, что читаете сейчас.", "I am reading now.", 20],
      ["Скажите, что парк рядом с домом.", "The park is near my home.", 16],
      ["Назовите любимый цвет.", "My favourite colour is green.", 7],
    ),
    practice: [
      match("weather-meaning", "Match the weather", [
        ["солнечно", "sunny", "Sunny — солнечно."],
        ["ветрено", "windy", "Windy — ветрено."],
        ["холодно", "cold", "Cold — холодно."],
      ]),
      gaps("weather-forms", "Complete the weather report", [
        ["___ is warm today.", "It", "Для погоды нужно формальное it."],
        ["It ___ snowing now.", "is", "Процесс сейчас: is snowing."],
        ["It is cold ___ winter.", "in", "Перед временем года: in."],
        ["It is ___. (идёт дождь)", "raining", "Raining — идёт дождь."],
      ]),
    ],
    speaking: {
      situation:
        "Вы выбираете, где провести короткую встречу: в парке или в кафе.",
      steps: [
        "Учитель описывает погоду в двух местах.",
        "Уточните один факт.",
        "Выберите место и простое занятие.",
        "Во втором круге погода меняется; измените план.",
      ],
      support: [
        "What’s the weather like?",
        "It is…",
        "The café, please.",
        "I am reading / walking.",
      ],
      success: [
        "Описал погоду с it is.",
        "Понял описание учителя.",
        "Выбрал подходящее место.",
      ],
      model: "It is cold and rainy. The café is good. It is warm in the café.",
      teacherNote:
        "Не требуйте сложного прогноза и будущего времени. Достаточно текущей погоды и короткого выбора.",
    },
    writing: {
      instruction:
        "Напишите сообщение из трёх предложений о погоде, месте и действии.",
      model: "It is sunny today. I am in the park. I am reading a book.",
      checklist: [
        "В погодном предложении есть it.",
        "Действие сейчас с be + -ing.",
        "Место названо понятно.",
      ],
    },
    exit: [
      "Я могу назвать три типа погоды.",
      "Я могу понять короткое сообщение о погоде.",
      "Я могу выбрать простое занятие по ситуации.",
    ],
    homework: {
      instruction: "Сделайте три вымышленные погодные карточки.",
      steps: [
        "На каждой укажите погоду и место.",
        "Добавьте одно действие человека.",
        "Завтра опишите карточки по ключевым словам, не читая предложений.",
      ],
      model: "Cold, snowy, home → It is cold. It is snowing. I am at home.",
    },
    teacherNotes: [
      "Не используйте актуальный прогноз: все ситуации учебные.",
      "Для развития аудирования меняйте только один признак погоды за раз.",
    ],
  }),
  makeLesson({
    n: 22,
    title: "How do you feel?",
    subtitle: "Называем самочувствие и простую потребность",
    topic: "Самочувствие",
    skills: ["vocabulary", "speaking", "listening"],
    goal: "I can say how I feel and ask for a simple thing I need.",
    vocabulary: vocab(
      ["tired", "уставший", "I am tired."],
      ["hungry", "голодный", "I am hungry."],
      ["thirsty", "испытывающий жажду", "I am thirsty."],
      ["happy", "счастливый / радостный", "She is happy."],
      ["cold", "замёрзший / холодно", "I am cold."],
      ["a headache", "головная боль", "I have a headache."],
    ),
    language: {
      focus: "I am + feeling; I have a…; Can I have…?",
      explanation:
        "Tired, hungry, thirsty, happy и cold сочетаются с be. В устойчивой фразе a headache используем have: I have a headache. Затем можно выразить простую потребность: Can I have some water?",
      examples: [
        "I am thirsty.",
        "I have a headache.",
        "Can I have some water, please?",
      ],
      pitfall:
        "I have hungry → I am hungry. Headache: I have a headache, не I am a headache.",
      pronunciation:
        "В hungry и happy выделяйте первый слог. В thirsty учитель показывает /θ/: воздух проходит между языком и зубами, без голоса.",
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
          "Первый ответ: tired and thirsty.",
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
      ["Скажите, что холодно на улице.", "It is cold.", 21],
      ["Вежливо попросите воду.", "Water, please.", 14],
      ["Скажите, где сумка.", "It is under the table.", 9],
    ),
    practice: [
      gaps("feelings", "Choose am or have", [
        ["I ___ tired.", "am", "Tired сочетается с be."],
        ["I ___ a headache.", "have", "Устойчивая фраза: have a headache."],
        ["I ___ hungry.", "am", "Hungry — состояние с be."],
        ["I ___ thirsty.", "am", "Thirsty — состояние с be."],
      ]),
      match("needs", "Match the feeling and the request", [
        [
          "I am thirsty.",
          "Water, please.",
          "Для языковой ситуации жажда связана с просьбой о воде.",
        ],
        [
          "I am hungry.",
          "A sandwich, please.",
          "Hungry — голодный; просьба о еде.",
        ],
        [
          "I am tired.",
          "A short break, please.",
          "Tired — уставший; просьба о перерыве.",
        ],
      ]),
    ],
    speaking: {
      situation: "На занятии вам нужен короткий перерыв или простая вещь.",
      steps: [
        "Выберите вымышленное самочувствие.",
        "Сообщите его учителю.",
        "Попросите воду, еду или перерыв.",
        "Учитель уточняет просьбу; подтвердите или исправьте.",
      ],
      support: [
        "I am…",
        "I have a…",
        "Can I have…?",
        "Yes, please. / No, thank you.",
      ],
      success: [
        "Правильно назвал состояние.",
        "Выразил конкретную просьбу.",
        "Ответил на уточнение.",
      ],
      model:
        "I am thirsty. Can I have some water, please? Yes, water. Thank you.",
      teacherNote:
        "Это языковая ролевая ситуация. Не просите реальные медицинские подробности и не обсуждайте лечение или лекарства.",
    },
    writing: {
      instruction: "Напишите два коротких сообщения о состоянии и просьбе.",
      model:
        "I am tired. A short break, please.\nI am thirsty. Can I have some water?",
      checklist: [
        "Для hungry/tired используется be.",
        "Для headache используется have.",
        "Просьба вежливая.",
      ],
    },
    exit: [
      "Я могу сказать, как чувствую себя в простой ситуации.",
      "Я могу попросить перерыв или воду.",
      "Я различаю am и have в знакомых фразах.",
    ],
    homework: {
      instruction: "Создайте три пары «состояние — просьба».",
      steps: [
        "Используйте вымышленные ситуации.",
        "Сначала назовите состояние по памяти.",
        "Затем добавьте подходящую просьбу.",
      ],
      model: "Hungry → I am hungry. Can I have a sandwich, please?",
    },
    teacherNotes: [
      "Заменяйте неудобные темы нейтральными happy/tired/thirsty по выбору ученика.",
      "При проверке оцените понятность просьбы, затем форму be/have.",
    ],
  }),
  makeLesson({
    n: 23,
    title: "Clothes that fit",
    subtitle: "Просим одежду нужного цвета и размера",
    topic: "Одежда и покупки",
    skills: ["vocabulary", "speaking", "grammar"],
    goal: "I can ask for a familiar item of clothing in a colour and size.",
    vocabulary: vocab(
      ["T-shirt", "футболка", "A blue T-shirt, please."],
      ["jacket", "куртка", "This jacket is black."],
      ["shoes", "обувь / туфли", "These shoes are white."],
      ["small", "маленький размер", "A small T-shirt."],
      ["medium", "средний размер", "Medium, please."],
      ["large", "большой размер", "Have you got a large jacket?"],
    ),
    language: {
      focus: "this/these; size + colour + noun; requests",
      explanation:
        "This относится к одному предмету, these — к нескольким. Для заказа: a medium blue T-shirt. Вопрос Can I try it on? означает просьбу примерить; его можно использовать как готовую фразу.",
      examples: [
        "This jacket is black.",
        "These shoes are white.",
        "Can I have a medium blue T-shirt?",
      ],
      pitfall:
        "These shoe → These shoes. Размер и цвет стоят перед названием вещи.",
      pronunciation:
        "В T-shirt буква T звучит как название /tiː/, затем shirt. Shoes начинается с /ʃ/; сравните с обычным /s/.",
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
          "Первый запрос: a blue T-shirt.",
        ],
        ["Which size?", ["Small", "Large", "Medium"], 2, "Medium, please."],
        ["How much is it?", ["£12", "£20", "£30"], 1, "Twenty pounds."],
      ],
    ),
    retrieval: recall(
      ["Спросите цену.", "How much is it?", 15],
      ["Назовите синий цвет.", "Blue.", 7],
      ["Скажите, что сегодня холодно.", "It is cold today.", 21],
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
          "Множественное число: these shoes are.",
        ],
        [
          "A correct request:",
          [
            "A blue medium T-shirt.",
            "A medium blue T-shirt, please.",
            "A T-shirt medium blue.",
          ],
          1,
          "Размер, затем цвет, затем вещь.",
        ],
        [
          "You want to put it on before buying.",
          [
            "Can I try it on?",
            "What is your name?",
            "Do you work here every day?",
          ],
          0,
          "Try it on — примерить.",
        ],
        [
          "One jacket:",
          ["This jacket", "These jacket", "This jackets"],
          0,
          "This + один предмет.",
        ],
      ]),
      gaps("clothes-spelling", "Complete the words", [
        ["A blue T-___", "shirt", "T-shirt пишется через дефис."],
        ["S, M, L: small, ___, large", "medium", "M = medium."],
        [
          "These ___ are black. (обувь)",
          "shoes",
          "Shoes — множественное число.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Учитель — продавец. Вам нужна футболка определённого цвета и размера.",
      steps: [
        "Выберите цвет и размер, не показывая запись учителю.",
        "Попросите вещь и узнайте цену.",
        "Учитель предлагает один неверный параметр.",
        "Уточните нужный вариант и попросите примерить.",
      ],
      support: [
        "A … T-shirt, please.",
        "Medium, please.",
        "No, blue, please.",
        "Can I try it on?",
      ],
      success: [
        "Назвал вещь, размер и цвет.",
        "Уточнил ошибочный вариант.",
        "Понял цену.",
      ],
      model: "A medium green T-shirt, please. How much is it? Can I try it on?",
      teacherNote:
        "Не обсуждайте размеры тела ученика. Используйте персонажа и условные S/M/L.",
    },
    writing: {
      instruction: "Напишите сообщение в магазин с просьбой отложить две вещи.",
      model:
        "Hello. A medium blue T-shirt and a large black jacket, please. How much are they?",
      checklist: [
        "Размер и цвет стоят перед вещью.",
        "This/these согласованы, если использованы.",
        "Запрос понятен без картинки.",
      ],
    },
    exit: [
      "Я могу назвать знакомые вещи одежды.",
      "Я могу уточнить размер и цвет.",
      "Я могу попросить примерить.",
    ],
    homework: {
      instruction: "Сделайте три карточки заказа одежды.",
      steps: [
        "Меняйте цвет и размер.",
        "Прочитайте каждую как покупатель.",
        "Через день ответьте на Small, medium or large? без подсказки.",
      ],
      model: "A small white T-shirt. A large green jacket.",
    },
    teacherNotes: [
      "Повторяйте цену и просьбы из уроков 14–15.",
      "Принимаются нейтральные варианты просьб Can I have… и I’d like….",
    ],
  }),
  makeLesson({
    n: 24,
    title: "A ticket, please",
    subtitle: "Покупаем билет и уточняем время",
    topic: "Путешествия",
    skills: ["listening", "reading", "speaking"],
    goal: "I can ask for a simple ticket and check a departure time and price.",
    vocabulary: vocab(
      ["ticket", "билет", "A ticket to York, please."],
      ["train", "поезд", "The train is at nine."],
      ["bus", "автобус", "The bus is at ten."],
      ["single", "в одну сторону", "A single ticket, please."],
      ["return", "туда и обратно", "A return ticket, please."],
      ["platform", "платформа", "Platform two."],
    ),
    language: {
      focus: "a ticket to…; What time…?; short travel questions",
      explanation:
        "Направление поездки: to York. Для простого запроса: A single ticket to York, please. Уточняйте время, цену и платформу отдельными короткими вопросами.",
      examples: [
        "A ticket to York, please.",
        "What time is the train?",
        "Which platform?",
      ],
      pitfall:
        "В направлении используйте to, а не from: a ticket to York. From — откуда отправляетесь.",
      pronunciation:
        "В ticket ударение на первом слоге. Диктуйте время целиком: nine thirty; повторите ключевую информацию для проверки.",
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
          "В таблице и реплике указано platform 2.",
        ],
      ],
    ),
    retrieval: recall(
      ["Прочитайте цену £15.", "Fifteen pounds.", 15],
      ["Спросите, где вокзал.", "Where is the station?", 17],
      ["Прочитайте 9:30.", "Half past nine. / Nine thirty.", 10],
    ),
    practice: [
      gaps("ticket-phrases", "Complete the request", [
        ["A ticket ___ York, please.", "to", "To указывает направление."],
        ["What ___ is the train?", "time", "What time — во сколько."],
        [
          "A ___ ticket, please. (в одну сторону)",
          "single",
          "Single — в одну сторону.",
        ],
        ["Which ___? (платформа)", "platform", "Platform — платформа."],
      ]),
      choice("travel-details", "Check the details", [
        [
          "The 10:00 train costs…",
          ["£15", "£20", "£10"],
          1,
          "В расписании 10:00 — £20.",
        ],
        [
          "A return ticket is…",
          ["only one way", "there and back", "a bus stop"],
          1,
          "Return = туда и обратно.",
        ],
        [
          "To check a time, say…",
          ["Nine thirty?", "How old are you?", "It is blue."],
          0,
          "Повтор времени — простая стратегия уточнения.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Учитель продаёт билет по расписанию, которого ученик сначала не видит.",
      steps: [
        "Попросите билет в York.",
        "Уточните время, цену и платформу.",
        "Повторите три детали для проверки.",
        "Выберите другой поезд, если предложенное время не подходит.",
      ],
      support: [
        "A single ticket to…, please.",
        "What time is the train?",
        "How much is it?",
        "Platform two?",
      ],
      success: [
        "Назвал направление.",
        "Уточнил время и цену.",
        "Проверил платформу повтором.",
      ],
      model:
        "A ticket to York, please. What time is the train? Nine thirty? How much is it? Platform two? Thank you.",
      teacherNote:
        "Не вводите сложные тарифы и реальные поездки. Для A1 достаточно одного маршрута и двух отправлений.",
    },
    writing: {
      instruction:
        "Запишите билет-памятку: destination, time, price, platform.",
      model: "To: York\nTime: 9:30\nPrice: £15\nPlatform: 2",
      checklist: [
        "Четыре детали не перепутаны.",
        "Цифры сверены с расписанием.",
        "Название города написано с большой буквы.",
      ],
    },
    exit: [
      "Я могу попросить простой билет.",
      "Я могу понять время и цену.",
      "Я могу уточнить платформу.",
    ],
    homework: {
      instruction:
        "Составьте вымышленное расписание из двух отправлений и запрос к кассиру.",
      steps: [
        "Запишите времена, цены и платформы.",
        "Выберите поезд и проговорите запрос.",
        "Завтра восстановите четыре детали по памяти.",
      ],
      model: "A single ticket to Leeds, please. Ten o’clock? Twenty pounds?",
    },
    teacherNotes: [
      "Фразы могут быть освоены как готовые блоки до полного разбора всех вопросительных слов.",
      "Варианты half past nine и nine thirty равно допустимы.",
    ],
  }),
  makeLesson({
    n: 25,
    title: "Free time and hobbies",
    subtitle: "Находим общее увлечение",
    topic: "Свободное время",
    skills: ["speaking", "vocabulary", "grammar"],
    goal: "I can talk about a few hobbies and find a shared interest.",
    vocabulary: vocab(
      ["reading", "чтение", "I like reading."],
      ["walking", "прогулки", "She likes walking."],
      ["listening to music", "слушать музыку", "I like listening to music."],
      ["playing football", "играть в футбол", "He likes playing football."],
      ["watching films", "смотреть фильмы", "I like watching films."],
      ["free time", "свободное время", "What do you do in your free time?"],
    ),
    language: {
      focus: "like + -ing; Do you like…?",
      explanation:
        "Когда называем любимое занятие после like, удобно использовать -ing: I like reading. Это не present continuous: здесь нет am/is/are. Для вопроса: Do you like walking?",
      examples: [
        "I like reading.",
        "She likes watching films.",
        "Do you like listening to music?",
      ],
      pitfall:
        "I am like reading → I like reading. Не путайте любимое занятие с I am reading now.",
      pronunciation:
        "В listening буква t не произносится. Учитель сравнивает listen и listening; ученик повторяет всю фразу listening to music.",
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
          "Обе любят walking.",
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
          "Последняя строка: On Sunday.",
        ],
      ],
    ),
    retrieval: recall(
      ["Скажите, что читаете прямо сейчас.", "I am reading now.", 20],
      ["Спросите о предпочтении в еде.", "Do you like apples?", 13],
      ["Скажите, что умеете плавать.", "I can swim.", 18],
    ),
    practice: [
      gaps("hobby-forms", "Complete the hobby", [
        [
          "I like ___. (read)",
          "reading",
          "После like называем занятие с -ing.",
        ],
        ["She ___ walking.", "likes", "После she: likes."],
        [
          "I like listening ___ music.",
          "to",
          "Устойчивое сочетание listen to music.",
        ],
        ["___ you like watching films?", "Do", "Вопрос с you: Do you like…?"],
      ]),
      choice("hobby-or-now", "Choose the meaning", [
        [
          "A hobby:",
          ["I like reading.", "I am reading now.", "I have a book now."],
          0,
          "Like reading выражает предпочтение.",
        ],
        [
          "An action right now:",
          [
            "He likes football.",
            "He is playing football.",
            "He can play football.",
          ],
          1,
          "Is playing — процесс сейчас.",
        ],
        [
          "Correct music phrase:",
          ["listening music", "listen music", "listening to music"],
          2,
          "После listen нужно to.",
        ],
      ]),
    ],
    speaking: {
      situation: "Найдите занятие, которое понравится вам и учителю.",
      steps: [
        "Задайте три вопроса Do you like…?",
        "Назовите свои интересы.",
        "Выберите одно общее занятие.",
        "Уточните день и простое место для него.",
      ],
      support: ["Do you like…?", "I like… too.", "On Sunday?", "In the park?"],
      success: [
        "Спросил о трёх занятиях.",
        "Различил интерес и действие сейчас.",
        "Нашёл общее увлечение.",
      ],
      model:
        "A: Do you like walking?\nB: Yes, I do.\nA: I like walking too. In the park on Sunday?\nB: Yes.",
      teacherNote:
        "Цель — реальный общий выбор; если интересы не совпали, пусть персонажи выберут нейтральную альтернативу.",
    },
    writing: {
      instruction:
        "Напишите профиль увлечений: два любимых занятия, одно нелюбимое и вопрос.",
      model:
        "I like reading and walking. I don’t like playing football. Do you like watching films?",
      checklist: [
        "После like занятие с -ing.",
        "У listening есть to.",
        "Вопрос сформулирован с Do.",
      ],
    },
    exit: [
      "Я могу назвать несколько увлечений.",
      "Я могу спросить об интересах.",
      "Я могу найти общее занятие.",
    ],
    homework: {
      instruction: "Сделайте карточку «Хобби для нового знакомого».",
      steps: [
        "Укажите три интереса персонажа.",
        "Добавьте один вопрос для знакомства.",
        "Через день расскажите о персонаже с he/she.",
      ],
      model:
        "She likes reading. She likes listening to music. Does she like walking?",
    },
    teacherNotes: [
      "Не требуйте участия в реальном мероприятии.",
      "Возвращайте изученные формы вопросов, времени и места.",
    ],
  }),
];

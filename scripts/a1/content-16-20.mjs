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
    subtitle: "Рассказываем, что есть рядом",
    topic: "Город",
    skills: ["vocabulary", "reading", "grammar"],
    goal: "I can name common places and say what there is near my home.",
    vocabulary: vocab(
      ["supermarket", "супермаркет", "There is a supermarket."],
      ["bank", "банк", "The bank is near the café."],
      ["park", "парк", "There is a park."],
      ["station", "станция / вокзал", "The station is big."],
      ["pharmacy", "аптека", "There is a pharmacy."],
      ["near", "рядом / недалеко от", "The park is near my home."],
    ),
    language: {
      focus: "There is / isn’t; Is there…?; near",
      explanation:
        "Чтобы узнать о наличии места, спросите Is there a…? Ответ: Yes, there is / No, there isn’t. Near my home означает «рядом с моим домом».",
      examples: [
        "Is there a park?",
        "Yes, there is.",
        "There isn’t a bank near my home.",
      ],
      pitfall:
        "В вопросе is стоит перед there: Is there a café? В ответе не заменяйте there на it.",
      pronunciation:
        "В pharmacy начальный ph звучит /f/. В station сочетание -tion звучит /ʃən/; повторите за учителем.",
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
          "Supermarket находится near the station.",
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
      ["Спросите цену сумки.", "How much is the bag?", 15],
      ["Скажите, что есть кухня.", "There is a kitchen.", 8],
      ["Назовите предлог «рядом с».", "Next to.", 9],
    ),
    practice: [
      gaps("town-questions", "Complete the town guide", [
        ["___ there a park?", "Is", "В вопросе is стоит перед there."],
        ["Yes, there ___.", "is", "Короткий ответ: Yes, there is."],
        [
          "There ___ a bank. (нет)",
          ["isn’t", "isn't"],
          "Отрицание: there isn’t.",
        ],
        [
          "The café is ___ my home. (недалеко от)",
          "near",
          "Near = недалеко от.",
        ],
      ]),
      match("town-places", "Choose the place", [
        [
          "You buy food here.",
          "supermarket",
          "Продукты покупают в supermarket.",
        ],
        ["You wait for a train here.", "station", "Поезд ожидают на station."],
        ["You can walk among trees here.", "park", "Парк — park."],
      ]),
    ],
    speaking: {
      situation:
        "Учитель выбирает место для короткого визита в ваш вымышленный район.",
      steps: [
        "Назовите три места в районе.",
        "Ответьте на два вопроса Is there…?",
        "Объясните расположение одного места.",
        "Уточните, что важно учителю: кафе, парк или магазин.",
      ],
      support: ["There is a…", "There isn’t a…", "Is there a…?", "It is near…"],
      success: [
        "Назвал три места.",
        "Ответил на вопрос о наличии.",
        "Дал понятный ориентир.",
      ],
      model:
        "There is a park near my home. There is a café next to the park. There isn’t a station.",
      teacherNote:
        "Дайте ученику возможность выбрать вымышленный район, не обсуждая точный адрес.",
    },
    writing: {
      instruction: "Напишите мини-гид по улице: три места есть, одного нет.",
      model:
        "There is a bank. There is a park near the bank. There is a café. There isn’t a station.",
      checklist: [
        "Использовано there is.",
        "Есть одно отрицание.",
        "Есть один ориентир с near/next to.",
      ],
    },
    exit: [
      "Я могу назвать места в городе.",
      "Я могу спросить, есть ли место рядом.",
      "Я могу дать простой ориентир.",
    ],
    homework: {
      instruction:
        "Нарисуйте улицу с пятью местами и придумайте три вопроса о ней.",
      steps: [
        "Подпишите места по-английски.",
        "Составьте Is there…? вопросы.",
        "На следующем уроке дайте учителю заполнить пустой план по ответам.",
      ],
      model: "Is there a park near the station? Yes, there is.",
    },
    teacherNotes: [
      "Повторяйте предлоги из урока 9.",
      "При новой лексике сначала проверьте смысл, затем написание.",
    ],
  }),
  makeLesson({
    n: 17,
    title: "Turn left at the café",
    subtitle: "Спрашиваем дорогу и следуем короткому маршруту",
    topic: "Ориентирование",
    skills: ["listening", "speaking", "vocabulary"],
    goal: "I can ask where a place is and follow a few simple directions with help.",
    vocabulary: vocab(
      ["turn left", "поверните налево", "Turn left at the café."],
      ["turn right", "поверните направо", "Turn right at the bank."],
      ["go straight", "идите прямо", "Go straight."],
      ["stop", "остановитесь", "Stop at the station."],
      ["opposite", "напротив", "The park is opposite the bank."],
      ["Excuse me", "Извините / простите", "Excuse me. Where is the station?"],
    ),
    language: {
      focus: "imperatives; Where is…?; at + landmark",
      explanation:
        "Для короткой инструкции начинайте с глагола: Go straight. Turn left. Место поворота обозначаем at the bank/café. Перед вопросом незнакомому человеку уместно Excuse me.",
      examples: [
        "Excuse me. Where is the park?",
        "Go straight. Turn right at the bank.",
        "The station is on your left.",
      ],
      pitfall:
        "Для инструкции не требуется you are: You are turn left → Turn left.",
      pronunciation:
        "Left и right должны различаться на слух. Учитель даёт один шаг за раз; ученик показывает направление рукой.",
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
          "Вопрос: Where is the station?",
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
          "Station is opposite the park.",
        ],
      ],
    ),
    retrieval: recall(
      ["Спросите, есть ли рядом парк.", "Is there a park?", 16],
      ["Назовите аптеку.", "A pharmacy.", 16],
      ["Скажите «за банком».", "Behind the bank.", 9],
    ),
    practice: [
      match("directions", "Match the direction", [
        ["налево", "left", "Left — налево."],
        ["направо", "right", "Right — направо."],
        ["прямо", "straight", "Straight — прямо."],
      ]),
      gaps("route", "Complete the route", [
        ["___ straight.", "Go", "Инструкция начинается с Go."],
        ["Turn left ___ the café.", "at", "Ориентир поворота: at."],
        [
          "___ me. Where is the park?",
          "Excuse",
          "Вежливое обращение: Excuse me.",
        ],
        [
          "The bank is ___ the park. (напротив)",
          "opposite",
          "Opposite = напротив.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Учитель и ученик смотрят на разные версии простого плана улицы.",
      steps: [
        "На бумаге нарисуйте перекрёсток и три места.",
        "Спросите учителя о пути к одному месту.",
        "Повторите один шаг для проверки.",
        "Поменяйтесь ролями и дайте маршрут из двух шагов.",
      ],
      support: [
        "Excuse me. Where is…?",
        "Go straight.",
        "Turn left/right at…",
        "Left at the café?",
      ],
      success: [
        "Вопрос понятен.",
        "Маршрут содержит два шага.",
        "Ученик уточнил непонятный поворот.",
      ],
      model: "Go straight. Turn right at the bank. The café is on your left.",
      teacherNote:
        "Маршрут должен соответствовать нарисованному плану; свободные ответы нельзя сверять с единственным текстовым ключом.",
    },
    writing: {
      instruction:
        "Напишите маршрут из трёх коротких инструкций по своему плану.",
      model: "Go straight. Turn left at the bank. Stop at the café.",
      checklist: [
        "Инструкции начинаются с глагола.",
        "Лево/право соответствуют плану.",
        "Назван ориентир поворота.",
      ],
    },
    exit: [
      "Я различаю left и right.",
      "Я могу спросить дорогу.",
      "Я могу повторить шаг для уточнения.",
    ],
    homework: {
      instruction: "Подготовьте маршрут к двум местам на вымышленной карте.",
      steps: [
        "Нарисуйте карту с одним перекрёстком.",
        "Напишите два маршрута.",
        "Завтра восстановите инструкции по карте, не читая текст.",
      ],
      model: "Turn right at the park. Go straight. The bank is on your left.",
    },
    teacherNotes: [
      "Для A1 достаточно 2–3 шагов, медленной речи и возможности повторения.",
      "Не используйте это упражнение как настоящую навигацию по незнакомому городу.",
    ],
  }),
  makeLesson({
    n: 18,
    title: "What can you do?",
    subtitle: "Рассказываем об умениях и просим помощи",
    topic: "Умения",
    skills: ["grammar", "speaking", "pronunciation"],
    goal: "I can say what I can do and ask for simple help.",
    vocabulary: vocab(
      ["swim", "плавать", "I can swim."],
      ["cook", "готовить", "Can you cook?"],
      ["drive", "водить машину", "She can drive."],
      ["dance", "танцевать", "I can’t dance."],
      ["help", "помогать", "Can you help me?"],
      ["use a computer", "пользоваться компьютером", "He can use a computer."],
    ),
    language: {
      focus: "can / can’t + verb; Can you…?",
      explanation:
        "Can не меняется после he/she. Следующий глагол без to: She can swim. Вопрос: Can you cook? Просьба Can you help me? использует ту же форму.",
      examples: ["I can cook.", "She can’t drive.", "Can you help me?"],
      pitfall: "She cans swim и can to swim неверны. Нужно She can swim.",
      pronunciation:
        "В утвердительной фразе can часто слабое /kən/. В can’t отрицание должно быть слышно; допустимы британская и американская модели учителя.",
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
      ["Дайте инструкцию повернуть налево.", "Turn left.", 17],
      ["Вежливо обратитесь к прохожему.", "Excuse me.", 17],
      ["Задайте вопрос о привычке.", "Do you study every day?", 12],
    ),
    practice: [
      gaps("can-forms", "Complete the abilities", [
        ["She ___ swim. (умеет)", "can", "Can одинаково для всех лиц."],
        [
          "He can ___ a car. (водить)",
          "drive",
          "После can — начальная форма глагола.",
        ],
        ["___ you cook?", "Can", "В вопросе Can ставится перед you."],
        ["I ___ dance. (не умею)", ["can’t", "can't"], "Отрицание: can’t."],
      ]),
      choice("can-help", "Choose the correct phrase", [
        [
          "A correct sentence:",
          ["She cans cook.", "She can to cook.", "She can cook."],
          2,
          "Can без -s; следующий глагол без to.",
        ],
        [
          "You need help.",
          ["Can you help me, please?", "I am help me.", "Help is you?"],
          0,
          "Can you help me, please? — вежливая просьба.",
        ],
        [
          "Can Ben drive? Positive answer:",
          ["Yes, he does.", "Yes, he can.", "Yes, he is."],
          1,
          "В ответе повторяем can.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Для небольшого мероприятия нужны люди, которые готовят, водят машину и работают с компьютером.",
      steps: [
        "Спросите учителя о трёх умениях его персонажа.",
        "Назовите два своих или вымышленных умения.",
        "Распределите две задачи.",
        "Попросите помощь в одной задаче.",
      ],
      support: ["Can you…?", "Yes, I can.", "No, I can’t.", "Can you help me?"],
      success: [
        "Задал вопросы can.",
        "Выразил умение и отсутствие умения.",
        "Договорился о помощи.",
      ],
      model:
        "A: Can you cook?\nB: Yes, I can. Can you drive?\nA: No, I can’t. Can you help me?\nB: Yes.",
      teacherNote:
        "Смените сведения о персонажах перед повторной попыткой, чтобы задача оставалась смысловой.",
    },
    writing: {
      instruction:
        "Составьте профиль умений персонажа из четырёх предложений и просьбы.",
      model:
        "Mia can swim. She can cook. She can’t drive. She can use a computer. Can you help her?",
      checklist: [
        "Can без окончания -s.",
        "После can нет to.",
        "Can’t выражает отрицание.",
      ],
    },
    exit: [
      "Я могу назвать три умения.",
      "Я могу спросить об умении.",
      "Я могу попросить помощь.",
    ],
    homework: {
      instruction: "Сделайте две карточки персонажей с разными умениями.",
      steps: [
        "Для каждого укажите два can и одно can’t.",
        "Придумайте одну общую задачу.",
        "Завтра решите, кому она подойдёт, объясняя короткими фразами.",
      ],
      model: "Tom can cook. Eva can drive. Tom can’t drive.",
    },
    teacherNotes: [
      "Не делайте выводов о способностях человека по акценту или скорости ответа.",
      "Цель — понятная передача can/can’t в контексте.",
    ],
  }),
  makeLesson({
    n: 19,
    title: "People and their things",
    subtitle: "Описываем людей и то, что у них есть",
    topic: "Люди и внешность",
    skills: ["grammar", "vocabulary", "reading"],
    goal: "I can describe a person with a few simple details and say what they have.",
    vocabulary: vocab(
      ["tall", "высокий", "Ben is tall."],
      ["short", "короткий / невысокий", "She has short hair."],
      ["long hair", "длинные волосы", "Eva has long hair."],
      ["glasses", "очки", "He has glasses."],
      ["brown", "коричневый / каштановый", "She has brown hair."],
      ["has got", "у него/неё есть", "Mia has got a blue bag."],
    ),
    language: {
      focus: "have got / has got; be + adjective",
      explanation:
        "Для наличия: I/you have got, he/she has got. Для качества: He is tall. Hair обычно используется без -s: long hair. Можно также сказать She has long hair без got.",
      examples: [
        "I have got glasses.",
        "She has got brown hair.",
        "He is tall.",
      ],
      pitfall:
        "She is long hair → She has got long hair. Is описывает качество, has got — наличие.",
      pronunciation:
        "В glasses два слога. В brown и short выделите гласный звук по модели учителя, не добавляя конечную гласную после согласного.",
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
          "Her bag is blue относится к Eva.",
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
      ["Скажите, что она умеет плавать.", "She can swim.", 18],
      ["Опишите синюю сумку.", "It is a blue bag.", 7],
      ["Назовите притяжательное слово «её».", "Her.", 5],
    ),
    practice: [
      gaps("have-got", "Complete the descriptions", [
        ["I ___ got glasses.", "have", "С I: have got."],
        ["She ___ got long hair.", "has", "С she: has got."],
        ["He ___ tall.", "is", "Высокий — качество с is."],
        ["She has got brown ___.", "hair", "Hair в этом значении без -s."],
      ]),
      match("description-meaning", "Match the description", [
        ["He is tall.", "Он высокий.", "Be + качество."],
        [
          "She has got glasses.",
          "У неё есть очки.",
          "Has got выражает наличие.",
        ],
        [
          "He has got short hair.",
          "У него короткие волосы.",
          "Hair — волосы как единое понятие.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Учитель должен найти вашего вымышленного персонажа среди трёх описаний.",
      steps: [
        "Выберите Ben, Eva или Mia из текста.",
        "Дайте две подсказки, не называя имя.",
        "Учитель уточняет один признак.",
        "Поменяйтесь ролями и используйте другого персонажа.",
      ],
      support: ["He is…", "She has got…", "His/Her bag is…"],
      success: [
        "Описал минимум два признака.",
        "Различил is и has got.",
        "Персонажа можно определить.",
      ],
      model: "She has got long brown hair. Her bag is blue. → Eva.",
      teacherNote:
        "Используйте нейтральные описания и вымышленных персонажей. Оценочные суждения о внешности не нужны.",
    },
    writing: {
      instruction:
        "Напишите описание вымышленного персонажа: волосы, очки, вещь и цвет.",
      model:
        "This is Ben. He is tall. He has got short hair and glasses. His bag is black.",
      checklist: [
        "Is перед качеством.",
        "Has got перед тем, что есть.",
        "Hair без лишнего -s.",
      ],
    },
    exit: [
      "Я могу описать человека нейтральными словами.",
      "Я различаю be и have got.",
      "Я могу опознать персонажа по описанию.",
    ],
    homework: {
      instruction: "Придумайте две карточки «Угадай человека».",
      steps: [
        "В каждой дайте три признака.",
        "Не указывайте имя до ответа.",
        "Повторите цвета из урока 7 и my/his/her из урока 5.",
      ],
      model: "He has got glasses. His bag is green. He has got short hair.",
    },
    teacherNotes: [
      "Полную парадигму вопросов have got можно вводить позже; здесь важнее описательная функция.",
      "Для открытой речи принимайте стандартное have/has без got.",
    ],
  }),
  makeLesson({
    n: 20,
    title: "What are you doing now?",
    subtitle: "Описываем действие прямо сейчас",
    topic: "Сейчас и сегодня",
    skills: ["grammar", "speaking", "listening"],
    goal: "I can say what I or another person am/is doing now.",
    vocabulary: vocab(
      ["reading", "читает / чтение сейчас", "She is reading."],
      ["writing", "пишет", "I am writing."],
      ["cooking", "готовит", "He is cooking."],
      ["working", "работает сейчас", "They are working."],
      ["talking", "разговаривает", "We are talking."],
      ["now", "сейчас", "I am studying now."],
    ),
    language: {
      focus: "am/is/are + verb-ing",
      explanation:
        "Для действия прямо сейчас используем be + -ing: I am reading, she is reading, they are reading. Для writing убираем конечную e в write. Вопрос: What are you doing?",
      examples: [
        "I am studying now.",
        "She is cooking.",
        "What are you doing?",
      ],
      pitfall:
        "I reading → I am reading. She is cook → She is cooking. Не путайте с обычной привычкой I cook every day.",
      pronunciation:
        "Окончание -ing обычно заканчивается звуком /ŋ/, без отдельного сильного /g/. Учитель даёт модель reading, writing, working.",
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
          "Сообщение подписано Tom; I’m studying.",
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
      ["Опишите обычное утро.", "I get up at seven.", 10],
      ["Скажите, где кухня.", "It is next to the living room.", 9],
      ["Скажите, что она умеет готовить.", "She can cook.", 18],
    ),
    practice: [
      gaps("doing-now", "Complete the action", [
        ["I ___ reading now.", "am", "С I: am."],
        ["She ___ cooking.", "is", "С she: is."],
        ["They ___ working.", "are", "С they: are."],
        [
          "He is ___. (write)",
          "writing",
          "Write → writing: конечная e убирается.",
        ],
      ]),
      choice("now-or-usually", "Choose the sentence", [
        [
          "Right now:",
          ["I am reading.", "I read every day.", "I can read."],
          0,
          "Am reading выражает действие сейчас.",
        ],
        [
          "A daily habit:",
          [
            "She is working now.",
            "She works every day.",
            "She working every day.",
          ],
          1,
          "Works every day — привычка.",
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
        "Учитель изображает действия, а ученик описывает их; затем роли меняются.",
      steps: [
        "Опишите три действия учителя по камере или словесной сцене.",
        "Скажите, что делаете сами.",
        "Спросите What are you doing?",
        "Повторите с новым действием после обратной связи.",
      ],
      support: ["You are…", "I am…", "He/She is…", "What are you doing?"],
      success: [
        "Не пропускаю be.",
        "Использую -ing.",
        "Описываю именно текущее действие.",
      ],
      model: "You are writing. I am reading. She is cooking.",
      teacherNote:
        "Если камера недоступна, дайте карточку ситуации: Ben / kitchen / cook. Ученик преобразует её в сообщение.",
    },
    writing: {
      instruction: "Напишите сообщение о том, что три человека делают сейчас.",
      model:
        "Hi! I am studying. Ben is cooking. Mia is reading. We are at home.",
      checklist: [
        "В каждой форме есть am/is/are.",
        "Основной глагол с -ing.",
        "Привычки не смешаны с действиями сейчас.",
      ],
    },
    exit: [
      "Я могу сказать, что делаю сейчас.",
      "Я могу спросить о текущем действии.",
      "Я различаю every day и now.",
    ],
    homework: {
      instruction:
        "Сделайте три короткие записи о вымышленных действиях в разное время дня.",
      steps: [
        "Каждую начинайте с Now.",
        "Добавьте действие другого человека.",
        "Через день сравните одну запись с фразой о привычке.",
      ],
      model: "Now I am reading. I read in the evening every day.",
    },
    teacherNotes: [
      "Не перегружайте первым уроком continuous: вопросы и отрицания отрабатывайте только в коротких знакомых формах.",
      "Понимание now против every day важнее скорости.",
    ],
  }),
];

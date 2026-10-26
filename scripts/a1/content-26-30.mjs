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
    n: 26,
    title: "Days, dates and appointments",
    subtitle: "Выбираем дату и время встречи",
    topic: "Календарь",
    skills: ["listening", "spelling", "speaking"],
    goal: "I can check a simple appointment date and time.",
    vocabulary: vocab(
      ["Monday", "понедельник", "On Monday at six."],
      ["Tuesday", "вторник", "The class is on Tuesday."],
      ["Wednesday", "среда", "On Wednesday, please."],
      ["date", "дата", "What is the date?"],
      ["first", "первый", "The first of May."],
      ["second", "второй", "The second of May."],
    ),
    language: {
      focus: "on + day/date; at + time; basic dates",
      explanation:
        "День и дата: on Monday, on the first of May. Время: at six. Читаем 1 May как the first of May, 2 May — the second of May, 3 May — the third of May. Для этого урока достаточно дат 1–3 и знакомых дней.",
      examples: [
        "The class is on Tuesday.",
        "On the second of May at six.",
        "Is Monday good?",
      ],
      pitfall:
        "On Monday, но at six. Wednesday пишется с буквой d, которая обычно не слышна.",
      pronunciation:
        "В Wednesday обычно два слога: WENZ-day. Учитель произносит first, second, third и просит сопоставить с 1, 2, 3.",
    },
    input: model(
      "Two lesson times",
      "schedule",
      "ENGLISH LESSONS\nMonday, 1 May — 18:00\nTuesday, 2 May — 17:30\nWednesday, 3 May — 19:00\n\nAnna: Tuesday is good for me.\nTeacher: The second of May at half past five.\nAnna: Yes, thank you.",
      [
        [
          "Which day does Anna choose?",
          ["Monday", "Tuesday", "Wednesday"],
          1,
          "Anna выбирает Tuesday.",
        ],
        [
          "What is the date?",
          ["1 May", "2 May", "3 May"],
          1,
          "Tuesday, 2 May.",
        ],
        [
          "What time is the lesson?",
          ["5:30 p.m.", "6:00 p.m.", "7:00 p.m."],
          0,
          "17:30 = half past five in the afternoon.",
        ],
      ],
    ),
    retrieval: recall(
      ["Прочитайте время 9:30.", "Nine thirty. / Half past nine.", 24],
      ["Спросите о занятии в понедельник.", "Do you study on Monday?", 12],
      ["Назовите общее увлечение.", "We like walking.", 25],
    ),
    practice: [
      gaps("appointment-prepositions", "Complete the appointment", [
        ["The class is ___ Monday.", "on", "Перед днём: on."],
        ["The lesson is ___ six.", "at", "Перед временем: at."],
        ["1 May: the ___ of May", "first", "Первое число: first."],
        ["2 May: the ___ of May", "second", "Второе число: second."],
      ]),
      choice("calendar-reading", "Read the calendar", [
        [
          "Wednesday in this timetable is…",
          ["1 May", "2 May", "3 May"],
          2,
          "В таблице Wednesday, 3 May.",
        ],
        [
          "17:30 is…",
          [
            "half past five in the afternoon",
            "half past seven in the morning",
            "five o’clock",
          ],
          0,
          "17:30 = 5:30 p.m.",
        ],
        [
          "Choose the correct spelling.",
          ["Wensday", "Wednesday", "Wednsday"],
          1,
          "Правильное написание: Wednesday.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "У учителя и ученика разные свободные окна для следующего занятия.",
      steps: [
        "Учитель называет два варианта из расписания.",
        "Уточните день, дату и время каждого.",
        "Выберите подходящий вариант.",
        "Повторите все три детали в одной фразе.",
      ],
      support: [
        "Is Tuesday good?",
        "What time?",
        "The second of May?",
        "On Tuesday at…",
      ],
      success: [
        "День не перепутан с датой.",
        "Время проверено повтором.",
        "Получилась однозначная договорённость.",
      ],
      model: "Tuesday is good. The second of May at half past five. Thank you.",
      teacherNote:
        "Таблица — вымышленное расписание без привязки к текущему году. Не переносите его автоматически в настоящий календарь ученика.",
    },
    writing: {
      instruction: "Запишите короткое подтверждение выбранного занятия.",
      model:
        "English lesson: Tuesday, 2 May, 17:30. The lesson is on Tuesday at half past five.",
      checklist: [
        "День и дата совпадают с таблицей.",
        "On перед днём.",
        "At перед временем.",
      ],
    },
    exit: [
      "Я могу уточнить день занятия.",
      "Я могу понять даты 1–3.",
      "Я могу подтвердить дату и время.",
    ],
    homework: {
      instruction: "Создайте три вымышленные записи календаря.",
      steps: [
        "Используйте Monday–Wednesday и даты 1–3.",
        "Запишите цифровое и словесное время.",
        "Завтра продиктуйте одну запись учителю без показа текста.",
      ],
      model: "Wednesday, 3 May, 19:00 — on Wednesday at seven.",
    },
    teacherNotes: [
      "При необходимости добавляйте месяцы по личной потребности, не требуя выучить все сразу.",
      "Реальное время уроков зависит от часового пояса; здесь отрабатывается только язык.",
    ],
  }),
  makeLesson({
    n: 27,
    title: "A short message",
    subtitle: "Пишем понятное сообщение о встрече",
    topic: "Сообщения",
    skills: ["writing", "spelling", "reading"],
    goal: "I can write a short message with a greeting, a simple plan and a question.",
    vocabulary: vocab(
      ["Hi…", "Привет… в сообщении", "Hi, Anna!"],
      ["Are you free?", "Ты свободен/свободна?", "Are you free on Friday?"],
      ["Let’s…", "Давай…", "Let’s meet at six."],
      ["meet", "встретиться", "Let’s meet at the café."],
      ["See you", "До встречи", "See you on Friday."],
      ["Sorry", "Извини / простите", "Sorry, I work on Friday."],
    ),
    language: {
      focus: "short message structure; capitals and punctuation",
      explanation:
        "Короткое сообщение может состоять из приветствия, причины/предложения, вопроса и завершения. I, имена и дни пишем с большой буквы. Let’s meet… вводим как готовую фразу-предложение.",
      examples: [
        "Hi, Eva!",
        "Are you free on Friday?",
        "Let’s meet at six. See you!",
      ],
      pitfall:
        "В конце вопроса нужен ?. I всегда с большой буквы; Friday тоже. Не требуется сложный официальный стиль.",
      pronunciation:
        "При чтении сообщения делайте паузу между законченными предложениями. See you часто звучит слитно; учитель даёт модель.",
    },
    input: model(
      "A message to a classmate",
      "message",
      "Hi, Eva!\nAre you free on Friday? Let’s meet at the café near the park at six. I like this café.\nSee you!\nAnna\n\nEva: Hi, Anna. Yes, Friday at six is good. See you!",
      [
        [
          "Who writes the first message?",
          ["Anna", "Eva", "Ben"],
          0,
          "Первое сообщение подписано Anna.",
        ],
        [
          "Where do they meet?",
          ["At the station", "At the café near the park", "At school"],
          1,
          "Let’s meet at the café near the park.",
        ],
        [
          "Does Eva agree?",
          ["Yes", "No", "She does not answer"],
          0,
          "Yes, Friday at six is good.",
        ],
      ],
    ),
    retrieval: recall(
      ["Подтвердите время занятия.", "On Tuesday at six.", 26],
      ["Скажите, где кафе.", "It is near the park.", 16],
      ["Спросите об увлечении.", "Do you like reading?", 25],
    ),
    practice: [
      choice("message-punctuation", "Choose a clear message", [
        [
          "Correct capital letters:",
          ["i study on friday.", "I study on Friday.", "I Study on friday."],
          1,
          "I и Friday с большой буквы.",
        ],
        [
          "A question:",
          [
            "Are you free on Friday?",
            "Are you free on Friday.",
            "Are you free on Friday,",
          ],
          0,
          "Вопрос заканчивается ?.",
        ],
        [
          "A friendly ending:",
          ["See you!", "What price?", "Turn left!"],
          0,
          "See you — естественное завершение сообщения.",
        ],
        [
          "A proposal:",
          ["Let’s meet at six.", "I’m six.", "I have Friday."],
          0,
          "Let’s meet — предложение встретиться.",
        ],
      ]),
      order("message-order", "Build the key sentences", [
        ["Are you free on Friday?", "Are + you + free + day."],
        ["Let’s meet at the café.", "Let’s + глагол meet."],
        ["See you on Friday.", "See you + on + день."],
      ]),
    ],
    speaking: {
      situation:
        "Учитель присылает короткое устное приглашение, а вы отвечаете голосом и затем письменно.",
      steps: [
        "Уточните место и время.",
        "Согласитесь или предложите другой знакомый день.",
        "Продиктуйте короткий ответ.",
        "Учитель читает запись; исправьте один неточный факт.",
      ],
      support: ["Yes, … is good.", "Sorry, I work on…", "At six?", "See you!"],
      success: [
        "Понятно, согласились ли вы.",
        "Место и время совпадают.",
        "Ответ содержит приветствие и завершение.",
      ],
      model:
        "Hi, Anna. Yes, Friday at six is good. At the café near the park? See you!",
      teacherNote:
        "Открытый ответ проверяйте по смыслу и полноте информации. Не требуйте точного совпадения с образцом.",
    },
    writing: {
      instruction:
        "Напишите сообщение знакомому: приветствие, встреча, место, время, вопрос и завершение. Достаточно 3–5 коротких предложений.",
      model:
        "Hi, Ben! Are you free on Monday? Let’s meet at the park at five. Is five good? See you!",
      checklist: [
        "Есть конкретные место и время.",
        "I/имена/дни с большой буквы.",
        "Вопросы отмечены знаком ?.",
      ],
    },
    exit: [
      "Я могу написать короткое понятное сообщение.",
      "Я могу согласиться или вежливо отказаться.",
      "Я проверяю основные заглавные буквы.",
    ],
    homework: {
      instruction: "Создайте приглашение и ответ с изменением одного условия.",
      steps: [
        "Напишите приглашение на знакомое занятие.",
        "Ответьте от имени друга с другим временем.",
        "На следующий день прочитайте оба сообщения вслух.",
      ],
      model: "Hi! Let’s meet at six. — Hi! Sorry, seven is good for me.",
    },
    teacherNotes: [
      "Не отправляйте сообщения реальным людям: это учебные черновики.",
      "Если Let’s трудно, достаточно формулы Café on Friday at six?",
    ],
  }),
  makeLesson({
    n: 28,
    title: "Sorry, again, please!",
    subtitle: "Переспрашиваем и проверяем важные детали",
    topic: "Стратегии общения",
    skills: ["listening", "speaking", "pronunciation"],
    goal: "I can ask someone to repeat, speak slowly or spell a word.",
    vocabulary: vocab(
      ["Again, please", "Ещё раз, пожалуйста", "Again, please."],
      ["Slowly, please", "Медленно, пожалуйста", "Slowly, please."],
      ["I don’t understand", "Я не понимаю", "Sorry, I don’t understand."],
      [
        "Can you repeat that?",
        "Можете повторить?",
        "Can you repeat that, please?",
      ],
      ["Is that right?", "Это верно?", "Platform two. Is that right?"],
      [
        "How do you spell it?",
        "Как это пишется по буквам?",
        "How do you spell it?",
      ],
    ),
    language: {
      focus: "repair phrases; checking by repetition",
      explanation:
        "Необязательно понимать всё с первого раза. Остановите разговор короткой вежливой фразой, уточните одну деталь и повторите её для проверки. Can you…? используем как готовую форму просьбы.",
      examples: [
        "Sorry, can you repeat that?",
        "Slowly, please.",
        "Fifteen pounds. Is that right?",
      ],
      pitfall:
        "Не отвечайте yes, если важная информация осталась непонятной. Уточните конкретное слово, число или время.",
      pronunciation:
        "Просьбы произносите спокойно и отчётливо; в Slowly, please выделите SLOW. Уточнение Fifteen? может иметь восходящую интонацию.",
    },
    input: model(
      "Checking a ticket",
      "dialogue",
      "Clerk: The train is at nine thirty. Platform three. Fifteen pounds.\nVisitor: Sorry, can you repeat that?\nClerk: Nine thirty. Platform three.\nVisitor: Platform three. Is that right?\nClerk: Yes.\nVisitor: And fifteen pounds?\nClerk: Yes, fifteen.",
      [
        [
          "Which detail does the visitor check first?",
          ["The platform", "The city name", "The weather"],
          0,
          "После повтора он проверяет Platform three.",
        ],
        [
          "How much is the ticket?",
          ["Fifty pounds", "Fifteen pounds", "Five pounds"],
          1,
          "Кассир подтверждает fifteen.",
        ],
        [
          "Which phrase asks for repetition?",
          ["Can you repeat that?", "See you!", "I like trains."],
          0,
          "Repeat that — просьба повторить.",
        ],
      ],
    ),
    retrieval: recall(
      ["Спросите время поезда.", "What time is the train?", 24],
      ["Попросите произнести имя по буквам.", "How do you spell your name?", 2],
      ["Прочитайте число 15 и 50.", "Fifteen. Fifty.", 15],
    ),
    practice: [
      match("repair-functions", "Choose the useful phrase", [
        [
          "You need the letters.",
          "How do you spell it?",
          "Чтобы записать слово, попросите произнести буквы.",
        ],
        [
          "The person speaks too fast.",
          "Slowly, please.",
          "Просьба говорить медленнее.",
        ],
        [
          "You want to check the number.",
          "Is that right?",
          "После повтора проверьте правильность.",
        ],
      ]),
      gaps("repair-phrases", "Complete the polite request", [
        ["Can you ___ that?", "repeat", "Repeat = повторить."],
        ["___, please. (медленно)", "Slowly", "Slowly = медленно."],
        [
          "I don’t ___. (понимаю)",
          "understand",
          "I don’t understand — я не понимаю.",
        ],
        ["Is that ___? (верно)", "right", "Is that right? — это верно?"],
      ]),
    ],
    speaking: {
      situation:
        "Учитель диктует вымышленное бронирование: имя, время, цена и номер.",
      steps: [
        "Запишите четыре детали; попросите повтор, когда нужно.",
        "Попросите произнести имя по буквам.",
        "Проверьте число повтором.",
        "Поменяйтесь ролями и намеренно исправьте одну услышанную неточность.",
      ],
      support: [
        "Sorry, again, please.",
        "How do you spell it?",
        "Fifteen?",
        "Is that right?",
      ],
      success: [
        "Использовал хотя бы две стратегии уточнения.",
        "Получил верные имя и цифры.",
        "Не сделал вид, что понял непонятную деталь.",
      ],
      model:
        "A: Mia, six thirty, fifteen pounds, room two.\nB: Mia. How do you spell it? Six thirty? Fifteen pounds. Is that right?",
      teacherNote:
        "Начните в понятном темпе. Увеличивайте трудность только после успешной попытки; цель не в том, чтобы запутать ученика.",
    },
    writing: {
      instruction: "Составьте памятку из четырёх фраз для сложного разговора.",
      model:
        "Sorry, I don’t understand.\nCan you repeat that?\nSlowly, please.\nIs that right?",
      checklist: [
        "Фразы вежливые.",
        "Каждая решает отдельную задачу.",
        "В вопросах есть ?.",
      ],
    },
    exit: [
      "Я могу попросить повтор.",
      "Я могу попросить говорить медленнее.",
      "Я могу проверить число или написание.",
    ],
    homework: {
      instruction: "Потренируйте уточнение трёх вымышленных деталей.",
      steps: [
        "Выберите имя, время и цену.",
        "Составьте к каждой просьбу или проверочный вопрос.",
        "На следующем уроке попросите учителя продиктовать новые детали.",
      ],
      model: "Eva? E–V–A? At five? Twenty pounds? Is that right?",
    },
    teacherNotes: [
      "Стратегии исправления непонимания — самостоятельная часть цели A1, а не признак неуспеха.",
      "Все важные детали должны стать понятны после уточнений.",
    ],
  }),
  makeLesson({
    n: 29,
    title: "At a guesthouse",
    subtitle: "Регистрируемся и задаём простые вопросы",
    topic: "Проживание в поездке",
    skills: ["speaking", "writing", "listening"],
    goal: "I can give simple registration details and ask about a room and breakfast.",
    vocabulary: vocab(
      ["room", "комната / номер", "Room twelve."],
      ["key", "ключ", "Here is your key."],
      ["breakfast", "завтрак", "What time is breakfast?"],
      ["Wi-Fi", "беспроводной интернет", "Is there Wi-Fi?"],
      ["reception", "стойка регистрации", "The key is at reception."],
      ["one night", "одна ночь", "A room for one night, please."],
    ),
    language: {
      focus: "registration questions; What time / Where / Is there",
      explanation:
        "Используйте уже знакомые вопросы для новой ситуации: What’s your surname? What time is breakfast? Where is my room? Is there Wi-Fi? Для просьбы о комнате: A room for one night, please.",
      examples: [
        "My surname is Green.",
        "What time is breakfast?",
        "Is there Wi-Fi?",
      ],
      pitfall:
        "Выбирайте вопрос по смыслу: Where — место, What time — время, Is there — наличие.",
      pronunciation:
        "Room содержит долгий /uː/. В breakfast обычно два слога; повторите вопрос What time is breakfast? как целую фразу.",
    },
    input: model(
      "Welcome to the guesthouse",
      "dialogue",
      "Receptionist: Hello. Your surname, please?\nGuest: Green. G–R–E–E–N.\nReceptionist: Room twelve. Here is your key.\nGuest: Thank you. What time is breakfast?\nReceptionist: At eight.\nGuest: Is there Wi-Fi?\nReceptionist: Yes. The information is in your room.",
      [
        [
          "What is the guest’s surname?",
          ["Green", "Brown", "White"],
          0,
          "Гость называет Green.",
        ],
        ["Which room?", ["Two", "Twelve", "Twenty"], 1, "Room twelve."],
        [
          "When is breakfast?",
          ["At seven", "At nine", "At eight"],
          2,
          "Ресепшен отвечает At eight.",
        ],
      ],
    ),
    retrieval: recall(
      ["Назовите фамилию по буквам.", "Green: G–R–E–E–N.", 4],
      ["Попросите повторить число.", "Can you repeat that, please?", 28],
      ["Скажите «ключ в сумке».", "The key is in the bag.", 9],
    ),
    practice: [
      choice("guesthouse-questions", "Ask the right question", [
        [
          "You need the breakfast time.",
          [
            "Where is breakfast?",
            "What time is breakfast?",
            "How much is your name?",
          ],
          1,
          "What time — вопрос о времени.",
        ],
        [
          "You need the room location.",
          [
            "Where is my room?",
            "How old is my room?",
            "What colour is my name?",
          ],
          0,
          "Where — место.",
        ],
        [
          "You want to know about Wi-Fi.",
          ["Is there Wi-Fi?", "Are Wi-Fi?", "I Wi-Fi?"],
          0,
          "Is there…? — вопрос о наличии.",
        ],
        [
          "You did not hear the room number.",
          ["See you!", "Again, please.", "I like blue."],
          1,
          "Просьба повторить подходит к непонятной детали.",
        ],
      ]),
      gaps("registration", "Complete the registration", [
        ["A room for one ___, please.", "night", "One night — одна ночь."],
        ["My ___ is Green. (фамилия)", "surname", "Surname — фамилия."],
        ["What ___ is breakfast?", "time", "What time — во сколько."],
      ]),
    ],
    speaking: {
      situation:
        "Учитель — сотрудник гостевого дома, ученик регистрируется с вымышленными данными.",
      steps: [
        "Попросите комнату на одну ночь.",
        "Сообщите фамилию и при необходимости буквы.",
        "Уточните номер и время завтрака.",
        "Задайте один вопрос о расположении или Wi-Fi.",
      ],
      support: [
        "A room for one night, please.",
        "My surname is…",
        "What time is…?",
        "Where is…?",
      ],
      success: [
        "Регистрационные данные понятны.",
        "Номер и время проверены.",
        "Есть хотя бы один самостоятельный вопрос.",
      ],
      model:
        "A room for one night, please. My surname is Green. Room twelve? What time is breakfast? Is there Wi-Fi?",
      teacherNote:
        "Не используйте реальные документы, бронирования или платёжные данные. Это итоговая функциональная практика знакомых форм.",
    },
    writing: {
      instruction:
        "Заполните карточку гостя и запишите два вопроса сотруднику.",
      model:
        "Name: Eva Green\nCountry: Poland\nRoom: 12\nWhat time is breakfast?\nIs there Wi-Fi?",
      checklist: [
        "Имя и страна с большой буквы.",
        "Номер записан верно.",
        "Вопросы соответствуют нужной информации.",
      ],
    },
    exit: [
      "Я могу дать простые данные для регистрации.",
      "Я могу уточнить время завтрака.",
      "Я могу задать вопрос о комнате.",
    ],
    homework: {
      instruction: "Подготовьте другой вариант регистрации с новым персонажем.",
      steps: [
        "Измените имя, страну и номер комнаты.",
        "Запишите три вопроса.",
        "Завтра проиграйте ситуацию без чтения диалога.",
      ],
      model: "My name is Tom White. Room twenty? Where is the room?",
    },
    teacherNotes: [
      "Опирайтесь на накопленный язык, не добавляя много новых правил.",
      "Повторная попытка с другим номером показывает перенос навыка.",
    ],
  }),
  makeLesson({
    n: 30,
    title: "My first day in a new town",
    subtitle: "Объединяем навыки в одном учебном дне",
    topic: "Итоговая практика",
    skills: ["speaking", "writing", "reading", "listening"],
    goal: "I can handle several very short everyday exchanges with a helpful partner.",
    vocabulary: vocab(
      ["introduce myself", "представиться", "I can introduce myself."],
      ["check", "проверить", "Check the time."],
      ["ask", "спросить", "Ask about the price."],
      ["choose", "выбрать", "Choose a café."],
      ["repeat", "повторить", "Repeat the important number."],
      ["next step", "следующий шаг", "My next step is speaking practice."],
    ),
    language: {
      focus: "review: be, present simple, can, there is, polite questions",
      explanation:
        "Выберите форму по смыслу: I am… — кто я; I study… — привычка; I can… — умение; There is… — что есть; Can I have…? — просьба. Если не поняли, уточняйте. Это повторение, а не экзамен на весь уровень.",
      examples: [
        "I’m Eva. I’m from Poland.",
        "I study English on Monday.",
        "Can I have a tea, please?",
      ],
      pitfall:
        "Не соединяйте все формы подряд: I am can study → I can study. Сначала решите, какую мысль хотите передать.",
      pronunciation:
        "Выделяйте важные детали: имя, время, цену, направление. После просьбы повторите ключевое число для проверки.",
    },
    input: model(
      "A new student’s day",
      "text",
      "My name is Eva Green. I’m from Poland. I study English on Monday. Today I am in York. There is a café near the station. I have a tea there. It is two pounds. My class starts at ten. The school is next to the park. My teacher is Ben.",
      [
        [
          "How much is the tea?",
          ["£10", "£2", "£20"],
          1,
          "It is two pounds относится к чаю.",
        ],
        [
          "When does the class start?",
          ["At ten", "At two", "At seven"],
          0,
          "My class starts at ten.",
        ],
        [
          "Where is the school?",
          ["Behind the station", "In the café", "Next to the park"],
          2,
          "The school is next to the park.",
        ],
      ],
    ),
    retrieval: recall(
      [
        "Представьтесь, назовите страну и одно увлечение.",
        "I’m Anna. I’m from Ukraine. I like reading.",
        25,
      ],
      [
        "Спросите цену и повторите её для проверки.",
        "How much is it? Fifteen pounds?",
        15,
      ],
      ["Попросите говорить медленнее.", "Slowly, please.", 28],
    ),
    practice: [
      gaps("review-forms", "Choose the useful form", [
        ["I ___ from Poland.", "am", "Происхождение: be."],
        [
          "She ___ English every day. (study)",
          "studies",
          "Study → studies после she.",
        ],
        ["I can ___ a computer.", "use", "Can + начальная форма."],
        ["There ___ a café near the station.", "is", "Одно кафе: there is."],
      ]),
      choice("review-functions", "Choose the phrase for the situation", [
        [
          "You need a tea.",
          ["Can I have a tea, please?", "I am tea.", "Do tea you?"],
          0,
          "Вежливая просьба.",
        ],
        [
          "You need the station location.",
          [
            "How old is the station?",
            "Where is the station?",
            "What name is the station?",
          ],
          1,
          "Where спрашивает место.",
        ],
        [
          "You did not understand the price.",
          ["I like prices.", "See you!", "Can you repeat that, please?"],
          2,
          "Попросите повторить непонятную информацию.",
        ],
      ]),
    ],
    speaking: {
      situation:
        "Четыре мини-сцены с одним учителем: знакомство, кафе, маршрут, время занятия.",
      steps: [
        "Представьтесь новому учителю и назовите одно увлечение.",
        "Закажите напиток и узнайте цену.",
        "Спросите путь к школе по вымышленной карте.",
        "Подтвердите день и время занятия.",
        "Выберите одну трудную сцену и повторите её после обратной связи.",
      ],
      support: [
        "I’m… / I’m from…",
        "Can I have…?",
        "Where is…?",
        "On Monday at…",
        "Again, please.",
      ],
      success: [
        "Передал нужную информацию в четырёх сценах.",
        "Пользовался уточнением при необходимости.",
        "После обратной связи улучшил одну сцену.",
      ],
      model:
        "Hello. I’m Eva. I like reading. Can I have a tea, please? How much is it? Where is the school? Monday at ten? Thank you.",
      teacherNote:
        "Учитель меняет роль, а не требует второго ученика. Помощь, повтор и медленный темп допустимы; успех не равен безошибочности.",
    },
    writing: {
      instruction:
        "Создайте мини-портфолио: короткий профиль, заказ и сообщение о времени занятия.",
      model:
        "I’m Eva. I’m from Poland. I like walking.\nA tea and a sandwich, please.\nHi, Ben. Monday at ten is good. See you!",
      checklist: [
        "Каждая запись выполняет конкретную задачу.",
        "Имена, I и дни с большой буквы.",
        "Вопросы и просьбы понятны читателю.",
      ],
    },
    exit: [
      "Я могу назвать свои сильные стороны в простых разговорах.",
      "Я могу выбрать одну тему для повторения.",
      "Я могу использовать уточнение вместо молчания.",
    ],
    homework: {
      instruction: "Соберите три лучшие работы и выберите следующий шаг.",
      steps: [
        "Выберите профиль, сообщение и одну запись диалога в виде текста.",
        "Подчеркните две фразы, которые теперь можете сказать без подсказки.",
        "Запишите одну следующую цель и обсудите её с учителем.",
      ],
      model:
        "I can order a drink. I can give my name. My next step: ask questions about a daily routine.",
    },
    teacherNotes: [
      "Не выдавайте результат этого урока за официальное подтверждение CEFR A1.",
      "Для следующего цикла используйте реальные трудности ученика, а не автоматическое повышение уровня.",
    ],
  }),
];

# Проверка прототипа

Проверено 25 октября 2026 года в Windows, Node.js 24.12.0, встроенный браузер Codex. Проверочные ответы очищены через интерфейс преподавателя; после обновления ученическая вкладка показывает 0 из 14.

## Автоматические проверки

- `npm run build`: TypeScript и production-сборка Vite проходят.
- `npm test`: 10 из 10 тестов проходят. Проверены объединение одновременных правок разных полей, сохранение сброса при поступлении старой записи, стабильное разрешение совпавших времён, повреждённое хранилище и наличие исходных 14 упражнений с ожидаемым ключом 1-a, 2-b, 3-a, 4-a, 5-a.
- При установке `npm install`: 0 уязвимостей в отчёте npm.

## Проверка в браузере

| Сценарий | Наблюдаемый результат |
| --- | --- |
| Все разделы | Vocabulary, Reading, Grammar, Speaking и Listening открываются, номера 1–14 сохранены. |
| Проверка Exercise 1 | При одном неверном ответе — `4 / 5 correct`, отметка Incorrect и подсветка. После исправления — `5 / 5 correct · Well done!`. |
| Таймер Exercise 2 | Стартует с 02:00, отсчитывает время, скрывает предложения, синхронизируется со второй вкладкой. Пауза на 01:12 сохраняется после обновления. После сброса снова 02:00. |
| Текстовые поля | Введённое предложение в Exercise 3 сохранилось после reload и появилось у преподавателя. |
| Reading | Показаны три абзаца Maja и девять вопросов. Student B показывает пояснение об отсутствующей странице. Скрытие и возврат текста преподавателем отражаются у ученика. |
| Интервью Exercise 8 | Девять вопросов переключаются последовательно; роли спрашивающего переключаются, заметки записываются отдельно для каждой роли и вопроса. |
| Грамматика | Свободное дополнение Exercise 11 видно во второй вкладке. Оценка Needs improvement преподавателя видна у ученика. |
| Ручная проверка | Correct в Exercise 3 появляется у ученика и сохраняется после reload. |
| Speaking | Все шесть тем доступны, заметка вводится, завершение увеличивает общий прогресс. |
| Listening | Показаны `Audio 102 not added`, `Audio 103 not added`, отключённый Play, восемь слов и восемь полей диктанта. Фиктивного аудио и ключей нет. |
| Исходное изображение | Диалог открывается и закрывается, изображение загружается локально; доступна ссылка на полный размер. |
| Сброс упражнения | Очистка Exercise 11 удаляет ответ и оценку, остальные упражнения остаются. |
| Сброс урока | Сбрасываются ответы, оценки, прогресс, таймер и скрытие. Вторая вкладка обновляется; после reload остаётся 0 из 14. |
| Ошибки | В обеих проверочных вкладках журнал браузера не содержит error / warn. На проверенном размере окна горизонтального переполнения нет. |

## Границы проверки

- Оригинальных MP3 нет: воспроизведение именно записей 102 и 103 проверить невозможно. Реализован стандартный HTML-аудиоплеер для предоставленных оригинальных файлов.
- Доступность без внешнего интернета обеспечена локальной сборкой: JavaScript, CSS, изображение и файлы шрифтов локальные; единственные прикладные fetch-запросы обращаются к локальным `/audio/102.mp3` и `/audio/103.mp3`. Сетевой адаптер компьютера при проверке не отключался. Для работы нужен запущенный локальный Vite / preview сервер.
- Адаптивные CSS-правила предусмотрены; визуальная проверка проведена в настольном окне. Отдельные мобильные устройства не проверялись.
- Синхронизация между устройствами добавлена отдельной доработкой; результаты проверки приведены ниже. Два физических компьютера в проверке не использовались.

Снимок первого экрана: `docs/lesson-preview.png`.


## Доработка: синхронизация через Supabase

Создан отдельный проект `english-lesson-studio` (`susbugetsyencnqdtvua`) в `favmotors`. Инструмент Supabase вернул стоимость `{amount: 0, recurrence: monthly}`. Существующие проекты не изменялись.

### Автоматические проверки

- Локальные тесты: 10/10. Добавлены проверки сохранения приглашения при навигации, оптимистической записи, сброса, очереди при сетевом сбое и перезагрузке, новых правок во время незавершённого запроса.
- `npm run test:cloud`: 8/8 (одна итоговая проверка и семь подслучаев) на настоящем Supabase. Проверены независимые клиенты, параллельные записи разных полей, сохранённые оценки, их снятие после изменения ответа, запрет ученических оценок и сброса, запрет скрытия Reading, повтор без дублирования, защита сброса от старых правок, неверный секрет и недоступность прямого чтения таблицы.
- Supabase advisors после миграций: security — пустой список; performance — пустой список.

### Проверка в интерфейсе

Преподаватель открыт на `http://127.0.0.1:5173`, ученик — на `http://localhost:5173`. Это разные origin: `localStorage` и `BroadcastChannel` между ними не разделяются. Передача данных происходила через HTTPS API реального Supabase.

- Кнопка Create shared lesson создаёт сессию, отображает ученическое приглашение и преподавательскую роль.
- Ученический ответ Exercise 3 появился у преподавателя. Обратная отметка Correct появилась у ученика и сохранилась после обновления.
- Подмена query-параметра ученика на `mode=teacher` оставила Student access; переключатель преподавателя отключён.
- После перехода в Grammar и обновления страницы сессия осталась открытой. Ответ и Completed в Exercise 11 появились у преподавателя.
- Оценка Needs improvement вернулась ученику.
- Полный сброс у преподавателя очистил поля и оценки у ученика на другом origin.
- В журналах обеих вкладок нет error / warn.

Сетевая ошибка и сохранение очереди после обновления проверены с управляемым транспортом в автоматическом тесте; физическое отключение сетевого адаптера не выполнялось. Для подключения с другого компьютера ещё требуется публикация frontend. На Vercel в рамках этой доработки приложение не публиковалось.


## Доработка: дизайн, карточка ученика, календарь и общий таймер

- Перестроены App и стили; заменены локальные шрифты на Source Sans 3 с кириллицей. В браузере подтверждены семейство и 17 px для инструкции на настольной ширине.
- Преподавательская версия использует синюю тему и поля Student name, English level, Lesson title, Lesson number. Ученическая — зелёную тему и отображение этих данных без редактирования.
- В узком окне 600 px проверены ввод данных и открытие панели Session controls; в настольном окне 1280 px — раскладка с правой панелью, без горизонтального переполнения.
- Выбран день 26 октября 2026, время 15:30 Europe/Warsaw и длительность 45 минут. Настройки сохранились после обновления и перенеслись при создании общей сессии.
- В независимой ученической вкладке (`localhost` вместо `127.0.0.1`) отображены Demo Student, B1, Lesson 12, название занятия и его дата/время. Редактируемых полей ученика в этой версии нет.
- Проверены Start, Pause, Resume и восстановление запущенного таймера после обновления ученика. Состояние Paused и оставшееся время появились в обоих окнах. Исправлено округление серверной поправки времени, чтобы отправляемые миллисекунды были целыми.
- Повторно проверено Exercise 1: 5/5. После Reset exercise answers очистились ответы и оценки; данные ученика, дата и общий таймер сохранились. Исходное изображение открывается.
- Локальные тесты: 15/15, включая таймер, его истечение, паузу/продолжение, дробную поправку времени, високосный календарь и валидацию дат.
- Настоящая база: 9/9 (итоговый тест и восемь подслучаев). Добавлены проверки запрета ученических изменений метаданных/таймера, проверки неверных дат и длительностей, сохранения настроек при сбросе ответов.
- Миграция `lesson_workspace_metadata` применена к существующему бесплатному проекту. Supabase security advisors не сообщают замечаний.

Внутренний календарь планирует только текущее занятие. Внешние календарные сервисы и управление несколькими учениками не добавлялись. Снимки интерфейсов: `docs/teacher-workspace.png` и `docs/student-workspace.png`.


## Доработка: индивидуальное Exercise 2

- Задание заменено на Review → Recall → Self-check с пятью исходными парами Exercise 1. Парная инструкция доступна отдельно, в свёрнутой справке.
- В браузере ученик перешёл к карточкам без запуска таймера. До Reveal answer исходное утверждение отсутствует в карточке. Устный ответ допустим без заполнения поля.
- Введённый ответ и текущая карточка сохранились после обновления страницы.
- Пройден полный круг с тремя отметками Remembered и двумя Revisit. Кнопка Practise 2 again открыла отдельный круг только по карточкам 2 и 5; старые черновики этих карточек были очищены.
- После повторения получен итог 5 remembered. Start over вернул Review. Проверены запуск, пауза и сброс необязательного двухминутного таймера.
- Фокус и прокрутка при переходах направляются на текущее задание/карточку, чтобы уменьшение блока не оставляло ученика ниже по странице. Горизонтального переполнения в проверенном настольном окне нет.
- `npm test`: 20/20; добавлены проверки исходных пар, старого состояния таймера, его истечения, раскрытия до самооценки, завершения и очереди повторения трудных карточек.
- `npm run test:cloud`: 10/10 (итоговый тест и девять подслучаев). Проверены передача этапа, индекса, ответа и самооценки ученика преподавателю, самостоятельный сброс Exercise 2 и сохранение других упражнений.
- Миграция individual_memory_practice добавляет ограниченные поля `.memory.*` и право ученика перезапустить Exercise 2. Права на данные занятия и общий таймер остаются преподавательскими.

Снимок индивидуальной карточки: `docs/individual-memory-practice.png`.

## Доработка: меню сервиса в кабинете учителя

- Учительская левая панель содержит только «Ученики» и «Задания». Ученическая панель по-прежнему содержит Vocabulary, Reading, Grammar, Speaking и Listening; меню сервиса и редактируемые данные занятия в ней отсутствуют.
- Проверены переход к карточке текущего ученика, ввод имени в правой панели, немедленное обновление карточки и восстановление выбранной вкладки после перезагрузки. Введённое тестовое имя удалено после проверки, ответы упражнений сохранены.
- Выбор Grammar в правой панели открывает задания 10–11 и вкладку «Задания»; возврат к Vocabulary открывает задания 1–4. Параметр view не заменяет параметры приглашения и его hash.
- Данные ученика и занятия перенесены в правую панель. Приглашение, выбор раздела, общий таймер, календарь, прогресс и обзор ответов находятся там же. Форма и календарь раскрываются отдельно; кнопка изменения данных из карточки раскрывает форму и переводит фокус на имя.
- На ширине 1280 px подтверждено отсутствие горизонтального переполнения у обеих ролей. На ширине 375 px обе версии проверены во встроенных фреймах временной страницы: содержимое помещается в экран; правая панель учителя открывается и закрывается клавишей Escape с возвратом фокуса. Временная страница удалена.
- Локальные тесты: 20/20. Production-сборка TypeScript + Vite проходит. Структура базы и правила общей сессии не менялись.
- Снимки: `docs/teacher-service-assignments.png`, `docs/teacher-service-students.png`, `docs/teacher-service-mobile.png`.

## Основа платформы: независимый раздел учеников

- Создана таблица `teacher_students` с привязкой к аккаунту, RLS, ограниченными правами столбцов и серверной версией записи. Миграция `teacher_students` применена к существующему бесплатному проекту, версия 20261025211851.
- `tests/students.database.sql` выполнен на настоящей базе. Проверены создание, валидация имени/уровня/статуса, изменение, архивирование и восстановление, отказ устаревшей записи, изоляция двух аккаунтов и запрет изменения владельца. Транзакция откатана вместе с синтетическими пользователями и строками. Публичный HTTP-запрос к списку без входа получает 401.
- Supabase security advisors: замечаний нет. Performance advisors: только информационное сообщение о неиспользованном индексе новой пустой таблицы.
- Добавлены регистрация и вход Supabase Auth. Настоящий пароль задаёт пользователь; при регистрации требуется подтверждение email. Автоматическая обработка подтверждения ограничена маршрутом кабинета и не затрагивает приглашения на урок. Письма реальным пользователям при проверках не отправлялись; доставка email и подтверждение настоящего адреса не проверялись.
- UI проверен на временной локальной странице с имитацией Auth/Data API и явно тестовыми данными: вход, список, добавление ученика, карточка, заметки с переносами строк, архивирование/восстановление, поиск и сочетание с фильтром уровня. Подлинные права и изменения строк отдельно проверены SQL-тестом выше. Имитация API не является проверкой настоящей доставки email или сквозного входа Supabase.
- При ширинах 1280 и 375 px проверены список и форма, отсутствие горизонтального переполнения на настольной ширине, мобильная раскладка карточек, закрытие формы Escape и возвращение фокуса к добавлению. Временные страницы проверки удалены перед коммитом. Рабочая база не заполнялась демонстрационными учениками.
- Локальные тесты: 26/26; сборка TypeScript + Vite проходит. Supabase SDK и стили списка загружаются отдельным модулем только при открытии «Учеников». Аудит зависимостей: 0 уязвимостей.
- Снимки с тестовыми данными: `docs/students-roster-qa.png`, `docs/students-profile-qa.png`, `docs/students-mobile-qa.png`.

Прогресс, назначения занятий и домашних работ пока не связаны со списком учеников. Контакты и заметки не переносятся автоматически в старую учебную сессию.

## Основа библиотеки и 30 уроков A1

- Применены миграции `20261025220643_assignment_library` и `20261025222251_material_validation`. Таблицы `lesson_materials` и `material_favourites` независимы от списка учеников и общей сессии. В рабочую базу загружены только 30 общих учебных материалов, без демонстрационных учеников или назначений.
- `tests/materials.database.sql` выполнен на настоящей базе: анонимное чтение 30 уроков, запрет изменения коллекции учителем, создание личного материала, серверная версия, запрет смены владельца и пустых метаданных, добавление/удаление избранного, изоляция двух владельцев. Вся транзакция откатана, включая синтетические аккаунты; email не отправлялись.
- `npm run test:library` проверяет через публичный HTTP API точное совпадение всех 30 полных JSON-уроков с встроенным курсом, их порядок, владельца и версии. Проверка прошла. Security advisors Supabase: замечаний нет. Performance advisors: только INFO об индексах, ещё не использованных на новых/малых таблицах.
- `npm test`: 35/35. Проверяются 30 различных текстов/целей/задач, состав 90 блоков/300 вопросов/180 слов и фраз, все четыре формата и все 8 навыков, правильные ключи и ложные варианты, регистр/пунктуация, импорт повреждённой структуры, раздельные черновики и восстановление после повреждения хранения. Для импортированных длительностей 15–180 минут сумма этапов совпадает с длительностью урока. Существующие тесты комнаты и учеников проходят.
- В реальном браузере проверены каталог из базы, фильтры навыка и уровня, пустая выдача/сброс, поиск урока 29, открытие уроков 1/5/29, переходы по этапам, заполнение пропусков с результатом 4/4 и сборка предложений с результатом 3/3. Ответы и проверка восстановились после обновления; письменный черновик также сохранился. Собственные проверочные ответы очищены через интерфейс.
- Гостевой импорт открывает вход в существующий кабинет. Личный импорт и избранное проверены на уровне настоящих политик/данных SQL; вход с настоящим паролем и доставка email в этой доработке не проверялись. Микрофон не запрашивается. Фактическое звучание английского системного голоса зависит от устройства и не подтверждалось.
- Проверены переходы «Задания → Ученики → Задания» и открытие старой комнаты с прежними ответами, таймером и правой панелью. На 1280 px каталог занимает основную область без панели управления комнатой; на 375 px каталог и ученический урок проверены во временных фреймах, мобильное меню открывается и закрывается Escape. Временная страница удалена перед коммитом.
- Снимки: `docs/assignments-library-qa.png`, `docs/assignments-mobile-qa.png`, `docs/assignments-student-qa.png`. Методика с первичными источниками и её границы: `docs/A1-METHODOLOGY.md`; программа: `docs/A1-CURRICULUM.md`.

Ответы новой коллекции сохраняются в текущем браузере раздельно по роли, материалу и версии. Назначения конкретным ученикам, облачные ответы, совместная комната для новых материалов и журнал прогресса пока не реализованы. Домашняя практика — содержимое урока и локальный черновик. Автоматическая оценка речи и свободного письма не заявляется; образцы служат ориентирами.

## Английский интерфейс

- Переведены меню, заголовки, кнопки, фильтры, поля, состояния, сообщения об ошибках, вход/регистрация, список/форма/карточка ученика, панель старой комнаты и элементы управления новой практикой. Дата добавления ученика использует `en-GB`. Заголовок и описание HTML отражают платформу Lesson Studio.
- Отображаемые темы и краткие описания всех 30 карточек переведены через `material-presentation.ts`. Фильтр по теме сохраняет исходные значения данных; поиск учитывает английское представление. JSON уроков, ключи ответов, версии, схема базы, пользовательские записи и ключи черновиков не менялись.
- В браузере проверены все четыре страницы каталога: 9/9/9/3 карточки, русских подписей в видимом тексте каталога нет. Фильтр Travel возвращает урок 24, поиск introduce — уроки 1 и 5. Проверены подписи уровней A1–C2, пустая выдача A2 и Clear filters. На настольной ширине горизонтального переполнения нет.
- Проверены английские вход и регистрация без отправки формы, а также переходы Students / Assignments. Форма и профиль ученика проверены на временной странице с изолированными синтетическими данными: подписи, статусы, дата 26 October 2026, ошибка Enter the student name. при имени из пробелов. В рабочую базу записи не добавлялись; письма не отправлялись.
- На ширине 375 px визуально проверены библиотека, форма ученика и оболочка практики ученика. Временные страницы удалены. В исходниках интерфейса `.ts/.tsx` кириллицы нет; учебные данные в JSON сохраняются.

Перевод содержания уроков не входит в эту доработку: внутри упражнений пока могут оставаться прежние русскоязычные инструкции, переводы и объяснения.

## Полностью английские задания A1

- Все 30 уроков переведены целиком: инструкции, 180 словарных значений, языковые объяснения, произношение, повторение, обратная связь, разговорные задачи, письмо, критерии, домашняя практика и заметки учителю. Значения слов даны простыми английскими определениями и примерами. Программа и методический документ также переведены на английский.
- Сверка с предыдущей коллекцией подтверждает сохранение целей, уровня, длительности, навыков, номеров, ID заданий/вопросов, типов и количества вопросов, а также исходных английских текстов. Изменились только три ключа с русскими фразами в `a1-19 / description-meaning`: теперь это английские перефразирования. Задания на соответствие и написание слов сохраняют смысловые подсказки вместо готового повторения ответа.
- Обновлены 30 общих строк `lesson_materials` в существующем проекте. Личных материалов в базе на момент проверки нет. Схема, права, данные учеников и избранное не менялись. Проверены 30 уроков, 90 блоков и 300 вопросов; кириллицы в учебном JSON нет. Снимок серверных версий добавлен в `src/data/a1-versions.json`: версии 2, для уроков 11/22 — 3. Повторная загрузка неизменённого урока 1 оставляет его версию 2.
- `npm test`: 37/37. Добавлены полная проверка учебных строк на остатки кириллицы и перенос совместимых старых черновиков. Проверяются сохранение свободного письма/домашней работы/самооценки, перевод выбранных значений урока 19 с сохранением правильности/ошибки, изоляция ролей и запрет переноса в будущие неподтверждённые версии. Существующий новый черновик или сброс не заменяется старым.
- `npm run test:library` прошёл через настоящий публичный API: все 30 JSON-уроков и версии точно совпадают со встроенной коллекцией. TypeScript и production-сборка Vite проходят.
- В браузере проверено английское содержимое урока 19, неверный выбор с английским объяснением и результатом 2/3, исправление и повторная проверка 3/3. На отдельной временной странице обращения только к REST API базы отклонялись: показана встроенная коллекция из 30 уроков, открыта та же английская практика, восстановлены ответы и 3/3 из локального черновика. В видимом тексте урока кириллицы и горизонтального переполнения нет. Собственные проверочные ответы очищены; временная страница удалена.

Свободные пользовательские ответы, имена и заметки не переводятся автоматически. Задания остаются индивидуальной практикой; облачный журнал результатов и назначение конкретному ученику не добавлялись.


## 2026-10-27 — English as the source language

- Added a single explicit product language and display locale: English / en-GB. Library search, topic sorting, dates and speech synthesis use the product locale. Lesson time zones remain independent.
- Added AGENTS.md with the English authoring policy: British English source, short learner instructions, explicit future localisations and no automatic rewriting of learner text.
- Audited the application source, public text and all 30 built-in lessons. No Cyrillic product strings remain. A script check is only a regression guard; wording and task meaning were reviewed separately.
- Edited unnatural instructions, definitions and goals in the course. Replaced lesson 19's description-paraphrase activity with identifying Ben, Eva and Mia from contextual descriptions.
- Removed the language-specific answer conversion from draft restoration. A reviewed revision manifest preserves compatible work and learner writing, and resets only the retired lesson 19 activity. Current drafts and explicit resets take priority; roles and unknown future revisions remain isolated.
- Updated changed shared lessons and packaged revision metadata. The public API integration test confirms exact JSON content and versions for all 30 lessons.
- npm test: 39/39; npm run test:library: 1/1; TypeScript and Vite production build pass. The 30 lessons retain 90 checked blocks, 300 questions and 180 vocabulary entries.
- Browser checks: Materials / Lesson library; uppercase I LIKE search finds Food I like; student Warm-up / Self-check / Homework labels; lesson 19 feedback at 2/3, correction to 3/3, then cleared only the three test selections. The rendered student page has lang=en, no Cyrillic text and no horizontal overflow at 1280 px. Teacher calendar displays October 2026 and Europe/Warsaw. No student records or account settings were changed.


## 2026-10-27 — Complete interface language review

- Reviewed every existing teacher and student screen, including navigation, library filters and empty states, lesson stages, profile and import dialogs, account forms, timers, calendars, audio notices, saved-work messages and connection failures.
- Standardised Materials / Lesson library, Import lesson / Download template / Download lesson JSON, previous-page controls, completion actions and teacher/student guidance. Corrected the duplicated homework wording and Back to warm-up navigation.
- Replaced developer setup directions in learner-facing notices with usable guidance. Textbook notices now explain missing pages and recordings without asking the learner to edit lesson data or server folders. Reading tabs identify Text A / Text B.
- Account and student forms show inline English validation independently of native browser validation bubbles, focus the first invalid field, and keep labels separate from error descriptions. Lesson duration errors also use the application's English message.
- Shared request errors retain their HTTP status for reconnection handling but display known, actionable English messages instead of raw server details. Local practice and teacher previews explicitly describe browser-only saving.
- Fixed View textbook availability in the teacher classroom; the same source dialog is now accessible to both roles. Updated teacher-link controls to Show/Hide and added the expanded state.
- Browser checks used localhost: library, sign-in dialog and required-field messages, empty search results, student homework, teacher duration validation, the source dialog and student audio notices. No actual sign-in, account creation, password change or student save was submitted.
- Temporary local fixtures rendered the real student editor, profile and import components with fictional data and blocked backend requests. Checked required name and invalid email, profile dates and empty history, malformed JSON and the offline A1 fallback. Fixtures were removed after review.
- Tested the account page, library, student practice and classroom in a 375 px iframe viewport. The content area and scroll width were both 360 px after the native scrollbar; opening the mobile controls and calendar did not introduce horizontal overflow. Calendar labels and screen-reader date names are English.
- Final checks: npm test passes 42/42, including account validation and shared-request error status preservation. TypeScript and the Vite production build pass. Static product sources contain no Cyrillic strings, stale homework wording or developer audio paths.


## 2026-10-27 — Separate teacher and student workspaces

- Added independent teacher/student entry components and canonical paths under /teacher/ and /student/. The root page offers separate entry links. Student navigation contains no teacher service menu or workspace role switch.
- Teacher roster, library, previews and classroom now have their own paths. Student classroom and material practice use student-only paths. Canonical paths ignore mode/view role overrides; previous root URLs redirect while preserving lesson IDs, invitation fragments and account confirmation tokens.
- Moved the textbook classroom into a shared fixed-role component. Service navigation never carries lesson capabilities to roster/library pages. A shared classroom waits for the server to verify its invitation role; wrong-workspace invitation URLs redirect to the verified workspace before rendering controls.
- Cached work no longer restores an authoritative invitation role. The first request verifies the invitation before replaying queued changes.
- Split local textbook draft keys and BroadcastChannel names by workspace. The previous shared browser draft is retained as independent snapshots; existing role drafts and resets take precedence. Material-practice draft keys remain unchanged.
- Kept the existing email-provider redirect allow-list contract through a legacy return URL that is canonicalised before Auth callback processing. Both callback formats reject lesson invitation credentials. No Google provider, account entitlement, database schema or RLS changes were introduced.
- npm test: 51/51; TypeScript and Vite production build pass. content:build still produces the same 30 lessons, 90 blocks, 300 questions and 180 vocabulary entries; only curriculum links changed.
- Browser: teacher library and lesson deep-link refresh; legacy material bookmark redirects; student practice deep-link refresh; student URL with forged teacher query parameters stays student; no teacher menu, teacher controls, teacher keys or teacher links in the tested student views.
- One isolated real shared lesson verified both invitation mismatches: teacher capability at the student path returned to /teacher/classroom, student capability at the teacher path returned to /student/classroom. A student answer synchronised to the teacher. Test answers were cleared and the temporary credential file removed.
- At a 375 px iframe viewport, the entry page, teacher library and student classroom each had a 360 px content area and matching scroll width. Temporary review files and tabs were removed.
- Account-based teacher entitlements, student memberships and Google sign-in remain the separate authentication step described in the platform plan.

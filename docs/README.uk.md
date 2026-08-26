# NZXT-ESC - Найкраща NZXT Web Integration

### Розширений редактор макетів і налаштування екрана для NZXT Kraken AIO

Створюйте повністю редаговані LCD-макети NZXT Kraken з оверлеями датчиків, які можна перетягувати, власними шрифтами, зображеннями, GIF, APNG, відео MP4, WebM, годинниками, графіками, даними Now Playing та візуалізаціями, що реагують на звук, які відображаються в реальному часі через **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-25-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Відкрити в NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Відкрити живий перегляд](https://nzxt-esc.pages.dev/)
· [Підтримувані моделі Kraken](#supported-nzxt-kraken-lcd-models)
· [Можливості](#features)
· [Швидкий старт](#quick-start)
· [FAQ](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="Редактор LCD-макетів NZXT Kraken NZXT-ESC із перетягуванням"
       width="70%" />

> [!NOTE]
> **NZXT-ESC незалежний проєкт спільноти.** Він не пов'язаний з NZXT, не спонсорується та не схвалюється компанією NZXT.

Якщо NZXT-ESC покращив вашу систему, ви можете підтримати його подальшу розробку:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## Налаштування LCD NZXT Kraken без фіксованих макетів

NZXT-ESC перетворює дисплей NZXT Kraken на полотно з довільним розташуванням елементів. Створіть власний LCD-екран, розмістивши кожен датчик, графіку, годинник, зображення чи медіаелемент саме там, де потрібно. Змінюйте розмір, обертайте, змінюйте порядок, перейменовуйте, блокуйте та оформлюйте елементи, спостерігаючи, як результат оновлюється в реальному часі через NZXT CAM.

Основний редактор **не потребує облікового запису** і **не потребує окремого встановлення для кінцевого користувача**. Пресети та локальні медіа залишаються у сховищі браузера. Додаткові музичні оверлеї використовують локальний супутній Windows-застосунок [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="supported-nzxt-kraken-lcd-models"></a>

## Підтримувані LCD-моделі NZXT Kraken

NZXT-ESC підтримує рідинні системи охолодження NZXT Kraken AIO з LCD-дисплеями та NZXT CAM Web Integration, зокрема поточні та попередні покоління моделей Kraken Elite, Kraken Plus, Kraken і Kraken Z.

NZXT Kraken Elite (2024)
NZXT Kraken Elite 240
NZXT Kraken Elite 360
NZXT Kraken Elite 240 RGB
NZXT Kraken Elite 280 RGB
NZXT Kraken Elite 360 RGB
NZXT Kraken Elite 420 RGB
NZXT Kraken Plus (2025)
NZXT Kraken Plus 240
NZXT Kraken Plus 280
NZXT Kraken Plus 360
NZXT Kraken Plus 240 RGB
NZXT Kraken Plus 360 RGB
NZXT Kraken Elite (2023)
NZXT Kraken Elite 240 (2023)
NZXT Kraken Elite 280 (2023)
NZXT Kraken Elite 360 (2023)
NZXT Kraken Elite 240 RGB (2023)
NZXT Kraken Elite 280 RGB (2023)
NZXT Kraken Elite 360 RGB (2023)
NZXT Kraken (2023)
NZXT Kraken 240
NZXT Kraken 280
NZXT Kraken 360
NZXT Kraken 240 RGB
NZXT Kraken 280 RGB
NZXT Kraken 360 RGB
NZXT Kraken Z Series
NZXT Kraken Z53
NZXT Kraken Z63
NZXT Kraken Z73
NZXT Kraken Z53 RGB
NZXT Kraken Z63 RGB
NZXT Kraken Z73 RGB

NZXT-ESC автоматично адаптує макет до роздільної здатності, розміру та форми LCD-дисплея Kraken, які повідомляються через API NZXT CAM, що дозволяє відображати власні макети, оверлеї датчиків, анімовані фони, графіку та медіа через NZXT CAM Web Integration.

<a id="quick-start"></a>
## Швидкий старт

### Відкрити безпосередньо в NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Натисніть **Open NZXT-ESC in NZXT CAM**.
2. Дозвольте браузеру відкрити NZXT CAM.
3. Підтвердьте **Load Web Integration**.
4. Відкрийте нову картку Web Integration і виберіть **Configure**.
5. Створіть свій макет; зміни синхронізуються з дисплеєм Kraken.

<details>
<summary><strong>Ручне налаштування в NZXT CAM</strong></summary>

1. Відкрийте **NZXT CAM**.
2. Перейдіть до **Lighting → Kraken → LCD Display**.
3. Виберіть **Web Integration**.
4. Відкрийте налаштування **Custom Web Integration**.
5. Введіть:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Виберіть **Apply**, потім **Add as Card**.
7. Відкрийте нову картку і виберіть **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Екран налаштування NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Додавання NZXT-ESC як картки NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## Подивіться на це в дії

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Власний LCD-пресет NZXT Kraken, створений у NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Анімований макет дисплея NZXT Kraken у NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Оверлей датчиків NZXT CAM у реальному часі на LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Власний анімований LCD-екран Kraken, що працює через NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Можливості

| Можливість | Що це дає |
|---|---|
| **Редактор довільних макетів** | Перетягуйте, змінюйте розмір, обертайте, керуйте шарами, блокуйте, перейменовуйте та точно розташовуйте кожен елемент. |
| **Дані датчиків NZXT CAM у реальному часі** | Створюйте власні екрани для CPU, GPU, RAM, температури рідини, потужності, частоти та швидкості вентиляторів. |
| **Розширена графіка** | Поєднуйте радіальну, лінійну, кругову та історичну графіку датчиків в одному макеті. |
| **Анімовані фони** | Використовуйте кольори, градієнти, локальні зображення, GIF, відео MP4, прямі URL-адреси медіа, YouTube та Pinterest. |
| **Інтеграція Now Playing** | Показуйте обкладинку альбому, інформацію про трек і візуалізації, що реагують на звук, з локального Windows-клієнта. |
| **Explore і Library** | Імпортуйте пресети спільноти, редагуйте кожну деталь, впорядковуйте обране та підтримуйте власну локальну колекцію пресетів. |
| **Зберігання насамперед локально** | Пресети використовують LocalStorage; локальні медіафайли - IndexedDB і залишаються на вашому пристрої. |
| **Багатомовний редактор** | Користуйтеся інтерфейсом однією з 25 підтримуваних мов. |

### Елементи оверлею

Поточний редактор групує елементи оверлею у чотири зрозумілі категорії:

| Вміст | Дані | Час | Аудіо |
|---|---|---|---|
| Текст | Датчик | Цифровий годинник | Обкладинка альбому |
| Фігура | Радіальна графіка | Аналоговий годинник | Текст Now Playing |
| Значок | Лінійна графіка | Дата | Аудіовізуалізатор |
| Стікер | Кругова графіка |  |  |
| Зображення | Графік датчика |  |  |

Там, де це можливо, кожен елемент використовує однаковий візуальний робочий процес: виберіть його в попередньому перегляді або списку шарів, а потім налаштуйте положення, розмір, поворот, порядок, стиль і параметри, специфічні для типу елемента.

### Моніторинг апаратного забезпечення

Створюйте макети в реальному часі на основі доступних даних моніторингу NZXT CAM, зокрема:

`температура CPU` · `навантаження CPU` · `частота CPU` · `потужність CPU` · `швидкість вентилятора CPU` · `температура GPU` · `навантаження GPU` · `частота GPU` · `потужність GPU` · `швидкість вентилятора GPU` · `використання RAM` · `температура рідини`

Системи з кількома GPU можуть автоматично вибирати активний графічний процесор або використовувати конкретний GPU. Коли API NZXT CAM недоступне, редактор у браузері також надає тестові значення, тож макети все одно можна створювати та переглядати.

### Фони та медіа

Використовуйте суцільний колір або градієнт як основу, а потім додавайте медіа з:

- Локальних файлів PNG, JPG, GIF, WebP або MP4
- Прямих URL-адрес зображень і відео
- Відео YouTube
- Медіапосилань Pinterest

Фонові медіа можна позиціонувати, масштабувати, підганяти під розмір і поєднувати з будь-яким макетом оверлеїв. Локальні файли зберігаються в IndexedDB і не завантажуються NZXT-ESC на сервер.

### Пресети, Explore і Library

- Зберігайте та впорядковуйте до **20 власних пресетів** у локальній Library.
- Створюйте кожен пресет із до **40 елементів оверлею**.
- Імпортуйте та експортуйте редаговані файли пресетів для резервного копіювання чи обміну.
- Переглядайте макети, створені спільнотою, через **Explore**.
- Додайте пресет з Explore до Library, налаштуйте його та зробіть своїм.
- Підтримуйте синхронізацію редагування та відображення на Kraken між двома режимами перегляду NZXT CAM.

## Now Playing та аудіовізуалізатор

Додатковий Windows-клієнт [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) працює локально та надсилає дані медіасесії й аудіоспектра до NZXT-ESC через локальне з'єднання WebSocket.

Використовуйте його, щоб додати:

- **Обкладинку альбому** поточну обкладинку з налаштуванням розміру, рамки та кутів
- **Текст Now Playing** назву, виконавця або альбом із прокручуванням довгого тексту
- **Аудіовізуалізатор** настроювані спектр і форму хвилі в реальному часі

Це не обмежується Spotify. Супутній застосунок зчитує підтримувані медіасесії Windows та системний звук із браузерів, медіаплеєрів та інших застосунків.

<a id="languages"></a>
## Мови

Наразі редактор підтримує:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino` · `العربية` · `Bahasa Melayu` · `Ελληνικά` · `繁體中文` · `Tiếng Việt` · `Українська` · `Magyar`

**Перекладена документація:**
[English](../README.md) ·
[Türkçe](README.tr.md) ·
[Español](README.es.md) ·
[Deutsch](README.de.md) ·
[Português-BR](README.pt-BR.md) ·
[Français](README.fr.md) ·
[Italiano](README.it.md) ·
[日本語](README.ja.md) ·
[ไทย](README.th.md) ·
[Polski](README.pl.md) ·
[Svenska](README.sv.md) ·
[Nederlands](README.nl.md) ·
[한국어](README.ko.md) ·
[Русский](README.ru.md) ·
[हिन्दी](README.hi.md) ·
[Bahasa Indonesia](README.id.md) ·
[Čeština](README.cs.md) ·
[Filipino](README.fil.md) ·
[العربية](README.ar.md) ·
[Bahasa Melayu](README.ms.md) ·
[Ελληνικά](README.el.md) ·
[繁體中文](README.zh-TW.md) ·
[Tiếng Việt](README.vi.md) ·
[Українська](README.uk.md) ·
[Magyar](README.hu.md)

## Приватність і локальне зберігання

NZXT-ESC побудований навколо локального сховища браузера:

- Конфігурація пресетів зберігається в **LocalStorage**.
- Локальні зображення та відео зберігаються в **IndexedDB**.
- Показання датчиків NZXT CAM і пресети, створені користувачами, не надсилаються до аналітики.
- Застосунок навмисно не збирає персональні дані, що дозволяють ідентифікувати особу.

Робочий вебсайт використовує **Google Tag Manager** і **Google Analytics 4** для необов'язкової анонімної продуктової аналітики. **CookieYes** керує згодою там, де це потрібно, а файли cookie Google Analytics вмикаються відповідно до вибору користувача щодо згоди.

Розгорнутий вебсайт також використовує **Cloudflare Web Analytics**, увімкнену через Cloudflare Pages і незалежну від Google Tag Manager. Вона надає орієнтовану на приватність аналітику трафіку й продуктивності вебсайту без використання файлів cookie чи LocalStorage.

### Участь у розробці

Ми раді внескам і точковим pull request. Перш ніж вносити архітектурні зміни, ознайомтеся з:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Кодекс поведінки](../CODE_OF_CONDUCT.md)
- [Політика безпеки](../SECURITY.md)

<a id="faq"></a>
## FAQ

<details>
<summary><strong>Чи потрібно встановлювати NZXT-ESC?</strong></summary>

Основний редактор не потребує окремого встановлення. Відкрийте його через NZXT CAM Web Integration. Лише додаткові музичні оверлеї потребують локального Windows-клієнта NowPlaying.WebSocket.

</details>

<details>
<summary><strong>Чи працює NZXT-ESC без NZXT CAM?</strong></summary>

Редактор можна відкрити у звичайному браузері, і він використовує тестові значення датчиків для дизайну. Моніторинг апаратного забезпечення в реальному часі та виведення на дисплей Kraken потребують NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Які моделі NZXT Kraken підтримуються?</strong></summary>

NZXT-ESC підтримує системи охолодження з LCD-дисплеєм серій **NZXT Kraken Elite, Kraken Plus, Kraken (2023) та Kraken Z**, які надають режим дисплея NZXT CAM Web Integration.

Перегляньте повний перелік [підтримуваних LCD-моделей NZXT Kraken](#supported-nzxt-kraken-lcd-models).

</details>

<details>
<summary><strong>Де зберігаються пресети та локальні медіа?</strong></summary>

Пресети зберігаються в LocalStorage браузера. Локальні зображення та відео зберігаються в IndexedDB. Регулярно експортуйте важливі пресети під час переходу на інший браузер, установлення Windows або комп'ютер.

</details>

<details>
<summary><strong>Чи потрібен Spotify для Now Playing?</strong></summary>

Ні. NowPlaying.WebSocket використовує підтримувані медіасесії Windows і системний звук, тому може працювати з браузерами та іншими сумісними медіазастосунками.

</details>

<details>
<summary><strong>Чи можна редагувати пресети спільноти?</strong></summary>

Так. Пресети, імпортовані з Explore, повністю редаговані після додавання до Library.

</details>

<details>
<summary><strong>Як працює Supporter Access?</strong></summary>

NZXT-ESC розробляється та підтримується незалежно. Коли у вас буде достатньо часу, щоб по-справжньому оцінити проєкт, NZXT-ESC може запитати, чи бажаєте ви підтримати його подальшу розробку, чи хочете ще трохи часу на роздуми.

Підтримка не обов'язково означає гроші. Відгуки, повідомлення про помилки, ідеї, поширення інформації про проєкт, допомога іншим у його відкритті та інші вагомі внески спільноти - усе це допомагає NZXT-ESC розвиватися.

Коди Supporter Access доступні прихильникам проєкту, а також можуть бути подаровані учасникам спільноти, які роблять вагомий внесок у розвиток NZXT-ESC.

Час використання враховується лише тоді, коли NZXT-ESC активно працює на дисплеї Kraken.

</details>

<a id="license"></a>
## Ліцензія

NZXT-ESC розповсюджується за **Ліцензією для особистого використання**.

**Дозволено:** особисте використання, особисті модифікації та повторне розповсюдження з чітким зазначенням авторства оригінального проєкту.

**Комерційне використання:** продаж, включення до наборів, оренда, інтеграція в платний продукт або інше монетизоване використання потребують попереднього письмового дозволу власника проєкту.
Повні умови див. у [LICENSE](../LICENSE).

## Підтримка та спільнота

- **Вебсайт:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **YouTube:** [@nzxt-esc](https://youtube.com/@nzxt-esc)
- **Instagram:** [@nzxtesc](https://www.instagram.com/nzxtesc/)
- **Останній випуск:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Повідомлення про помилки та ідеї:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)

Стежте за NZXT-ESC на YouTube та Instagram, щоб бачити приклади оформлення, нові функції, навчальні матеріали, роботи спільноти та новини проєкту.

Якщо NZXT-ESC зайняв гідне місце у вашій системі, є багато способів підтримати проєкт: діліться відгуками та ідеями, повідомляйте про помилки, допомагайте іншим відкрити для себе NZXT-ESC, робіть внесок у розвиток спільноти - або просто пригостіть мене кавою.

Будь-який внесок допомагає NZXT-ESC рухатися вперед, а підтримка кавою допомагає покривати витрати на сервер, API, хостинг та обслуговування.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Створено **Gökhan AKGÜL (mRGogo)** - на каві та сумнівному режимі сну.

</div>

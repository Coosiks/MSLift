# 🏋️‍♂️ MSLift — Полнофункциональная экосистема для силовых видов спорта и пауэрлифтинга

<p align="center">
  <img src="https://img.shields.io/badge/Java-21_LTS-orange?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/OpenAPI_3.0-Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger OpenAPI 3" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tests-JUnit_5_&_Vitest-25A162?style=for-the-badge&logo=vitest&logoColor=white" alt="JUnit 5 & Vitest" />
  <img src="https://img.shields.io/badge/Offline--First-Ready-10B981?style=for-the-badge&logo=pwa&logoColor=white" alt="Offline-First" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <strong>MSLift</strong> — современная кроссплатформенная веб- и мобильная экосистема для спортсменов, пауэрлифтеров и тренеров. Объединяет в себе интерактивную библиотеку тренировочных программ, гибкий дневник тренировок с подсобными упражнениями, научный калькулятор 1ПМ, дневник питания, расчет суточной нормы КБЖУ и полную автономность в условиях отсутствия интернета.
</p>

---

## ⚡ Основные возможности

### 1. Библиотека тренировочных программ (30+ программ)
- Каталог классических и современных циклов: программы **Б.И. Шейко**, **А. Фалеева**, **В. Муравьёва**, **Л. Остапенко**, **Wendler 5/3/1**, **Candito 6-Week**, **Texas Method**, **Смолова**, **Воробьёва** и др.
- Фильтрация по направлениям: *Пауэрлифтинг, Жим лёжа, Присед, Базовые, Начинающие*.
- Интерактивный расчет рабочих весов по процентам от персональных 1ПМ атлета (жим, присед, тяга).

### 2. Интерактивный дневник тренировок
- Выбор тренировочной программы с автоподстановкой базовых упражнений по дням недели.
- Добавление персональных подсобных упражнений (название, подходы, повторения, вес, RPE).
- Сохранение тренировочных сессий в PostgreSQL с хронологией и детальным разбором подходов.

### 3. Калькулятор 1ПМ (Одноповторный максимум)
- Расчет предельного максимума по валидированным спортивным формулам **Эпли (Epley)** и **Бржицки (Brzycki)**.
- Интерактивная таблица зон интенсивности от 60% до 100% с шагом весов и оценкой повторений по RPE.

### 4. Дневник питания и подсчет макронутриентов
- Гибкий учет приемов пищи за день: Завтрак, Обед, Ужин, Перекус.
- Автоматический подсчет суммарных калорий, белков, жиров и углеводов с пересчетом граммовок порций.
- Интеграция с суточными целевыми показателями атлета и динамическая шкала прогресса дефицита/профицита.

### 5. Калькулятор и суточная норма КБЖУ
- Научный расчет базового уровня метаболизма (**BMR**) по формулам **Миффлина — Сан-Жеора** и **Кэтча — МакАрдла** (с учетом сухой мышечной массы).
- Расчет суточных энергозатрат (**TDEE**) с учетом коэффициента силовой активности (PAL 1.2 – 1.9).
- Персонализированное распределение макронутриентов под 3 ключевые спортивные цели: *Сброс веса / Сушка (-15%)*, *Поддержание / Рекомпозиция*, *Набор массы (+15%)*.

### 6. Мобильный опыт (Capacitor & UX)
- Нативная сборка под Android через **Capacitor**.
- Интеграция с **Keep-Awake** (экран не гаснет во время выполнения подходов) и **Local Notifications** (таймер отдыха между подходами с виброоткликом).

### 7. Темы оформления (Dark & Light Mode)
- Полноценная светлая и тёмная тема с сохранением предпочтения в `localStorage`.
- Плавные микроанимации, адаптивный дизайн для мобильных устройств, планшетов и десктопов.

---

## 🌐 Архитектура Offline-First и автономность в зале

Специфика силового спорта и пауэрлифтинга такова, что тренировки регулярно проходят в **подвальных помещениях, полуподвалах или специализированных залах с железобетонными перекрытиями**, где мобильная сеть и Wi-Fi сигнал либо крайне нестабильны, либо полностью отсутствуют.

В **MSLift** реализована полноценная **Offline-First архитектура**, гарантирующая бесперебойную работу атлета без интернета:

1. **Встроенная база данных программ (Pre-bundled Database)**:
   - Вся база из 30+ авторских программ (Шейко, Фалеев, Муравьев, Wendler, Candito и др.) встроена в клиентский бандл (`programsDb.json`).
   - Каталог, сетка тренировочных дней, упражнения и проценты открываются мгновенно при нулевом сигнале сети.
2. **Автономное математическое ядро на клиенте**:
   - Формулы расчета 1ПМ (Epley, Brzycki), процентных сеток, метаболизма (BMR Mifflin-St Jeor, Katch-McArdle) и распределения макронутриентов работают прямо в браузере / WebView на чистом TypeScript.
   - При отсутствии связи API-клиент прозрачно активирует локальные вычисления без отображения блокирующих ошибок.
3. **Локальное персистентное хранилище**:
   - Профиль спортсмена, персональные 1ПМ, целевые нормы КБЖУ и записи дневника кэшируются через `@capacitor/preferences` и `localStorage`.
   - При появлении сети данные синхронизируются с сервером PostgreSQL.
4. **Аппаратные фичи для тренировочного зала**:
   - **Keep-Awake (Screen Lock)**: дисплей смартфона остается включенным во время подходов, исключая необходимость разблокировать устройство магнезированными руками.
   - **Local Notifications**: таймер отдыха между подходами (от 1.5 до 5 минут) отправляет уведомление и виброотклик даже при свернутом приложении или заблокированном телефоне.

---

## 📖 Интерактивная документация API (Swagger / OpenAPI 3.0) и серверная валидация

Архитектура REST API бэкенда спроектирована по строгим стандартам промышленной разработки:

### Swagger UI и спецификация OpenAPI
- **Интерактивный UI**: [`http://localhost:8080/swagger-ui.html`](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON спецификация**: [`http://localhost:8080/v3/api-docs`](http://localhost:8080/v3/api-docs)
- Все контроллеры и DTO задокументированы аннотациями Springdoc OpenAPI 3.0 (`@Tag`, `@Operation`, `@ApiResponse`, `@Schema`), с примерами тел запросов, кодов ответов (200, 201, 400, 404, 500) и моделей данных. Прямо из браузера можно отправлять тестовые запросы и проверять контракты API.

### Серверная валидация данных (Jakarta Validation + GlobalExceptionHandler)
Для обеспечения целостности данных и защиты от некорректных входных параметров на уровне бэкенда внедрена строгая валидация:
- **DTO Аннотации**:
  - `OneRepMaxRequest`: `@NotNull`, `@Positive` на вес снаряда; `@NotNull`, `@Min(1)`, `@Max(36)` на число повторений;
  - `NutritionEntryRequest`: `@Positive` на массу порции (граммы), `@PositiveOrZero` на калории и макронутриенты;
  - `WorkoutSetRequest`: `@NotNull`, `@Positive` на рабочий вес, `@Min(1)` на повторы, `@Min(1)`, `@Max(10)` на шкалу RPE;
  - `TrainingDiaryRequest`: `@NotBlank` на идентификаторы программ, `@NotNull`, `@Min(1)` на номера недель и дней.
- **Контроллеры**:
  - Все методы контроллеров (`OneRepMaxController`, `NutritionController`, `WorkoutController`) защищены аннотацией `@Valid`.
- **Централизованная обработка ошибок (`@RestControllerAdvice`)**:
  - Класс `GlobalExceptionHandler` перехватывает `MethodArgumentNotValidException` и возвращает клиенту стандартизированный ответ `HTTP 400 Bad Request` с картой полей и описанием ошибок:
    ```json
    {
      "timestamp": "2026-11-02T14:00:00",
      "status": 400,
      "error": "Validation Failed",
      "errors": {
        "weight": "Вес снаряда должен быть положительным числом",
        "reps": "Количество повторений не должно превышать 36"
      }
    }
    ```
- **Автоматические тесты валидации**:
  - Слой контроллеров покрыт тестами `MockMvc` (`OneRepMaxControllerValidationTest`), валидирующими отсечение некорректных запросов с отрицательным весом или выходом за границы диапазона повторений.

---

## 🛠 Технологический стек

### Бэкенд
- **Язык**: Java 21 (LTS)
- **Фреймворк**: Spring Boot 3.3.5 (Spring Web, Spring Data JPA, Spring Security)
- **API Документация**: Springdoc OpenAPI 3.0 + Swagger UI (`/swagger-ui.html`)
- **Валидация**: Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Positive`, `@Min`, `@Max`, `@NotBlank`) + Централизованный `GlobalExceptionHandler` (`@RestControllerAdvice`)
- **База данных**: PostgreSQL 16 + H2 (in-memory для изолированных тестов)
- **Миграции**: Flyway Migration
- **Тестирование**: JUnit 5, Mockito, AssertJ, Spring Boot Test (MockMvc slice validation tests)
- **Сборка**: Gradle Wrapper
- **Утилиты**: Lombok, Docker Compose, JJWT (JSON Web Token)

### Фронтенд
- **Фреймворк**: React 19 + TypeScript
- **Сборщик**: Vite 8.3
- **Архитектура**: Offline-First (локальная база программ, client-side fallback для калькуляторов и дневника)
- **Тестирование**: Vitest (покрытие калькуляторов 1ПМ и КБЖУ, формулы Эпли, Бржицки, Миффлина-Сан Жеора, Кэтча-МакАрдла)
- **Мобильный стек**: Capacitor (@capacitor/core, @capacitor/local-notifications, @capacitor-community/keep-awake, @capacitor/preferences)
- **Стилизация**: Tailwind CSS v4 + Glassmorphism
- **Иконки**: Lucide React
- **Графики**: Recharts
- **Маршрутизация**: React Router DOM v7

---

## 📁 Структура репозитория

```text
MSLift/
├── src/                          # Исходный код бэкенда (Spring Boot)
│   ├── main/
│   │   ├── java/com/coociks/mslift/
│   │   │   ├── config/           # CORS, Web MVC, Beans, Security
│   │   │   ├── controller/       # REST API контроллеры (@Valid, OpenAPI)
│   │   │   ├── dto/              # Request / Response DTO с валидацией
│   │   │   ├── entity/           # JPA сущности базы данных
│   │   │   ├── exception/        # GlobalExceptionHandler (@RestControllerAdvice)
│   │   │   ├── repository/       # Spring Data репозитории
│   │   │   └── service/          # Бизнес-логика платформы
│   │   └── resources/
│   │       ├── application.yml   # Конфигурация приложения
│   │       └── db/migration/     # Flyway SQL-миграции
│   └── test/                     # Модульные, интеграционные и MockMvc тесты валидации
├── frontend/                     # Исходный код фронтенда (React + Vite)
│   ├── src/
│   │   ├── components/           # Переиспользуемые компоненты (Navbar, таймеры и др.)
│   │   ├── context/              # Контекст темы оформления (ThemeContext)
│   │   ├── pages/                # Страницы (Dashboard, Programs, Workouts, ...)
│   │   ├── services/             # HTTP API-клиент + Offline Fallback
│   │   ├── utils/                # Чистые математические модули (oneRepMax.ts, nutrition.ts)
│   │   ├── test/                 # Модульные тесты Vitest (калькуляторы 1ПМ и КБЖУ)
│   │   ├── types/                # TypeScript интерфейсы
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts            # Конфигурация Vite & Vitest
├── .github/workflows/ci.yml      # GitHub Actions CI (Java 21 Gradle + Vitest + Vite build)
├── docker-compose.yml            # Сервисы Docker (PostgreSQL 16)
├── build.gradle                  # Gradle конфигурация
└── README.md
```

---

## 🚀 Быстрый старт

### Требования
- **Java**: 21 LTS (OpenJDK 21 / Eclipse Temurin)
- **Node.js**: 20+ и **npm**
- **Docker** и **Docker Compose** (для запуска PostgreSQL)

### 1. Клонирование репозитория
```bash
git clone https://github.com/Coosiks/MSLift.git
cd MSLift
```

### 2. Запуск базы данных в Docker
```bash
docker compose up -d
```
> База данных PostgreSQL поднимется на порту `5433` (база `mslift`, пользователь `mslift`, пароль `mslift_secret`).

### 3. Запуск бэкенда (Spring Boot)
В корневой папке проекта:
```bash
# Windows
.\gradlew.bat bootRun

# Linux / macOS
./gradlew bootRun
```
> REST API будет доступен по адресу: `http://localhost:8080/api`  
> Swagger UI интерактивная документация: `http://localhost:8080/swagger-ui.html`

### 4. Запуск фронтенда (React + Vite)
В отдельном окне терминала:
```bash
cd frontend
npm install
npm run dev
```
> Фронтенд запустится на: `http://localhost:5173/`

### 5. Запуск автоматических тестов

**Тестирование бэкенда (JUnit 5, Mockito, MockMvc Validation):**
```bash
# Windows
.\gradlew.bat test

# Linux / macOS
./gradlew test
```

**Тестирование фронтенда (Vitest Unit Tests для калькуляторов 1ПМ и КБЖУ):**
```bash
cd frontend
npm test
```

---

## 📡 Ключевые REST API Эндпоинты

| Метод | URL | Описание | Валидация |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/programs` | Получить каталог программ тренировок | — |
| `GET` | `/api/programs/{id}` | Детали программы и дни тренировок | — |
| `POST` | `/api/programs/calculate` | Расчет рабочих весов по 1ПМ | `@Valid` |
| `POST` | `/api/calculator/1rm` | Серверный расчет 1ПМ (Epley / Brzycki) | `@Valid` (`@Positive`, `@Min(1)`, `@Max(36)`) |
| `GET` | `/api/workouts` | История тренировок из дневника | — |
| `POST` | `/api/workouts` | Сохранить завершенную тренировку | `@Valid` (`@NotBlank`, `@Min(1)`) |
| `POST` | `/api/workouts/sets` | Добавить подход в упражнение | `@Valid` (`@Positive`, `@Min(1)`, `@Max(10)`) |
| `DELETE` | `/api/workouts/{id}` | Удалить запись из дневника | — |
| `GET` | `/api/nutrition/day?date=YYYY-MM-DD` | Питание и КБЖУ за указанную дату | — |
| `POST` | `/api/nutrition/entry` | Добавить блюдо / продукт | `@Valid` (`@Positive`, `@PositiveOrZero`) |
| `DELETE` | `/api/nutrition/entry/{id}` | Удалить прием пищи | — |
| `GET` | `/api/nutrition/target` | Текущая целевая норма КБЖУ | — |
| `POST` | `/api/nutrition/target` | Сохранить / обновить суточную норму | `@Valid` |

---

## 📝 Соглашение о коммитах (IT Git Etiquette)

В проекте принято соглашение [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — добавление новой функциональности
- `fix:` — исправление ошибок
- `docs:` — обновление документации
- `test:` — добавление и обновление тестов
- `refactor:` — рефакторинг кода без изменения логики
- `style:` — правки форматирования, CSS, отступов
- `chore:` — обновление зависимостей, сборки, конфигураций

---

## 📄 Лицензия и отказ от ответственности

### 1. Лицензия (MIT License)
Проект распространяется под открытой лицензией [MIT](LICENSE).  
Copyright (c) 2026 [Coosiks](https://github.com/Coosiks).  
Код открыт для изучения, форков и использования в рамках портфолио и некоммерческой разработки.

### 2. Отказ от медицинской и спортивной ответственности (Health & Fitness Disclaimer)
Все тренировочные планы, расчёты рабочих весов (1ПМ) и норм КБЖУ носят исключительно рекомендательный и ознакомительный характер. Работа с субмаксимальными и максимальными весами в пауэрлифтинге сопряжена с риском получения спортивных травм. Приложение не заменяет очную консультацию спортивного врача и контроль сертифицированного тренера. Пользователь несёт полную личную ответственность за своё здоровье и технику выполнения упражнений.

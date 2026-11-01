#  MSLift — Полнофункциональная экосистема для силовых видов спорта и пауэрлифтинга

<p align="center">
  <img src="https://img.shields.io/badge/Java-21_LTS-orange?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Tests-JUnit_5-25A162?style=for-the-badge&logo=junit5&logoColor=white" alt="JUnit 5" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <strong>MSLift</strong> — современная веб-платформа для спортсменов, пауэрлифтеров и тренеров. Объединяет в себе интерактивную библиотеку тренировочных программ, гибкий дневник тренировок с подсобными упражнениями, научный калькулятор 1ПМ, дневник питания и расчет суточной нормы КБЖУ.
</p>

---

##  Основные возможности

### 1. Библиотека тренировочных программ (30+ программ)
- Каталог классических и современных циклов: программы **Б.И. Шейко**, **А. Фалеева**, **В. Муравьёва**, **Л. Остапенко**, **Wendler 5/3/1**, **Candito 6-Week**, **Texas Method**, **Смолова**, **Воробьёва** и др.
- Фильтрация по направлениям: *Пауэрлифтинг, Жим лёжа, Присед, Базовые, Начинающие*.
- Интерактивный расчет рабочих весов по процентам от персональных 1ПМ атлета (жим, присед, тяга).

### 2. Интерактивный дневник тренировок
- Выбор тренировочной программы с автоподстановкой базовых упражнений по дням недели.
- Добавление персональных подсобных упражнений (название, подходы, повторения, вес).
- Сохранение тренировочных сессий в PostgreSQL с хронологией и детальным разбором подходов.

### 3. Калькулятор 1ПМ (Одноповторный максимум)
- Расчет предельного максимума по валидированным спортивным формулам **Эпли (Epley)** и **Бжицки (Brzycki)**.
- Интерактивная таблица зон интенсивности от 50% до 100% с шагом весов.

### 4. Дневник питания и КБЖУ
- Гибкий учет приемов пищи за день: Завтрак, Обед, Ужин, Перекус.
- Автоматический подсчет суммарных калорий, белков, жиров и углеводов.
- Интеграция с суточными целевыми показателями атлета и индикация дефицита/профицита.

### 5. Калькулятор и суточная норма КБЖУ
- Научный расчет базового уровня метаболизма (**BMR**) по формуле **Миффлина — Сан Жеора**.
- Расчет суточных энергозатрат (**TDEE**) с учетом коэффициента силовой активности (PAL).
- Персонализированное распределение макронутриентов под 4 цели: *Сброс веса (дефицит 15%)*, *Поддержание*, *Набор массы (профицит 10%)*, *Сушка к соревнованиям*.

### 6. Мобильный опыт (Capacitor & UX)
- Поддержка нативного режима через **Capacitor** (сборка в Android APK).
- Интеграция с **Keep-Awake** (экран не гаснет во время выполнения подходов) и **Local Notifications** (таймер отдыха между подходами).

### 7. Темы оформления (Dark & Light Mode)
- Полноценная светлая и тёмная тема с сохранением предпочтения в `localStorage`.
- Плавные микроанимации, адаптивный дизайн для мобильных устройств, планшетов и десктопов.

---

## 🛠 Технологический стек

### Бэкенд
- **Язык**: Java 21 (LTS)
- **Фреймворк**: Spring Boot 3.3.5 (Spring Web, Spring Data JPA, Spring Security, Jakarta Validation)
- **База данных**: PostgreSQL 16 + H2 (in-memory для изолированных тестов)
- **Миграции**: Flyway Migration
- **Тестирование**: JUnit 5, Mockito, AssertJ, Spring Boot Test
- **Сборка**: Gradle Wrapper
- **Утилиты**: Lombok, Docker Compose, JJWT (JSON Web Token)

### Фронтенд
- **Фреймворк**: React 19 + TypeScript 5.7
- **Сборщик**: Vite 6.0
- **Мобильный стек**: Capacitor (@capacitor/core, @capacitor/local-notifications, @capacitor-community/keep-awake)
- **Стилизация**: Tailwind CSS v4 + Glassmorphism
- **Иконки**: Lucide React
- **Маршрутизация**: React Router DOM v7

---

## Структура репозитория

```text
MSLift/
├── src/                          # Исходный код бэкенда (Spring Boot)
│   ├── main/
│   │   ├── java/com/coociks/mslift/
│   │   │   ├── config/           # CORS, Web MVC, Beans
│   │   │   ├── controller/       # REST API контроллеры
│   │   │   ├── dto/              # Request / Response DTO
│   │   │   ├── entity/           # JPA сущности базы данных
│   │   │   ├── repository/       # Spring Data репозитории
│   │   │   └── service/          # Бизнес-логика платформы
│   │   └── resources/
│   │       ├── application.yml   # Конфигурация приложения
│   │       └── db/migration/     # Flyway SQL-миграции
├── frontend/                     # Исходный код фронтенда (React + Vite)
│   ├── src/
│   │   ├── components/           # Переиспользуемые компоненты (Navbar и др.)
│   │   ├── context/              # Контекст темы оформления (ThemeContext)
│   │   ├── pages/                # Страницы (Dashboard, Programs, Workouts, ...)
│   │   ├── services/             # HTTP API-клиент
│   │   ├── types/                # TypeScript интерфейсы
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml            # Сервисы Docker (PostgreSQL 16)
├── build.gradle                  # Gradle конфигурация
└── README.md
```

---

## Быстрый старт

### Требования
- **Java**: 21 LTS (OpenJDK 21 / Eclipse Temurin)
- **Node.js**: 18+ и **npm**
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

### 5. Запуск модульных тестов
```bash
# Windows
.\gradlew.bat test

# Linux / macOS
./gradlew test
```

---

## 📡 Ключевые REST API Эндпоинты

| Метод | URL | Описание |
| :--- | :--- | :--- |
| `GET` | `/api/programs` | Получить каталог программ тренировок |
| `GET` | `/api/programs/{id}` | Детали программы и дни тренировок |
| `POST` | `/api/programs/calculate` | Расчет рабочих весов по 1ПМ |
| `GET` | `/api/workouts` | История тренировок из дневника |
| `POST` | `/api/workouts` | Сохранить завершенную тренировку |
| `DELETE` | `/api/workouts/{id}` | Удалить запись из дневника |
| `GET` | `/api/nutrition/day?date=YYYY-MM-DD` | Питание и КБЖУ за указанную дату |
| `POST` | `/api/nutrition/entry` | Добавить блюдо / продукт |
| `DELETE` | `/api/nutrition/entry/{id}` | Удалить прием пищи |
| `GET` | `/api/nutrition/target` | Текущая целевая норма КБЖУ |
| `POST` | `/api/nutrition/target` | Сохранить / обновить суточную норму |

---

## Соглашение о коммитах (IT Git Etiquette)

В проекте принято соглашение [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — добавление новой функциональности
- `fix:` — исправление ошибок
- `docs:` — обновление документации
- `test:` — добавление и обновление тестов
- `refactor:` — рефакторинг кода без изменения логики
- `style:` — правки форматирования, CSS, отступов
- `chore:` — обновление зависимостей, сборки, конфигураций

---

## Лицензия и отказ от ответственности

### 1. Лицензия (MIT License)
Проект распространяется под открытой лицензией [MIT](LICENSE).  
Copyright (c) 2026 [Coosiks](https://github.com/Coosiks).  
Код открыт для изучения, форков и использования в рамках портфолио и некоммерческой разработки.

### 2. Отказ от медицинской и спортивной ответственности (Health & Fitness Disclaimer)
Все тренировочные планы, расчёты рабочих весов (1ПМ) и норм КБЖУ носят исключительно рекомендательный и ознакомительный характер. Работа с субмаксимальными и максимальными весами в пауэрлифтинге сопряжена с риском получения спортивных травм. Приложение не заменяет очную консультацию спортивного врача и контроль сертифицированного тренера. Пользователь несёт полную личную ответственность за своё здоровье и технику выполнения упражнений.

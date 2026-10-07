# Лабораторная работа №3 — Sass-рефакторинг

Рефакторинг стилей сайта-визитки (ЛР1–2) на препроцессор **Sass (SCSS)**:
модульная архитектура, миксины, функции, БЭМ, тёмная тема.

## Автор

- **ФИО:** Симоненко Регина Зиядиновна
- **Группа:** ФИТ-241\

## Что реализовано

### 1. Модульная структура SCSS

Стили разбиты на partials с `@use` / `@forward`:

- `scss/utils/` — переменные, карты, функции, миксины
- `scss/base/` — reset и типографика
- `scss/layout/` — header, hero, секции, footer
- `scss/components/` — кнопки, карточки, модалка, карусель, форма
- `scss/themes/` — генерация CSS-переменных из карт тем
- `scss/main.scss` — точка входа

### 2. Sass-возможности

- **Карта брейкпоинтов** `$breakpoints` (mobile / tablet / desktop)
- **Функция** `rem($px)` — перевод пикселей в rem
- **Миксин** `respond-to($breakpoint)` — медиа-запросы с `@content` и `@error`
- **Миксины** `flex-center`, `truncate`, `visually-hidden`
- Модули `sass:math`, `sass:map`, `sass:color`

### 3. БЭМ-именование

Все классы переименованы по БЭМ: `блок`, `блок__элемент`, `блок--модификатор`.
Селекторы в итоговом CSS не длиннее 2 уровней.

Для JS используются отдельные `data-js`-атрибуты, чтобы не сломать jQuery при переименовании классов.

### 4. Тёмная и светлая темы

- Палитры описаны в картах Sass: `$theme-light` и `$theme-dark`
- CSS-переменные генерируются через `@each` для `:root` и `[data-theme="dark"]`
- Все цвета в компонентах берутся только через `var(--color-*)`
- Переключатель темы работает на jQuery, выбор сохраняется в `localStorage`
- При первом визите тема выбирается по `prefers-color-scheme`

### 5. Компонент с состояниями

Кнопка `.button` оформлена полностью:
- Состояния: `:hover`, `:focus-visible`, `:active`, `:disabled`
- Модификаторы: `button--block`, `button--small`, `button--ghost`, `button--icon`
- Корректно выглядит в обеих темах

## Технологии

- HTML5 (семантические теги)
- Sass (SCSS) — модули, миксины, функции, карты
- CSS3 (Flexbox, Grid, CSS-переменные)
- jQuery 3.7 (CDN) — динамика из ЛР2
- Node.js / npm — сборка
- Git / GitVerse

## Структура проекта

web1/
├─ index.html
├─ scss/
│  ├─ utils/         ← переменные, функции, миксины
│  ├─ base/          ← reset, типографика
│  ├─ layout/        ← header, hero, секции, footer
│  ├─ components/    ← кнопки, карточки, модалка, карусель, форма
│  ├─ themes/        ← генерация CSS-переменных
│  └─ main.scss      ← точка входа
├─ dist/             ← собранный CSS (в .gitignore)
├─ js/script.js
├─ data/portfolio.json
├─ images/
├─ package.json
├─ package-lock.json
├─ README.md
└─ .gitignore

## Инструкция запуска с нуля

1. Установите Node.js (LTS) с [nodejs.org](https://nodejs.org)
2. Клонируйте репозиторий и перейдите в папку проекта:
   ```bash
   git clone <ссылка-на-репозиторий>
   cd web1
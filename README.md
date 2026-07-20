# Linkz Design System

Общая дизайн-система для проектов Linkz — собственный [shadcn registry](https://ui.shadcn.com/docs/registry) `@linkz`. Тема (primary `#2563eb`, светлая + тёмная, radius 12px) и 17 базовых компонентов. Код компонентов копируется в проект — им владеет проект (философия shadcn).

Раздаётся статикой из папки [`r/`](r/) через GitHub raw.

## Подключение в проект

```bash
# 1. Если в проекте ещё нет shadcn (Vite + Tailwind v4):
pnpm dlx shadcn@latest init -b radix -p nova -y

# 2. Зарегистрировать реестр (один раз, пишется в components.json):
pnpm dlx shadcn@latest registry add "@linkz=https://raw.githubusercontent.com/Siwaaa/design-system-01/main/r/{name}.json"

# 3. Ставить компоненты:
pnpm dlx shadcn@latest add @linkz/theme @linkz/button @linkz/card
```

`@linkz/theme` подтягивается автоматически как зависимость любого компонента — отдельно ставить не обязательно.

## Состав

| Item | Тип |
|---|---|
| `theme` | тема: cssVars light/dark, primary #2563eb (oklch), radius 0.75rem |
| `alert` `badge` `button` `card` `checkbox` `dialog` `dropdown-menu` `input` `label` `select` `separator` `skeleton` `switch` `table` `tabs` `textarea` `tooltip` | registry:ui |

Фирменный шрифт демо-стенда — Geist (`@fontsource-variable/geist`); в проект-потребитель он не устанавливается автоматически. Чтобы включить: `pnpm add @fontsource-variable/geist` и `@import "@fontsource-variable/geist";` в главный CSS.

## Разработка

```bash
pnpm install
pnpm dev              # демо-страница со всеми компонентами + тумблер темы
pnpm build            # tsc + vite build (проверка)
pnpm build:registry   # синк темы из theme.css в registry.json + shadcn build → r/
```

Правила внесения изменений — в [CLAUDE.md](CLAUDE.md). Главное: тема правится только в `registry/linkz/theme/theme.css`, после любых правок реестра — `pnpm build:registry` и коммит `r/`.

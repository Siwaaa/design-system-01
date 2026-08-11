# Linkz Design System

Общая дизайн-система для проектов Linkz — собственный [shadcn registry](https://ui.shadcn.com/docs/registry) `@linkz`. Пока в реестре только тема (primary `#2563eb`, светлая + тёмная, radius 12px) — компоненты добавляются с нуля.

Раздаётся статикой из папки [`r/`](r/) через GitHub raw.

## Подключение в проект

```bash
# 1. Если в проекте ещё нет shadcn (Vite + Tailwind v4):
pnpm dlx shadcn@latest init -b radix -p nova -y

# 2. Зарегистрировать реестр (один раз, пишется в components.json):
pnpm dlx shadcn@latest registry add "@linkz=https://raw.githubusercontent.com/Siwaaa/design-system-01/main/r/{name}.json"

# 3. Ставить компоненты:
pnpm dlx shadcn@latest add @linkz/theme
```

## Разработка

```bash
pnpm install
pnpm dev              # демо-страница
pnpm build            # tsc + vite build (проверка)
pnpm build:registry   # синк темы из theme.css в registry.json + shadcn build → r/
pnpm deploy:demo      # пересобрать демо и опубликовать на GitHub Pages
```

Правила внесения изменений — в [CLAUDE.md](CLAUDE.md). Главное: тема правится только в `registry/linkz/theme/theme.css`, после любых правок реестра — `pnpm build:registry` и коммит `r/`.

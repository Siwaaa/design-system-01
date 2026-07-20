# Linkz Design System

Собственный shadcn-реестр `@linkz`: тема + базовые UI-компоненты, раздаётся через GitHub raw из папки `r/`.

## Структура

- `registry/linkz/theme/theme.css` — **единственный источник темы** (light/dark, primary #2563eb, radius 0.75rem). Правки темы — только здесь.
- `registry/linkz/ui/*.tsx` — исходники компонентов реестра. Импорты внутри — через `@/registry/linkz/ui/...` (CLI переписывает пути при установке в проект).
- `registry.json` — каталог реестра. `cssVars` итема `theme` **генерируются** из theme.css скриптом — руками не править.
- `r/` — собранный выход `shadcn build`. Коммитится, потому что раздаётся через raw.githubusercontent.com.
- `src/App.tsx` — демо-страница всех компонентов (`pnpm dev`).

## Правила

1. После любого изменения в `registry/` или `registry.json` — запустить `pnpm build:registry` (синкает тему в registry.json и пересобирает `r/`) и закоммитить `r/` вместе с исходниками. Иначе потребители получат старую версию.
2. Новый компонент: поставить канонический (`pnpm dlx shadcn@latest add <имя>` кладёт в `src/components/ui/`), перенести файл в `registry/linkz/ui/`, заменить импорты `@/components/ui/` → `@/registry/linkz/ui/`, добавить item в `registry.json` (dependencies — npm-пакеты из импортов; registryDependencies — `@linkz/theme` + внутренние `@linkz/<имя>`), показать на демо-странице, `pnpm build:registry`.
3. Проверка перед пушем: `pnpm build` (tsc + vite) проходит, демо-страница ок в обеих темах.
4. Стиль shadcn: `radix-nova` (CLI 3.x; radix-ui единым пакетом, иконки lucide).

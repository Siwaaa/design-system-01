# limeui Design System

Собственный shadcn-реестр `@limeui`: тема + базовые UI-компоненты в стиле klipni.com, раздаётся через GitHub raw из папки `r/`.

## Структура

- `registry/limeui/theme/theme.css` — **единственный источник темы** (light/dark, primary #d9da26 — лайм, именованный радиус pill/lg/md/sm вместо линейной шкалы). Правки темы — только здесь.
- `registry/limeui/ui/*.tsx` — исходники компонентов реестра. Импорты внутри — через `@/registry/limeui/ui/...` (CLI переписывает пути при установке в проект).
- `registry.json` — каталог реестра. `cssVars` итема `theme` **генерируются** из theme.css скриптом — руками не править.
- `r/` — собранный выход `shadcn build`. Коммитится, потому что раздаётся через raw.githubusercontent.com.
- `src/App.tsx` — демо-страница всех компонентов (`pnpm dev`).

## Правила

1. После любого изменения в `registry/` или `registry.json` — запустить `pnpm build:registry` (синкает тему в registry.json и пересобирает `r/`) и закоммитить `r/` вместе с исходниками. Иначе потребители получат старую версию.
2. Новый компонент: поставить канонический (`pnpm dlx shadcn@latest add <имя>` кладёт в `src/components/ui/`), перенести файл в `registry/limeui/ui/`, заменить импорты `@/components/ui/` → `@/registry/limeui/ui/`, добавить item в `registry.json` (dependencies — npm-пакеты из импортов; registryDependencies — `@limeui/theme` + внутренние `@limeui/<имя>`), показать на демо-странице, `pnpm build:registry`.
3. Проверка перед пушем: `pnpm build` (tsc + vite) проходит, демо-страница ок в обеих темах.
4. Стиль shadcn: `radix-nova` (CLI 3.x; `radix-ui` единым пакетом, иконки lucide).
5. Радиус — именованные токены, НЕ линейная шкала: `rounded-pill` (999px, все интерактивные контролы), `rounded-lg` (20px, карточки/основные инпуты), `rounded-md` (14px, textarea/floating-меню), `rounded-sm` (10px, вложенные элементы). Тени в покое запрещены везде, кроме hover/active у `Button` variant `default`.

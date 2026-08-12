# limeui Design System

Собственный shadcn-реестр `@limeui`: тема + базовые UI-компоненты в стиле klipni.com, раздаётся через GitHub raw из папки `r/`.

## Структура

- `registry/limeui/theme/theme.css` — **единственный источник темы** (light/dark, primary #d9da26 — лайм, именованный радиус pill/lg/md/sm вместо линейной шкалы). Правки темы — только здесь.
- `registry/limeui/ui/*.tsx` — исходники компонентов реестра. Импорты внутри — через `@/registry/limeui/ui/...` (CLI переписывает пути при установке в проект).
- `registry.json` — каталог реестра. `cssVars` итема `theme` **генерируются** из theme.css скриптом — руками не править.
- `r/` — собранный выход `shadcn build`. Коммитится, потому что раздаётся через raw.githubusercontent.com.
- `src/App.tsx` — демо-страница всех компонентов (`pnpm dev`).
- `registry/limeui/hooks/*.ts` — хуки реестра (`use-mobile`), тип итема `registry:hook`.

## Правила

1. После любого изменения в `registry/` или `registry.json` — запустить `pnpm build:registry` (синкает тему в registry.json и пересобирает `r/`) и закоммитить `r/` вместе с исходниками. Иначе потребители получат старую версию.
2. Новый компонент: поставить канонический (`pnpm dlx shadcn@latest add <имя>` кладёт в `src/components/ui/`), перенести файл в `registry/limeui/ui/`, заменить импорты `@/components/ui/` → `@/registry/limeui/ui/`, добавить item в `registry.json` (dependencies — npm-пакеты из импортов; registryDependencies — `@limeui/theme` + внутренние `@limeui/<имя>`), показать на демо-странице, `pnpm build:registry`.
3. Проверка перед пушем: `pnpm build` (tsc + vite) проходит, демо-страница ок в обеих темах.
4. Стиль shadcn: `radix-nova` (CLI 3.x; `radix-ui` единым пакетом, иконки lucide).
5. Радиус — именованные токены, НЕ линейная шкала: `rounded-pill` (999px, все интерактивные контролы), `rounded-lg` (20px, карточки/основные инпуты), `rounded-md` (14px, textarea/floating-меню), `rounded-sm` (10px, вложенные элементы, пункты сайдбара).
6. `src/lib/utils.ts` не раздаётся реестром — `cn()` там расширен через `extendTailwindMerge` (rounded-группа знает про `pill`), потому что дефолтный `tailwind-merge` не резолвит конфликт `rounded-pill` vs `rounded-lg/md/sm`. Известное ограничение: проекты-потребители, не скопировавшие это расширение из `src/lib/utils.ts`, могут ненадёжно переопределять `rounded-pill` через `className`.
7. **Тени.** Поверхности в потоке (Card, Table, Stat, Sidebar, Input, Chip) — без теней в покое, глубина создаётся фоном и границей. Плавающие слои (DropdownMenu, Select, Popover, Dialog, Sheet, Tooltip) — ровно `shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]`. Исключение: `Button` variant `default` на hover.
8. **Geist Mono семантический, а не декоративный.** Внутри реестра `font-mono` стоит вручную ровно в восьми местах в шести файлах — это исчерпывающий список, сверяйте `grep -rn "font-mono" registry/` при добавлении нового: `Eyebrow` и `Num` (`typography.tsx`), `SidebarGroupLabel` и `SidebarMenuBadge` (`sidebar.tsx`), `TableHead` (`table.tsx`), `StatCaption` (`stat.tsx`), подписи оси в `BarChart` (`bar-chart.tsx`), инициалы в `AvatarFallback` (`avatar.tsx`). Всё остальное внутри компонентов реестра — Geist Sans. Прикладной код (`src/`, проекты-потребители) `font-mono` руками не ставит — берёт готовый компонент реестра. Прямой `font-mono` вне этого списка — признак того, что нужен `Eyebrow`, `Num`, `StatCaption` или другой существующий компонент, а не новый класс.
9. `"use client"` стоит только в `registry/limeui/ui/sidebar.tsx` — он единственный владеет React-контекстом и состоянием. В остальные файлы не добавлять.
10. Демо живёт в `src/demo/`: `DashboardDemo.tsx` — реальный каркас со сайдбаром (только в нём видны collapse, sticky и мобильный Sheet), `ComponentsDemo.tsx` — витрина всех компонентов. `src/App.tsx` только переключает их и тему.

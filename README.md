# limeui

Личная дизайн-система для всех проектов — собственный [shadcn registry](https://ui.shadcn.com/docs/registry) `@limeui`, полностью повторяющий визуальный стиль [app.klipni.com](https://app.klipni.com): лайм-акцент (`#d9da26`), тёплая нейтральная палитра, pill-радиус на всех интерактивных элементах, без теней в покое. Тема + 20 компонентов (17 базовых shadcn-примитивов + `SegmentedControl`, `Chip`, `Stat`). Код компонентов копируется в проект — им владеет проект (философия shadcn).

Раздаётся статикой из папки [`r/`](r/) через GitHub raw.

## Подключение в проект

> В чистом vite-скаффолде `shadcn init` с первой попытки не пройдёт: CLI требует, чтобы Tailwind v4 и алиас `@/*` уже были настроены. Заранее нужны: `@import "tailwindcss";` в главном CSS, плагин `@tailwindcss/vite` и алиас `@` → `./src` в `vite.config.ts`, а также `paths: {"@/*": ["./src/*"]}` в `tsconfig.json` и `tsconfig.app.json`.

```bash
# 1. Если в проекте ещё нет shadcn (Vite + Tailwind v4):
pnpm dlx shadcn@latest init -b radix -p nova -y

# 2. Зарегистрировать реестр (один раз, пишется в components.json):
pnpm dlx shadcn@latest registry add "@limeui=https://raw.githubusercontent.com/Siwaaa/design-system-01/main/r/{name}.json"

# 3. Ставить компоненты:
pnpm dlx shadcn@latest add @limeui/theme @limeui/button @limeui/card
```

`@limeui/theme` подтягивается автоматически как зависимость любого компонента — отдельно ставить не обязательно.

> `src/lib/utils.ts` не раздаётся реестром (ожидается, что он уже есть после `shadcn init`). Если хотите надёжно переопределять `rounded-pill` через `className`, расширьте свой `cn()` через `extendTailwindMerge` так же, как в этом репозитории (`src/lib/utils.ts`) — иначе `rounded-pill` может конфликтовать с другими `rounded-*` непредсказуемо.

## Состав

| Item | Тип |
|---|---|
| `theme` | тема: cssVars light/dark, primary #d9da26 (лайм), радиус pill/20px/14px/10px, шрифты Geist + Geist Mono |
| `alert` `badge` `button` `card` `checkbox` `dialog` `dropdown-menu` `input` `label` `select` `separator` `sheet` `skeleton` `switch` `table` `tabs` `textarea` `tooltip` | registry:ui — базовые shadcn-примитивы |
| `avatar` `progress` `sidebar` | registry:ui — примитивы дашборда |
| `bar-chart` `chip` `data-list` `empty-state` `page-header` `segmented-control` `stat` `typography` | registry:ui — паттерны klipni, которых нет в дефолтном shadcn |
| `use-mobile` | registry:hook |

Фирменные шрифты — **Geist** и **Geist Mono**; `@limeui/theme` ставит оба как npm-зависимости. Geist Mono в limeui семантический: он используется только через `Eyebrow` (микро-лейбл над секцией), `Num` (любое число-данные) и шапку таблицы. Прямой `font-mono` в прикладном коде — признак того, что нужен один из этих компонентов.

## Дашборд

`@limeui/sidebar` — канонический shadcn-сайдбар с API апстрима, перекрашенный под klipni: 236px развёрнутый, 68px свёрнутый, группы с mono-лейблами, активный пункт — чёрная плашка. Тянет за собой `sheet`, `use-mobile`, `tooltip`, `input`, `skeleton`, `separator`, `button`.

`@limeui/bar-chart` — столбчатый график за период без единой внешней зависимости: flex-вёрстка, каждый столбец — кнопка с `aria-label`, дни без значения рисуются полоской 2px.

## Демо

Живая демо-страница (все компоненты, светлая/тёмная тема): **https://siwaaa.github.io/design-system-01/** (GitHub Pages, ветка `gh-pages`). Обновить после правок: `pnpm deploy:demo`.

## Разработка

```bash
pnpm install
pnpm dev              # демо-страница со всеми компонентами + тумблер темы
pnpm build            # tsc + vite build (проверка)
pnpm build:registry   # синк темы из theme.css в registry.json + shadcn build → r/
pnpm deploy:demo      # пересобрать демо и опубликовать на GitHub Pages
```

Правила внесения изменений — в [CLAUDE.md](CLAUDE.md). Главное: тема правится только в `registry/limeui/theme/theme.css`, после любых правок реестра — `pnpm build:registry` и коммит `r/`.

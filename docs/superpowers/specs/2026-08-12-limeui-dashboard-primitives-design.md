# limeui — dashboard-примитивы (Sidebar, Table, BarChart, типографика)

**Дата:** 2026-08-12
**Статус:** утверждено
**Предшествующая спека:** [2026-08-12-limeui-design-system-design.md](2026-08-12-limeui-design-system-design.md)

## Цель

Расширить реестр `@limeui` до пригодного для B2B SaaS: сайдбар, таблицы, график,
и — главное — зафиксировать типографский контракт (Geist / Geist Mono), который
до сих пор существовал только как наблюдение, а не как код.

Все значения ниже сняты с живого `app.klipni.com` через chrome-devtools-mcp
(computed styles + outerHTML со страниц `/earnings` и `/leaderboard`), а не
воспроизведены по памяти.

---

## 1. Типографский контракт

Ключевое открытие: **Geist Mono у klipni семантический, а не декоративный.**
Он используется ровно в трёх ролях, и ни в одной другой.

| Роль | Значения (сняты с сайта) | Где встречается |
|---|---|---|
| **Eyebrow** — микро-лейбл над секцией/карточкой/шапкой таблицы | mono, `font-weight: 500`, `11px`, `uppercase`, `letter-spacing: 0.06em`, `line-height: 1.5`, цвет `muted-foreground` | над **каждым** заголовком секции, в каждой карточке, в шапке таблицы |
| **Num** — любое число, которое пользователь читает как данные | mono, `tabular-nums`, `letter-spacing: -0.02em` | деньги, счётчики, просмотры, даты, проценты, ранги |
| **Nav group label** — лейбл группы в сайдбаре | mono, `500`, `9.5px`, `uppercase`, `letter-spacing: 0.12em`, цвет `foreground-subtle` | «РАБОТА», «РОСТ», «ДЕНЬГИ», «КАБИНЕТ» |

Всё остальное — Geist Sans.

Уменьшенный вариант eyebrow (`10px` и `9.5px`, та же `0.06em`) применяется внутри
плотных карточек — это вариант размера, не отдельная роль.

### Правило

> Geist Mono ставится только через компоненты `Eyebrow` и `Num` либо через
> шапку `Table`/`SidebarGroupLabel`. Прямое использование `font-mono` в прикладном
> коде — признак того, что нужен один из этих компонентов.

Компоненты нужны именно затем, чтобы правило нельзя было нарушить случайно:
разработчик, которому нужен микро-лейбл, берёт `<Eyebrow>`, а не подбирает
`text-[11px] uppercase tracking-[0.06em]` на глаз.

### Остальная типографика (Geist Sans)

| Элемент | Значения |
|---|---|
| body | `16px`, `letter-spacing: -0.005em` |
| h1 страницы | `38px` → `48px` (lg), `600`, `leading-none`, `tracking: -0.03em` |
| h1 крупный (лидерборд) | `26px` → `44px` (md), `600`, `leading: 1.05 / 0.98`, `tracking: -0.025em / -0.03em` |
| display-число | mono, `600`, `leading: 0.9–1`, `tracking: -0.04em`, размеры `20 / 22 / 28 / 32 / 38 / 44 / 64 / 88` |
| brand-wordmark | `18px`, `800`, `tracking: -0.04em`, `leading-none` |

### Доставка шрифта

Сейчас Geist в проект-потребитель не ставится — README просит сделать это руками.
Исправляем: item `@limeui/theme` получает npm-зависимости
`@fontsource-variable/geist` и `@fontsource-variable/geist-mono` (обе `5.3.0`,
проверено `npm view`) и объявляет `--font-sans` / `--font-mono`.

**Открытый вопрос, решаемый эмпирически:** доставляет ли поле `css` в
registry-item корректно расположенный `@import` (он обязан стоять до всех правил,
кроме `@charset`/`@layer`). Проверяется установкой темы в чистый тестовый проект
и чтением получившегося CSS. Если CLI кладёт `@import` неправильно —
фолбэк: отдать `registry:file` `src/styles/limeui-fonts.css` с двумя импортами
и задокументировать одну строку `@import "./styles/limeui-fonts.css";`.
Гадать нельзя — только проверка на реальном CLI.

---

## 2. Новые токены темы

Правятся в `registry/limeui/theme/theme.css` (единственный источник), в
`registry.json` попадают генератором.

| Токен | light | dark | Зачем |
|---|---|---|---|
| `--foreground-subtle` | `#9c9c95` | `#6b6b66` | третий уровень текста (лейблы групп, ранги, разделители «·»). Сейчас это значение существует только как `--chart-5` — семантики нет |
| `--border-mute` | `#efefea` | `#232322` | разделители внутри плотных списков, где `--border` слишком контрастен |
| `--primary-soft` | `#f4f7b9` | `#2e2f14` | лаймовый тинт для фонов-подсветок (снят с `--color-accent-soft`) |
| `--sidebar` | `#ffffff` | `#111110` | сайдбар белый на фоне страницы `#f7f7f5` — контраст держится фоном, не тенью |
| `--sidebar-foreground` | `#0c0c0b` | `#f7f7f5` | |
| `--sidebar-border` | `#e7e7e2` | `#2c2c2a` | |
| `--sidebar-accent` | `#f1f1ee` | `#232322` | hover-фон пункта |
| `--sidebar-accent-foreground` | `#0c0c0b` | `#f7f7f5` | |
| `--sidebar-primary` | `#0c0c0b` | `#f7f7f5` | фон **активного** пункта (чёрная плашка) |
| `--sidebar-primary-foreground` | `#ffffff` | `#0c0c0b` | |
| `--sidebar-ring` | `#0c0c0b` | `#f7f7f5` | |

Каждый токен также добавляется в `@theme inline` в `src/index.css`, иначе
Tailwind не сгенерирует утилиты (`text-foreground-subtle`, `bg-sidebar` и т.д.).

Радиус-шкала не расширяется. У klipni есть `--radius-input: 12px`, но добавлять
пятый токен ради 2px разницы — размывание именованной шкалы, которая и есть
подпись этого дизайна. `12px` отображается в `rounded-sm` (10px).

---

## 3. Правило теней — уточнение

Действующее правило (CLAUDE.md, п. 5): «Тени в покое запрещены везде, кроме
hover/active у `Button` variant `default`».

Наблюдение с сайта опровергает его в одном месте: **плавающие слои у klipni
тень в покое имеют** — выпадающая панель фильтра несёт
`box-shadow: 0 8px 24px -12px rgb(0 0 0 / 0.18)`.

Уточнённая формулировка:

> **Поверхности в потоке** (Card, Table, Stat, Sidebar, Input, Chip) — тени в
> покое запрещены; глубина создаётся фоном и границей.
> **Плавающие слои** (DropdownMenu, Select, Popover, Dialog, Sheet, Tooltip) —
> несут `shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]`, потому что им нужно
> отделиться от произвольного содержимого под ними.
> Исключение прежнее: `Button` variant `default` получает
> `0 8px 20px -8px rgb(12 12 11 / 0.22)` на hover.

Затрагивает существующие компоненты: `dropdown-menu`, `select`, `dialog`,
`tooltip` — им добавляется класс тени на content-слой.

---

## 4. Новые компоненты

Все — в `registry/limeui/ui/` (кроме хука), импорты внутри через
`@/registry/limeui/ui/...`, без `React.forwardRef`, `data-slot` на корне.

### 4.1 `typography` → `Eyebrow`, `Num`

Два крошечных компонента, несущих контракт из раздела 1.

- `Eyebrow` — `<div>`, варианты размера `sm` (9.5px) / `default` (11px) / `lg` (12px).
  Классы: `font-mono font-medium uppercase tracking-[0.06em] text-muted-foreground`.
- `Num` — `<span>`, `font-mono tabular-nums tracking-[-0.02em]`.
  Проп `value?: number` + `format?: Intl.NumberFormatOptions` для удобства, либо `children` как есть.

Registry deps: только `@limeui/theme`.

### 4.2 `use-mobile` (registry:hook)

Канонический `useIsMobile` (брейкпоинт 768). Кладётся в
`registry/limeui/hooks/use-mobile.ts`, тип item — `registry:hook`.
Нужен `sidebar`. Ставится как есть, без правок.

### 4.3 `sheet`

Канонический shadcn `sheet` на `radix-ui` `Dialog`, с двумя правками под limeui:
- убрать `font-heading` из `SheetTitle` (такого токена в теме нет — сейчас класс
  ничего не делает и вводит в заблуждение);
- `SheetContent` получает тень плавающего слоя (раздел 3).

Зависит от `@limeui/button` (использует `size="icon-sm"` — см. 5.2).

### 4.4 `sidebar`

Канонический shadcn `sidebar` (все 23 экспорта, API совпадает с апстримом —
варианты `floating`/`inset`/`rail` сохраняются, даже если у klipni не
используются: расхождение API с апстримом дороже, чем лишние 3 КБ).

Перекраска под klipni:

| Что | Канон | limeui |
|---|---|---|
| `SIDEBAR_WIDTH` | `16rem` | `14.75rem` (236px) |
| `SIDEBAR_WIDTH_ICON` | `3rem` | `4.25rem` (68px) |
| `SIDEBAR_WIDTH_MOBILE` | `18rem` | `18rem` (без изменений) |
| пункт меню, радиус | `rounded-md` | `rounded-sm` (10px) |
| пункт меню, текст | `text-sm` | `text-[13px] font-medium` |
| пункт меню, размеры | `h-8 p-2` | `py-2 px-2.5 gap-2.5` |
| активный пункт | `bg-sidebar-accent` | `bg-sidebar-primary text-sidebar-primary-foreground` |
| `SidebarGroupLabel` | `text-xs font-medium text-sidebar-foreground/70` | `font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-foreground-subtle` |
| `SidebarGroup` padding | `p-2` | `px-3 pb-4` |
| `SidebarHeader` | `p-2` | `px-5 pt-5 pb-4` |
| `SidebarFooter` | `p-2` | `border-t border-sidebar-border px-4 py-3.5` |
| `SidebarMenuBadge` | `rounded-md` | `rounded-sm`, `font-mono` |

Канонический файл использует утилиту `no-scrollbar`, которой в проекте нет —
она добавляется в `src/index.css` как `@utility` (Tailwind v4) **и** в
`css`-поле item'а, чтобы доехать до потребителя.

Зависимости item'а: `@limeui/theme`, `@limeui/button`, `@limeui/input`,
`@limeui/separator`, `@limeui/sheet`, `@limeui/skeleton`, `@limeui/tooltip`,
`@limeui/use-mobile`; npm — `radix-ui`, `class-variance-authority`, `lucide-react`.

### 4.5 `bar-chart`

Механика скопирована с klipni дословно — там нет ни SVG, ни charting-библиотеки:

```
<div class="flex h-[120px] items-end gap-1">
  <button class="group relative flex-1 self-stretch border-0 bg-transparent p-0" aria-label="...">
    <span class="absolute inset-x-0 bottom-0 rounded-[2px]" style="height:2px;background:rgba(247,247,245,0.4)" />
  </button>
  ...
</div>
<div class="mt-2.5 flex justify-between font-mono text-[11px] opacity-50">
  <span>01 авг</span><span>сегодня · 12 авг</span>
</div>
```

Recharts не подключается: 100 КБ зависимости ради того, что здесь делают
40 строк flex-вёрстки, не окупаются, а внешний вид всё равно пришлось бы
переопределять целиком.

API:

```ts
type BarChartDatum = { label: string; value: number }

type BarChartProps = {
  data: BarChartDatum[]
  height?: number              // default 120
  tone?: "default" | "inverse" // inverse — для чёрной карточки
  formatValue?: (v: number) => string
  startLabel?: React.ReactNode // default: data[0].label
  endLabel?: React.ReactNode   // default: последний label
  onBarClick?: (d: BarChartDatum, i: number) => void
}
```

Поведение:
- высота столбца = `Math.round((value / max) * height)`, минимум `2px`;
- при `value === 0` (или `max === 0`) — полоска `2px` цветом `currentColor/40`;
- ненулевые столбцы — `bg-primary`;
- каждый столбец — `<button>` с `aria-label` вида `«{label}: {formatValue(value)}»`,
  чтобы график читался скринридером как список значений (так и сделано у klipni);
- `tone="inverse"` переключает цвет подписей и нулевых полосок на `currentColor`
  инвертированной карточки.

Registry deps: только `@limeui/theme`. Никаких npm-зависимостей.

### 4.6 `page-header`

`PageHeader` (`flex flex-wrap items-end justify-between gap-6`),
`PageHeaderTitle` (`text-[38px] lg:text-[48px] font-semibold leading-none tracking-[-0.03em]`),
`PageHeaderActions` (`flex gap-2`). Eyebrow подаётся снаружи как `<Eyebrow>`.

### 4.7 `avatar`

На `radix-ui` `Avatar` (экспорты `Root` / `Image` / `Fallback` проверены).
Fallback — инициалы: `font-mono font-semibold tracking-[-0.02em]`, фон `muted`,
цвет `muted-foreground`. Размеры `sm` 32 / `default` 40 / `lg` 56, всегда
`rounded-pill`. Проп `ring?: boolean` → `ring-2 ring-primary` (у klipni так
выделен первый в лидерборде).

### 4.8 `progress`

На `radix-ui` `Progress`. Трек `h-[3px] w-full overflow-hidden rounded-pill bg-muted`,
индикатор `h-full rounded-pill bg-foreground`. Варианты толщины `sm` 3px /
`default` 5px; вариант цвета `default` (`bg-foreground`) / `primary` (`bg-primary`).

### 4.9 `empty-state`

`px-5 py-10 text-center text-[13px] text-muted-foreground`, слоты для иконки,
текста и действия. Ставится внутрь карточки таблицы или на место списка.

### 4.10 `data-list`

Список «лейбл — значение», как блок «ЗА ВСЁ ВРЕМЯ»:
`DataList` — `rounded-lg bg-muted p-5 flex flex-col gap-3`;
`DataListRow` — `flex items-baseline justify-between gap-3`,
лейбл `text-[12px] leading-[1.35] text-muted-foreground`,
значение `<Num>` `text-[13px] font-semibold shrink-0 whitespace-nowrap`.

---

## 5. Изменения существующих компонентов

### 5.1 `table` — вид klipni

У klipni таблица не `<table>`, а CSS-grid. Семантику `<table>` мы сохраняем
(доступность, сортировка, копирование в буфер), а визуал приводим к их виду:

| Слот | Изменение |
|---|---|
| `Table` (обёртка) | `overflow-hidden rounded-lg border border-border bg-card` вместо голого `overflow-x-auto` |
| `TableHead` | `bg-muted font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground py-3` |
| `TableRow` | `border-b border-border`, hover `bg-muted/60` |
| `TableCell` | `py-4 text-[13px]`; числовые колонки — через `<Num>` + `text-right` на стороне вызова |
| `TableEmpty` (новый) | `<tr><td colSpan>` с версткой `EmptyState` |

Плюс парный паттерн на демо-странице: `Eyebrow` слева + `<Num>N</Num> записей`
справа над карточкой таблицы.

### 5.2 `button` — размер `icon-sm`

Канонические `sheet` и `sidebar` используют `size="icon-sm"`, которого в нашем
`Button` нет — без него оба компонента молча теряют размер. Добавляется
`"icon-sm": "size-8 shrink-0 px-0"`.

### 5.3 `stat` — карточный вариант и подпись

Добавляются `StatCaption` (mono 11px muted) и проп `variant="card"`
(`rounded-lg border border-border bg-card px-6 py-5`) — точная копия плиток
«Креаторов / Просмотры / Заработано» с лидерборда.

### 5.4 Плавающие слои — тень

`dropdown-menu`, `select`, `dialog`, `tooltip`: content-слой получает
`shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]` (раздел 3).

---

## 6. Демо-страница

`src/App.tsx` перестраивается из плоского списка секций в **реальный
дашборд-каркас**: `SidebarProvider` + `Sidebar` (с группами, активным пунктом и
футером) + `SidebarInset`, внутри — `PageHeader`, чёрная карточка с `BarChart`,
секция с `Table` + `TableEmpty`, правая колонка `xl:grid-cols-[1fr_380px]` со
`Stat`-карточками и `DataList`. Существующая витрина всех 20 компонентов
переезжает на вторую вкладку/секцию ниже.

Причина: сайдбар и таблица нельзя проверить в отрыве от layout'а — плоский
список секций не покажет ни collapse, ни sticky, ни поведение `SidebarInset`.

Проверка — в обеих темах, на десктопе и при ширине < 768px (мобильный сайдбар
через `Sheet`).

---

## 7. Проверка

Юнит-тестов в проекте нет (визуальная библиотека компонентов) — верификация
такая же, как в предыдущей спеке, плюс два новых пункта:

1. `pnpm build` (`tsc -b && vite build`) — типизирует и `src`, и `registry`.
2. `pnpm build:registry` — синк темы в `registry.json` + `shadcn build → r/`.
3. Демо-страница визуально проверяется в light и dark через chrome-devtools-mcp.
4. **Новое:** установка в чистый тестовый проект-потребитель реальным CLI
   (`shadcn init` → `registry add` → `add @limeui/theme @limeui/sidebar
   @limeui/bar-chart @limeui/table`) и проверка, что: (а) `@import` шрифтов
   встал корректно и Geist реально применился; (б) `--sidebar-*` и
   `--foreground-subtle` доехали; (в) утилита `no-scrollbar` существует.
   Именно этот шаг в прошлый раз поймал критический баг с доставкой радиусов —
   он обязателен, а не опционален.
5. Мобильная ширина (< 768px): сайдбар открывается как `Sheet`.

---

## 8. Что сознательно не делается

- **Recharts / любая charting-библиотека** — см. 4.5.
- **Пятый радиус-токен (12px)** — см. раздел 2.
- **Урезание канонического `sidebar`** — API держим совместимым с апстримом.
- **Страничные композиции klipni** (карточка кампании, лидерборд-подиум,
  карточка тира с прогрессом) — это композиции из примитивов выше, а не
  примитивы. Ограничение «только базовые переиспользуемые компоненты»
  остаётся в силе.
- **DataTable с сортировкой/пагинацией** (TanStack Table) — отдельная задача
  со своей спекой; здесь только визуальный слой таблицы.

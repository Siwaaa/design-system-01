# limeui Dashboard Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Расширить реестр `@limeui` до пригодного для B2B SaaS-дашбордов: типографский контракт Geist/Geist Mono в виде компонентов, 10 новых примитивов (включая канонический `sidebar`, `bar-chart`, `table` в стиле klipni) и уточнённое правило теней.

**Архитектура:** Реестр shadcn. Тема правится только в `registry/limeui/theme/theme.css`; `scripts/build-registry.mjs` синкает её в `registry.json` и раскладывает переменные по бакетам `theme`/`light`/`dark`. Компоненты — в `registry/limeui/ui/*.tsx`, хуки — в `registry/limeui/hooks/*.ts`. Собранный выход `r/` коммитится, потому что раздаётся через raw.githubusercontent.com.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4 (`@theme inline`), `radix-ui` (единый пакет), `class-variance-authority`, `lucide-react`, shadcn CLI 4.x (стиль `radix-nova`), Vite.

**Спека:** [docs/superpowers/specs/2026-08-12-limeui-dashboard-primitives-design.md](../specs/2026-08-12-limeui-dashboard-primitives-design.md)

## Global Constraints

Эти требования действуют в **каждой** задаче — они являются частью требований любого таска, даже если в нём не повторены.

- Реестр называется `limeui`. Компоненты — `registry/limeui/ui/<имя>.tsx`, хуки — `registry/limeui/hooks/<имя>.ts`, тема — `registry/limeui/theme/theme.css`.
- Импорты **внутри** файлов реестра — только через `@/registry/limeui/ui/...`, `@/registry/limeui/hooks/...` и `@/lib/utils`. Никогда `@/components/ui/...`.
- Тему правим только в `registry/limeui/theme/theme.css`. `cssVars` итема `theme` в `registry.json` **генерируются** скриптом — руками не править.
- Радиус — именованная шкала, НЕ линейный множитель: `rounded-pill` (999px), `rounded-lg` (20px), `rounded-md` (14px), `rounded-sm` (10px). Пятый радиус-токен не вводится.
- **Правило теней (уточнённое):** поверхности в потоке (Card, Table, Stat, Sidebar, Input, Chip) — тени в покое запрещены. Плавающие слои (DropdownMenu, Select, Popover, Dialog, Sheet, Tooltip) — несут ровно `shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]`. Исключение: `Button` variant `default` получает `0 8px 20px -8px rgb(12 12 11 / 0.22)` на hover.
- Фокус — только через outline: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`. Не box-shadow ring.
- Radix — только через единый пакет `radix-ui` (`import { Avatar as AvatarPrimitive } from "radix-ui"`), никогда `@radix-ui/react-*`.
- Никаких `React.forwardRef` — обычные функции, типизация через `React.ComponentProps<"tag">`, атрибут `data-slot` на корневом элементе каждого слота.
- `"use client"` ставится только в `registry/limeui/ui/sidebar.tsx` (владеет React-контекстом и состоянием) — ровно как в апстриме shadcn. В остальные файлы не добавлять.
- **Geist Mono семантический.** Он допустим только в: `Eyebrow`, `Num`, `SidebarGroupLabel`, `TableHead`, `AvatarFallback`, ось `BarChart`, `SidebarMenuBadge`. Появление `font-mono` где-то ещё — признак, что нужен один из этих компонентов.
- Юнит-тестов в проекте нет (визуальная библиотека компонентов). Верификация каждой задачи = `pnpm build` (это `tsc -b && vite build`; `tsconfig.app.json` содержит `"include": ["src", "registry"]`, поэтому типизируется весь реестр, даже файлы, не импортированные демо-страницей).
- После **любого** изменения в `registry/` или `registry.json` — запустить `pnpm build:registry` и закоммитить `r/` вместе с исходниками. Иначе потребители получат старую версию.
- Все сообщения коммитов — на русском, с префиксом `limeui:`.

---

## Структура файлов

**Создаются:**

| Файл | Ответственность |
|---|---|
| `registry/limeui/ui/typography.tsx` | `Eyebrow`, `Num` — носители типографского контракта |
| `registry/limeui/hooks/use-mobile.ts` | `useIsMobile` (брейкпоинт 768), нужен `sidebar` |
| `registry/limeui/ui/sheet.tsx` | боковая панель на `radix-ui` `Dialog`; мобильный режим `sidebar` |
| `registry/limeui/ui/sidebar.tsx` | канонический shadcn-сайдбар, перекрашенный под limeui |
| `registry/limeui/ui/bar-chart.tsx` | столбчатый график без зависимостей |
| `registry/limeui/ui/avatar.tsx` | аватар с инициалами на `radix-ui` `Avatar` |
| `registry/limeui/ui/progress.tsx` | тонкий pill-прогресс на `radix-ui` `Progress` |
| `registry/limeui/ui/page-header.tsx` | шапка страницы: заголовок + действия |
| `registry/limeui/ui/empty-state.tsx` | пустое состояние списка/таблицы |
| `registry/limeui/ui/data-list.tsx` | список «лейбл — значение» |

**Изменяются:**

| Файл | Что |
|---|---|
| `registry/limeui/theme/theme.css` | новые токены + `--font-sans` / `--font-mono` |
| `src/index.css` | маппинги в `@theme inline`, `@import` Geist Mono, утилита `no-scrollbar` |
| `scripts/build-registry.mjs` | `font-*` уезжает в бакет `theme`, как `radius-*` |
| `package.json` | `@fontsource-variable/geist-mono` |
| `registry.json` | 10 новых итемов + правки зависимостей существующих |
| `registry/limeui/ui/button.tsx` | размер `icon-sm` |
| `registry/limeui/ui/dropdown-menu.tsx`, `select.tsx`, `dialog.tsx`, `tooltip.tsx` | тень плавающего слоя |
| `registry/limeui/ui/table.tsx` | вид klipni + `TableEmpty` |
| `registry/limeui/ui/stat.tsx` | `StatCaption`, `variant="card"`, mono-значение |
| `src/App.tsx` | перестройка в дашборд-каркас |
| `CLAUDE.md`, `README.md` | новые правила и состав |

**Удаляются в конце (Task 17):** `src/components/`, `src/hooks/` — это временные копии, поставленные `shadcn add sidebar` как эталонный исходник. Они не должны попасть в коммит как часть демо-приложения.

---

### Task 1: Токены темы, шрифты и утилита no-scrollbar

Фундамент. Без него ни один следующий компонент не скомпилируется в нужные классы (`bg-sidebar`, `text-foreground-subtle`, `font-mono`, `no-scrollbar`).

**Files:**
- Modify: `registry/limeui/theme/theme.css`
- Modify: `src/index.css`
- Modify: `scripts/build-registry.mjs:31-41`
- Modify: `package.json:15`
- Modify: `registry.json` (через генератор)

**Interfaces:**
- Produces: CSS-переменные `--foreground-subtle`, `--border-mute`, `--primary-soft`, `--sidebar`, `--sidebar-foreground`, `--sidebar-border`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-ring`, `--font-sans`, `--font-mono`; Tailwind-утилиты `text-foreground-subtle`, `border-border-mute`, `bg-primary-soft`, `bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`, `bg-sidebar-accent`, `text-sidebar-accent-foreground`, `bg-sidebar-primary`, `text-sidebar-primary-foreground`, `ring-sidebar-ring`, `font-sans`, `font-mono`, `no-scrollbar`.

- [ ] **Step 1: Установить Geist Mono**

```bash
pnpm add @fontsource-variable/geist-mono@^5.3.0
```

- [ ] **Step 2: Добавить токены в theme.css**

Заменить блок `:root` в `registry/limeui/theme/theme.css` целиком на:

```css
:root {
    --background: #f7f7f5;
    --foreground: #0c0c0b;
    --foreground-subtle: #9c9c95;
    --card: #ffffff;
    --card-foreground: #0c0c0b;
    --popover: #ffffff;
    --popover-foreground: #0c0c0b;
    --primary: #d9da26;
    --primary-foreground: #0c0c0b;
    --primary-soft: #f4f7b9;
    --secondary: #f1f1ee;
    --secondary-foreground: #0c0c0b;
    --muted: #f1f1ee;
    --muted-foreground: #6b6b66;
    --accent: #e7e7e2;
    --accent-foreground: #0c0c0b;
    --success: #1f8a45;
    --success-muted: #e3f3e8;
    --destructive: #d33a2c;
    --border: #e7e7e2;
    --border-strong: #d4d4ce;
    --border-mute: #efefea;
    --input: #e7e7e2;
    --ring: #0c0c0b;
    --sidebar: #ffffff;
    --sidebar-foreground: #0c0c0b;
    --sidebar-border: #e7e7e2;
    --sidebar-accent: #f1f1ee;
    --sidebar-accent-foreground: #0c0c0b;
    --sidebar-primary: #0c0c0b;
    --sidebar-primary-foreground: #ffffff;
    --sidebar-ring: #0c0c0b;
    --chart-1: #d9da26;
    --chart-2: #1f8a45;
    --chart-3: #6b6b66;
    --chart-4: #0c0c0b;
    --chart-5: #9c9c95;
    --font-sans: "Geist Variable", ui-sans-serif, system-ui, -apple-system, sans-serif;
    --font-mono: "Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace;
    --radius-pill: 999px;
    --radius-lg: 20px;
    --radius-md: 14px;
    --radius-sm: 10px;
}
```

И блок `.dark` целиком на:

```css
.dark {
    --background: #0c0c0b;
    --foreground: #f7f7f5;
    --foreground-subtle: #6b6b66;
    --card: #161615;
    --card-foreground: #f7f7f5;
    --popover: #161615;
    --popover-foreground: #f7f7f5;
    --primary: #d9da26;
    --primary-foreground: #0c0c0b;
    --primary-soft: #2e2f14;
    --secondary: #232322;
    --secondary-foreground: #f7f7f5;
    --muted: #232322;
    --muted-foreground: #9c9c95;
    --accent: #2c2c2a;
    --accent-foreground: #f7f7f5;
    --success: #3fbd6e;
    --success-muted: #16321f;
    --destructive: #ef5445;
    --border: #2c2c2a;
    --border-strong: #3a3a37;
    --border-mute: #232322;
    --input: #2c2c2a;
    --ring: #f7f7f5;
    --sidebar: #111110;
    --sidebar-foreground: #f7f7f5;
    --sidebar-border: #2c2c2a;
    --sidebar-accent: #232322;
    --sidebar-accent-foreground: #f7f7f5;
    --sidebar-primary: #f7f7f5;
    --sidebar-primary-foreground: #0c0c0b;
    --sidebar-ring: #f7f7f5;
    --chart-1: #d9da26;
    --chart-2: #3fbd6e;
    --chart-3: #9c9c95;
    --chart-4: #f7f7f5;
    --chart-5: #6b6b66;
}
```

Также обновить шапку-комментарий файла, добавив после строки про радиус:

```
 * Шрифты: Geist (sans) + Geist Mono. Mono — семантический: только eyebrow,
 * числа-данные и лейблы групп в сайдбаре.
```

Обратите внимание: `--font-*` и `--radius-*` объявлены **только** в `:root`, не в `.dark` — они не зависят от темы, и генератор (шаг 4) вырезает их в отдельный бакет.

- [ ] **Step 3: Обновить src/index.css**

Заменить файл целиком на:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";
@import "../registry/limeui/theme/theme.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --font-heading: var(--font-sans);
    --font-sans: var(--font-sans);
    --font-mono: var(--font-mono);
    --color-chart-5: var(--chart-5);
    --color-chart-4: var(--chart-4);
    --color-chart-3: var(--chart-3);
    --color-chart-2: var(--chart-2);
    --color-chart-1: var(--chart-1);
    --color-sidebar-ring: var(--sidebar-ring);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar: var(--sidebar);
    --color-ring: var(--ring);
    --color-input: var(--input);
    --color-border-mute: var(--border-mute);
    --color-border-strong: var(--border-strong);
    --color-border: var(--border);
    --color-destructive: var(--destructive);
    --color-success-muted: var(--success-muted);
    --color-success: var(--success);
    --color-accent-foreground: var(--accent-foreground);
    --color-accent: var(--accent);
    --color-muted-foreground: var(--muted-foreground);
    --color-muted: var(--muted);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-secondary: var(--secondary);
    --color-primary-soft: var(--primary-soft);
    --color-primary-foreground: var(--primary-foreground);
    --color-primary: var(--primary);
    --color-popover-foreground: var(--popover-foreground);
    --color-popover: var(--popover);
    --color-card-foreground: var(--card-foreground);
    --color-card: var(--card);
    --color-foreground-subtle: var(--foreground-subtle);
    --color-foreground: var(--foreground);
    --color-background: var(--background);
    --radius-pill: var(--radius-pill);
    --radius-lg: var(--radius-lg);
    --radius-md: var(--radius-md);
    --radius-sm: var(--radius-sm);
}

@utility no-scrollbar {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

@layer base {
  * {
    @apply border-border outline-ring/50;
    }
  body {
    @apply bg-background text-foreground;
    }
  html {
    @apply font-sans;
    }
}
```

Почему `--font-sans: var(--font-sans)` не зациклено: `@theme inline` **не** переэмитит переменную в `:root` — она уже объявлена в `:root` через `@import` темы. Ровно этот же приём уже работает для `--radius-lg`.

- [ ] **Step 4: Научить генератор класть font-* в бакет theme**

В `scripts/build-registry.mjs` заменить блок строк 27-41 на:

```js
// Именованный радиус (`--radius-*`) и шрифты (`--font-*`) должны попасть
// в бакет `theme` cssVars, а не в `light`/`dark`: только `theme` CLI пишет
// напрямую в блок `@theme inline` проекта-потребителя, перезаписывая
// дефолтные shadcn-маппинги (`--radius-lg: var(--radius)` и т.п.).
// Значения одинаковы в обеих темах.
const THEME_BUCKET_PREFIXES = ["radius-", "font-"]
const inThemeBucket = (key) =>
  THEME_BUCKET_PREFIXES.some((prefix) => key.startsWith(prefix))

const themeVars = {}
for (const key of Object.keys(light)) {
  if (inThemeBucket(key)) {
    themeVars[key] = light[key]
    delete light[key]
  }
}
for (const key of Object.keys(dark)) {
  if (inThemeBucket(key)) delete dark[key]
}
```

Также исправить устаревший путь в комментарии на строке 2: `registry/linkz/theme/theme.css` → `registry/limeui/theme/theme.css`.

- [ ] **Step 5: Добавить в тему css-поле с импортом шрифтов**

В `registry.json`, в итем `theme` (после `"description"`, до `"cssVars"`) добавить:

```json
      "dependencies": [
        "@fontsource-variable/geist",
        "@fontsource-variable/geist-mono"
      ],
      "css": {
        "@import \"@fontsource-variable/geist\"": {},
        "@import \"@fontsource-variable/geist-mono\"": {}
      },
      "docs": "Шрифты Geist и Geist Mono установлены как npm-зависимости. Если после установки текст рендерится системным шрифтом — проверьте, что в главном CSS есть строки `@import \"@fontsource-variable/geist\";` и `@import \"@fontsource-variable/geist-mono\";` сразу после `@import \"tailwindcss\";`.",
```

Поле `css` здесь — гипотеза: не факт, что CLI умеет эмитить `@import` в правильную позицию файла. Это **проверяется на реальном CLI в Task 16**, там же описан фолбэк. Поле `docs` CLI печатает пользователю после установки, поэтому даже при неудачном `css` потребитель получит инструкцию.

- [ ] **Step 6: Пересобрать реестр и проверить бакеты**

```bash
pnpm build:registry
```

Ожидается вывод вида `theme: 6 theme / 32 light / 32 dark переменных`.

Проверить, что шрифты и радиусы уехали в нужный бакет:

```bash
node -e "const t=require('./registry.json').items.find(i=>i.name==='theme'); console.log(JSON.stringify(t.cssVars.theme,null,2)); console.log('font в light?', Object.keys(t.cssVars.light).filter(k=>k.startsWith('font-')));"
```

Ожидается: в `cssVars.theme` — `radius-pill`, `radius-lg`, `radius-md`, `radius-sm`, `font-sans`, `font-mono`; в `light` нет ни одного ключа на `font-`.

- [ ] **Step 7: Проверить сборку**

```bash
pnpm build
```

Ожидается: успех, без ошибок TypeScript и Vite.

- [ ] **Step 8: Коммит**

```bash
git add registry/limeui/theme/theme.css src/index.css scripts/build-registry.mjs package.json pnpm-lock.yaml registry.json r/
git commit -m "limeui: токены sidebar/foreground-subtle/border-mute/primary-soft, шрифты Geist Mono, утилита no-scrollbar"
```

---

### Task 2: Компонент typography (Eyebrow, Num)

Носители типографского контракта. Идут вторыми, потому что от них зависят `data-list`, `table`, `stat`.

**Files:**
- Create: `registry/limeui/ui/typography.tsx`
- Modify: `registry.json`
- Modify: `src/App.tsx` (временная секция-витрина, чтобы компонент был виден в демо)

**Interfaces:**
- Consumes: токены темы из Task 1 (`font-mono`, `text-muted-foreground`).
- Produces:
  - `Eyebrow(props: React.ComponentProps<"div"> & { size?: "sm" | "default" | "lg" })`
  - `Num(props: React.ComponentProps<"span"> & { value?: number; format?: Intl.NumberFormatOptions; locale?: string })`
  - `eyebrowVariants` (cva)

- [ ] **Step 1: Создать компонент**

Создать `registry/limeui/ui/typography.tsx`:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Geist Mono в limeui семантический, а не декоративный. Eyebrow — одна из
// трёх его ролей: микро-лейбл над секцией, карточкой или шапкой таблицы.
const eyebrowVariants = cva(
  "font-mono font-medium uppercase leading-[1.5] tracking-[0.06em] text-muted-foreground",
  {
    variants: {
      size: {
        sm: "text-[9.5px]",
        default: "text-[11px]",
        lg: "text-[12px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Eyebrow({
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof eyebrowVariants>) {
  return (
    <div
      data-slot="eyebrow"
      className={cn(eyebrowVariants({ size, className }))}
      {...props}
    />
  )
}

// Вторая роль mono: любое число, которое пользователь читает как данные —
// деньги, счётчики, просмотры, даты, проценты, ранги. tabular-nums держит
// колонки цифр выровненными при смене значения.
function Num({
  className,
  value,
  format,
  locale,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  value?: number
  format?: Intl.NumberFormatOptions
  locale?: string
}) {
  return (
    <span
      data-slot="num"
      className={cn("font-mono tabular-nums tracking-[-0.02em]", className)}
      {...props}
    >
      {value === undefined
        ? children
        : new Intl.NumberFormat(locale, format).format(value)}
    </span>
  )
}

export { Eyebrow, Num, eyebrowVariants }
```

- [ ] **Step 2: Зарегистрировать итем**

В `registry.json` в массив `items` добавить (порядок итемов в файле значения не имеет, добавляйте в конец):

```json
    {
      "name": "typography",
      "type": "registry:ui",
      "title": "Typography",
      "description": "Eyebrow и Num — носители типографского контракта limeui: Geist Mono только для микро-лейблов и чисел-данных.",
      "files": [
        {
          "path": "registry/limeui/ui/typography.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "class-variance-authority"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Показать на демо-странице**

В `src/App.tsx` добавить импорт:

```tsx
import { Eyebrow, Num } from "@/registry/limeui/ui/typography"
```

и секцию сразу после `<Section title="Button">…</Section>`:

```tsx
      <Section title="Typography">
        <div className="space-y-2">
          <Eyebrow>Заработано · август 2026</Eyebrow>
          <div className="flex items-baseline gap-4">
            <Num value={150000} className="text-[38px] font-semibold tracking-[-0.03em]" />
            <Num value={0.42} format={{ style: "percent" }} className="text-sm text-muted-foreground" />
            <Num className="text-sm text-muted-foreground">12 авг</Num>
          </div>
          <Eyebrow size="sm">Мелкий вариант · 9.5px</Eyebrow>
        </div>
      </Section>
```

- [ ] **Step 4: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: обе команды успешны, появился файл `r/typography.json`.

- [ ] **Step 5: Коммит**

```bash
git add registry/limeui/ui/typography.tsx registry.json src/App.tsx r/
git commit -m "limeui: компонент typography (Eyebrow, Num) — типографский контракт в коде"
```

---

### Task 3: Button icon-sm и тени плавающих слоёв

Разблокирует `sheet` и `sidebar` (оба используют `size="icon-sm"`) и приводит существующие компоненты к уточнённому правилу теней.

**Files:**
- Modify: `registry/limeui/ui/button.tsx:22-27`
- Modify: `registry/limeui/ui/dropdown-menu.tsx:34,191`
- Modify: `registry/limeui/ui/select.tsx:53`
- Modify: `registry/limeui/ui/dialog.tsx:51`
- Modify: `registry/limeui/ui/tooltip.tsx:37`

**Interfaces:**
- Produces: `Button` принимает `size="icon-sm"` (32×32).

- [ ] **Step 1: Добавить размер icon-sm**

В `registry/limeui/ui/button.tsx` заменить блок `size` (строки 22-27):

```tsx
      size: {
        default: "h-[54px] px-6 text-base",
        sm: "h-11 px-4 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "size-11 shrink-0 px-0",
      },
```

на:

```tsx
      size: {
        default: "h-[54px] px-6 text-base",
        sm: "h-11 px-4 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "size-11 shrink-0 px-0",
        "icon-sm": "size-8 shrink-0 px-0",
      },
```

- [ ] **Step 2: Тень на DropdownMenuContent**

В `registry/limeui/ui/dropdown-menu.tsx` строка 34 — заменить

```
          "z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground",
```

на

```
          "z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]",
```

- [ ] **Step 3: Тень на DropdownMenuSubContent**

В том же файле строка 191 — заменить

```
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground",
```

на

```
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]",
```

- [ ] **Step 4: Тень на SelectContent**

В `registry/limeui/ui/select.tsx` строка 53 — заменить

```
          "z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground",
```

на

```
          "z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]",
```

- [ ] **Step 5: Тень на DialogContent**

В `registry/limeui/ui/dialog.tsx` строка 51 — в длинной строке классов заменить фрагмент

```
gap-5 rounded-lg border border-border bg-card p-6 text-card-foreground duration-150
```

на

```
gap-5 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)] duration-150
```

- [ ] **Step 6: Тень на TooltipContent**

В `registry/limeui/ui/tooltip.tsx` строка 37 — заменить

```
          "z-50 w-fit rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-balance text-background",
```

на

```
          "z-50 w-fit rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-balance text-background shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]",
```

- [ ] **Step 7: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех. Открыть демо (`pnpm dev`) не требуется — визуальная проверка теней делается в Task 15.

- [ ] **Step 8: Коммит**

```bash
git add registry/limeui/ui/button.tsx registry/limeui/ui/dropdown-menu.tsx registry/limeui/ui/select.tsx registry/limeui/ui/dialog.tsx registry/limeui/ui/tooltip.tsx r/
git commit -m "limeui: размер кнопки icon-sm, тень для плавающих слоёв (dropdown/select/dialog/tooltip)"
```

---

### Task 4: Хук use-mobile

**Files:**
- Create: `registry/limeui/hooks/use-mobile.ts`
- Modify: `registry.json`

**Interfaces:**
- Produces: `useIsMobile(): boolean` — `true` при ширине окна < 768px.

- [ ] **Step 1: Создать хук**

Создать `registry/limeui/hooks/use-mobile.ts`:

```ts
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

- [ ] **Step 2: Зарегистрировать итем**

В `registry.json` добавить в `items`:

```json
    {
      "name": "use-mobile",
      "type": "registry:hook",
      "title": "useIsMobile",
      "description": "Хук: true при ширине окна < 768px. Нужен sidebar для переключения в мобильный режим.",
      "files": [
        {
          "path": "registry/limeui/hooks/use-mobile.ts",
          "type": "registry:hook"
        }
      ]
    }
```

- [ ] **Step 3: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех, появился `r/use-mobile.json`. Внутри `r/use-mobile.json` путь файла должен быть `registry/limeui/hooks/use-mobile.ts` с типом `registry:hook`.

- [ ] **Step 4: Коммит**

```bash
git add registry/limeui/hooks/use-mobile.ts registry.json r/
git commit -m "limeui: хук use-mobile"
```

---

### Task 5: Компонент sheet

Канонический shadcn-компонент, портированный в реестр с двумя правками под limeui.

**Files:**
- Create: `registry/limeui/ui/sheet.tsx` (источник — `src/components/ui/sheet.tsx`, поставленный CLI)
- Modify: `registry.json`

**Interfaces:**
- Consumes: `Button` с `size="icon-sm"` (Task 3).
- Produces: `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent` (проп `side?: "top" | "right" | "bottom" | "left"`, `showCloseButton?: boolean`), `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`.

- [ ] **Step 1: Скопировать канонический файл**

```bash
cp src/components/ui/sheet.tsx registry/limeui/ui/sheet.tsx
```

- [ ] **Step 2: Переписать импорт на реестровый путь**

В `registry/limeui/ui/sheet.tsx` заменить

```tsx
import { Button } from "@/components/ui/button"
```

на

```tsx
import { Button } from "@/registry/limeui/ui/button"
```

- [ ] **Step 3: Убрать несуществующий токен font-heading из SheetTitle**

Заменить

```tsx
      className={cn(
        "font-heading text-base font-medium text-foreground",
        className
      )}
```

на

```tsx
      className={cn("text-base font-medium text-foreground", className)}
```

Причина: `--font-heading` объявлен только в `src/index.css` этого репозитория и не доставляется темой — в проекте-потребителе класс `font-heading` не сгенерируется и будет молчаливо ничем.

- [ ] **Step 4: Заменить тень на токен плавающего слоя**

В классах `SheetContent` заменить `shadow-lg` на `shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]`. Фрагмент

```
bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out
```

должен стать

```
bg-clip-padding text-sm text-popover-foreground shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)] transition duration-200 ease-in-out
```

- [ ] **Step 5: Зарегистрировать итем**

В `registry.json` добавить в `items`:

```json
    {
      "name": "sheet",
      "type": "registry:ui",
      "title": "Sheet",
      "description": "Выезжающая панель на Radix Dialog. Используется sidebar в мобильном режиме.",
      "files": [
        {
          "path": "registry/limeui/ui/sheet.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "lucide-react",
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme",
        "@limeui/button"
      ]
    }
```

- [ ] **Step 6: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех, появился `r/sheet.json`.

- [ ] **Step 7: Коммит**

```bash
git add registry/limeui/ui/sheet.tsx registry.json r/
git commit -m "limeui: компонент sheet"
```

---

### Task 6: Компонент sidebar

Канонический shadcn-сайдбар (все 23 экспорта, API совместим с апстримом), перекрашенный под klipni. Самая большая задача плана.

**Files:**
- Create: `registry/limeui/ui/sidebar.tsx` (источник — `src/components/ui/sidebar.tsx`, поставленный CLI)
- Modify: `registry.json`

**Interfaces:**
- Consumes: `useIsMobile` (Task 4), `Sheet`/`SheetContent`/`SheetHeader`/`SheetTitle`/`SheetDescription` (Task 5), `Button` с `size="icon-sm"` (Task 3), `Input`, `Separator`, `Skeleton`, `Tooltip`/`TooltipContent`/`TooltipTrigger` (существуют), токены `--sidebar-*` и утилита `no-scrollbar` (Task 1).
- Produces: `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInput`, `SidebarInset`, `SidebarMenu`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem`, `SidebarProvider`, `SidebarRail`, `SidebarSeparator`, `SidebarTrigger`, `useSidebar`.
  - `SidebarProvider` принимает `defaultOpen?: boolean`, `open?: boolean`, `onOpenChange?: (open: boolean) => void`.
  - `Sidebar` принимает `side?: "left" | "right"`, `variant?: "sidebar" | "floating" | "inset"`, `collapsible?: "offcanvas" | "icon" | "none"`.
  - `SidebarMenuButton` принимает `asChild?`, `isActive?`, `tooltip?: string | React.ComponentProps<typeof TooltipContent>`, `variant?: "default" | "outline"`, `size?: "default" | "sm" | "lg"`.

- [ ] **Step 1: Скопировать канонический файл**

```bash
cp src/components/ui/sidebar.tsx registry/limeui/ui/sidebar.tsx
```

Строку `"use client"` в начале файла **оставить** — компонент владеет React-контекстом и состоянием, и в Next.js App Router без неё сломается. Это единственный файл реестра с этой директивой, ровно как в апстриме shadcn.

- [ ] **Step 2: Переписать импорты на реестровые пути**

В `registry/limeui/ui/sidebar.tsx` заменить блок импортов (строки 7-24) на:

```tsx
import { useIsMobile } from "@/registry/limeui/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/limeui/ui/button"
import { Input } from "@/registry/limeui/ui/input"
import { Separator } from "@/registry/limeui/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/registry/limeui/ui/sheet"
import { Skeleton } from "@/registry/limeui/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/limeui/ui/tooltip"
```

- [ ] **Step 3: Задать ширины klipni**

Заменить

```tsx
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
```

на

```tsx
const SIDEBAR_WIDTH = "14.75rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "4.25rem"
```

(236px развёрнутый и 68px свёрнутый — измерено на app.klipni.com.)

- [ ] **Step 4: Перекрасить SidebarHeader**

Заменить

```tsx
      className={cn("flex flex-col gap-2 p-2", className)}
```

(внутри функции `SidebarHeader`) на

```tsx
      className={cn(
        "flex flex-col gap-2 px-5 pt-5 pb-4 group-data-[collapsible=icon]:px-3",
        className
      )}
```

- [ ] **Step 5: Перекрасить SidebarFooter**

Заменить

```tsx
      className={cn("flex flex-col gap-2 p-2", className)}
```

(внутри функции `SidebarFooter`) на

```tsx
      className={cn(
        "flex flex-col gap-2 border-t border-sidebar-border px-4 py-3.5 group-data-[collapsible=icon]:px-3",
        className
      )}
```

- [ ] **Step 6: Перекрасить SidebarGroup**

Заменить

```tsx
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
```

на

```tsx
      className={cn("relative flex w-full min-w-0 flex-col px-3 pb-4", className)}
```

- [ ] **Step 7: Перекрасить SidebarGroupLabel в mono-контракт**

Заменить

```tsx
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
```

на

```tsx
        "flex h-auto shrink-0 items-center rounded-sm px-2.5 pb-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-foreground-subtle ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
```

Это третья роль Geist Mono из типографского контракта.

- [ ] **Step 8: Перекрасить пункт меню**

Заменить базовую строку `sidebarMenuButtonVariants`

```tsx
  "peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
```

на

```tsx
  "peer/menu-button group/menu-button flex w-full items-center gap-2.5 overflow-hidden rounded-sm px-2.5 py-2 text-left text-[13px] font-medium text-muted-foreground ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-primary data-active:font-medium data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
```

Три содержательных изменения: активный пункт стал чёрной плашкой (`bg-sidebar-primary`), добавлены `data-active:hover:*` (иначе hover перебивал бы активное состояние), покоящийся цвет стал `text-muted-foreground` (как на klipni).

- [ ] **Step 9: Подправить размеры пункта меню**

Заменить

```tsx
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
```

на

```tsx
      size: {
        default: "h-auto text-[13px]",
        sm: "h-auto py-1.5 text-[12px]",
        lg: "h-12 text-[13px] group-data-[collapsible=icon]:p-0!",
      },
```

- [ ] **Step 10: Перекрасить SidebarMenuBadge**

Заменить

```tsx
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none
```

на

```tsx
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-sm px-1 font-mono text-[11px] font-medium text-sidebar-foreground tabular-nums select-none
```

(остальная часть длинной строки классов не меняется).

- [ ] **Step 11: Перекрасить радиусы вложенных элементов**

Три точечные замены `rounded-md` → `rounded-sm`:

1. В `SidebarMenuSkeleton`: `className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}` → `className={cn("flex h-8 items-center gap-2.5 rounded-sm px-2.5", className)}`
2. В `SidebarMenuSkeleton`, у иконки: `className="size-4 rounded-md"` → `className="size-4 rounded-sm"`
3. В `SidebarMenuSubButton`: фрагмент `overflow-hidden rounded-md px-2 text-sidebar-foreground` → `overflow-hidden rounded-sm px-2.5 text-sidebar-foreground`

Плюс в `SidebarGroupAction` и `SidebarMenuAction`: `rounded-md p-0` → `rounded-sm p-0` (по одному вхождению в каждом).

- [ ] **Step 12: Подправить SidebarInput**

Заменить

```tsx
      className={cn("h-8 w-full bg-background shadow-none", className)}
```

на

```tsx
      className={cn("h-9 w-full bg-background shadow-none", className)}
```

- [ ] **Step 13: Зарегистрировать итем**

В `registry.json` добавить в `items`:

```json
    {
      "name": "sidebar",
      "type": "registry:ui",
      "title": "Sidebar",
      "description": "Сайдбар дашборда: 236px развёрнутый / 68px свёрнутый, группы с mono-лейблами, активный пункт — чёрная плашка. На мобильном открывается как Sheet.",
      "files": [
        {
          "path": "registry/limeui/ui/sidebar.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "class-variance-authority",
        "lucide-react",
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme",
        "@limeui/button",
        "@limeui/input",
        "@limeui/separator",
        "@limeui/sheet",
        "@limeui/skeleton",
        "@limeui/tooltip",
        "@limeui/use-mobile"
      ],
      "css": {
        "@utility no-scrollbar": {
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            "display": "none"
          }
        }
      }
    }
```

Поле `css` обязательно: канонический файл использует класс `no-scrollbar`, которого нет ни в Tailwind, ни в shadcn — без доставки утилиты у потребителя в сайдбаре появится системный скроллбар.

- [ ] **Step 14: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех, появился `r/sidebar.json`. Проверить, что утилита доехала:

```bash
node -e "const s=require('./r/sidebar.json'); console.log(JSON.stringify(s.css,null,2))"
```

Ожидается непустой объект с ключом `@utility no-scrollbar`.

- [ ] **Step 15: Коммит**

```bash
git add registry/limeui/ui/sidebar.tsx registry.json r/
git commit -m "limeui: компонент sidebar (канонический shadcn, перекрашен под klipni)"
```

---

### Task 7: Компонент bar-chart

**Files:**
- Create: `registry/limeui/ui/bar-chart.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces:
  - `type BarChartDatum = { label: string; value: number }`
  - `BarChart(props)` где props =
    `Omit<React.ComponentProps<"div">, "onClick"> & { data: BarChartDatum[]; height?: number; tone?: "default" | "inverse"; formatValue?: (value: number) => string; startLabel?: React.ReactNode; endLabel?: React.ReactNode; onBarClick?: (datum: BarChartDatum, index: number) => void }`

- [ ] **Step 1: Создать компонент**

Создать `registry/limeui/ui/bar-chart.tsx`:

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

type BarChartDatum = {
  label: string
  value: number
}

// Столбец с нулевым значением всё равно рисуется полоской в 2px — так график
// читается как календарь периода, а не как обрывающийся ряд.
const MIN_BAR_HEIGHT = 2

function BarChart({
  className,
  data,
  height = 120,
  tone = "default",
  formatValue = (value) => String(value),
  startLabel,
  endLabel,
  onBarClick,
  ...props
}: Omit<React.ComponentProps<"div">, "onClick"> & {
  data: BarChartDatum[]
  height?: number
  tone?: "default" | "inverse"
  formatValue?: (value: number) => string
  startLabel?: React.ReactNode
  endLabel?: React.ReactNode
  onBarClick?: (datum: BarChartDatum, index: number) => void
}) {
  const max = data.reduce((acc, datum) => Math.max(acc, datum.value), 0)

  return (
    <div data-slot="bar-chart" className={cn("w-full", className)} {...props}>
      <div
        data-slot="bar-chart-bars"
        className="flex items-end gap-1"
        style={{ height }}
      >
        {data.map((datum, index) => {
          const filled = max > 0 && datum.value > 0
          const barHeight = filled
            ? Math.max(MIN_BAR_HEIGHT, Math.round((datum.value / max) * height))
            : MIN_BAR_HEIGHT

          return (
            <button
              key={`${datum.label}-${index}`}
              type="button"
              data-slot="bar-chart-bar"
              data-empty={filled ? undefined : true}
              aria-label={`${datum.label}: ${formatValue(datum.value)}`}
              onClick={onBarClick ? () => onBarClick(datum, index) : undefined}
              className="group relative flex-1 self-stretch border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 bottom-0 rounded-[2px] transition-opacity",
                  // bg-current подхватывает цвет текста контейнера, поэтому
                  // на чёрной карточке нулевые полоски светлые, на белой — тёмные.
                  filled
                    ? "bg-primary group-hover:opacity-80"
                    : "bg-current opacity-40"
                )}
                style={{ height: barHeight }}
              />
            </button>
          )
        })}
      </div>
      {data.length > 0 && (
        <div
          data-slot="bar-chart-axis"
          className={cn(
            "mt-2.5 flex items-center justify-between font-mono text-[11px] tabular-nums",
            tone === "inverse" ? "opacity-50" : "text-muted-foreground"
          )}
        >
          <span>{startLabel ?? data[0].label}</span>
          <span>{endLabel ?? data[data.length - 1].label}</span>
        </div>
      )}
    </div>
  )
}

export { BarChart }
export type { BarChartDatum }
```

- [ ] **Step 2: Зарегистрировать итем**

В `registry.json` добавить в `items`:

```json
    {
      "name": "bar-chart",
      "type": "registry:ui",
      "title": "Bar Chart",
      "description": "Столбчатый график за период без внешних зависимостей: flex-вёрстка, столбец = кнопка с aria-label, нулевые дни — полоска 2px.",
      "files": [
        {
          "path": "registry/limeui/ui/bar-chart.tsx",
          "type": "registry:ui"
        }
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех, появился `r/bar-chart.json`. В `dependencies` итема не должно быть ни одного npm-пакета.

- [ ] **Step 4: Коммит**

```bash
git add registry/limeui/ui/bar-chart.tsx registry.json r/
git commit -m "limeui: компонент bar-chart (без внешних зависимостей)"
```

---

### Task 8: Компонент avatar

**Files:**
- Create: `registry/limeui/ui/avatar.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces:
  - `Avatar(props: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: "sm" | "default" | "lg"; ring?: boolean })`
  - `AvatarImage(props: React.ComponentProps<typeof AvatarPrimitive.Image>)`
  - `AvatarFallback(props: React.ComponentProps<typeof AvatarPrimitive.Fallback>)`
  - `avatarVariants` (cva)

Размеры: `sm` 32px (текст 12px), `default` 40px (текст 15px), `lg` 56px (текст 21px) — сняты с app.klipni.com.

- [ ] **Step 1: Создать компонент**

Создать `registry/limeui/ui/avatar.tsx`:

```tsx
import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Размер шрифта задаётся на корне, чтобы AvatarFallback наследовал его
// и не приходилось дублировать вариант размера во втором компоненте.
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-pill",
  {
    variants: {
      size: {
        sm: "size-8 text-[12px]",
        default: "size-10 text-[15px]",
        lg: "size-14 text-[21px]",
      },
      ring: {
        true: "ring-2 ring-primary",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      ring: false,
    },
  }
)

function Avatar({
  className,
  size,
  ring,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, ring, className }))}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-pill bg-muted font-mono font-semibold tracking-[-0.02em] text-muted-foreground select-none",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants }
```

- [ ] **Step 2: Зарегистрировать итем**

В `registry.json` добавить в `items`:

```json
    {
      "name": "avatar",
      "type": "registry:ui",
      "title": "Avatar",
      "description": "Аватар с инициалами в Geist Mono. Размеры 32/40/56, опциональное лаймовое кольцо.",
      "files": [
        {
          "path": "registry/limeui/ui/avatar.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "class-variance-authority",
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех, появился `r/avatar.json`.

- [ ] **Step 4: Коммит**

```bash
git add registry/limeui/ui/avatar.tsx registry.json r/
git commit -m "limeui: компонент avatar"
```

---

### Task 9: Компонент progress

**Files:**
- Create: `registry/limeui/ui/progress.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Progress(props: React.ComponentProps<typeof ProgressPrimitive.Root> & { size?: "sm" | "default"; tone?: "default" | "primary" })`. `size="sm"` → 3px, `default` → 5px. `tone="default"` → индикатор `bg-foreground`, `tone="primary"` → `bg-primary`.

- [ ] **Step 1: Создать компонент**

Создать `registry/limeui/ui/progress.tsx`:

```tsx
import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-pill bg-muted",
  {
    variants: {
      size: {
        sm: "h-[3px]",
        default: "h-[5px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Progress({
  className,
  value,
  size,
  tone = "default",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants> & {
    tone?: "default" | "primary"
  }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressVariants({ size, className }))}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "size-full flex-1 rounded-pill transition-transform duration-300 ease-out",
          tone === "primary" ? "bg-primary" : "bg-foreground"
        )}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress, progressVariants }
```

- [ ] **Step 2: Зарегистрировать итем**

В `registry.json` добавить в `items`:

```json
    {
      "name": "progress",
      "type": "registry:ui",
      "title": "Progress",
      "description": "Тонкий pill-прогресс: 3px или 5px, индикатор нейтральный или лаймовый.",
      "files": [
        {
          "path": "registry/limeui/ui/progress.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "class-variance-authority",
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех, появился `r/progress.json`.

- [ ] **Step 4: Коммит**

```bash
git add registry/limeui/ui/progress.tsx registry.json r/
git commit -m "limeui: компонент progress"
```

---

### Task 10: Компонент page-header

**Files:**
- Create: `registry/limeui/ui/page-header.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `PageHeader`, `PageHeaderContent`, `PageHeaderTitle` (рендерит `<h1>`), `PageHeaderDescription` (рендерит `<p>`), `PageHeaderActions` — все принимают `React.ComponentProps` соответствующего тега.

- [ ] **Step 1: Создать компонент**

Создать `registry/limeui/ui/page-header.tsx`:

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function PageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-6",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-content"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

function PageHeaderTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn(
        "text-[38px] font-semibold leading-none tracking-[-0.03em] lg:text-[48px]",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-description"
      className={cn("text-[15px] text-muted-foreground", className)}
      {...props}
    />
  )
}

function PageHeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

export {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
}
```

Eyebrow подаётся снаружи, внутрь `PageHeaderContent` — компонент не тянет `@limeui/typography` в зависимости, потому что заголовок может обходиться без надстрочника.

- [ ] **Step 2: Зарегистрировать итем**

В `registry.json` добавить в `items`:

```json
    {
      "name": "page-header",
      "type": "registry:ui",
      "title": "Page Header",
      "description": "Шапка страницы дашборда: надстрочник + заголовок слева, действия справа.",
      "files": [
        {
          "path": "registry/limeui/ui/page-header.tsx",
          "type": "registry:ui"
        }
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех, появился `r/page-header.json`.

- [ ] **Step 4: Коммит**

```bash
git add registry/limeui/ui/page-header.tsx registry.json r/
git commit -m "limeui: компонент page-header"
```

---

### Task 11: Компонент empty-state

**Files:**
- Create: `registry/limeui/ui/empty-state.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `EmptyState`, `EmptyStateIcon`, `EmptyStateTitle`, `EmptyStateDescription`.
- Голый `<EmptyState>текст</EmptyState>` должен визуально совпадать с пустым состоянием таблицы на klipni: `px-5 py-10 text-center text-[13px] text-muted-foreground`.

- [ ] **Step 1: Создать компонент**

Создать `registry/limeui/ui/empty-state.tsx`:

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function EmptyState({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-5 py-10 text-center text-[13px] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-icon"
      className={cn(
        "text-foreground-subtle [&_svg]:size-6 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-title"
      className={cn("text-[14px] font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function EmptyStateDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-state-description"
      className={cn("max-w-[46ch] text-[13px] text-muted-foreground", className)}
      {...props}
    />
  )
}

export { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription }
```

- [ ] **Step 2: Зарегистрировать итем**

В `registry.json` добавить в `items`:

```json
    {
      "name": "empty-state",
      "type": "registry:ui",
      "title": "Empty State",
      "description": "Пустое состояние списка или таблицы: иконка, заголовок, пояснение, действие.",
      "files": [
        {
          "path": "registry/limeui/ui/empty-state.tsx",
          "type": "registry:ui"
        }
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех, появился `r/empty-state.json`.

- [ ] **Step 4: Коммит**

```bash
git add registry/limeui/ui/empty-state.tsx registry.json r/
git commit -m "limeui: компонент empty-state"
```

---

### Task 12: Компонент data-list

**Files:**
- Create: `registry/limeui/ui/data-list.tsx`
- Modify: `registry.json`

**Interfaces:**
- Consumes: `Num` из `@/registry/limeui/ui/typography` (Task 2).
- Produces: `DataList`, `DataListBody`, `DataListRow`, `DataListLabel`, `DataListValue`. `DataListValue` рендерит `Num`, поэтому принимает `React.ComponentProps<typeof Num>` (включая `value`/`format`/`locale`).

- [ ] **Step 1: Создать компонент**

Создать `registry/limeui/ui/data-list.tsx`:

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"
import { Num } from "@/registry/limeui/ui/typography"

function DataList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-list"
      className={cn("rounded-lg bg-muted p-5", className)}
      {...props}
    />
  )
}

function DataListBody({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="data-list-body"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function DataListRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-list-row"
      className={cn("flex items-baseline justify-between gap-3", className)}
      {...props}
    />
  )
}

function DataListLabel({ className, ...props }: React.ComponentProps<"dt">) {
  return (
    <dt
      data-slot="data-list-label"
      className={cn("text-[12px] leading-[1.35] text-muted-foreground", className)}
      {...props}
    />
  )
}

// Значение всегда идёт через Num — это и есть механизм, которым типографский
// контракт limeui соблюдается сам собой, без дисциплины на стороне вызова.
function DataListValue({
  className,
  ...props
}: React.ComponentProps<typeof Num>) {
  return (
    <dd data-slot="data-list-value" className="contents">
      <Num
        className={cn(
          "shrink-0 text-[13px] font-semibold whitespace-nowrap",
          className
        )}
        {...props}
      />
    </dd>
  )
}

export { DataList, DataListBody, DataListRow, DataListLabel, DataListValue }
```

- [ ] **Step 2: Зарегистрировать итем**

В `registry.json` добавить в `items`:

```json
    {
      "name": "data-list",
      "type": "registry:ui",
      "title": "Data List",
      "description": "Список «лейбл — значение» на приглушённом фоне. Значения идут через Num, поэтому всегда в Geist Mono с tabular-nums.",
      "files": [
        {
          "path": "registry/limeui/ui/data-list.tsx",
          "type": "registry:ui"
        }
      ],
      "registryDependencies": [
        "@limeui/theme",
        "@limeui/typography"
      ]
    }
```

- [ ] **Step 3: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех, появился `r/data-list.json`.

- [ ] **Step 4: Коммит**

```bash
git add registry/limeui/ui/data-list.tsx registry.json r/
git commit -m "limeui: компонент data-list"
```

---

### Task 13: Переделка table под вид klipni

Семантика `<table>` сохраняется (доступность, сортировка, копирование), визуал приводится к виду klipni.

**Files:**
- Modify: `registry/limeui/ui/table.tsx`
- Modify: `registry.json` (зависимости итема `table`)

**Interfaces:**
- Consumes: `EmptyState` из `@/registry/limeui/ui/empty-state` (Task 11).
- Produces: прежние экспорты `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption` + новый `TableEmpty(props: React.ComponentProps<"td"> & { colSpan: number })`.

- [ ] **Step 1: Переписать компонент**

Заменить `registry/limeui/ui/table.tsx` целиком на:

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"
import { EmptyState } from "@/registry/limeui/ui/empty-state"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-lg border border-border bg-card"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-muted [&_tr]:border-b [&_tr]:border-border", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-border bg-muted font-medium", className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors hover:bg-muted/60 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

// Шапка таблицы — одна из трёх ролей Geist Mono в limeui.
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "px-4 py-3 text-left align-middle font-mono text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase whitespace-nowrap lg:px-6 [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-4 align-middle text-[13px] whitespace-nowrap lg:px-6 [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableEmpty({
  className,
  colSpan,
  children,
  ...props
}: React.ComponentProps<"td"> & { colSpan: number }) {
  return (
    <tr data-slot="table-empty-row" className="hover:bg-transparent">
      <td
        data-slot="table-empty"
        colSpan={colSpan}
        className={cn("p-0", className)}
        {...props}
      >
        <EmptyState>{children}</EmptyState>
      </td>
    </tr>
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableEmpty,
  TableCaption,
}
```

Числовые колонки оформляются на стороне вызова: `<TableCell className="text-right"><Num value={150000} /></TableCell>`.

- [ ] **Step 2: Обновить зависимости итема table**

В `registry.json` в итеме `"name": "table"` заменить

```json
      "registryDependencies": [
        "@limeui/theme"
      ]
```

на

```json
      "registryDependencies": [
        "@limeui/theme",
        "@limeui/empty-state"
      ]
```

- [ ] **Step 3: Обновить демо-страницу под новый API**

В `src/App.tsx` в секции `Table` убрать `className="max-w-md"` с `<Table>` (обёртка теперь несёт рамку и фон, ограничивать ширину надо снаружи) — обернуть таблицу в `<div className="max-w-2xl">`. Числовые ячейки перевести на `Num`:

```tsx
      <Section title="Table">
        <div className="max-w-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Кампания</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Ставка</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Gloox</TableCell>
                <TableCell>
                  <Badge variant="success">Активна</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Num value={150000} /> ₽
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Luminary</TableCell>
                <TableCell>
                  <Badge variant="secondary">Скоро</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Num value={200000} /> ₽
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Section>
```

Добавить импорт `TableEmpty` в список импортов из `@/registry/limeui/ui/table`.

- [ ] **Step 4: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех.

- [ ] **Step 5: Коммит**

```bash
git add registry/limeui/ui/table.tsx registry.json src/App.tsx r/
git commit -m "limeui: table в стиле klipni (mono-шапка, карточная обёртка, TableEmpty)"
```

---

### Task 14: Расширение stat

**Files:**
- Modify: `registry/limeui/ui/stat.tsx`
- Modify: `registry.json` (зависимости итема `stat`)

**Interfaces:**
- Consumes: `Eyebrow`, `Num` из `@/registry/limeui/ui/typography` (Task 2).
- Produces: `Stat(props: React.ComponentProps<"div"> & { variant?: "plain" | "card" })`, `StatLabel` (рендерит `Eyebrow`), `StatValue` (рендерит `Num`, принимает `React.ComponentProps<typeof Num>`), `StatCaption` (новый).

- [ ] **Step 1: Переписать компонент**

Заменить `registry/limeui/ui/stat.tsx` целиком на:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Eyebrow, Num } from "@/registry/limeui/ui/typography"

const statVariants = cva("flex flex-col", {
  variants: {
    variant: {
      plain: "gap-1.5",
      card: "gap-3 rounded-lg border border-border bg-card px-6 py-5",
    },
  },
  defaultVariants: {
    variant: "plain",
  },
})

function Stat({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof statVariants>) {
  return (
    <div
      data-slot="stat"
      className={cn(statVariants({ variant, className }))}
      {...props}
    />
  )
}

function StatLabel({
  className,
  ...props
}: React.ComponentProps<typeof Eyebrow>) {
  return <Eyebrow data-slot="stat-label" className={className} {...props} />
}

function StatValue({ className, ...props }: React.ComponentProps<typeof Num>) {
  return (
    <Num
      data-slot="stat-value"
      className={cn(
        "text-[38px] font-semibold leading-[1] tracking-[-0.03em] text-foreground",
        className
      )}
      {...props}
    />
  )
}

function StatCaption({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-caption"
      className={cn(
        "font-mono text-[11px] tabular-nums text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Stat, StatLabel, StatValue, StatCaption, statVariants }
```

`StatValue` теперь `<span>` (потому что `Num` — span). В существующей демо-разметке он лежит внутри `Stat` (flex-колонка), поэтому визуально это ничего не ломает.

- [ ] **Step 2: Обновить зависимости итема stat**

В `registry.json` в итеме `"name": "stat"` заменить

```json
      "registryDependencies": [
        "@limeui/theme"
      ]
```

на

```json
      "dependencies": [
        "class-variance-authority"
      ],
      "registryDependencies": [
        "@limeui/theme",
        "@limeui/typography"
      ]
```

- [ ] **Step 3: Обновить демо-страницу**

В `src/App.tsx` заменить секцию `Stat` на:

```tsx
      <Section title="Stat">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat variant="card">
            <StatLabel size="sm">Креаторов</StatLabel>
            <StatValue value={2603} />
            <StatCaption>на платформе</StatCaption>
          </Stat>
          <Stat variant="card">
            <StatLabel size="sm">Просмотры</StatLabel>
            <StatValue>11,1 млн</StatValue>
            <StatCaption>на принятых клипах</StatCaption>
          </Stat>
          <Stat variant="card">
            <StatLabel size="sm">Заработано</StatLabel>
            <StatValue>113 тыс ₽</StatValue>
            <StatCaption>в этой доске</StatCaption>
          </Stat>
        </div>
      </Section>
```

и добавить `StatCaption` в импорт из `@/registry/limeui/ui/stat`.

- [ ] **Step 4: Проверить сборку и реестр**

```bash
pnpm build && pnpm build:registry
```

Ожидается: успех.

- [ ] **Step 5: Коммит**

```bash
git add registry/limeui/ui/stat.tsx registry.json src/App.tsx r/
git commit -m "limeui: stat — карточный вариант, StatCaption, значение через Num"
```

---

### Task 15: Перестройка демо-страницы в дашборд-каркас

Сайдбар и таблицу нельзя проверить в отрыве от layout'а: плоский список секций не покажет ни collapse, ни sticky, ни поведение `SidebarInset`, ни мобильный `Sheet`.

**Files:**
- Create: `src/demo/DashboardDemo.tsx`
- Create: `src/demo/ComponentsDemo.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: все компоненты из Task 1-14.
- Produces: `DashboardDemo()` — дашборд-каркас; `ComponentsDemo()` — витрина всех компонентов (переезжает из нынешнего `App.tsx`).

- [ ] **Step 1: Вынести существующую витрину**

Создать `src/demo/ComponentsDemo.tsx`: перенести туда всё текущее содержимое `src/App.tsx` **кроме** тумблера темы и обёртки `<div className="mx-auto max-w-4xl …">`. Экспортировать по умолчанию функцию `ComponentsDemo`, возвращающую `<div className="space-y-10">…секции…</div>`. Локальный хелпер `Section` переезжает вместе с ней. Импорты компонентов оставить прежними (`@/registry/limeui/ui/...`).

- [ ] **Step 2: Создать дашборд-демо**

Создать `src/demo/DashboardDemo.tsx`:

```tsx
import {
  BarChartIcon,
  BellIcon,
  LayoutGridIcon,
  MessageSquareIcon,
  PlayIcon,
  TrophyIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"

import { BarChart, type BarChartDatum } from "@/registry/limeui/ui/bar-chart"
import { Button } from "@/registry/limeui/ui/button"
import { Chip } from "@/registry/limeui/ui/chip"
import {
  DataList,
  DataListBody,
  DataListLabel,
  DataListRow,
  DataListValue,
} from "@/registry/limeui/ui/data-list"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderTitle,
} from "@/registry/limeui/ui/page-header"
import { Progress } from "@/registry/limeui/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/limeui/ui/sidebar"
import { Stat, StatCaption, StatLabel, StatValue } from "@/registry/limeui/ui/stat"
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/limeui/ui/table"
import { Eyebrow, Num } from "@/registry/limeui/ui/typography"
import { Avatar, AvatarFallback } from "@/registry/limeui/ui/avatar"

const NAV = [
  {
    label: "Работа",
    items: [
      { title: "Кампании", icon: LayoutGridIcon, badge: undefined },
      { title: "Мои клипы", icon: PlayIcon, badge: "7" },
      { title: "Сообщения", icon: MessageSquareIcon, badge: undefined },
    ],
  },
  {
    label: "Рост",
    items: [
      { title: "Аналитика", icon: BarChartIcon, badge: undefined },
      { title: "Лидерборд", icon: TrophyIcon, badge: undefined },
      { title: "Команда", icon: UsersIcon, badge: undefined },
    ],
  },
  {
    label: "Деньги",
    items: [{ title: "Выплаты", icon: WalletIcon, badge: undefined }],
  },
  {
    label: "Кабинет",
    items: [{ title: "Уведомления", icon: BellIcon, badge: "3" }],
  },
]

const ACTIVE = "Выплаты"

// 12 дней августа: часть с начислениями, часть нулевых — так видно оба
// состояния столбца одновременно.
const EARNINGS: BarChartDatum[] = [
  { label: "01 авг", value: 0 },
  { label: "02 авг", value: 4200 },
  { label: "03 авг", value: 11800 },
  { label: "04 авг", value: 6400 },
  { label: "05 авг", value: 0 },
  { label: "06 авг", value: 19300 },
  { label: "07 авг", value: 24100 },
  { label: "08 авг", value: 9700 },
  { label: "09 авг", value: 0 },
  { label: "10 авг", value: 31500 },
  { label: "11 авг", value: 27600 },
  { label: "12 авг", value: 15400 },
]

const TOTAL = EARNINGS.reduce((sum, day) => sum + day.value, 0)

const money = (value: number) =>
  `${new Intl.NumberFormat("ru-RU").format(value)} ₽`

export default function DashboardDemo() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
              <span className="text-[18px] font-extrabold leading-none tracking-[-0.04em]">
                limeui
              </span>
              <span className="rounded-[3px] bg-foreground px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-background">
                beta
              </span>
            </span>
            <SidebarTrigger />
          </div>
        </SidebarHeader>

        <SidebarContent className="no-scrollbar">
          {NAV.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={item.title === ACTIVE}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-baseline justify-between group-data-[collapsible=icon]:hidden">
            <Eyebrow size="sm">Баланс</Eyebrow>
            <Num value={TOTAL} className="text-[13px] font-semibold" />
          </div>
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              <AvatarFallback>АС</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
              Профиль
            </span>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="mx-auto w-full max-w-[1320px] px-6 py-8 lg:px-10 lg:py-10">
          <PageHeader>
            <PageHeaderContent>
              <Eyebrow>Выплаты</Eyebrow>
              <PageHeaderTitle>Заработок</PageHeaderTitle>
            </PageHeaderContent>
            <PageHeaderActions>
              <Chip pressed>Август 2026</Chip>
              <Chip>Все каналы</Chip>
            </PageHeaderActions>
          </PageHeader>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_380px]">
            <div className="min-w-0 space-y-7">
              <div className="rounded-lg border border-foreground bg-foreground p-6 text-background lg:p-8">
                <Eyebrow className="mb-3.5 text-background opacity-60">
                  Заработано · август 2026
                </Eyebrow>
                <Num
                  value={TOTAL}
                  className="block text-[64px] font-semibold leading-[0.9] tracking-[-0.04em] lg:text-[88px]"
                />
                <BarChart
                  className="mt-9"
                  data={EARNINGS}
                  tone="inverse"
                  formatValue={money}
                  endLabel="сегодня · 12 авг"
                />
              </div>

              <div>
                <div className="mb-3.5 flex items-baseline justify-between">
                  <Eyebrow>История начислений</Eyebrow>
                  <span className="text-[12px] text-muted-foreground">
                    <Num value={2} /> записи
                  </span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Кампания</TableHead>
                      <TableHead className="text-right">Просмотров</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Num>10 авг</Num>
                      </TableCell>
                      <TableCell>Gloox</TableCell>
                      <TableCell className="text-right">
                        <Num value={798000} />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        <Num value={31500} /> ₽
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Num>11 авг</Num>
                      </TableCell>
                      <TableCell>Luminary</TableCell>
                      <TableCell className="text-right">
                        <Num value={313000} />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        <Num value={27600} /> ₽
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <Eyebrow className="mb-3.5">Пустая таблица</Eyebrow>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Кампания</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableEmpty colSpan={3}>
                      Когда модератор одобрит клипы — здесь появятся начисления.
                    </TableEmpty>
                  </TableBody>
                </Table>
              </div>
            </div>

            <aside className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:flex xl:flex-col">
              <Stat variant="card">
                <StatLabel size="sm">К выводу</StatLabel>
                <StatValue value={TOTAL} />
                <StatCaption>минимума нет</StatCaption>
                <Button className="mt-2 w-full" size="sm">
                  Подключить реквизиты →
                </Button>
              </Stat>

              <div className="rounded-lg border border-border bg-card p-5">
                <Eyebrow size="sm" className="mb-2.5">
                  Лига · Бронза
                </Eyebrow>
                <Progress value={42} size="sm" />
                <p className="mt-2.5 text-[12px] text-muted-foreground">
                  До серебра осталось <Num value={58000} /> ₽
                </p>
              </div>

              <DataList>
                <Eyebrow size="sm" className="mb-2.5">
                  За всё время
                </Eyebrow>
                <DataListBody>
                  <DataListRow>
                    <DataListLabel>Заработано за клипы</DataListLabel>
                    <DataListValue value={TOTAL} />
                  </DataListRow>
                  <DataListRow>
                    <DataListLabel>Просмотров</DataListLabel>
                    <DataListValue value={11100000} />
                  </DataListRow>
                  <DataListRow>
                    <DataListLabel>Клипов одобрено</DataListLabel>
                    <DataListValue>7 / 9</DataListValue>
                  </DataListRow>
                </DataListBody>
              </DataList>
            </aside>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

- [ ] **Step 3: Переписать App.tsx как переключатель двух демо**

Заменить `src/App.tsx` целиком на:

```tsx
import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/registry/limeui/ui/button"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/limeui/ui/segmented-control"
import ComponentsDemo from "@/demo/ComponentsDemo"
import DashboardDemo from "@/demo/DashboardDemo"

export default function App() {
  const [dark, setDark] = useState(false)
  const [view, setView] = useState("dashboard")

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className="min-h-svh">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <SegmentedControl value={view} onValueChange={setView}>
          <SegmentedControlItem value="dashboard">Дашборд</SegmentedControlItem>
          <SegmentedControlItem value="components">
            Компоненты
          </SegmentedControlItem>
        </SegmentedControl>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDark(!dark)}
          aria-label={dark ? "Светлая тема" : "Тёмная тема"}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      {view === "dashboard" ? (
        <DashboardDemo />
      ) : (
        <div className="mx-auto max-w-4xl space-y-10 p-8">
          <ComponentsDemo />
        </div>
      )}
    </div>
  )
}
```

Если `SegmentedControl` не принимает `value`/`onValueChange` как контролируемые пропсы — проверить его сигнатуру в `registry/limeui/ui/segmented-control.tsx` и использовать те имена, которые он реально экспортирует (он построен на Radix RadioGroup, поэтому ожидаются именно `value` и `onValueChange`).

- [ ] **Step 4: Проверить сборку**

```bash
pnpm build
```

Ожидается: успех.

- [ ] **Step 5: Визуальная проверка в браузере**

```bash
pnpm dev
```

Через chrome-devtools-mcp открыть локальный адрес и проверить **шесть** состояний, снимая скриншот на каждом:

1. Дашборд, светлая тема, ширина 1440 — сайдбар развёрнут, активный пункт «Выплаты» — чёрная плашка с белым текстом, лейблы групп в mono uppercase, график показывает 12 столбцов (три из них — тонкие полоски нулевых дней).
2. Дашборд, тёмная тема, ширина 1440 — карточка графика инвертируется, нулевые полоски становятся тёмными на светлом, текст читается.
3. Дашборд, светлая тема, сайдбар свёрнут (клик по `SidebarTrigger`) — ширина 68px, видны только иконки, при наведении появляется тултип с названием.
4. Дашборд, ширина 400 — сайдбар исчезает с полосы, открывается по триггеру как `Sheet` поверх контента.
5. Витрина компонентов, светлая тема — таблица в карточной обёртке с mono-шапкой, `TableEmpty` показывает текст по центру.
6. Витрина компонентов, тёмная тема.

Любое расхождение с ожидаемым — дефект этой задачи, а не «особенность демо».

- [ ] **Step 6: Коммит**

```bash
git add src/App.tsx src/demo/
git commit -m "limeui: демо-страница как дашборд-каркас + витрина компонентов"
```

---

### Task 16: Проверка доставки в чистом проекте-потребителе

Именно этот шаг в прошлой итерации поймал критический баг, который пропустили все 24 таск-ревью: радиус-токены не доезжали до потребителя. Он обязателен.

**Files:**
- Возможные правки: `registry.json` (итем `theme`, поле `css`), `README.md`

**Interfaces:**
- Consumes: собранный `r/` из всех предыдущих задач.

- [ ] **Step 1: Собрать реестр и поднять локальную раздачу**

```bash
pnpm build:registry
python3 -m http.server 8099 --directory r &
```

Проверить, что раздача живая:

```bash
curl -sf http://localhost:8099/theme.json | head -c 200
```

Ожидается начало JSON-объекта итема `theme`. Номер задания фоновой задачи (`%1`) понадобится на шаге 7.

- [ ] **Step 2: Создать чистый проект-потребитель**

```bash
cd "$(mktemp -d)"
pnpm create vite@latest consumer --template react-ts
cd consumer
pnpm install
pnpm add tailwindcss @tailwindcss/vite
pnpm dlx shadcn@latest init -b radix -p nova -y
```

- [ ] **Step 3: Установить компоненты из локального реестра**

```bash
pnpm dlx shadcn@latest registry add "@limeui=http://localhost:8099/{name}.json"
pnpm dlx shadcn@latest add @limeui/theme @limeui/sidebar @limeui/bar-chart @limeui/table @limeui/typography -y
```

- [ ] **Step 4: Проверить четыре вещи**

```bash
grep -n "radius-pill\|radius-lg\|radius-md\|radius-sm" src/index.css
grep -n "font-sans\|font-mono\|fontsource" src/index.css
grep -n "sidebar-primary\|foreground-subtle\|border-mute\|primary-soft" src/index.css
grep -rn "no-scrollbar" src/
```

Ожидается:
1. `--radius-pill: 999px`, `--radius-lg: 20px`, `--radius-md: 14px`, `--radius-sm: 10px` — внутри блока `@theme inline`, а не в `:root`.
2. `--font-sans` и `--font-mono` — внутри `@theme inline`, со значениями `"Geist Variable"` / `"Geist Mono Variable"`; плюс две строки `@import "@fontsource-variable/geist";` и `@import "@fontsource-variable/geist-mono";`.
3. `--sidebar-primary`, `--foreground-subtle`, `--border-mute`, `--primary-soft` — в блоках `:root` и `.dark`.
4. Утилита `no-scrollbar` определена (пришла из `css`-поля итема `sidebar`).

Также проверить, что оба fontsource-пакета попали в `package.json` потребителя:

```bash
node -e "const p=require('./package.json'); console.log(Object.keys(p.dependencies).filter(d=>d.includes('geist')))"
```

- [ ] **Step 5: Развилка по результату проверки шрифтов**

**Если `@import` строк для fontsource в `src/index.css` НЕТ или они стоят не в начале файла** (это и есть та гипотеза, которую мы проверяем):

1. Вернуться в репозиторий дизайн-системы.
2. Убрать поле `"css"` из итема `theme` в `registry.json`.
3. Создать `registry/limeui/theme/fonts.css`:

```css
/* limeui — подключение фирменных шрифтов.
 * Импортируйте этот файл сразу после `@import "tailwindcss";` в главном CSS:
 *   @import "./styles/limeui-fonts.css";
 */
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";
```

4. Добавить его в `files` итема `theme`:

```json
        {
          "path": "registry/limeui/theme/fonts.css",
          "type": "registry:file",
          "target": "src/styles/limeui-fonts.css"
        }
```

5. Обновить `docs` итема `theme` на: `"Добавьте в главный CSS сразу после `@import \"tailwindcss\";` строку `@import \"./styles/limeui-fonts.css\";` — без неё Geist и Geist Mono не загрузятся."`
6. `pnpm build:registry`, повторить шаги 2-4 этой задачи с нуля и убедиться, что файл `src/styles/limeui-fonts.css` появился у потребителя.

**Если `@import` строки на месте и стоят до всех правил** — ничего не менять, зафиксировать это в отчёте.

- [ ] **Step 6: Проверить, что потребитель собирается**

В проекте-потребителе:

```bash
pnpm build
```

Ожидается: успех. Если сборка падает на импорте `@/hooks/use-mobile` или подобном — значит, `registryDependencies` итема `sidebar` неполные; дописать недостающее и пересобрать реестр.

- [ ] **Step 7: Убрать за собой**

```bash
kill %1 2>/dev/null || true
```

Временный каталог потребителя удалять не обязательно (он в `$TMPDIR`), но и оставлять ссылок на него в репозитории нельзя.

- [ ] **Step 8: Коммит (только если что-то менялось на шаге 5)**

```bash
git add registry.json registry/limeui/theme/ r/
git commit -m "limeui: фолбэк доставки шрифтов через registry:file"
```

Если ничего не менялось — коммита нет, задача закрывается отчётом о проверке.

---

### Task 17: Документация и уборка

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Delete: `src/components/`, `src/hooks/`

**Interfaces:**
- Consumes: финальный состав реестра из Task 1-16.

- [ ] **Step 1: Удалить временные копии от shadcn CLI**

```bash
git status --short src/components src/hooks
rm -rf src/components src/hooks
```

Эти каталоги были поставлены `pnpm dlx shadcn@latest add sidebar` как эталонный исходник для портирования. Они не отслеживаются git и не должны попасть в репозиторий: настоящие файлы живут в `registry/limeui/`.

- [ ] **Step 2: Обновить CLAUDE.md**

В разделе «Правила» заменить пункт 5 на:

```markdown
5. Радиус — именованные токены, НЕ линейная шкала: `rounded-pill` (999px, все интерактивные контролы), `rounded-lg` (20px, карточки/основные инпуты), `rounded-md` (14px, textarea/floating-меню), `rounded-sm` (10px, вложенные элементы, пункты сайдбара).
```

и добавить новые пункты после пункта 6:

```markdown
7. **Тени.** Поверхности в потоке (Card, Table, Stat, Sidebar, Input, Chip) — без теней в покое, глубина создаётся фоном и границей. Плавающие слои (DropdownMenu, Select, Popover, Dialog, Sheet, Tooltip) — ровно `shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]`. Исключение: `Button` variant `default` на hover.
8. **Geist Mono семантический, а не декоративный.** Три роли, и только они: `Eyebrow` (микро-лейбл над секцией/карточкой/шапкой таблицы), `Num` (любое число-данные — деньги, счётчики, даты, проценты), лейбл группы в сайдбаре. Всё остальное — Geist Sans. Прямой `font-mono` в прикладном коде — признак того, что нужен `Eyebrow` или `Num`.
9. `"use client"` стоит только в `registry/limeui/ui/sidebar.tsx` — он единственный владеет React-контекстом и состоянием. В остальные файлы не добавлять.
10. Демо живёт в `src/demo/`: `DashboardDemo.tsx` — реальный каркас со сайдбаром (только в нём видны collapse, sticky и мобильный Sheet), `ComponentsDemo.tsx` — витрина всех компонентов. `src/App.tsx` только переключает их и тему.
```

Также в разделе «Структура» после строки про `src/App.tsx` добавить:

```markdown
- `registry/limeui/hooks/*.ts` — хуки реестра (`use-mobile`), тип итема `registry:hook`.
```

- [ ] **Step 3: Обновить README.md**

Заменить таблицу состава на:

```markdown
| Item | Тип |
|---|---|
| `theme` | тема: cssVars light/dark, primary #d9da26 (лайм), радиус pill/20px/14px/10px, шрифты Geist + Geist Mono |
| `alert` `badge` `button` `card` `checkbox` `dialog` `dropdown-menu` `input` `label` `select` `separator` `sheet` `skeleton` `switch` `table` `tabs` `textarea` `tooltip` | registry:ui — базовые shadcn-примитивы |
| `avatar` `progress` `sidebar` | registry:ui — примитивы дашборда |
| `bar-chart` `chip` `data-list` `empty-state` `page-header` `segmented-control` `stat` `typography` | registry:ui — паттерны klipni, которых нет в дефолтном shadcn |
| `use-mobile` | registry:hook |
```

Заменить абзац про шрифт (начинающийся с «Фирменный шрифт — Geist») на:

```markdown
Фирменные шрифты — **Geist** и **Geist Mono**; `@limeui/theme` ставит оба как npm-зависимости. Geist Mono в limeui семантический: он используется только через `Eyebrow` (микро-лейбл над секцией), `Num` (любое число-данные) и шапку таблицы. Прямой `font-mono` в прикладном коде — признак того, что нужен один из этих компонентов.
```

Добавить перед разделом «Демо» новый раздел:

```markdown
## Дашборд

`@limeui/sidebar` — канонический shadcn-сайдбар с API апстрима, перекрашенный под klipni: 236px развёрнутый, 68px свёрнутый, группы с mono-лейблами, активный пункт — чёрная плашка. Тянет за собой `sheet`, `use-mobile`, `tooltip`, `input`, `skeleton`, `separator`, `button`.

`@limeui/bar-chart` — столбчатый график за период без единой внешней зависимости: flex-вёрстка, каждый столбец — кнопка с `aria-label`, дни без значения рисуются полоской 2px.
```

- [ ] **Step 4: Финальная проверка**

```bash
pnpm build && pnpm build:registry && git status --short
```

Ожидается: обе команды успешны; в `git status` нет ни `src/components/`, ни `src/hooks/`.

- [ ] **Step 5: Коммит**

```bash
git add CLAUDE.md README.md
git commit -m "limeui: документация — правила теней, типографский контракт, состав реестра"
```

---

## Самопроверка плана

**Покрытие спеки:**

| Раздел спеки | Задача |
|---|---|
| 1. Типографский контракт (Eyebrow, Num, nav label) | Task 2, Task 6 (шаг 7), Task 13 (TableHead) |
| 1. Доставка шрифта | Task 1 (шаги 1, 2, 5), Task 16 (шаги 4-5) |
| 2. Новые токены | Task 1 (шаги 2-3) |
| 3. Правило теней | Task 3 (шаги 2-6), Task 5 (шаг 4), Task 17 (шаг 2) |
| 4.1 typography | Task 2 |
| 4.2 use-mobile | Task 4 |
| 4.3 sheet | Task 5 |
| 4.4 sidebar | Task 6 |
| 4.5 bar-chart | Task 7 |
| 4.6 page-header | Task 10 |
| 4.7 avatar | Task 8 |
| 4.8 progress | Task 9 |
| 4.9 empty-state | Task 11 |
| 4.10 data-list | Task 12 |
| 5.1 table | Task 13 |
| 5.2 button icon-sm | Task 3 (шаг 1) |
| 5.3 stat | Task 14 |
| 5.4 тени плавающих слоёв | Task 3 |
| 6. Демо-страница | Task 15 |
| 7. Проверка | шаг «проверить сборку» в каждой задаче + Task 16 |
| 8. Что не делается | ограничения зафиксированы в Global Constraints |

Пробелов нет.

**Согласованность типов:** `BarChartDatum` объявлен в Task 7 и используется в Task 15 под тем же именем. `Num` из Task 2 потребляется в Task 12 (`DataListValue`), Task 13 (демо) и Task 14 (`StatValue`) — везде как `React.ComponentProps<typeof Num>`. `Eyebrow` из Task 2 потребляется в Task 14 (`StatLabel`). `useIsMobile` из Task 4 потребляется в Task 6. `size="icon-sm"` вводится в Task 3 и потребляется в Task 5 и Task 6 — порядок задач это гарантирует.

**Порядок задач:** Task 1 (токены) → Task 2 (typography) → Task 3 (button/тени) → Task 4 (хук) → Task 5 (sheet) → Task 6 (sidebar) — цепочка зависимостей соблюдена. Задачи 7-12 независимы друг от друга. Task 13 зависит от Task 11, Task 14 — от Task 2. Task 15 зависит от всех предыдущих, Task 16 — от собранного `r/`, Task 17 закрывает.

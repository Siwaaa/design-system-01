# limeui Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Построить полноценный shadcn registry `@limeui` — 17 базовых примитивов + 3 новых компонента (`SegmentedControl`, `Chip`, `Stat`), полностью стилизованных под визуальный язык `app.klipni.com`, на месте вычищенного каркаса `@linkz`, и открыть PR по готовности.

**Architecture:** Тот же паттерн, что и был у `linkz`: `registry/limeui/theme/theme.css` — единственный источник CSS-переменных темы; `registry/limeui/ui/*.tsx` — исходники компонентов (Radix-примитивы через unified-пакет `radix-ui`, `class-variance-authority` для вариантов, `cn()` из `@/lib/utils` для мерджа классов); `registry.json` в корне — каталог реестра, из которого `shadcn build` собирает раздаваемые JSON в `r/`; `src/App.tsx` — демо-страница со всеми компонентами.

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4, `radix-ui` (unified package, стиль `radix-nova`), `class-variance-authority`, `lucide-react`, `tw-animate-css`, шрифт Geist (`@fontsource-variable/geist`), `shadcn` CLI для сборки реестра.

## Global Constraints

- Имя реестра — `limeui` (не `linkz`). Регистр-путь: `registry/limeui/theme/theme.css`, `registry/limeui/ui/*.tsx`.
- Внутренние импорты компонентов — только через `@/registry/limeui/ui/...` (алиас переписывается CLI при установке в проект-потребитель), utils — `@/lib/utils`.
- Тема правится только в `registry/limeui/theme/theme.css`; `registry.json.items[].cssVars` для item `theme` генерируются скриптом `scripts/build-registry.mjs` — руками не трогать.
- Радиус — именованная шкала (НЕ линейный множитель от одного `--radius`, как было раньше): `--radius-pill: 999px` (все интерактивные контролы — button/badge/chip/tabs-индикатор/segmented-control/avatar), `--radius-lg: 20px` (card, основные input/select/dialog), `--radius-md: 14px` (textarea, floating-меню — dropdown/select content, skeleton), `--radius-sm: 10px` (мелкие вложенные элементы — select/dropdown item, table head).
- `box-shadow: none` в состоянии покоя — везде, без исключений. Единственное исключение — hover/active-состояние ТОЛЬКО у `Button` variant `default` (лайм-кнопка): лёгкий подъём + тень при hover, `scale-[0.97]` при active.
- Фокус — `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring` (аутлайном, не box-shadow ring) на всех интерактивных компонентах.
- Шрифт — Geist, уже установлен и импортирован в `src/index.css`, не трогать. Заголовки/кнопки/крупные числа получают `tracking-tight`; uppercase-микролейблы (Stat label, table head) — `tracking-[0.08em] uppercase` (аппроксимация наблюдаемого положительного трекинга, а не точные px-значения по каждому размеру).
- Импорты Radix — из unified-пакета `radix-ui` (напр. `import { Dialog as DialogPrimitive } from "radix-ui"`, далее `DialogPrimitive.Root`), НЕ из отдельных `@radix-ui/react-*` пакетов. Это подтверждено фактическим API пакета (`node -e "console.log(Object.keys(require('radix-ui').Dialog))"` в этой же сессии).
- Компоненты — обычные функции, БЕЗ `React.forwardRef` (React 19, ref как обычный проп через `{...props}`), без `interface`-объявлений под каждый компонент — типы инлайн через `React.ComponentProps<...>`.
- В проекте нет юнит-тестов — это визуальная библиотека компонентов. Верификация каждой задачи: `pnpm build` (`tsc -b && vite build`, ловит типы даже для файлов, не подключённых в демо — `tsconfig.app.json` включает весь `registry/`) должен проходить без ошибок. Финальная визуальная проверка — `pnpm dev` + сравнение со скриншотами klipni.com, сделанными в ходе брейнстforming (см. транскрипт сессии/спеку).
- После ЛЮБОГО изменения `registry/` или `registry.json` — прогнать `pnpm build:registry` (синк темы + `shadcn build --output r`) и закоммитить `r/` вместе с исходниками (правило из `CLAUDE.md`).
- Дизайн-спека: `docs/superpowers/specs/2026-08-12-limeui-design-system-design.md` — источник всех решений по токенам/скоупу.

---

## File Structure

```
registry/limeui/theme/theme.css     — токены темы (light + dark), единственный источник
registry/limeui/ui/*.tsx            — 20 компонентов (17 база + 3 новых)
registry.json                        — каталог реестра (корень)
scripts/build-registry.mjs           — путь к theme.css переключается на limeui
src/index.css                        — @theme inline маппинг токенов → Tailwind-утилиты
src/App.tsx                          — демо-страница (все компоненты, light/dark)
package.json                         — зависимости (radix-ui, cva, lucide-react — уже возвращены в этой сессии)
CLAUDE.md, README.md                 — переписаны под limeui
r/                                    — пересобранный выход shadcn build (коммитится)
```

---

## Task 1: Токены темы + маппинг в Tailwind

**Files:**
- Modify: `registry/limeui/theme/theme.css` (уже существует как пустой каркас с прошлой сессии — заменить содержимое)
- Modify: `scripts/build-registry.mjs:7` (путь к theme.css)
- Modify: `src/index.css` (`@theme inline` блок)

**Interfaces:**
- Produces: CSS custom properties `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--success`, `--success-muted`, `--destructive`, `--border`, `--border-strong`, `--input`, `--ring`, `--chart-1..5`, `--radius-pill`, `--radius-lg`, `--radius-md`, `--radius-sm` — все последующие компоненты используют Tailwind-утилиты `bg-background`, `text-foreground`, `rounded-pill`, `rounded-lg`, `rounded-md`, `rounded-sm`, `border-border`, `border-border-strong`, `bg-success-muted`, `text-success`, `bg-destructive` и т.д., которые Tailwind v4 генерирует автоматически из `@theme inline`.

- [ ] **Step 1: Записать `registry/limeui/theme/theme.css`**

```css
/*
 * limeui — theme tokens.
 * Единственный источник значений темы. registry.json собирает cssVars
 * из этого файла скриптом scripts/build-registry.mjs — правь только здесь.
 * Стиль снят с app.klipni.com (chrome-devtools-mcp, live computed styles).
 * accent: #d9da26 (лайм). Радиус — именованная шкала, не линейный множитель:
 * pill 999px / lg 20px / md 14px / sm 10px.
 */

:root {
    --background: #f7f7f5;
    --foreground: #0c0c0b;
    --card: #ffffff;
    --card-foreground: #0c0c0b;
    --popover: #ffffff;
    --popover-foreground: #0c0c0b;
    --primary: #d9da26;
    --primary-foreground: #0c0c0b;
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
    --input: #e7e7e2;
    --ring: #0c0c0b;
    --chart-1: #d9da26;
    --chart-2: #1f8a45;
    --chart-3: #6b6b66;
    --chart-4: #0c0c0b;
    --chart-5: #9c9c95;
    --radius-pill: 999px;
    --radius-lg: 20px;
    --radius-md: 14px;
    --radius-sm: 10px;
}

.dark {
    --background: #0c0c0b;
    --foreground: #f7f7f5;
    --card: #161615;
    --card-foreground: #f7f7f5;
    --popover: #161615;
    --popover-foreground: #f7f7f5;
    --primary: #d9da26;
    --primary-foreground: #0c0c0b;
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
    --input: #2c2c2a;
    --ring: #f7f7f5;
    --chart-1: #d9da26;
    --chart-2: #3fbd6e;
    --chart-3: #9c9c95;
    --chart-4: #f7f7f5;
    --chart-5: #6b6b66;
}
```

- [ ] **Step 2: Переключить путь в `scripts/build-registry.mjs`**

В файле `scripts/build-registry.mjs` строка 7 сейчас:
```js
const css = readFileSync("registry/linkz/theme/theme.css", "utf8")
```
Заменить на:
```js
const css = readFileSync("registry/limeui/theme/theme.css", "utf8")
```

- [ ] **Step 3: Переписать `@theme inline` блок в `src/index.css`**

Весь файл `src/index.css` заменить на:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/geist";
@import "../registry/limeui/theme/theme.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --font-heading: var(--font-sans);
    --font-sans: 'Geist Variable', sans-serif;
    --color-chart-5: var(--chart-5);
    --color-chart-4: var(--chart-4);
    --color-chart-3: var(--chart-3);
    --color-chart-2: var(--chart-2);
    --color-chart-1: var(--chart-1);
    --color-ring: var(--ring);
    --color-input: var(--input);
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
    --color-primary-foreground: var(--primary-foreground);
    --color-primary: var(--primary);
    --color-popover-foreground: var(--popover-foreground);
    --color-popover: var(--popover);
    --color-card-foreground: var(--card-foreground);
    --color-card: var(--card);
    --color-foreground: var(--foreground);
    --color-background: var(--background);
    --radius-pill: var(--radius-pill);
    --radius-lg: var(--radius-lg);
    --radius-md: var(--radius-md);
    --radius-sm: var(--radius-sm);
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

- [ ] **Step 4: Проверить сборку**

Run: `pnpm build`
Expected: PASS (tsc + vite build без ошибок; на этом шаге в проекте ещё нет ни одного компонента limeui, но CSS должен собраться).

- [ ] **Step 5: Commit**

```bash
git add registry/limeui/theme/theme.css scripts/build-registry.mjs src/index.css
git commit -m "limeui: theme tokens (colors, named radius scale) cloned from klipni.com"
```

---

## Task 2: `registry.json` — переименование и скелет каталога

**Files:**
- Modify: `registry.json`

**Interfaces:**
- Produces: `registry.json` с `"name": "limeui"` и единственным item `theme` (без `cssVars` пока — их проставит `build:registry` в задаче 3). Каждая следующая задача (3–22) добавляет один объект в массив `items`.

- [ ] **Step 1: Заменить содержимое `registry.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "limeui",
  "homepage": "https://github.com/Siwaaa/design-system-01",
  "items": [
    {
      "name": "theme",
      "type": "registry:theme",
      "title": "limeui Theme",
      "description": "Тема limeui: primary #d9da26 (лайм), нейтральная тёплая серая шкала, именованный радиус (pill/lg/md/sm), без теней в покое. cssVars генерируются из registry/limeui/theme/theme.css скриптом scripts/build-registry.mjs.",
      "cssVars": {}
    }
  ]
}
```

- [ ] **Step 2: Пересобрать и проверить**

Run: `pnpm build:registry`
Expected: PASS, скрипт выводит `theme: 27 light / 26 dark переменных` (примерное число — 21 общий токен + 4 радиус-токена в light, 21 в dark без радиуса), `r/registry.json` и `r/theme.json` пересозданы.

- [ ] **Step 3: Commit**

```bash
git add registry.json r/
git commit -m "limeui: rename registry linkz -> limeui, regenerate theme item"
```

---

## Task 3: Button

**Files:**
- Create: `registry/limeui/ui/button.tsx`
- Modify: `registry.json` (добавить item `button`)

**Interfaces:**
- Consumes: `cn` из `@/lib/utils`
- Produces: `Button` (принимает `variant: "default"|"secondary"|"outline"|"ghost"|"destructive"|"link"`, `size: "default"|"sm"|"lg"|"icon"`, `asChild?: boolean`), `buttonVariants` (cva-функция, используется другими компонентами реестра, если понадобится — в этом плане не переиспользуется, но экспортируется по конвенции shadcn).

- [ ] **Step 1: Записать `registry/limeui/ui/button.tsx`**

```tsx
import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill text-sm font-semibold tracking-tight select-none transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground transition-[transform,box-shadow,filter] duration-150 ease-out hover:brightness-95 hover:-translate-y-px hover:shadow-[0_8px_20px_-8px_rgb(12_12_11_/_0.22)] active:translate-y-0 active:scale-[0.97] active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 active:bg-secondary/60",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-accent",
        ghost: "bg-transparent text-foreground hover:bg-accent",
        destructive: "bg-destructive text-white hover:brightness-95",
        link: "bg-transparent text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[54px] px-6 text-base",
        sm: "h-11 px-4 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "size-11 shrink-0 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

- [ ] **Step 2: Добавить item в `registry.json`**

Добавить в конец массива `items` (после `theme`):

```json
    {
      "name": "button",
      "type": "registry:ui",
      "title": "Button",
      "files": [
        {
          "path": "registry/limeui/ui/button.tsx",
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

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/button.tsx registry.json r/
git commit -m "limeui: add Button component"
```

---

## Task 4: Badge

**Files:**
- Create: `registry/limeui/ui/badge.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Badge` (`variant: "default"|"secondary"|"success"|"destructive"|"outline"`, `asChild?: boolean`), `badgeVariants`.

- [ ] **Step 1: Записать `registry/limeui/ui/badge.tsx`**

```tsx
import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-pill px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors [&_svg]:pointer-events-none [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-success-muted text-success",
        destructive: "bg-destructive/10 text-destructive",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "badge",
      "type": "registry:ui",
      "title": "Badge",
      "files": [
        {
          "path": "registry/limeui/ui/badge.tsx",
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

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/badge.tsx registry.json r/
git commit -m "limeui: add Badge component"
```

---

## Task 5: Label

**Files:**
- Create: `registry/limeui/ui/label.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Label`. Стиль — sentence-case (как на форме входа klipni), НЕ uppercase (uppercase-трекинг закреплён за `StatLabel`, см. задачу 22 — сознательное решение, чтобы не дублировать один приём на каждом лейбле).

- [ ] **Step 1: Записать `registry/limeui/ui/label.tsx`**

```tsx
import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "label",
      "type": "registry:ui",
      "title": "Label",
      "files": [
        {
          "path": "registry/limeui/ui/label.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/label.tsx registry.json r/
git commit -m "limeui: add Label component"
```

---

## Task 6: Input

**Files:**
- Create: `registry/limeui/ui/input.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Input` (обычный `<input>` со всеми стандартными пропами).

- [ ] **Step 1: Записать `registry/limeui/ui/input.tsx`**

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-[52px] w-full min-w-0 rounded-lg border border-border bg-secondary px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:outline-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "input",
      "type": "registry:ui",
      "title": "Input",
      "files": [
        {
          "path": "registry/limeui/ui/input.tsx",
          "type": "registry:ui"
        }
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/input.tsx registry.json r/
git commit -m "limeui: add Input component"
```

---

## Task 7: Textarea

**Files:**
- Create: `registry/limeui/ui/textarea.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Textarea`.

- [ ] **Step 1: Записать `registry/limeui/ui/textarea.tsx`**

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:outline-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "textarea",
      "type": "registry:ui",
      "title": "Textarea",
      "files": [
        {
          "path": "registry/limeui/ui/textarea.tsx",
          "type": "registry:ui"
        }
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/textarea.tsx registry.json r/
git commit -m "limeui: add Textarea component"
```

---

## Task 8: Checkbox

**Files:**
- Create: `registry/limeui/ui/checkbox.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Checkbox`.

- [ ] **Step 1: Записать `registry/limeui/ui/checkbox.tsx`**

```tsx
import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-md border border-border bg-secondary outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <Check className="size-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "checkbox",
      "type": "registry:ui",
      "title": "Checkbox",
      "files": [
        {
          "path": "registry/limeui/ui/checkbox.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "lucide-react",
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/checkbox.tsx registry.json r/
git commit -m "limeui: add Checkbox component"
```

---

## Task 9: Switch

**Files:**
- Create: `registry/limeui/ui/switch.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Switch`.

- [ ] **Step 1: Записать `registry/limeui/ui/switch.tsx`**

```tsx
import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-10 shrink-0 items-center rounded-pill border border-transparent bg-secondary transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-5 rounded-pill bg-card transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "switch",
      "type": "registry:ui",
      "title": "Switch",
      "files": [
        {
          "path": "registry/limeui/ui/switch.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/switch.tsx registry.json r/
git commit -m "limeui: add Switch component"
```

---

## Task 10: Separator

**Files:**
- Create: `registry/limeui/ui/separator.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Separator`.

- [ ] **Step 1: Записать `registry/limeui/ui/separator.tsx`**

```tsx
import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "separator",
      "type": "registry:ui",
      "title": "Separator",
      "files": [
        {
          "path": "registry/limeui/ui/separator.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/separator.tsx registry.json r/
git commit -m "limeui: add Separator component"
```

---

## Task 11: Skeleton

**Files:**
- Create: `registry/limeui/ui/skeleton.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Skeleton`.

- [ ] **Step 1: Записать `registry/limeui/ui/skeleton.tsx`**

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-secondary", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "skeleton",
      "type": "registry:ui",
      "title": "Skeleton",
      "files": [
        {
          "path": "registry/limeui/ui/skeleton.tsx",
          "type": "registry:ui"
        }
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/skeleton.tsx registry.json r/
git commit -m "limeui: add Skeleton component"
```

---

## Task 12: Card

**Files:**
- Create: `registry/limeui/ui/card.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

- [ ] **Step 1: Записать `registry/limeui/ui/card.tsx`**

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-lg border border-border bg-card p-5 text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-lg leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn(className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "card",
      "type": "registry:ui",
      "title": "Card",
      "files": [
        {
          "path": "registry/limeui/ui/card.tsx",
          "type": "registry:ui"
        }
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/card.tsx registry.json r/
git commit -m "limeui: add Card component"
```

---

## Task 13: Alert

**Files:**
- Create: `registry/limeui/ui/alert.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Alert` (`variant: "default"|"success"|"destructive"`), `AlertTitle`, `AlertDescription`.

- [ ] **Step 1: Записать `registry/limeui/ui/alert.tsx`**

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] gap-y-0.5 rounded-lg border border-border bg-secondary px-4 py-3.5 text-sm has-[>svg]:grid-cols-[16px_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-secondary text-foreground",
        success: "bg-success-muted text-success [&>svg]:text-success",
        destructive: "bg-destructive/10 text-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "alert",
      "type": "registry:ui",
      "title": "Alert",
      "files": [
        {
          "path": "registry/limeui/ui/alert.tsx",
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

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/alert.tsx registry.json r/
git commit -m "limeui: add Alert component"
```

---

## Task 14: Tabs

**Files:**
- Create: `registry/limeui/ui/tabs.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`. Обычный underline-переключатель панелей (НЕ pill — за pill-вид отвечает `SegmentedControl`, задача 21).

- [ ] **Step 1: Записать `registry/limeui/ui/tabs.tsx`**

```tsx
import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("inline-flex w-fit items-center gap-1 border-b border-border", className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-foreground data-[state=active]:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "tabs",
      "type": "registry:ui",
      "title": "Tabs",
      "files": [
        {
          "path": "registry/limeui/ui/tabs.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/tabs.tsx registry.json r/
git commit -m "limeui: add Tabs component"
```

---

## Task 15: Table

**Files:**
- Create: `registry/limeui/ui/table.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`.

- [ ] **Step 1: Записать `registry/limeui/ui/table.tsx`**

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
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
      className={cn("[&_tr]:border-b [&_tr]:border-border", className)}
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
      className={cn("border-t border-border bg-secondary font-medium", className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors hover:bg-secondary/60 data-[state=selected]:bg-secondary",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-3 text-left align-middle text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase whitespace-nowrap [&:has([role=checkbox])]:pr-0",
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
      className={cn("p-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
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
  TableCaption,
}
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "table",
      "type": "registry:ui",
      "title": "Table",
      "files": [
        {
          "path": "registry/limeui/ui/table.tsx",
          "type": "registry:ui"
        }
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/table.tsx registry.json r/
git commit -m "limeui: add Table component"
```

---

## Task 16: Tooltip

**Files:**
- Create: `registry/limeui/ui/tooltip.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`.

- [ ] **Step 1: Записать `registry/limeui/ui/tooltip.tsx`**

```tsx
import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 200,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger {...props} />
}

function TooltipContent({
  className,
  sideOffset = 8,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-balance text-background",
          className
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "tooltip",
      "type": "registry:ui",
      "title": "Tooltip",
      "files": [
        {
          "path": "registry/limeui/ui/tooltip.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/tooltip.tsx registry.json r/
git commit -m "limeui: add Tooltip component"
```

---

## Task 17: Select

**Files:**
- Create: `registry/limeui/ui/select.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectLabel`, `SelectItem`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`.

- [ ] **Step 1: Записать `registry/limeui/ui/select.tsx`**

```tsx
import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-[52px] w-full items-center justify-between gap-2 rounded-lg border border-border bg-secondary px-4 text-base text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          "z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-2 pr-8 pl-2 text-sm text-foreground outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "select",
      "type": "registry:ui",
      "title": "Select",
      "files": [
        {
          "path": "registry/limeui/ui/select.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "lucide-react",
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/select.tsx registry.json r/
git commit -m "limeui: add Select component"
```

---

## Task 18: Dropdown Menu

**Files:**
- Create: `registry/limeui/ui/dropdown-menu.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `DropdownMenu`, `DropdownMenuPortal`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`.

- [ ] **Step 1: Записать `registry/limeui/ui/dropdown-menu.tsx`**

```tsx
import * as React from "react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset || undefined}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[highlighted]:bg-destructive/10 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset || undefined}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset || undefined}
      className={cn(
        "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[highlighted]:bg-accent data-[inset]:pl-8 data-[state=open]:bg-accent",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "dropdown-menu",
      "type": "registry:ui",
      "title": "Dropdown Menu",
      "files": [
        {
          "path": "registry/limeui/ui/dropdown-menu.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "lucide-react",
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/dropdown-menu.tsx registry.json r/
git commit -m "limeui: add Dropdown Menu component"
```

---

## Task 19: Dialog

**Files:**
- Create: `registry/limeui/ui/dialog.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`.

- [ ] **Step 1: Записать `registry/limeui/ui/dialog.tsx`**

```tsx
import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-foreground/40 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-5 rounded-lg border border-border bg-card p-6 text-card-foreground duration-150 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-4 right-4 rounded-pill p-1.5 text-muted-foreground opacity-80 transition-colors hover:bg-accent hover:opacity-100 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="size-4" />
            <span className="sr-only">Закрыть</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "dialog",
      "type": "registry:ui",
      "title": "Dialog",
      "files": [
        {
          "path": "registry/limeui/ui/dialog.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "lucide-react",
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/dialog.tsx registry.json r/
git commit -m "limeui: add Dialog component"
```

---

## Task 20: SegmentedControl (новый компонент)

**Files:**
- Create: `registry/limeui/ui/segmented-control.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `SegmentedControl` (обёртка, = Radix `RadioGroup.Root`), `SegmentedControlItem` (= `RadioGroup.Item`). Использование: `<SegmentedControl defaultValue="creator"><SegmentedControlItem value="creator">Я креатор</SegmentedControlItem><SegmentedControlItem value="brand">Я бренд</SegmentedControlItem></SegmentedControl>` — воспроизводит pill-переключатель со страницы входа klipni.

- [ ] **Step 1: Записать `registry/limeui/ui/segmented-control.tsx`**

```tsx
import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function SegmentedControl({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="segmented-control"
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-pill border border-border-strong bg-secondary p-1.5",
        className
      )}
      {...props}
    />
  )
}

function SegmentedControlItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="segmented-control-item"
      className={cn(
        "rounded-pill px-4 py-2 text-sm font-semibold tracking-tight text-foreground outline-none transition-colors disabled:pointer-events-none disabled:opacity-50 data-[state=checked]:bg-foreground data-[state=checked]:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  )
}

export { SegmentedControl, SegmentedControlItem }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "segmented-control",
      "type": "registry:ui",
      "title": "Segmented Control",
      "description": "Pill-переключатель режимов (напр. «Я креатор / Я бренд» на klipni.com) поверх Radix RadioGroup.",
      "files": [
        {
          "path": "registry/limeui/ui/segmented-control.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/segmented-control.tsx registry.json r/
git commit -m "limeui: add SegmentedControl component"
```

---

## Task 21: Chip (новый компонент)

**Files:**
- Create: `registry/limeui/ui/chip.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Chip` (= стилизованный Radix `Toggle.Root`, проп `pressed`/`onPressedChange` как у обычного Radix Toggle). Использование — tag-select в профиле и фильтр-строка кампаний на klipni.

- [ ] **Step 1: Записать `registry/limeui/ui/chip.tsx`**

```tsx
import * as React from "react"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Chip({
  className,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root>) {
  return (
    <TogglePrimitive.Root
      data-slot="chip"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border border-border bg-secondary px-3.5 py-1.5 text-sm font-medium tracking-tight text-foreground outline-none transition-colors hover:bg-secondary/70 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )
}

export { Chip }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "chip",
      "type": "registry:ui",
      "title": "Chip",
      "description": "Переключаемая pill-кнопка для тегов и фильтров поверх Radix Toggle.",
      "files": [
        {
          "path": "registry/limeui/ui/chip.tsx",
          "type": "registry:ui"
        }
      ],
      "dependencies": [
        "radix-ui"
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/chip.tsx registry.json r/
git commit -m "limeui: add Chip component"
```

---

## Task 22: Stat (новый компонент)

**Files:**
- Create: `registry/limeui/ui/stat.tsx`
- Modify: `registry.json`

**Interfaces:**
- Produces: `Stat`, `StatLabel`, `StatValue`. Единственное место в реестре с uppercase-tracked лейблом (см. Global Constraints).

- [ ] **Step 1: Записать `registry/limeui/ui/stat.tsx`**

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Stat({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="stat" className={cn("flex flex-col gap-1.5", className)} {...props} />
  )
}

function StatLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-label"
      className={cn(
        "text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}

function StatValue({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-value"
      className={cn("text-3xl font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  )
}

export { Stat, StatLabel, StatValue }
```

- [ ] **Step 2: Добавить item в `registry.json`**

```json
    {
      "name": "stat",
      "type": "registry:ui",
      "title": "Stat",
      "description": "Лейбл + крупное число для баланс/стат-плиток (как «ТЕКУЩИЙ БАЛАНС / 0 ₽» на klipni.com).",
      "files": [
        {
          "path": "registry/limeui/ui/stat.tsx",
          "type": "registry:ui"
        }
      ],
      "registryDependencies": [
        "@limeui/theme"
      ]
    }
```

- [ ] **Step 3: Проверить и пересобрать**

Run: `pnpm build && pnpm build:registry`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add registry/limeui/ui/stat.tsx registry.json r/
git commit -m "limeui: add Stat component"
```

---

## Task 23: Демо-страница

**Files:**
- Modify: `src/App.tsx` (полная замена — сейчас там только заголовок + тумблер темы)

**Interfaces:**
- Consumes: все 20 компонентов из `@/registry/limeui/ui/*`.

- [ ] **Step 1: Записать `src/App.tsx`**

```tsx
import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/registry/limeui/ui/alert"
import { Badge } from "@/registry/limeui/ui/badge"
import { Button } from "@/registry/limeui/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/limeui/ui/card"
import { Checkbox } from "@/registry/limeui/ui/checkbox"
import { Chip } from "@/registry/limeui/ui/chip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/limeui/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/limeui/ui/dropdown-menu"
import { Input } from "@/registry/limeui/ui/input"
import { Label } from "@/registry/limeui/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/limeui/ui/select"
import { SegmentedControl, SegmentedControlItem } from "@/registry/limeui/ui/segmented-control"
import { Separator } from "@/registry/limeui/ui/separator"
import { Skeleton } from "@/registry/limeui/ui/skeleton"
import { Stat, StatLabel, StatValue } from "@/registry/limeui/ui/stat"
import { Switch } from "@/registry/limeui/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/limeui/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/limeui/ui/tabs"
import { Textarea } from "@/registry/limeui/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/limeui/ui/tooltip"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

export default function App() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className="mx-auto max-w-4xl space-y-10 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">limeui</h1>
          <p className="text-muted-foreground">Реестр @limeui — тема + 20 компонентов, в стиле klipni.com</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setDark(!dark)}>
          {dark ? <SunIcon /> : <MoonIcon />}
        </Button>
      </header>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Войти →</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge>Активна</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">100% подходит</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Section>

      <Section title="Chip / SegmentedControl">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-wrap gap-2">
            <Chip pressed>Все</Chip>
            <Chip>UGC</Chip>
            <Chip>Нарезки</Chip>
          </div>
          <SegmentedControl defaultValue="creator">
            <SegmentedControlItem value="creator">Я креатор</SegmentedControlItem>
            <SegmentedControlItem value="brand">Я бренд</SegmentedControlItem>
          </SegmentedControl>
        </div>
      </Section>

      <Section title="Stat">
        <div className="flex flex-wrap gap-10">
          <Stat>
            <StatLabel>Текущий баланс</StatLabel>
            <StatValue>150 000 ₽</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Клипов</StatLabel>
            <StatValue>7</StatValue>
          </Stat>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="grid max-w-md gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Textarea</Label>
            <Textarea id="bio" placeholder="Пара слов о себе…" />
          </div>
          <div className="grid gap-2">
            <Label>Select</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Выберите проект" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limeui">limeui</SelectItem>
                <SelectItem value="klipni">Klipni</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Согласен с условиями</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="notify" />
            <Label htmlFor="notify">Уведомления</Label>
          </div>
        </div>
      </Section>

      <Section title="Card">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Gloox — ИИ-тренер</CardTitle>
            <CardDescription>Сними ролик про Gloox — 150 000 ₽ за 1M просмотров.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Радиус и цвета — из темы @limeui/theme.</p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button>Сохранить</Button>
            <Button variant="outline">Отмена</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Alert">
        <div className="grid max-w-md gap-3">
          <Alert>
            <AlertTitle>Обновление готово</AlertTitle>
            <AlertDescription>Новая версия дизайн-системы опубликована в реестре.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>100% подходит</AlertTitle>
            <AlertDescription>Кампания соответствует вашему профилю.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>Не удалось сохранить реквизиты.</AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="account" className="max-w-md">
          <TabsList>
            <TabsTrigger value="account">Аккаунт</TabsTrigger>
            <TabsTrigger value="password">Пароль</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Содержимое вкладки «Аккаунт».</TabsContent>
          <TabsContent value="password">Содержимое вкладки «Пароль».</TabsContent>
          <TabsContent value="settings">Содержимое вкладки «Настройки».</TabsContent>
        </Tabs>
      </Section>

      <Section title="Table">
        <Table className="max-w-md">
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
              <TableCell className="text-right">150 000 ₽</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Luminary</TableCell>
              <TableCell>
                <Badge variant="secondary">Скоро</Badge>
              </TableCell>
              <TableCell className="text-right">200 000 ₽</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>

      <Section title="Dialog / Dropdown / Tooltip">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Открыть диалог</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Подтверждение</DialogTitle>
                <DialogDescription>Это диалог из дизайн-системы limeui.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Ок</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Меню</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Редактировать</DropdownMenuItem>
              <DropdownMenuItem>Дублировать</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Удалить</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">Наведи на меня</Button>
            </TooltipTrigger>
            <TooltipContent>Подсказка из @limeui/tooltip</TooltipContent>
          </Tooltip>
        </div>
      </Section>

      <Section title="Skeleton / Separator">
        <div className="max-w-md space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-pill" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">Под разделителем.</p>
        </div>
      </Section>
    </div>
  )
}
```

- [ ] **Step 2: Проверить сборку и визуально в браузере**

Run: `pnpm build`
Expected: PASS

Run: `pnpm dev`, открыть в браузере, переключить тумблер темы вверху справа, визуально сверить с скриншотами klipni.com (pill-радиус на всех кнопках/бейджах/чипах/segmented control, отсутствие теней в покое, лайм-акцент на primary-кнопке, hover-подъём именно у неё). Закрыть dev-сервер (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "limeui: demo page showcasing all 20 components"
```

---

## Task 24: Документация и финальная сборка

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`

**Interfaces:** нет (только документация).

- [ ] **Step 1: Переписать `CLAUDE.md`**

Заменить весь файл на:

```markdown
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
```

- [ ] **Step 2: Переписать `README.md`**

Заменить весь файл на:

```markdown
# limeui

Личная дизайн-система для всех проектов — собственный [shadcn registry](https://ui.shadcn.com/docs/registry) `@limeui`, полностью повторяющий визуальный стиль [app.klipni.com](https://app.klipni.com): лайм-акцент (`#d9da26`), тёплая нейтральная палитра, pill-радиус на всех интерактивных элементах, без теней в покое. Тема + 20 компонентов (17 базовых shadcn-примитивов + `SegmentedControl`, `Chip`, `Stat`). Код компонентов копируется в проект — им владеет проект (философия shadcn).

Раздаётся статикой из папки [`r/`](r/) через GitHub raw.

## Подключение в проект

\`\`\`bash
# 1. Если в проекте ещё нет shadcn (Vite + Tailwind v4):
pnpm dlx shadcn@latest init -b radix -p nova -y

# 2. Зарегистрировать реестр (один раз, пишется в components.json):
pnpm dlx shadcn@latest registry add "@limeui=https://raw.githubusercontent.com/Siwaaa/design-system-01/main/r/{name}.json"

# 3. Ставить компоненты:
pnpm dlx shadcn@latest add @limeui/theme @limeui/button @limeui/card
\`\`\`

`@limeui/theme` подтягивается автоматически как зависимость любого компонента — отдельно ставить не обязательно.

## Состав

| Item | Тип |
|---|---|
| `theme` | тема: cssVars light/dark, primary #d9da26 (лайм), радиус pill/20px/14px/10px |
| `alert` `badge` `button` `card` `checkbox` `dialog` `dropdown-menu` `input` `label` `select` `separator` `skeleton` `switch` `table` `tabs` `textarea` `tooltip` | registry:ui — базовые shadcn-примитивы |
| `segmented-control` `chip` `stat` | registry:ui — новые компоненты, которых нет в дефолтном shadcn, повторяют паттерны klipni.com |

Фирменный шрифт — Geist (`@fontsource-variable/geist`); в проект-потребитель он не устанавливается автоматически. Чтобы включить: `pnpm add @fontsource-variable/geist` и `@import "@fontsource-variable/geist";` в главный CSS.

## Демо

Живая демо-страница (все компоненты, светлая/тёмная тема): **https://siwaaa.github.io/design-system-01/** (GitHub Pages, ветка `gh-pages`). Обновить после правок: `pnpm deploy:demo`.

## Разработка

\`\`\`bash
pnpm install
pnpm dev              # демо-страница со всеми компонентами + тумблер темы
pnpm build            # tsc + vite build (проверка)
pnpm build:registry   # синк темы из theme.css в registry.json + shadcn build → r/
pnpm deploy:demo      # пересобрать демо и опубликовать на GitHub Pages
\`\`\`

Правила внесения изменений — в [CLAUDE.md](CLAUDE.md). Главное: тема правится только в `registry/limeui/theme/theme.css`, после любых правок реестра — `pnpm build:registry` и коммит `r/`.
```

- [ ] **Step 3: Финальная сборка и проверка**

Run: `pnpm build:registry && pnpm build`
Expected: PASS, `r/` содержит 21 файл (`registry.json` + 20 компонентов, без `theme.json`... фактически `theme` тоже отдельный файл — итого 21 JSON в `r/`).

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md README.md
git commit -m "limeui: rewrite docs for limeui rebrand"
```

---

## Task 25: Pull Request

**Files:** нет изменений кода — только git/GitHub операции.

- [ ] **Step 1: Убедиться, что рабочая копия чистая**

Run: `git status`
Expected: working tree clean (все предыдущие задачи закоммичены).

- [ ] **Step 2: Создать ветку и запушить**

```bash
git checkout -b limeui-design-system
git push -u origin limeui-design-system
```

- [ ] **Step 3: Открыть PR**

```bash
gh pr create --title "limeui: дизайн-система в стиле klipni.com" --body "$(cat <<'EOF'
## Summary
- Реестр @linkz полностью заменён на @limeui — клон визуального стиля app.klipni.com (лайм-акцент, тёплая нейтральная палитра, именованная pill-радиус-шкала, без теней в покое)
- 17 базовых shadcn-компонентов переписаны под новые токены + 3 новых компонента (SegmentedControl, Chip, Stat), которых нет в дефолтном shadcn
- Токены сняты не на глаз, а через chrome-devtools-mcp — реальные computed styles с живого сайта (см. docs/superpowers/specs/2026-08-12-limeui-design-system-design.md)

## Test plan
- [ ] `pnpm build` проходит
- [ ] `pnpm build:registry` проходит, `r/` пересобран
- [ ] `pnpm dev` — демо-страница проверена визуально в light и dark
EOF
)"
```

Вернуть пользователю ссылку на PR из вывода команды.

---

## Self-Review (проведён при написании плана)

**Покрытие спеки:** все разделы `docs/superpowers/specs/2026-08-12-limeui-design-system-design.md` покрыты — токены (задача 1), переименование реестра (задача 2), 17 базовых компонентов (задачи 3–19), 3 новых компонента (задачи 20–22), демо-страница (задача 23), документация (задача 24), PR (задача 25).

**Плейсхолдеры:** не найдено — каждый шаг содержит полный, реальный код без TODO/TBD.

**Согласованность типов и имён:** проверено — `cn` из `@/lib/utils` переиспользуется одинаково во всех 20 файлах; токены `--radius-pill/lg/md/sm`, `--success`, `--success-muted`, `--border-strong`, `--destructive` объявлены в задаче 1 и используются в задачах 3–22 без расхождений в именах; все импорты `radix-ui` (`Slot`, `Label`, `Checkbox`, `Switch`, `Separator`, `Tabs`, `Tooltip`, `Select`, `DropdownMenu`, `Dialog`, `RadioGroup`, `Toggle`) верифицированы фактическим API пакета (`node -e "console.log(Object.keys(require('radix-ui').X))"`) в ходе написания плана, а не по памяти.

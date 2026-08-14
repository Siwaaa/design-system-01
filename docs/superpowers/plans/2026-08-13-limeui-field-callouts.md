# limeui: Field, брендовые тона Alert, CopyField — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить в реестр `@limeui` примитив формы `Field`, два фирменных тона и кликабельный слот у `Alert`, и поле-ссылку с копированием `CopyField`.

**Architecture:** `Field` — порт `@shadcn/field` с лейблом в начертании `Eyebrow` и без клиентской директивы. `Alert` расширяется двумя вариантами на существующих токенах плюс новым экспортом `AlertAction`. `CopyField` — свой, без внешних зависимостей.

**Tech Stack:** React 19, Tailwind v4, `class-variance-authority`, `lucide-react`, `radix-ui`, shadcn CLI 4.x. Новых npm-зависимостей не добавляется.

**Спека:** `docs/superpowers/specs/2026-08-13-limeui-field-callouts-design.md`

## Global Constraints

- Радиус только из четырёх токенов: `rounded-pill`, `rounded-lg`, `rounded-md`, `rounded-sm`. Пятый не вводится.
- Тени: поверхности в потоке — без теней. Плавающие слои — ровно `shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]`.
- Классы разбиваются по осям через аргументы `cn()` или массив базы `cva`, в порядке `раскладка` → `оформление` → `состояния`, каждая группа со своим комментарием.
- Комбинация «активное состояние + hover» требует явного правила `data-active:hover:*`: псевдокласс имеет более высокую специфичность, чем именованный data-вариант.
- **Имена CSS-классов не пишутся в тексте комментариев и документации.** Tailwind v4 сканирует сырой текст всех файлов проекта, включая `.md`, и порождает утилиту из любого похожего на класс слова. В этой ветке правило уже сработало трижды, последний раз — на цитате чужих классов в спеке этого же плана.
- Импорты внутри `registry/` — через `@/registry/limeui/...`; `cn` — из `@/lib/utils`.
- Цвета только через токены темы, литеральных значений цвета нет.
- Клиентская директива ставится только в файлах, владеющих состоянием, рефами или контекстом. Сейчас таких три; этот план добавляет ровно один — `copy-field.tsx`.
- В проекте нет тестового раннера. Цикл проверки задачи: `pnpm exec tsc -b` без ошибок, `pnpm build` проходит, визуальная проверка в браузере в обеих темах.

## Установленные факты

Проверено сборкой до написания плана, повторять не нужно:

- Утилиты `@container/field-group`, `@md/field-group:flex-row`, `bg-primary/[0.06]`, `border-primary/30`, `bg-primary-soft`, `pr-11`, `has-[>[data-slot=alert-action]]:grid-cols-[16px_1fr_auto]` — все генерируются в Tailwind 4.3.3.
- `Label` (`registry/limeui/ui/label.tsx`) рендерит Radix `Label.Root`, то есть настоящий `<label>`, и принимает `className`.
- `Separator` (`registry/limeui/ui/separator.tsx`) принимает `className` и `orientation`.
- `eyebrowVariants` экспортируется из `registry/limeui/ui/typography.tsx`, размер `default` даёт 11px — ровно то начертание, что у лейблов формы на klipni.
- В реестре сейчас 36 итемов (тема, 34 `registry:ui`, хук). После плана — 38 итемов, 36 компонентов.

---

## Структура файлов

Создаются:

- `registry/limeui/ui/field.tsx` — примитив формы
- `registry/limeui/ui/copy-field.tsx` — поле-ссылка с копированием

Меняются:

- `registry/limeui/ui/alert.tsx` — два варианта тона плюс экспорт `AlertAction`
- `registry.json` — два новых итема, обновление итема `alert`
- `src/demo/ComponentsDemo.tsx` — три новые секции
- `CLAUDE.md` — правила 8 и 9
- `README.md` — состав и числа

---

### Task 1: Компонент `field`

**Files:**
- Create: `registry/limeui/ui/field.tsx`
- Modify: `registry.json`

**Interfaces:**
- Consumes: `cn`; `Label` из `@/registry/limeui/ui/label`; `Separator` из `@/registry/limeui/ui/separator`; `eyebrowVariants` из `@/registry/limeui/ui/typography`
- Produces: `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldLegend`, `FieldSet`, `FieldContent`, `FieldTitle`, `FieldSeparator`, `fieldVariants`

- [ ] **Шаг 1: Создать `registry/limeui/ui/field.tsx`**

Отличия от апстрима, внесённые сознательно и уже учтённые в коде ниже:

1. `FieldLabel` стилизуется классами `eyebrowVariants` — микро-лейбл в моноширинном начертании, как на klipni. Компонент `Eyebrow` при этом НЕ оборачивается: он рендерит `div`, а лейблу нужен настоящий `label`, иначе теряется связь с полем. Начертание берётся из общего источника, поэтому ручного моноширинного класса в файле не появляется и правило 8 не меняется.
2. Апстримовый `FieldError` считает содержимое через мемоизацию, из-за чего файл требует клиентской директивы. Вычисление тривиальное — список ошибок схлопывается в уникальные сообщения. Мемоизация убрана, директива не нужна, компонент остаётся серверным.

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/registry/limeui/ui/label"
import { Separator } from "@/registry/limeui/ui/separator"
import { eyebrowVariants } from "@/registry/limeui/ui/typography"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  "group/field flex w-full gap-1.5 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
        className
      )}
      {...props}
    />
  )
}

// Лейбл поля — тот же микро-лейбл, что Eyebrow, но настоящим элементом label:
// обёртка над Eyebrow дала бы div и потеряла связь лейбла с полем.
function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        // раскладка
        "group/field-label peer/field-label flex w-fit gap-2",
        // оформление — начертание берётся из общего источника типографики
        eyebrowVariants({ size: "default" }),
        // состояния
        "group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        // оформление
        "text-left text-[11px] leading-[1.4] font-normal text-muted-foreground",
        // ссылки внутри подсказки подчёркиваются
        "[&>a]:text-foreground [&>a]:underline [&>a]:underline-offset-2 [&>a:hover]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { children?: React.ReactNode }) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn("relative -my-2 h-5 text-sm", className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          data-slot="field-separator-content"
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
        >
          {children}
        </span>
      )}
    </div>
  )
}

// Мемоизация апстрима убрана: вычисление тривиальное, а хук потребовал бы
// клиентской директивы для файла, который иначе полностью серверный.
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  let content: React.ReactNode = children

  if (!content && errors?.length) {
    const unique = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ].filter((error) => error?.message)

    if (unique.length === 1) {
      content = unique[0]?.message
    } else if (unique.length > 1) {
      content = (
        <ul className="ml-4 flex list-disc flex-col gap-1">
          {unique.map((error, index) => (
            <li key={index}>{error?.message}</li>
          ))}
        </ul>
      )
    }
  }

  if (!content) return null

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-[11px] leading-[1.4] font-normal text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
  fieldVariants,
}
```

- [ ] **Шаг 2: Добавить итем в `registry.json`**

В конец массива `items`:

```json
{
  "name": "field",
  "type": "registry:ui",
  "title": "Field",
  "description": "Примитив формы: микро-лейбл в моноширинном начертании, контрол, подсказка и ошибка. Порт канонического field с лейблом в стилистике limeui.",
  "files": [
    {
      "path": "registry/limeui/ui/field.tsx",
      "type": "registry:ui"
    }
  ],
  "dependencies": [
    "class-variance-authority"
  ],
  "registryDependencies": [
    "@limeui/theme",
    "@limeui/label",
    "@limeui/separator",
    "@limeui/typography"
  ]
}
```

- [ ] **Шаг 3: Проверить сборку**

```bash
pnpm exec tsc -b && pnpm build:registry
```

Ожидается: без ошибок, в выводе присутствует `Building field...`.

- [ ] **Шаг 4: Убедиться, что клиентская директива не понадобилась**

```bash
grep -c '"use client"' registry/limeui/ui/field.tsx
```

Ожидается `0`. Если больше нуля — значит в файл просочился хук; убрать его, а не добавлять директиву.

- [ ] **Шаг 5: Коммит**

```bash
git add registry/limeui/ui/field.tsx registry.json r/
git commit -m "limeui: компонент field"
```

---

### Task 2: Фирменные тона и кликабельный слот у `alert`

**Files:**
- Modify: `registry/limeui/ui/alert.tsx`
- Modify: `registry.json` (итем `alert`)

**Interfaces:**
- Consumes: `cn`; `Slot` из `radix-ui`
- Produces: дополнительно к существующим — вариант `primary`, вариант `primary-muted`, экспорт `AlertAction`

- [ ] **Шаг 1: Переписать `registry/limeui/ui/alert.tsx`**

Базовая строка получает третью колонку сетки, когда внутри есть слот действия. Существующие варианты не трогаются — они уже используются на демо-странице.

```tsx
import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  [
    // раскладка — иконка слева и слот действия справа добавляют колонки
    "relative grid w-full grid-cols-[0_1fr] gap-y-0.5 px-4 py-3.5 has-[>svg]:grid-cols-[16px_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5",
    "has-[>[data-slot=alert-action]]:grid-cols-[0_1fr_auto] has-[>[data-slot=alert-action]]:items-center has-[>svg]:has-[>[data-slot=alert-action]]:grid-cols-[16px_1fr_auto]",
    // оформление
    "rounded-lg border border-border bg-secondary text-sm [&>svg]:text-foreground",
  ],
  {
    variants: {
      variant: {
        default: "bg-secondary text-foreground",
        success: "bg-success-muted text-success [&>svg]:text-success",
        destructive: "bg-destructive/10 text-destructive [&>svg]:text-destructive",
        // Плотный фирменный тон — привлечение внимания, как у баннера klipni.
        primary: "border-primary bg-primary-soft text-foreground [&>svg]:text-foreground",
        // Приглушённый фирменный тон — встроенные пояснения внутри форм.
        "primary-muted":
          "rounded-md border-primary/30 bg-primary/[0.06] text-foreground [&>svg]:text-foreground",
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

// Кликабельный слот у правого края. Сам Alert остаётся некликабельным:
// оборачивать контейнер со статусной ролью в ссылку — плохая семантика,
// вложенный интерактивный элемент сбивает скринридер. Через asChild сюда
// подставляется ссылка или кнопка потребителя.
function AlertAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="alert-action"
      className={cn(
        // раскладка — встаёт в последнюю колонку сетки, во всю её высоту
        "col-start-3 row-span-full row-start-1 flex size-8 shrink-0 items-center justify-center self-center [&>svg]:size-4 [&>svg]:shrink-0",
        // оформление
        "rounded-pill text-current transition-colors outline-hidden",
        // состояния
        "hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction, alertVariants }
```

Замечание про сетку: в базовой строке для всех сочетаний иконки и слота используется нулевая колонка-заглушка, которая задаёт три явных трека. Это гарантирует, что подпись встанет во вторую колонку, а слот в третью, независимо от наличия иконки. Если при проверке в браузере слот окажется не на своём месте — правь раскладку в базе `cva`, а не подпирай отступами в демо.

- [ ] **Шаг 2: Обновить итем `alert` в `registry.json`**

Добавить `radix-ui` в `dependencies` (появился импорт `Slot`) и описание:

```json
{
  "name": "alert",
  "type": "registry:ui",
  "title": "Alert",
  "description": "Плашка-уведомление в пяти тонах, включая два фирменных: плотный для привлечения внимания и тихий для пояснений внутри форм. Слот действия у правого края кликабелен отдельно от контейнера.",
  "files": [
    {
      "path": "registry/limeui/ui/alert.tsx",
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

- [ ] **Шаг 3: Проверить сборку**

```bash
pnpm exec tsc -b && pnpm build:registry
```

- [ ] **Шаг 4: Коммит**

```bash
git add registry/limeui/ui/alert.tsx registry.json r/
git commit -m "limeui: фирменные тона и слот действия у alert"
```

---

### Task 3: Компонент `copy-field`

**Files:**
- Create: `registry/limeui/ui/copy-field.tsx`
- Modify: `registry.json`

**Interfaces:**
- Consumes: `cn`; `Button` из `@/registry/limeui/ui/button`; `CheckIcon`, `CopyIcon` из `lucide-react`
- Produces: `CopyField` с пропсами `value`, `label`, `copiedLabel`

- [ ] **Шаг 1: Создать `registry/limeui/ui/copy-field.tsx`**

```tsx
"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/limeui/ui/button"

function CopyField({
  className,
  value,
  label = "Copy",
  copiedLabel = "Copied",
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  value: string
  label?: string
  copiedLabel?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Таймер сбрасывается при размонтировании: без этого обновление состояния
  // прилетело бы в уже снятый компонент.
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Буфер обмена недоступен без защищённого контекста или разрешения —
      // молча остаёмся в исходном состоянии, значение видно и выделяемо.
      return
    }
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      data-slot="copy-field"
      className={cn("relative w-full", className)}
      {...props}
    >
      <input
        readOnly
        value={value}
        data-slot="copy-field-input"
        className={cn(
          // раскладка — правый отступ освобождает место под кнопку
          "h-12 w-full px-4 pr-11",
          // оформление — строка, которую копируют посимвольно, читается моноширинно
          "rounded-md border border-border bg-secondary font-mono text-[12.5px] text-foreground outline-none transition-colors",
          // состояния
          "focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={copy}
        aria-label={copied ? copiedLabel : label}
        className="absolute top-1/2 right-1.5 -translate-y-1/2"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      {/* Подтверждение копирования для скринридера: визуальной смены иконки
          недостаточно, объявление нужно голосом. */}
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  )
}

export { CopyField }
```

- [ ] **Шаг 2: Добавить итем в `registry.json`**

```json
{
  "name": "copy-field",
  "type": "registry:ui",
  "title": "Copy Field",
  "description": "Поле только для чтения со встроенной кнопкой копирования: ссылка на профиль, токен, реквизит. Значение читается моноширинно, копирование подтверждается голосом и иконкой.",
  "files": [
    {
      "path": "registry/limeui/ui/copy-field.tsx",
      "type": "registry:ui"
    }
  ],
  "dependencies": [
    "lucide-react"
  ],
  "registryDependencies": [
    "@limeui/theme",
    "@limeui/button"
  ]
}
```

- [ ] **Шаг 3: Проверить сборку**

```bash
pnpm exec tsc -b && pnpm build:registry
```

- [ ] **Шаг 4: Коммит**

```bash
git add registry/limeui/ui/copy-field.tsx registry.json r/
git commit -m "limeui: компонент copy-field"
```

---

### Task 4: Показать всё три на витрине

**Files:**
- Modify: `src/demo/ComponentsDemo.tsx`

- [ ] **Шаг 1: Добавить импорты**

К существующим импортам файла добавить:

```tsx
import { AlertAction } from "@/registry/limeui/ui/alert"
import { CopyField } from "@/registry/limeui/ui/copy-field"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/limeui/ui/field"
```

`Alert`, `AlertTitle`, `AlertDescription` в файле уже импортированы — дополнять только новым экспортом. Иконку стрелки взять из `lucide-react`; если импорт иконок в файле уже есть, дополнить его, а не заводить второй.

- [ ] **Шаг 2: Расширить существующую секцию `Alert`**

В уже существующий блок секции `Alert` дописать два примера. Первый — плотный тон со слотом действия в виде ссылки:

```tsx
<Alert variant="primary">
  <AlertTitle>Добавьте фото профиля</AlertTitle>
  <AlertDescription>
    Бренды листают каталог глазами: карточку без лица пропускают.
  </AlertDescription>
  <AlertAction asChild>
    <a href="#profile" aria-label="Перейти к загрузке фото">
      <ArrowRightIcon />
    </a>
  </AlertAction>
</Alert>
```

Второй — тихий тон без действия:

```tsx
<Alert variant="primary-muted">
  <AlertTitle>Нужна самозанятость</AlertTitle>
  <AlertDescription>
    Зарегистрируйтесь через приложение «Мой налог» — это бесплатно и занимает
    пять минут.
  </AlertDescription>
</Alert>
```

- [ ] **Шаг 3: Добавить секцию `Field`**

Новая секция по образцу соседних (компонент-обёртка `Section` в файле уже есть, использовать его). Внутри — группа из трёх полей, показывающая все части: подсказку со ссылкой, счётчик в строке лейбла и ошибку.

```tsx
<Section title="Field">
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="demo-inn">ИНН</FieldLabel>
      <Input id="demo-inn" placeholder="123456789012" />
      <FieldDescription>
        12 цифр — найдёте в приложении «Мой налог» или на{" "}
        <a href="#gosuslugi">Госуслугах</a>.
      </FieldDescription>
    </Field>

    <Field>
      <div className="flex items-baseline justify-between">
        <FieldLabel htmlFor="demo-about">О себе</FieldLabel>
        <Num className="text-[10px] text-foreground-subtle">0/300</Num>
      </div>
      <Textarea id="demo-about" placeholder="Пара предложений о себе." />
      <FieldDescription>
        Бренд увидит это на вашей публичной странице.
      </FieldDescription>
    </Field>

    <Field data-invalid="true">
      <FieldLabel htmlFor="demo-bik">БИК банка</FieldLabel>
      <Input id="demo-bik" defaultValue="0445" aria-invalid />
      <FieldError errors={[{ message: "БИК состоит из 9 цифр." }]} />
    </Field>
  </FieldGroup>
</Section>
```

Счётчик идёт через `Num` — это данные, и по правилу 8 моноширинное начертание попадает в разметку только через готовый компонент, а не ручным классом. `Input`, `Textarea` и `Num` в файле уже импортированы; проверить и дополнить импорты при необходимости.

- [ ] **Шаг 4: Добавить секцию `CopyField`**

```tsx
<Section title="Copy Field">
  <CopyField
    value="https://klipni.com/u/anton-vereschagin"
    label="Скопировать ссылку"
    copiedLabel="Скопировано"
  />
</Section>
```

- [ ] **Шаг 5: Собрать**

```bash
pnpm exec tsc -b && pnpm build
```

Неиспользуемые импорты роняют сборку с TS6133 — в проекте включён соответствующий флаг.

- [ ] **Шаг 6: Коммит**

```bash
git add src/demo/ComponentsDemo.tsx
git commit -m "limeui: показать field, тона alert и copy-field на витрине"
```

---

### Task 5: Проверка в браузере

Задача без правок кода — только проверка и, если найдётся расхождение, точечный фикс.

- [ ] **Шаг 1: Запустить дев-сервер**

```bash
pnpm dev --port 5217
```

Витрина — вкладка «Компоненты».

- [ ] **Шаг 2: Проверить тона `Alert` в обеих темах**

Ключевой пункт задачи. Тихий тон — это фирменный цвет с прозрачностью 6% поверх фона; поверх тёмного фона он ведёт себя иначе, чем поверх светлого, и на глаз до сборки этого оценить нельзя.

Замерить вычисленные цвета фона и текста обоих новых тонов в светлой и тёмной теме и посчитать контраст текста к фону. Привести четыре числа. Контраст ниже 4.5 для основного текста — находка.

- [ ] **Шаг 3: Проверить раскладку слота действия**

При варианте с иконкой и без неё слот действия обязан стоять у правого края и быть выровнен по вертикали. Проверить оба случая, привести координаты.

- [ ] **Шаг 4: Проверить, что слот действительно кликабелен, а контейнер — нет**

Убедиться, что внутри контейнера с ролью статуса ровно один интерактивный элемент и что он получает фокус по Tab. Контейнер фокус получать не должен.

- [ ] **Шаг 5: Проверить `Field`**

Клик по лейблу переводит фокус в связанное поле — это и есть смысл замены обёртки на настоящий элемент лейбла. Проверить на всех трёх полях секции. Отдельно убедиться, что поле с ошибкой её показывает.

- [ ] **Шаг 6: Проверить `CopyField`**

Нажать кнопку, подтвердить: значение оказалось в буфере обмена, иконка сменилась, доступное имя кнопки сменилось, область для скринридера получила текст подтверждения, через полторы секунды всё вернулось.

- [ ] **Шаг 7: Проверить, что ничего не сломалось**

Существующие три тона `Alert` выглядят как раньше. Вкладки «Дашборд» и «Сообщения» открываются без ошибок в консоли.

---

### Task 6: Проверка доставки в чистом проекте-потребителе

- [ ] **Шаг 1: Поднять реестр статикой**

```bash
cd "$(git rev-parse --show-toplevel)" && python3 -m http.server 8099 --directory r &
```

- [ ] **Шаг 2: Собрать чистый проект**

```bash
cd "$TMPDIR" && rm -rf limeui-field-check && pnpm create vite limeui-field-check --template react-ts && cd limeui-field-check && pnpm install
```

Подготовить проект так, как требует раздел подключения в `README.md`, затем `pnpm dlx shadcn@latest init -b radix -p nova -y`.

- [ ] **Шаг 3: Поставить компоненты**

```bash
pnpm dlx shadcn@latest registry add "@limeui=http://localhost:8099/{name}.json"
pnpm dlx shadcn@latest add @limeui/field @limeui/copy-field @limeui/alert
```

- [ ] **Шаг 4: Проверить четыре вещи**

1. Три файла приехали, импорты внутри переписаны на алиасы потребителя.
2. Приехали транзитивные зависимости: лейбл, разделитель, типографика, кнопка, тема.
3. Файл `field` у потребителя не содержит клиентской директивы — она там не нужна, а лишняя директива утащила бы серверный компонент на клиент.
4. Проект-потребитель собирается: `pnpm build`.

- [ ] **Шаг 5: Прибрать**

```bash
kill %1
cd "$TMPDIR" && rm -rf limeui-field-check
```

Результат каждой проверки записать дословно, вместе с выводом команд.

---

### Task 7: Документация

**Files:**
- Modify: `CLAUDE.md` (правила 8 и 9)
- Modify: `README.md`

- [ ] **Шаг 1: Обновить правило 8 в `CLAUDE.md`**

Правило перечисляет места, где моноширинное начертание ставится вручную, и утверждает, что список исчерпывающий. `copy-field` добавляет одно такое место: значение, которое копируют посимвольно, — это данные, та же смысловая роль, что у чисел.

Обновить счётчики мест и файлов и дописать `CopyField` в перечень. `field` в перечень НЕ попадает: он берёт начертание из общего источника типографики, ручного класса в нём нет. Сверить фактическое число командой поиска по каталогу реестра и привести её вывод в отчёте.

- [ ] **Шаг 2: Обновить правило 9 в `CLAUDE.md`**

Список файлов с клиентской директивой пополняется `copy-field.tsx` — он владеет состоянием и таймером. Указать причину рядом с файлом, как сделано для остальных. Сверить фактический список командой поиска.

- [ ] **Шаг 3: Обновить `README.md`**

- числа: итемов 36 → 38, компонентов 34 → 36
- в таблицу состава добавить `field` и `copy-field`
- в описании `alert` упомянуть фирменные тона

Имена CSS-классов в текст не писать.

- [ ] **Шаг 4: Финальная сборка и сверка**

```bash
pnpm build && pnpm build:registry && git status --short
```

После сборки реестра не должно остаться несохранённых изменений.

Отдельно сравнить число правил в собранном CSS до и после правок документации: если выросло — в текст просочилось имя класса, найти и переформулировать.

- [ ] **Шаг 5: Коммит**

```bash
git add CLAUDE.md README.md registry.json r/
git commit -m "limeui: документация field, тонов alert и copy-field"
```

---

## Самопроверка плана

**Покрытие спеки.** `Field` — задача 1. Тона и слот действия `Alert` — задача 2. `CopyField` — задача 3. Пункты проверки спеки 2-4 — задачи 4 и 5, пункт 5 — задача 6, пункт 1 — во всех задачах. Раздел «Не входит в объём» соблюдён: загрузки аватара, флагов, тегов-бейджей и пустых состояний в задачах нет.

**Заглушки.** Задачи 1-4 содержат готовый код. Задачи 5-7 описаны словами намеренно: задача 5 — проверка, где предписывать ожидаемые числа заранее означало бы подсказать ответ; задачи 6-7 переписывают существующие абзацы, а дословное цитирование правил вернуло бы имена классов в текст, что запрещено глобальным ограничением.

**Согласованность типов.** `FieldLabel` принимает пропсы `Label`, поэтому в демо ему передаётся `htmlFor`. `FieldError` принимает `errors` массивом объектов с полем `message` — демо передаёт именно такой. `AlertAction` принимает `asChild`, демо подставляет ссылку. `CopyField` требует `value` строкой и принимает два необязательных имени — демо передаёт все три. `eyebrowVariants` вызывается с размером `default`, такой вариант в типографике существует.

**Известные риски.** Два. Первый: раскладка слота действия в сетке `Alert` при варианте без иконки — сетка меняет число колонок через проверку наличия дочернего элемента, и это единственное место плана, где я не уверен в результате без браузера; поэтому в задаче 5 стоит отдельный шаг именно на этот случай. Второй: тихий фирменный тон в тёмной теме — прозрачность поверх тёмного фона даёт другой результат, чем поверх светлого, и требует замера контраста, а не осмотра.

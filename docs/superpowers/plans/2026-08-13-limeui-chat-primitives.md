# limeui: примитивы чата — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить в реестр `@limeui` пять итемов для экрана переписки и третью демо-страницу «Сообщения» внутри дашборд-каркаса.

**Architecture:** Каноника `@shadcn/message` берётся за основу раскладки; пузырь, время, индикатор набора, лента с автоскроллом, композер, список диалогов и разделители — наши. Демо-каркас выносится из `DashboardDemo` в `DemoShell`, на нём живут обе страницы.

**Tech Stack:** React 19, Tailwind v4, `class-variance-authority`, `lucide-react`, shadcn CLI 4.x. Новых npm-зависимостей не добавляется.

**Спека:** `docs/superpowers/specs/2026-08-13-limeui-chat-primitives-design.md`

## Global Constraints

Требования ниже входят в каждую задачу неявно.

- Радиус только из четырёх токенов: `rounded-pill`, `rounded-lg`, `rounded-md`, `rounded-sm` (включая угловые формы вроде `rounded-bl-sm`). Пятый токен не вводится.
- Тени: поверхности в потоке — без теней. Плавающие — ровно `shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]`.
- Geist Mono ставится только через существующие `Num` и `Eyebrow`. Ручной `font-mono` в новых файлах не появляется.
- Классы разбиваются по осям через аргументы `cn()` или массив базы `cva`, в порядке `раскладка` → `оформление` → `состояния`, каждая группа со своим комментарием.
- Комбинация «активное состояние + hover» всегда получает явное правило `data-active:hover:*`. Псевдокласс `hover:` имеет более высокую специфичность, чем именованный data-вариант, и без явного правила побеждает независимо от порядка в строке.
- Имена классов не пишутся в комментариях и в тексте документации: Tailwind v4 сканирует сырой текст всех файлов проекта, включая `.md`, и порождает утилиту из любого похожего на класс слова.
- Импорты внутри `registry/` идут через `@/registry/limeui/...`; `cn` — из `@/lib/utils`.
- Цвета только через токены темы. Литеральных значений цвета в компонентах нет.
- В проекте нет тестового раннера. Цикл проверки задачи: `pnpm exec tsc -b` без ошибок, `pnpm build` проходит, визуальная проверка в браузере в обеих темах.

---

## Структура файлов

Создаются:

- `registry/limeui/ui/message.tsx` — раскладка сообщения, пузырь, время, индикатор набора
- `registry/limeui/ui/message-separator.tsx` — разделитель дня и границы непрочитанного
- `registry/limeui/ui/conversation-list.tsx` — список диалогов
- `registry/limeui/ui/message-composer.tsx` — строка ввода
- `registry/limeui/ui/message-list.tsx` — лента с автоскроллом
- `src/demo/DemoShell.tsx` — дашборд-каркас, общий для страниц демо
- `src/demo/MessagesDemo.tsx` — демо-страница переписки

Меняются:

- `src/index.css` — новый `@keyframes`
- `registry.json` — пять новых итемов
- `src/demo/DashboardDemo.tsx` — переезд на `DemoShell`
- `src/App.tsx` — третья вкладка
- `CLAUDE.md`, `README.md` — правила 9 и 10, состав реестра

---

### Task 1: Компонент `message`

**Files:**
- Create: `registry/limeui/ui/message.tsx`
- Modify: `src/index.css` (добавить `@keyframes` после существующего)
- Modify: `registry.json` (добавить итем)

**Interfaces:**
- Consumes: `cn` из `@/lib/utils`; `Num` из `@/registry/limeui/ui/typography`
- Produces: `MessageGroup`, `Message`, `MessageAvatar`, `MessageContent`, `MessageHeader`, `MessageFooter`, `MessageTime`, `MessageBubble`, `MessageTyping`, `messageBubbleVariants`

- [ ] **Шаг 1: Создать `registry/limeui/ui/message.tsx`**

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Num } from "@/registry/limeui/ui/typography"

function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

function Message({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        // раскладка — исходящее сообщение разворачивает строку,
        // поэтому аватар и пузырь меняются местами без второй разметки
        "group/message relative flex w-full min-w-0 gap-2.5 data-[align=end]:flex-row-reverse",
        // оформление
        "text-sm",
        className
      )}
      {...props}
    />
  )
}

// Обёртка выравнивания без собственного фона и радиуса: внутрь кладётся
// Avatar реестра, который уже даёт нужную форму.
function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn("flex shrink-0 items-end self-end", className)}
      {...props}
    />
  )
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        // раскладка
        "flex w-full min-w-0 flex-col gap-1 group-data-[align=end]/message:items-end",
        // оформление — длинные ссылки не должны рвать колонку
        "wrap-break-word",
        className
      )}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        // раскладка
        "flex max-w-full min-w-0 items-center gap-2 px-1 group-data-[align=end]/message:justify-end",
        // оформление
        "text-[11px] font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        // раскладка
        "flex max-w-full min-w-0 items-center gap-2 px-1 group-data-[align=end]/message:justify-end",
        // оформление
        "text-[11px] font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

// Время всегда идёт через Num: поставить его мимо Geist Mono нельзя
// по построению, как у StatValue и DataListValue.
function MessageTime({ className, ...props }: React.ComponentProps<typeof Num>) {
  return (
    <Num
      className={cn("text-[11px] text-muted-foreground", className)}
      {...props}
    />
  )
}

const messageBubbleVariants = cva(
  [
    // раскладка
    "w-fit max-w-[min(38rem,85%)] px-3.5 py-2.5",
    // оформление
    "rounded-lg text-[13px] leading-[1.5]",
  ],
  {
    variants: {
      variant: {
        // Угол со стороны аватара срезается до меньшего токена — «хвостик»
        // собирается из существующей шкалы, пятый радиус не вводится.
        incoming: "rounded-bl-sm bg-secondary text-foreground",
        outgoing: "rounded-br-sm bg-foreground text-background",
        // Системное сообщение — не пузырь, а строка по центру ленты.
        system:
          "mx-auto max-w-[min(38rem,100%)] bg-transparent px-0 py-1 text-center text-[12px] text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "incoming",
    },
  }
)

function MessageBubble({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof messageBubbleVariants>) {
  return (
    <div
      data-slot="message-bubble"
      data-variant={variant ?? "incoming"}
      className={cn(messageBubbleVariants({ variant, className }))}
      {...props}
    />
  )
}

function MessageTyping({
  className,
  label = "Typing…",
  ...props
}: React.ComponentProps<"div"> & { label?: string }) {
  return (
    <div
      data-slot="message-typing"
      role="status"
      aria-label={label}
      className={cn(
        // раскладка
        "flex w-fit items-center gap-1 px-3.5 py-3",
        // оформление — та же коробка, что у входящего пузыря
        "rounded-lg rounded-bl-sm bg-secondary",
        className
      )}
      {...props}
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          aria-hidden
          style={{ animationDelay: `${index * 0.16}s` }}
          className="size-1.5 rounded-pill bg-muted-foreground animate-[limeui-typing-bounce_1.1s_ease-in-out_infinite] motion-reduce:animate-none!"
        />
      ))}
    </div>
  )
}

export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
  MessageTime,
  MessageBubble,
  MessageTyping,
  messageBubbleVariants,
}
```

- [ ] **Шаг 2: Добавить `@keyframes` в `src/index.css`**

Вставить сразу после блока `@keyframes limeui-progress-slide`:

```css
@keyframes limeui-typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }
  30% {
    transform: translateY(-3px);
    opacity: 1;
  }
}
```

- [ ] **Шаг 3: Добавить итем в `registry.json`**

В конец массива `items`:

```json
{
  "name": "message",
  "type": "registry:ui",
  "title": "Message",
  "description": "Раскладка сообщения переписки: группа, выравнивание по стороне, аватар, шапка и подвал, пузырь в трёх вариантах, время через Num и индикатор набора.",
  "files": [
    {
      "path": "registry/limeui/ui/message.tsx",
      "type": "registry:ui"
    }
  ],
  "dependencies": [
    "class-variance-authority"
  ],
  "registryDependencies": [
    "@limeui/theme",
    "@limeui/avatar",
    "@limeui/typography"
  ],
  "css": {
    "@keyframes limeui-typing-bounce": {
      "0%, 60%, 100%": {
        "transform": "translateY(0)",
        "opacity": "0.45"
      },
      "30%": {
        "transform": "translateY(-3px)",
        "opacity": "1"
      }
    }
  }
}
```

- [ ] **Шаг 4: Проверить сборку**

```bash
pnpm exec tsc -b && pnpm build:registry
```

Ожидается: без ошибок, в выводе `shadcn build` присутствует `Building message...`.

- [ ] **Шаг 5: Убедиться, что анимация действительно гасится при reduced-motion**

```bash
pnpm exec vite build --outDir /tmp/limeui-t1 --emptyOutDir >/dev/null 2>&1 && grep -o 'animation:none!important' /tmp/limeui-t1/assets/*.css | head -1
```

Ожидается вывод `animation:none!important`. Если пусто — завершающий `!` не сработал, править до перехода к следующему шагу.

- [ ] **Шаг 6: Коммит**

```bash
git add registry/limeui/ui/message.tsx src/index.css registry.json r/
git commit -m "limeui: компонент message — раскладка, пузырь, время, индикатор набора"
```

---

### Task 2: Компонент `message-separator`

**Files:**
- Create: `registry/limeui/ui/message-separator.tsx`
- Modify: `registry.json`

**Interfaces:**
- Consumes: `cn`; `Eyebrow` из `@/registry/limeui/ui/typography`
- Produces: `MessageSeparator`

- [ ] **Шаг 1: Создать `registry/limeui/ui/message-separator.tsx`**

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"
import { Eyebrow } from "@/registry/limeui/ui/typography"

function MessageSeparator({
  className,
  variant = "day",
  children,
  ...props
}: React.ComponentProps<"div"> & { variant?: "day" | "unread" }) {
  return (
    <div
      data-slot="message-separator"
      data-variant={variant}
      role="separator"
      className={cn(
        // раскладка
        "flex w-full items-center gap-3 py-1",
        className
      )}
      {...props}
    >
      <span aria-hidden className={cn("h-px flex-1", line)} />
      <Eyebrow size="sm" className={cn(variant === "unread" && "text-primary")}>
        {children}
      </Eyebrow>
      <span aria-hidden className={cn("h-px flex-1", line)} />
    </div>
  )
}

export { MessageSeparator }
```

Переменная `line` объявляется до `return`:

```tsx
const line = variant === "unread" ? "bg-primary" : "bg-border"
```

Вариант выбирается в JavaScript, а не селектором по data-атрибуту: значение известно на рендере, и лишние правила только раздували бы CSS.

- [ ] **Шаг 2: Добавить итем в `registry.json`**

```json
{
  "name": "message-separator",
  "type": "registry:ui",
  "title": "Message Separator",
  "description": "Разделитель ленты переписки: подпись дня или граница непрочитанного. Подпись рендерится через Eyebrow.",
  "files": [
    {
      "path": "registry/limeui/ui/message-separator.tsx",
      "type": "registry:ui"
    }
  ],
  "registryDependencies": [
    "@limeui/theme",
    "@limeui/typography"
  ]
}
```

- [ ] **Шаг 3: Проверить сборку**

```bash
pnpm exec tsc -b && pnpm build:registry
```

- [ ] **Шаг 4: Коммит**

```bash
git add registry/limeui/ui/message-separator.tsx registry.json r/
git commit -m "limeui: компонент message-separator"
```

---

### Task 3: Компонент `conversation-list`

**Files:**
- Create: `registry/limeui/ui/conversation-list.tsx`
- Modify: `registry.json`

**Interfaces:**
- Consumes: `cn`; `Num` из `@/registry/limeui/ui/typography`
- Produces: `ConversationList`, `ConversationItem`, `ConversationTitle`, `ConversationPreview`, `ConversationMeta`, `ConversationBadge`

- [ ] **Шаг 1: Создать `registry/limeui/ui/conversation-list.tsx`**

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"
import { Num } from "@/registry/limeui/ui/typography"

function ConversationList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="conversation-list"
      className={cn("flex w-full min-w-0 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function ConversationItem({
  className,
  isActive = false,
  children,
  ...props
}: React.ComponentProps<"button"> & { isActive?: boolean }) {
  return (
    <li data-slot="conversation-item" className="min-w-0">
      <button
        type="button"
        data-slot="conversation-item-button"
        data-active={isActive}
        className={cn(
          // раскладка
          "flex w-full min-w-0 items-center gap-3 px-3 py-2.5 text-left",
          // оформление
          "rounded-sm outline-hidden transition-colors",
          // состояния. `data-active:hover:*` обязателен: псевдокласс hover
          // имеет более высокую специфичность, чем именованный data-вариант,
          // и без явного правила перекрывал бы активный фон.
          "hover:bg-secondary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-active:bg-secondary data-active:hover:bg-secondary",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </li>
  )
}

// Все части внутри ConversationItem — span с block/flex, а не div:
// содержимое кнопки по спецификации HTML ограничено фразовым контентом,
// и блочные элементы там невалидны.
function ConversationBody({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="conversation-body"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function ConversationTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="conversation-title"
      className={cn(
        "block truncate text-[13px] font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

function ConversationPreview({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="conversation-preview"
      className={cn(
        "block truncate text-[12px] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ConversationMeta({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="conversation-meta"
      className={cn(
        // раскладка
        "flex shrink-0 flex-col items-end gap-1.5",
        // оформление
        "text-[11px] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

// Счётчик непрочитанных идёт через Num — цифры в моно с tabular-nums,
// чтобы бейдж не дёргался при смене значения.
function ConversationBadge({
  className,
  ...props
}: React.ComponentProps<typeof Num>) {
  return (
    <Num
      className={cn(
        // раскладка
        "flex h-5 min-w-5 items-center justify-center px-1.5",
        // оформление
        "rounded-pill bg-primary text-[11px] font-semibold text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  ConversationList,
  ConversationItem,
  ConversationBody,
  ConversationTitle,
  ConversationPreview,
  ConversationMeta,
  ConversationBadge,
}
```

- [ ] **Шаг 2: Добавить итем в `registry.json`**

```json
{
  "name": "conversation-list",
  "type": "registry:ui",
  "title": "Conversation List",
  "description": "Список диалогов: аватар, имя, превью последнего сообщения, время и счётчик непрочитанных. Активный элемент подсвечен приглушённым фоном, чёрная плашка оставлена сайдбару.",
  "files": [
    {
      "path": "registry/limeui/ui/conversation-list.tsx",
      "type": "registry:ui"
    }
  ],
  "registryDependencies": [
    "@limeui/theme",
    "@limeui/typography"
  ]
}
```

- [ ] **Шаг 3: Проверить сборку**

```bash
pnpm exec tsc -b && pnpm build:registry
```

- [ ] **Шаг 4: Коммит**

```bash
git add registry/limeui/ui/conversation-list.tsx registry.json r/
git commit -m "limeui: компонент conversation-list"
```

---

### Task 4: Компонент `message-composer`

**Files:**
- Create: `registry/limeui/ui/message-composer.tsx`
- Modify: `registry.json`

**Interfaces:**
- Consumes: `cn`; `Button` из `@/registry/limeui/ui/button`; `Textarea` из `@/registry/limeui/ui/textarea`; `ArrowUpIcon` из `lucide-react`
- Produces: `MessageComposer` с пропсами `onSend(value: string)`, `placeholder`, `disabled`, `maxRows`, `sendLabel`

- [ ] **Шаг 1: Создать `registry/limeui/ui/message-composer.tsx`**

```tsx
"use client"

import * as React from "react"
import { ArrowUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/limeui/ui/button"
import { Textarea } from "@/registry/limeui/ui/textarea"

function MessageComposer({
  className,
  onSend,
  placeholder = "Message…",
  disabled = false,
  maxRows = 6,
  sendLabel = "Send",
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit"> & {
  onSend: (value: string) => void
  placeholder?: string
  disabled?: boolean
  maxRows?: number
  sendLabel?: string
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = React.useState("")

  const trimmed = value.trim()
  const canSend = trimmed.length > 0 && !disabled

  // Авторост: высота сбрасывается перед замером, иначе scrollHeight
  // запомнит предыдущее, большее значение и поле никогда не уменьшится.
  React.useLayoutEffect(() => {
    const element = textareaRef.current
    if (!element) return

    element.style.height = "auto"

    const styles = getComputedStyle(element)
    const lineHeight = parseFloat(styles.lineHeight) || 24
    const vertical =
      parseFloat(styles.paddingTop) +
      parseFloat(styles.paddingBottom) +
      parseFloat(styles.borderTopWidth) +
      parseFloat(styles.borderBottomWidth)
    const maxHeight = lineHeight * maxRows + vertical

    element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`
    element.style.overflowY = element.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [value, maxRows])

  function send() {
    if (!canSend) return
    onSend(trimmed)
    setValue("")
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // isComposing защищает ввод через IME: во время подбора иероглифа или
    // диакритики Enter принадлежит редактору метода ввода, а не форме.
    if (event.key !== "Enter" || event.shiftKey) return
    if (event.nativeEvent.isComposing) return
    event.preventDefault()
    send()
  }

  return (
    <form
      data-slot="message-composer"
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
      className={cn(
        // раскладка
        "flex w-full items-end gap-2",
        className
      )}
      {...props}
    >
      <Textarea
        ref={textareaRef}
        value={value}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-0 resize-none py-3 text-[13px]"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!canSend}
        aria-label={sendLabel}
        className="shrink-0"
      >
        <ArrowUpIcon />
      </Button>
    </form>
  )
}

export { MessageComposer }
```

- [ ] **Шаг 2: Убедиться, что `Textarea` пропускает `ref`**

Проверить `registry/limeui/ui/textarea.tsx`: компонент объявлен как `React.ComponentProps<"textarea">` и раскладывает `...props` в элемент. В React 19 `ref` приходит внутри пропсов, поэтому передача работает без `forwardRef`. Если в файле обнаружится, что `ref` не доходит, — остановиться и сообщить, а не переписывать `Textarea` молча.

- [ ] **Шаг 3: Добавить итем в `registry.json`**

```json
{
  "name": "message-composer",
  "type": "registry:ui",
  "title": "Message Composer",
  "description": "Строка ввода сообщения: авторост до заданного числа строк, Enter отправляет, Shift+Enter переносит, пустое значение не отправляется.",
  "files": [
    {
      "path": "registry/limeui/ui/message-composer.tsx",
      "type": "registry:ui"
    }
  ],
  "dependencies": [
    "lucide-react"
  ],
  "registryDependencies": [
    "@limeui/theme",
    "@limeui/button",
    "@limeui/textarea"
  ]
}
```

- [ ] **Шаг 4: Проверить сборку**

```bash
pnpm exec tsc -b && pnpm build:registry
```

- [ ] **Шаг 5: Коммит**

```bash
git add registry/limeui/ui/message-composer.tsx registry.json r/
git commit -m "limeui: компонент message-composer"
```

---

### Task 5: Компонент `message-list`

**Files:**
- Create: `registry/limeui/ui/message-list.tsx`
- Modify: `registry.json`

**Interfaces:**
- Consumes: `cn`; `Button`; `ArrowDownIcon` из `lucide-react`
- Produces: `MessageList` с пропсом `scrollButtonLabel`

- [ ] **Шаг 1: Создать `registry/limeui/ui/message-list.tsx`**

```tsx
"use client"

import * as React from "react"
import { ArrowDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/limeui/ui/button"

function MessageList({
  className,
  children,
  scrollButtonLabel = "Scroll to latest",
  ...props
}: React.ComponentProps<"div"> & { scrollButtonLabel?: string }) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  const [atBottom, setAtBottom] = React.useState(true)
  // Зеркало состояния в рефе: колбэк MutationObserver создаётся один раз
  // и через замыкание видел бы навсегда первое значение atBottom.
  const atBottomRef = React.useRef(true)

  React.useEffect(() => {
    const viewport = viewportRef.current
    const sentinel = sentinelRef.current
    if (!viewport || !sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        atBottomRef.current = entry.isIntersecting
        setAtBottom(entry.isIntersecting)
      },
      { root: viewport, threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const content = contentRef.current
    if (!content) return

    // Автоскролл только когда пользователь уже внизу: иначе чтение истории
    // сбивалось бы каждым новым сообщением.
    const observer = new MutationObserver(() => {
      if (!atBottomRef.current) return
      sentinelRef.current?.scrollIntoView({ block: "end" })
    })
    observer.observe(content, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  // Первый показ открывается на свежих сообщениях, без анимации.
  React.useEffect(() => {
    sentinelRef.current?.scrollIntoView({ block: "end" })
  }, [])

  return (
    <div
      data-slot="message-list"
      className={cn("relative flex min-h-0 flex-1 flex-col", className)}
      {...props}
    >
      <div
        ref={viewportRef}
        data-slot="message-list-viewport"
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-6"
      >
        <div ref={contentRef} className="flex flex-col gap-5">
          {children}
          <div ref={sentinelRef} aria-hidden className="h-px shrink-0" />
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        aria-label={scrollButtonLabel}
        onClick={() =>
          sentinelRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          })
        }
        className={cn(
          // раскладка
          "absolute bottom-4 left-1/2 -translate-x-1/2",
          // оформление — плавающий контрол несёт тень плавающего слоя
          "shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)] transition-opacity",
          // состояния
          atBottom && "pointer-events-none opacity-0"
        )}
      >
        <ArrowDownIcon />
      </Button>
    </div>
  )
}

export { MessageList }
```

- [ ] **Шаг 2: Добавить итем в `registry.json`**

```json
{
  "name": "message-list",
  "type": "registry:ui",
  "title": "Message List",
  "description": "Прокручиваемая лента переписки: автоскролл к новым сообщениям только если пользователь уже внизу, плюс кнопка возврата вниз при отлистывании вверх. Без внешних зависимостей.",
  "files": [
    {
      "path": "registry/limeui/ui/message-list.tsx",
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
git add registry/limeui/ui/message-list.tsx registry.json r/
git commit -m "limeui: компонент message-list с автоскроллом"
```

---

### Task 6: Вынос дашборд-каркаса в `DemoShell`

Задача целиком про переезд без изменения внешнего вида. Любое расхождение в собранном CSS — ошибка.

**Files:**
- Create: `src/demo/DemoShell.tsx`
- Modify: `src/demo/DashboardDemo.tsx`

**Interfaces:**
- Produces: `DemoShell` с пропсами `active: string`, `children: React.ReactNode`

- [ ] **Шаг 1: Снять базовый слепок CSS**

```bash
pnpm exec vite build --outDir /tmp/limeui-shell-before --emptyOutDir >/dev/null 2>&1 && cp /tmp/limeui-shell-before/assets/*.css /tmp/limeui-shell-before.css && wc -c /tmp/limeui-shell-before.css
```

- [ ] **Шаг 2: Создать `src/demo/DemoShell.tsx`**

Перенести из `DashboardDemo.tsx` без единого изменения классов: константу `NAV`, весь `SidebarProvider` с `Sidebar`, шапкой, `SidebarContent`, `SidebarFooter`, мобильную шапку и `SidebarInset`. Константа `ACTIVE` заменяется на проп `active`. Содержимое страницы (всё, что было внутри `SidebarInset` после мобильной шапки) заменяется на `{children}`.

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

import { Avatar, AvatarFallback } from "@/registry/limeui/ui/avatar"
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
import { Eyebrow, Num } from "@/registry/limeui/ui/typography"

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

const BALANCE = 150000

export default function DemoShell({
  active,
  children,
}: {
  active: string
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
            <span className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
              <span className="text-[18px] font-extrabold leading-none tracking-[-0.04em]">
                limeui
              </span>
              <Eyebrow
                size="sm"
                className="inline-block rounded-sm bg-foreground px-1.5 py-0.5 font-semibold tracking-[0.08em] text-background"
              >
                beta
              </Eyebrow>
            </span>
            {/* В свёрнутом виде триггер встаёт на ту же 40-пиксельную
                колонку, что и иконки меню, иначе в рейле оказывается
                три разных оптических центра. */}
            <SidebarTrigger className="group-data-[collapsible=icon]:size-10" />
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
                        isActive={item.title === active}
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
            <Num value={BALANCE} className="text-[13px] font-semibold" />
          </div>
          <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
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
        {/* Триггер обязан жить снаружи Sidebar: на мобильном сам Sidebar
            рендерится внутри Sheet, который этой кнопкой и открывается. */}
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background px-4 py-3 md:hidden">
          <SidebarTrigger />
          <span className="text-[15px] font-extrabold tracking-[-0.04em]">
            limeui
          </span>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
```

- [ ] **Шаг 3: Переписать `src/demo/DashboardDemo.tsx`**

Удалить всё, что переехало в `DemoShell` (импорты сайдбара, `NAV`, `ACTIVE`, разметку каркаса). Оставить данные графика, `TOTAL`, `money` и содержимое страницы. Файл начинает возвращать:

```tsx
export default function DashboardDemo() {
  return (
    <DemoShell active="Выплаты">
      <div className="mx-auto w-full max-w-[1320px] px-6 py-8 lg:px-10 lg:py-10">
        {/* содержимое страницы без изменений */}
      </div>
    </DemoShell>
  )
}
```

Внимание: `TOTAL` в дашборде вычисляется из данных графика и равен 150000; в `DemoShell` баланс задан константой `BALANCE = 150000`. Значение сознательно продублировано — сайдбар не должен зависеть от данных конкретной страницы. Если числа разойдутся, править `BALANCE`.

Неиспользуемые импорты обязательно удалить: в `tsconfig` включён `noUnusedLocals`, и лишний импорт роняет сборку с TS6133.

- [ ] **Шаг 4: Доказать, что внешний вид не изменился**

```bash
pnpm exec tsc -b
pnpm exec vite build --outDir /tmp/limeui-shell-after --emptyOutDir >/dev/null 2>&1 && cp /tmp/limeui-shell-after/assets/*.css /tmp/limeui-shell-after.css
node --input-type=module -e '
import {readFileSync} from "fs";
const leaf=(p)=>{const c=readFileSync(p,"utf8"),m=new Map();
 for(const x of c.matchAll(/([^{}]+)\{([^{}]*)\}/g))m.set(x[1].trim(),x[2].trim());return m;};
const a=leaf("/tmp/limeui-shell-before.css"),b=leaf("/tmp/limeui-shell-after.css");
const del=[...a.keys()].filter(k=>!b.has(k)),add=[...b.keys()].filter(k=>!a.has(k));
const chg=[...a.keys()].filter(k=>b.has(k)&&b.get(k)!==a.get(k));
console.log("удалено:",del.length,"добавлено:",add.length,"изменено:",chg.length);
del.concat(add).concat(chg).forEach(s=>console.log("  ",s.slice(0,110)));'
```

Ожидается: `удалено: 0 добавлено: 0 изменено: 0`. Любое расхождение означает, что при переносе изменились классы — найти и вернуть как было.

- [ ] **Шаг 5: Коммит**

```bash
git add src/demo/DemoShell.tsx src/demo/DashboardDemo.tsx
git commit -m "limeui: вынести дашборд-каркас в DemoShell"
```

---

### Task 7: Демо-страница «Сообщения»

**Files:**
- Create: `src/demo/MessagesDemo.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `DemoShell`; все пять новых итемов; `Avatar`, `AvatarFallback`; `Eyebrow`, `Num`; `Chip`

- [ ] **Шаг 1: Создать `src/demo/MessagesDemo.tsx`**

Страница состоит из трёх частей: список диалогов слева (от `xl`), шапка диалога, лента и композер справа. Прокручивается только лента — высота набирается флексом, фиксированных пикселей нет.

```tsx
import { useState } from "react"

import { Avatar, AvatarFallback } from "@/registry/limeui/ui/avatar"
import {
  ConversationBadge,
  ConversationBody,
  ConversationItem,
  ConversationList,
  ConversationMeta,
  ConversationPreview,
  ConversationTitle,
} from "@/registry/limeui/ui/conversation-list"
import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageTime,
  MessageTyping,
} from "@/registry/limeui/ui/message"
import { MessageComposer } from "@/registry/limeui/ui/message-composer"
import { MessageList } from "@/registry/limeui/ui/message-list"
import { MessageSeparator } from "@/registry/limeui/ui/message-separator"
import { Eyebrow } from "@/registry/limeui/ui/typography"
import DemoShell from "@/demo/DemoShell"

type ChatMessage = {
  id: number
  author: "them" | "me" | "system"
  initials?: string
  text: string
  time: string
}

const CONVERSATIONS = [
  { id: 1, name: "Gloox", initials: "GX", preview: "Отлично, тогда ждём черновик", time: "14:32", unread: 0 },
  { id: 2, name: "Luminary", initials: "LM", preview: "Прислали бриф на октябрь", time: "12:05", unread: 3 },
  { id: 3, name: "Поддержка", initials: "ПД", preview: "Реквизиты подтверждены", time: "вчера", unread: 0 },
  { id: 4, name: "Nord Studio", initials: "NS", preview: "Можем обсудить ставку?", time: "11 авг", unread: 1 },
]

const HISTORY: ChatMessage[] = [
  { id: 1, author: "system", text: "Кампания «Gloox — ИИ-тренер» началась 10 августа", time: "" },
  { id: 2, author: "them", initials: "GX", text: "Привет! Видели ваш последний ролик — заходит очень хорошо.", time: "14:02" },
  { id: 3, author: "them", initials: "GX", text: "Хотим предложить вам кампанию на сентябрь. Ставка 150 ₽ за 1000 просмотров.", time: "14:03" },
  { id: 4, author: "me", text: "Привет! Спасибо. Звучит интересно — какой объём планируется?", time: "14:15" },
  { id: 5, author: "me", text: "И есть ли ограничения по формату?", time: "14:15" },
  { id: 6, author: "them", initials: "GX", text: "Четыре ролика в месяц, вертикаль до 60 секунд. Сценарий свободный, только логотип в конце.", time: "14:28" },
  { id: 7, author: "me", text: "Тогда давайте попробуем. Пришлю черновик первого до пятницы.", time: "14:31" },
  { id: 8, author: "them", initials: "GX", text: "Отлично, тогда ждём черновик 🙌", time: "14:32" },
]

export default function MessagesDemo() {
  const [messages, setMessages] = useState(HISTORY)
  const [activeChat, setActiveChat] = useState(1)

  function send(text: string) {
    setMessages((current) => [
      ...current,
      {
        id: current.length + 1,
        author: "me",
        text,
        time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ])
  }

  return (
    <DemoShell active="Сообщения">
      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[300px_1fr]">
        <aside className="hidden min-h-0 flex-col border-r border-border xl:flex">
          <div className="border-b border-border px-4 py-4">
            <Eyebrow>Диалоги</Eyebrow>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <ConversationList>
              {CONVERSATIONS.map((chat) => (
                <ConversationItem
                  key={chat.id}
                  isActive={chat.id === activeChat}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <Avatar size="sm">
                    <AvatarFallback>{chat.initials}</AvatarFallback>
                  </Avatar>
                  <ConversationBody>
                    <ConversationTitle>{chat.name}</ConversationTitle>
                    <ConversationPreview>{chat.preview}</ConversationPreview>
                  </ConversationBody>
                  <ConversationMeta>
                    <span>{chat.time}</span>
                    {chat.unread > 0 && (
                      <ConversationBadge value={chat.unread} />
                    )}
                  </ConversationMeta>
                </ConversationItem>
              ))}
            </ConversationList>
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col">
          <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3.5 lg:px-6">
            <Avatar size="sm">
              <AvatarFallback>GX</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold">
                Gloox
              </span>
              <span className="block truncate text-[12px] text-muted-foreground">
                Кампания «ИИ-тренер» · онлайн
              </span>
            </span>
          </header>

          <MessageList scrollButtonLabel="К последним сообщениям">
            <MessageSeparator>12 августа</MessageSeparator>

            {messages.map((message, index) => {
              if (message.author === "system") {
                return (
                  <MessageBubble key={message.id} variant="system">
                    {message.text}
                  </MessageBubble>
                )
              }

              const mine = message.author === "me"
              const showUnread = index === 6

              return (
                <div key={message.id}>
                  {showUnread && (
                    <MessageSeparator variant="unread" className="mb-5">
                      Непрочитанные
                    </MessageSeparator>
                  )}
                  <Message align={mine ? "end" : "start"}>
                    <MessageAvatar>
                      <Avatar size="sm">
                        <AvatarFallback>
                          {mine ? "АС" : message.initials}
                        </AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
                    <MessageContent>
                      <MessageBubble variant={mine ? "outgoing" : "incoming"}>
                        {message.text}
                      </MessageBubble>
                      <MessageFooter>
                        <MessageTime>{message.time}</MessageTime>
                      </MessageFooter>
                    </MessageContent>
                  </Message>
                </div>
              )
            })}

            <MessageGroup>
              <Message>
                <MessageAvatar>
                  <Avatar size="sm">
                    <AvatarFallback>GX</AvatarFallback>
                  </Avatar>
                </MessageAvatar>
                <MessageContent>
                  <MessageTyping label="Собеседник печатает" />
                </MessageContent>
              </Message>
            </MessageGroup>
          </MessageList>

          <div className="shrink-0 border-t border-border px-4 py-3.5 lg:px-6">
            <MessageComposer
              onSend={send}
              placeholder="Написать сообщение…"
              sendLabel="Отправить"
            />
          </div>
        </section>
      </div>
    </DemoShell>
  )
}
```

- [ ] **Шаг 2: Проверить, что страница занимает всю высоту**

`SidebarInset` в реестре объявлен как `flex flex-1 flex-col`. Чтобы сетка страницы растянулась, ей нужны `min-h-0 flex-1` — они уже проставлены в разметке выше. Если лента не прокручивается, а тянет страницу, искать пропущенный `min-h-0` в цепочке от `SidebarInset` до `MessageList`.

- [ ] **Шаг 3: Добавить третью вкладку в `src/App.tsx`**

Добавить импорт `MessagesDemo`, третий `SegmentedControlItem` со значением `messages` и ветку рендера. Тернарный оператор заменить на явное сопоставление, чтобы третья ветка не превратилась во вложенный тернарник:

```tsx
{view === "dashboard" && <DashboardDemo />}
{view === "messages" && <MessagesDemo />}
{view === "components" && (
  <div className="mx-auto max-w-4xl space-y-10 p-8">
    <ComponentsDemo />
  </div>
)}
```

- [ ] **Шаг 4: Собрать и проверить**

```bash
pnpm exec tsc -b && pnpm build
```

- [ ] **Шаг 5: Коммит**

```bash
git add src/demo/MessagesDemo.tsx src/App.tsx
git commit -m "limeui: демо-страница «Сообщения»"
```

---

### Task 8: Проверка в браузере

Задача без правок кода — только проверка и, если найдётся расхождение, точечный фикс.

**Files:** правки по результатам, файлы заранее не известны

- [ ] **Шаг 1: Запустить дев-сервер**

```bash
pnpm dev --port 5211
```

- [ ] **Шаг 2: Проверить список**

На вкладке «Сообщения», ширина 1440px, обе темы:

1. Прокручивается **только** лента; шапка диалога и композер не уезжают.
2. При открытии лента показана снизу, на последних сообщениях.
3. Отправка через кнопку добавляет сообщение и прокручивает вниз.
4. Enter отправляет, Shift+Enter переносит строку и растит поле.
5. Поле перестаёт расти после шестой строки и начинает прокручиваться.
6. Пустое поле — кнопка отправки неактивна.
7. Отлистать вверх: кнопка «вниз» появляется; нажать — лента возвращается вниз плавно, кнопка исчезает.
8. Отлистать вверх и отправить сообщение — лента **не** должна дёрнуться вниз.
9. Наведение на активный диалог не осветляет его фон.
10. Индикатор набора анимируется.

Ширина 400px: список диалогов скрыт, лента и композер помещаются, сайдбар открывается кнопкой в мобильной шапке.

- [ ] **Шаг 3: Проверить, что дашборд не изменился**

Переключиться на вкладку «Дашборд» в обеих темах и сравнить со скриншотом до задачи 6. Свернуть и развернуть сайдбар.

- [ ] **Шаг 4: Проверить доступные имена**

```js
// в консоли браузера
[...document.querySelectorAll('button')].filter(b => !b.textContent.trim() && !b.getAttribute('aria-label'))
```

Ожидается пустой массив: кнопок без текста и без доступного имени быть не должно.

- [ ] **Шаг 5: Зафиксировать найденное**

Если пункты 1-10 прошли — двигаться дальше. Каждое расхождение чинится и перепроверяется до перехода к задаче 9.

---

### Task 9: Проверка доставки в чистом проекте-потребителе

- [ ] **Шаг 1: Поднять реестр статикой**

```bash
cd "$(git rev-parse --show-toplevel)" && python3 -m http.server 8099 --directory r &
```

- [ ] **Шаг 2: Собрать чистый проект**

```bash
cd "$TMPDIR" && rm -rf limeui-chat-check && pnpm create vite limeui-chat-check --template react-ts && cd limeui-chat-check && pnpm install
```

Дальше подготовить проект так, как требует README: `@import "tailwindcss";` в главном CSS, плагин `@tailwindcss/vite`, алиас `@` в `vite.config.ts`, `paths` в обоих `tsconfig`. Затем `pnpm dlx shadcn@latest init -b radix -p nova -y`.

- [ ] **Шаг 3: Поставить компоненты чата**

```bash
pnpm dlx shadcn@latest registry add "@limeui=http://localhost:8099/{name}.json"
pnpm dlx shadcn@latest add @limeui/message @limeui/message-list @limeui/message-composer @limeui/conversation-list @limeui/message-separator
```

- [ ] **Шаг 4: Проверить четыре вещи**

1. Все пять файлов приехали в `src/components/ui/`, импорты внутри переписаны на алиасы потребителя.
2. Приехали транзитивные зависимости: `avatar`, `typography`, `button`, `textarea`, `theme`.
3. В главном CSS появился блок `@keyframes limeui-typing-bounce`.
4. Проект-потребитель собирается: `pnpm build`.

- [ ] **Шаг 5: Прибрать**

```bash
kill %1
cd "$TMPDIR" && rm -rf limeui-chat-check
```

Результат каждой из четырёх проверок записать в отчёт дословно, вместе с выводом команд.

---

### Task 10: Документация и финальная сборка

**Files:**
- Modify: `CLAUDE.md` (правила 9 и 10)
- Modify: `README.md` (состав, число итемов, раздел про чат)

- [ ] **Шаг 1: Уточнить правило 9 в `CLAUDE.md`**

Заменить текущий текст правила 9 на формулировку, где директива клиентского компонента привязана к владению состоянием, рефами или контекстом, и перечислены три файла: `sidebar.tsx`, `message-list.tsx`, `message-composer.tsx`. Указать, что список исчерпывающий и сверяется командой поиска по каталогу реестра.

- [ ] **Шаг 2: Дополнить правило 10 в `CLAUDE.md`**

Добавить `DemoShell.tsx` как общий каркас и `MessagesDemo.tsx` как третью страницу. Отметить, что примитивы чата показаны именно там, а не в витрине компонентов, потому что вне каркаса не видно ни прокрутки на полную высоту, ни автоскролла.

- [ ] **Шаг 3: Обновить `README.md`**

- число итемов: 31 → 36, число компонентов 29 → 34
- в таблицу состава добавить строку про примитивы чата с пятью именами
- короткий раздел про чат по образцу раздела про дашборд: что делает `message-list`, почему не взят апстримовый скроллер, что композер отправляет по Enter

- [ ] **Шаг 4: Финальная сборка и сверка**

```bash
pnpm build && pnpm build:registry && git status --short
```

Ожидается: сборка проходит; `pnpm build:registry` не оставляет несохранённых изменений в `registry.json` и `r/` после коммитов предыдущих задач; в списке изменённых нет файлов вне объёма плана.

- [ ] **Шаг 5: Коммит**

```bash
git add CLAUDE.md README.md registry.json r/
git commit -m "limeui: документация примитивов чата"
```

---

## Самопроверка плана

**Покрытие спеки.** Пять итемов — задачи 1-5. Вынос каркаса — задача 6. Демо-страница — задача 7. Пункты проверки 1-5 из спеки — задачи 1-8. Пункт 6 (установка в чистого потребителя) — задача 9. Уточнение правила 9 — задача 10. Разделы «Не входит в объём» соблюдены: ни вложений, ни цитат, ни статусов доставки, ни реакций, ни виртуализации в задачах нет.

**Заглушки.** Все шаги содержат либо готовый код, либо точную команду с ожидаемым выводом. Единственный шаг без готового кода — задача 10, где правки документации описаны словами: там переписываются существующие абзацы, и дословное дублирование правил в план вернуло бы имена классов в текст, что запрещено глобальным ограничением.

**Согласованность типов.** `MessageBubble` принимает `variant` из трёх значений — так же он вызывается в задаче 7. `ConversationBadge` наследует пропсы `Num`, поэтому в демо ему передаётся `value`, а не дети. `MessageComposer` требует `onSend`, и демо его передаёт. `DemoShell` принимает `active: string`, оба вызова передают строку из `NAV`. `MessageList` принимает `scrollButtonLabel`, демо передаёт русскую строку. Экспорт `ConversationBody` объявлен в задаче 3 и используется в задаче 7.

**Валидность разметки.** Всё содержимое `ConversationItem` — фразовый контент (`span` с `block` или `flex`), потому что внутри `button` блочные элементы невалидны. По этой же причине в демо строка диалога собирается из `ConversationBody`, а не из произвольной обёртки.

**Известный риск.** Задача 6 — единственная, где легко незаметно изменить внешний вид. Поэтому она содержит обязательную сверку собранного CSS с нулевым допуском, а не визуальную проверку на глаз.

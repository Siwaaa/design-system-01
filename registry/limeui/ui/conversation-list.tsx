import * as React from "react"

import { cn } from "@/lib/utils"
import { Num } from "@/registry/limeui/ui/typography"

function ConversationList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="conversation-list"
      className={cn("flex w-full min-w-0 flex-col", className)}
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
    <li
      data-slot="conversation-item"
      className={cn(
        // раскладка
        "relative min-w-0",
        // разделитель. Линия принадлежит пункту списка, а не кнопке: заливка
        // состояния занимает пункт целиком, и линия на самой кнопке легла бы
        // поверх этой заливки. Отступ слева выводит линию из-под колонки
        // аватаров (px-3 + size-8 + gap-3), чтобы она начиналась под текстом.
        "before:absolute before:top-0 before:start-14 before:end-0 before:h-px before:bg-border-mute first:before:hidden"
      )}
    >
      <button
        type="button"
        data-slot="conversation-item-button"
        data-active={isActive}
        aria-current={isActive ? "true" : undefined}
        className={cn(
          // раскладка
          "flex w-full min-w-0 items-center gap-3 px-3 py-2.5 text-left",
          // оформление — заливка без скругления: пункты идут вплотную,
          // и скруглённые углы отрывались бы от разделительных линий
          "outline-hidden transition-colors",
          // состояния. Оба уровня непрозрачны: доля непрозрачности смешала бы
          // заливку с белой панелью под ней и осветлила бы пункт вместо того,
          // чтобы его выделить. `data-active:hover:*` обязателен — псевдокласс
          // hover специфичнее именованного data-варианта и иначе перекрыл бы
          // активный фон.
          "hover:bg-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring data-active:bg-accent data-active:hover:bg-accent",
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
        // раскладка
        "block truncate",
        // оформление
        "text-[13px] font-medium text-foreground",
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
        // раскладка
        "block truncate",
        // оформление
        "text-[12px] text-muted-foreground",
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

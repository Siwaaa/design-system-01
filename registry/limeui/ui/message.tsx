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

"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { eyebrowVariants } from "@/registry/limeui/ui/typography"

// Поле формы, которое сворачивается в одну строку. Живёт отдельно от field.tsx:
// тот не владеет состоянием и остаётся серверным, а сворачивание требует
// клиентской директивы — см. CLAUDE.md, правило 9.
function FieldCollapsible({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="field-collapsible"
      className={cn("flex w-full min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

// Заголовок кликабелен целиком. Метка здесь — текст, а не label: label внутри
// кнопки конфликтует по поведению, браузер переносит фокус на связанный
// контрол, и это спорит с раскрытием. Настоящий label остаётся в содержимом.
function FieldCollapsibleTrigger({
  className,
  children,
  summary,
  required = false,
  emptyLabel = "<empty>",
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger> & {
  summary?: React.ReactNode
  required?: boolean
  emptyLabel?: string
}) {
  // Пустая строка, ноль детей и пробел одинаково означают «значение не задано»
  const hasSummary =
    summary !== undefined &&
    summary !== null &&
    summary !== false &&
    !(typeof summary === "string" && summary.trim() === "")

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="field-collapsible-trigger"
      className={cn(
        // раскладка
        "group/field-collapsible-trigger flex w-full min-w-0 items-center gap-2.5 text-left",
        // оформление
        "cursor-pointer rounded-sm outline-hidden",
        // состояния
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          // раскладка
          "flex size-6 shrink-0 items-center justify-center",
          // оформление
          "rounded-sm bg-secondary text-muted-foreground transition-colors",
          // состояния — заливка идёт вниз от белого, как у прочих состояний
          "group-hover/field-collapsible-trigger:bg-accent"
        )}
      >
        <ChevronRight
          className="size-3.5 transition-transform duration-150 group-data-[state=open]/field-collapsible-trigger:rotate-90 motion-reduce:transition-none"
        />
      </span>

      <span className={cn(eyebrowVariants({ size: "default" }), "min-w-0 truncate text-foreground")}>
        {children}
        {required && (
          // Глиф декоративен: обязательность скринридер берёт из атрибута
          // required на самом контроле, дублировать её звёздочкой не нужно.
          <span aria-hidden className="ml-0.5 text-destructive">
            *
          </span>
        )}
      </span>

      {/* Сводка видна только в свёрнутом виде. Показ решает data-state,
          который Radix ставит на триггер, — без контекста и без ветвления. */}
      <span
        data-slot="field-collapsible-summary"
        data-empty={!hasSummary}
        className={cn(
          // раскладка
          "min-w-0 flex-1 truncate",
          // оформление
          "text-[12px] text-muted-foreground",
          // состояния
          "group-data-[state=open]/field-collapsible-trigger:hidden"
        )}
      >
        {hasSummary ? summary : emptyLabel}
      </span>
    </CollapsiblePrimitive.Trigger>
  )
}

// Без анимации высоты намеренно: она потребовала бы keyframes, а реестр
// раздаёт только переменные темы — у потребителей кадры бы не приехали.
function FieldCollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="field-collapsible-content"
      className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}
      {...props}
    />
  )
}

export { FieldCollapsible, FieldCollapsibleTrigger, FieldCollapsibleContent }

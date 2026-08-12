import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Geist Mono в limeui семантический, а не декоративный. Eyebrow — микро-лейбл
// над секцией, карточкой или шапкой таблицы; полный список мест, где mono
// ставится вручную, — в CLAUDE.md, правило 8.
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

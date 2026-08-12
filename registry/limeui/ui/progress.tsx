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
  max = 100,
  size,
  tone = "default",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants> & {
    tone?: "default" | "primary"
  }) {
  // Те же условия, по которым Radix выставляет data-state="indeterminate",
  // — так вид полосы никогда не расходится с тем, что читает скринридер.
  const determinate =
    typeof value === "number" &&
    Number.isFinite(value) &&
    max > 0 &&
    value >= 0 &&
    value <= max
  // Доля считается от max, а не от жёсткой сотни: при max={200} и value={100}
  // полоса должна быть заполнена наполовину, как и говорит aria-valuenow.
  // Отсечение не нужно — determinate уже гарантирует 0 <= value <= max,
  // а всё, что вне диапазона, Radix сам переводит в indeterminate.
  const percent = determinate ? (value / max) * 100 : 0

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressVariants({ size, className }))}
      value={value}
      max={max}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "size-full flex-1 rounded-pill transition-transform duration-300 ease-out",
          tone === "primary" ? "bg-primary" : "bg-foreground",
          // Без отдельного вида indeterminate выглядел бы ровно как 0%:
          // «идёт загрузка» и «ничего не сделано» — разные состояния.
          "data-[state=indeterminate]:w-1/3 data-[state=indeterminate]:animate-[limeui-progress-slide_1.2s_ease-in-out_infinite] data-[state=indeterminate]:transition-none",
          // Специфичность data-[state=indeterminate]:animate-[…] равна 0,2,0
          // и без важности перебила бы этот сброс — медиазапрос приоритета
          // не добавляет, оба правила лежат в одном @layer utilities.
          "motion-reduce:animate-none!"
        )}
        style={
          determinate ? { transform: `translateX(-${100 - percent}%)` } : undefined
        }
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress, progressVariants }

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
              className={cn(
                // раскладка
                "group relative flex-1 self-stretch border-0 bg-transparent p-0",
                // состояния — палец только когда столбец действительно нажимаем:
                // без обработчика это не кнопка по смыслу, а разметка графика
                onBarClick && "cursor-pointer",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              )}
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

import * as React from "react"

import { cn } from "@/lib/utils"
import { Num } from "@/registry/limeui/ui/typography"

function DataList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-list"
      // Заявленное исключение из правила поверхностей: единственный блок,
      // который остаётся заливкой на полотне, а не белой карточкой с
      // границей. Интерактива внутри нет, поэтому порог различения к нему
      // не применяется — см. CLAUDE.md, правило 14.
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

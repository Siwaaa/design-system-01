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

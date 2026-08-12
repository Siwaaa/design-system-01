import * as React from "react"

import { cn } from "@/lib/utils"

function EmptyState({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-5 py-10 text-center text-[13px] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-icon"
      className={cn(
        "text-foreground-subtle [&_svg]:size-6 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-title"
      className={cn("text-[14px] font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function EmptyStateDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-state-description"
      className={cn("max-w-[46ch] text-[13px] text-muted-foreground", className)}
      {...props}
    />
  )
}

export { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription }

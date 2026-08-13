import * as React from "react"

import { cn } from "@/lib/utils"
import { Eyebrow } from "@/registry/limeui/ui/typography"

function MessageSeparator({
  className,
  variant = "day",
  children,
  ...props
}: React.ComponentProps<"div"> & { variant?: "day" | "unread" }) {
  const line = variant === "unread" ? "bg-primary" : "bg-border"

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

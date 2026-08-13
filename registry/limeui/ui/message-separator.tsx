import * as React from "react"

import { cn } from "@/lib/utils"
import { Eyebrow } from "@/registry/limeui/ui/typography"

// Доступное имя роли separator берётся из собственного содержимого — узел
// может быть строкой, числом или деревом элементов (Eyebrow оборачивает
// children ниже), поэтому текст вытаскивается рекурсивно.
function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (React.isValidElement(node)) {
    const { children } = node.props as { children?: React.ReactNode }
    return extractText(children)
  }
  return ""
}

function MessageSeparator({
  className,
  variant = "day",
  children,
  ...props
}: React.ComponentProps<"div"> & { variant?: "day" | "unread" }) {
  const line = variant === "unread" ? "bg-primary" : "bg-border"
  const label = extractText(children) || undefined

  return (
    <div
      data-slot="message-separator"
      data-variant={variant}
      role="separator"
      aria-label={label}
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

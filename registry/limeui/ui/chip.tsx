import * as React from "react"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Chip({
  className,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root>) {
  return (
    <TogglePrimitive.Root
      data-slot="chip"
      className={cn(
        // раскладка
        "inline-flex items-center gap-1.5 px-3.5 py-1.5",
        // оформление
        "rounded-pill border border-border bg-secondary text-sm font-medium tracking-tight text-foreground outline-none transition-colors",
        // состояния — нажатый чип инвертируется в чёрную плашку
        "hover:bg-accent disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background",
        className
      )}
      {...props}
    />
  )
}

export { Chip }

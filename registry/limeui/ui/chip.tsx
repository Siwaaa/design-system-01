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
        "inline-flex items-center gap-1.5 rounded-pill border border-border bg-secondary px-3.5 py-1.5 text-sm font-medium tracking-tight text-foreground outline-none transition-colors hover:bg-secondary/70 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )
}

export { Chip }

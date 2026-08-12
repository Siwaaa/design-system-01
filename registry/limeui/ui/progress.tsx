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
  size,
  tone = "default",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants> & {
    tone?: "default" | "primary"
  }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressVariants({ size, className }))}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "size-full flex-1 rounded-pill transition-transform duration-300 ease-out",
          tone === "primary" ? "bg-primary" : "bg-foreground"
        )}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress, progressVariants }

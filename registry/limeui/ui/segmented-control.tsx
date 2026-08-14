import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function SegmentedControl({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="segmented-control"
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-pill border border-border-strong bg-secondary p-1.5",
        className
      )}
      {...props}
    />
  )
}

function SegmentedControlItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="segmented-control-item"
      className={cn(
        // раскладка
        "px-4 py-2",
        // оформление
        "cursor-pointer rounded-pill text-sm font-semibold tracking-tight text-foreground outline-none transition-colors",
        // состояния — выбранный сегмент инвертируется в чёрную плашку
        "disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=checked]:bg-foreground data-[state=checked]:text-background",
        className
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  )
}

export { SegmentedControl, SegmentedControlItem }

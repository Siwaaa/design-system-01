import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// min-h идёт по тому же шагу плотности, что высота у Button/Input/Select
// (sm/default/lg), но не равна их h-11/h-13/h-14: текстовая область растёт
// вместе с содержимым, а min-h задаёт только стартовую высоту в несколько строк.
const textareaVariants = cva(
  [
    // раскладка
    "flex w-full",
    // оформление
    "rounded-md border border-border bg-secondary text-foreground outline-none transition-colors placeholder:text-muted-foreground",
    // состояния
    "disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:outline-destructive",
  ],
  {
    variants: {
      size: {
        default: "min-h-24 px-3.5 py-2.5 text-base",
        sm: "min-h-16 px-3 py-2 text-sm",
        lg: "min-h-32 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Textarea({
  className,
  size,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }

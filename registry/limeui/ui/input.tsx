import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Высоты — тот же шаг sm/default/lg, что у Button, SelectTrigger и Textarea:
// h-11/h-13/h-14. Значения дублируются в каждом файле по числу, а не через
// общую переменную, потому что реестр раздаёт компоненты поодиночке —
// см. CLAUDE.md.
const inputVariants = cva(
  [
    // раскладка
    "flex w-full min-w-0",
    // оформление
    "rounded-lg border border-border bg-secondary text-foreground outline-none transition-colors placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
    // кнопка выбора файла у type="file"
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    // состояния
    "disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:outline-destructive",
  ],
  {
    variants: {
      size: {
        default: "h-13 px-4 text-base",
        sm: "h-11 px-3.5 text-sm",
        lg: "h-14 px-5 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Input({
  className,
  type,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  // Нативный HTML-атрибут `size` (число видимых символов) у `<input>`
  // отключён намеренно: имя занято под шаг плотности sm/default/lg,
  // как у Button, SelectTrigger и Textarea.
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }

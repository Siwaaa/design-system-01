import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    // раскладка
    "inline-flex items-center justify-center gap-2 whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    // оформление
    "cursor-pointer rounded-pill text-sm font-semibold tracking-tight select-none transition-colors",
    // состояния
    "disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  ],
  {
    variants: {
      variant: {
        // Единственная тень в покое-адъяцентном состоянии во всём реестре:
        // подъём основной кнопки на hover — заявленное исключение из правила 7.
        default: [
          "bg-primary text-primary-foreground",
          "transition-[transform,box-shadow,filter] duration-150 ease-out",
          "hover:brightness-95 hover:-translate-y-px hover:shadow-[0_8px_20px_-8px_rgb(12_12_11_/_0.22)] active:translate-y-0 active:scale-[0.97] active:shadow-none",
        ],
        // Оба состояния — отдельные уровни шкалы, а не доля непрозрачности
        // базовой заливки: такая доля смешивается с подложкой и на светлой
        // поверхности осветляла кнопку при нажатии до цвета полотна.
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent active:bg-border-strong",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-accent",
        ghost: "bg-transparent text-foreground hover:bg-accent",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-95",
        link: "bg-transparent text-foreground underline-offset-4 hover:underline",
      },
      // Высоты по шагам sm/default/lg — h-11/h-13/h-14 — общий с Input,
      // SelectTrigger и Textarea шаг: значения фиксированы, а не выведены из
      // общей переменной, потому что реестр раздаёт файлы поодиночке и
      // каждый компонент можно поставить без остальных — см. CLAUDE.md.
      size: {
        default: "h-13 px-6 text-base",
        sm: "h-11 px-4 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "size-11 shrink-0 px-0",
        "icon-sm": "size-8 shrink-0 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

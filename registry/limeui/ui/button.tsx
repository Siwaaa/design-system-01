import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Утапливание под нажатием. В базу класса не идёт: единственный вариант без
// него — `link`, и гасить его пришлось бы встречным правилом того же веса,
// где исход решает порядок в собранном CSS, а не намерение. Проверено — там
// побеждала база, и ссылка утапливалась вопреки правилу. Поэтому отклик
// раздаётся вариантам поимённо.
// Нажатие идёт вдвое быстрее наведения: отклик на собственное действие должен
// успевать за пальцем, а возврат остаётся плавным. Одна длительность на обе
// стороны читается как задержка интерфейса.
const PRESS = "active:scale-[0.97] active:duration-75"

// Подъём с тенью — только у вариантов с непрозрачным фоном: под прозрачной
// кнопкой тень висела бы сама по себе, без видимого тела. Гашение у
// выключенной кнопки идёт тут же — `pointer-events-none` наведение и так не
// пускает, но правило переживёт и возврат событий.
const LIFT = [
  "hover:-translate-y-px hover:shadow-[0_8px_20px_-8px_rgb(12_12_11_/_0.22)]",
  "active:translate-y-0 active:shadow-none",
  "disabled:hover:translate-y-0 disabled:hover:shadow-none",
].join(" ")

const buttonVariants = cva(
  [
    // раскладка
    "inline-flex items-center justify-center gap-2 whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    // оформление
    "cursor-pointer rounded-pill text-sm font-semibold tracking-tight select-none",
    // `will-change` заранее кладёт кнопку на свой слой, чтобы трансформация
    // не тянула за собой перерисовку соседей
    "transition-[transform,opacity,background-color,filter,box-shadow] duration-150 ease-out will-change-transform",
    // состояния
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground hover:brightness-95",
          PRESS,
          LIFT,
        ],
        // Оба состояния — отдельные уровни шкалы, а не доля непрозрачности
        // базовой заливки: такая доля смешивается с подложкой и на светлой
        // поверхности осветляла кнопку при нажатии до цвета полотна.
        secondary: [
          "bg-secondary text-secondary-foreground hover:bg-accent active:bg-border-strong",
          PRESS,
          LIFT,
        ],
        // Тело непрозрачно ради того же подъёма: у варианта с прозрачным
        // фоном тень оказалась бы висящей в воздухе.
        outline: [
          "border border-border-strong bg-card text-foreground hover:bg-secondary active:bg-accent",
          PRESS,
          LIFT,
        ],
        destructive: [
          "bg-destructive text-destructive-foreground hover:brightness-95 active:brightness-90",
          PRESS,
          LIFT,
        ],
        // Прозрачный вариант подъёма и тени не получает — утапливания хватает.
        ghost: [
          "bg-transparent text-foreground hover:bg-accent active:bg-border-strong",
          PRESS,
        ],
        // Ссылка не утапливается и не поднимается: двигать текстовую ссылку
        // неправильно, нажатие обозначается цветом.
        link: "bg-transparent text-foreground underline-offset-4 hover:underline active:text-muted-foreground",
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

import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  [
    // раскладка — иконка слева и слот действия справа добавляют колонки
    "relative grid w-full grid-cols-[0_1fr] gap-y-0.5 px-4 py-3.5 has-[>svg]:grid-cols-[16px_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5",
    "has-[>[data-slot=alert-action]]:grid-cols-[0_1fr_auto] has-[>[data-slot=alert-action]]:items-center has-[>svg]:has-[>[data-slot=alert-action]]:grid-cols-[16px_1fr_auto]",
    // зазор перед слотом действия: без иконки первая колонка сетки нулевая,
    // общий gap сетки добавил бы лишний отступ и перед текстом — поэтому
    // зазор ставится отступом на самом слоте, а не через gap сетки; когда
    // иконка есть, gap сетки уже даёт нужный отступ, поэтому отступ гасится
    "has-[>[data-slot=alert-action]]:[&>[data-slot=alert-action]]:ml-3 has-[>svg]:has-[>[data-slot=alert-action]]:[&>[data-slot=alert-action]]:ml-0",
    // оформление
    "rounded-lg border border-border bg-secondary text-sm [&>svg]:text-foreground",
  ],
  {
    variants: {
      variant: {
        default: "bg-secondary text-foreground",
        // Фон из слоя индикаторов (-soft), текст и иконка — из текстового
        // слоя: он единственный держит контраст 4.5:1 на этих подложках.
        // Описание на цветной плашке наследует цвет варианта, а не остаётся
        // приглушённо-серым: серый на подложке под ошибку давал 3.94:1.
        // Иерархию заголовка держит начертание, а не цвет.
        success:
          "bg-success-soft text-success [&>svg]:text-success [&_[data-slot=alert-description]]:text-current",
        warning:
          "bg-warning-soft text-warning [&>svg]:text-warning [&_[data-slot=alert-description]]:text-current",
        destructive:
          "bg-destructive-soft text-destructive [&>svg]:text-destructive [&_[data-slot=alert-description]]:text-current",
        neutral:
          "bg-secondary text-neutral [&>svg]:text-neutral [&_[data-slot=alert-description]]:text-current",
        // Плотный фирменный тон — привлечение внимания, как у баннера klipni.
        primary: "border-primary bg-primary-soft text-foreground [&>svg]:text-foreground",
        // Приглушённый фирменный тон — встроенные пояснения внутри форм.
        "primary-muted":
          "rounded-md border-primary/30 bg-primary/[0.06] text-foreground [&>svg]:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

// Кликабельный слот у правого края. Сам Alert остаётся некликабельным:
// оборачивать контейнер со статусной ролью в ссылку — плохая семантика,
// вложенный интерактивный элемент сбивает скринридер. Через asChild сюда
// подставляется ссылка или кнопка потребителя.
function AlertAction({
  className,
  asChild = false,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  const finalType = asChild ? undefined : type

  return (
    <Comp
      data-slot="alert-action"
      {...(asChild ? {} : { type: finalType })}
      className={cn(
        // раскладка — встаёт в последнюю колонку сетки, во всю её высоту
        "col-start-3 row-span-full row-start-1 flex size-8 shrink-0 items-center justify-center self-center [&>svg]:size-4 [&>svg]:shrink-0",
        // оформление
        "rounded-pill text-current transition-colors outline-hidden",
        // состояния
        "hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction, alertVariants }

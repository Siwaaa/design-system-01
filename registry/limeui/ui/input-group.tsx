import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Слитая полоса «приставка + контрол + приставка»: иконка сервиса, выбор
// подключения и кнопка добавления читаются как один блок. Контур принадлежит
// группе, а не детям, — иначе каждое использование чинило бы вид классами.
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        // раскладка — высоту держит сама группа, та же, что у Input и Select.
        // Дети приводятся к ней принудительно: у Button собственная высота
        // задана таким же по весу классом, и без `!` победил бы порядок
        // правил в бандле, а не намерение — кнопка распирала полосу.
        "flex h-[52px] w-full min-w-0 items-stretch *:h-full!",
        // оформление — общая коробка, та же геометрия, что у Input и Select
        "overflow-hidden rounded-lg border border-border bg-card",
        // дети отдают свой контур группе: собственная рамка и радиус сняты,
        // а стыки между сегментами прорисованы левой границей соседа
        "*:rounded-none *:border-0 *:shadow-none",
        "*:not-first:border-s *:not-first:border-border",
        // контрол в середине занимает всё свободное место и не рвёт колонку
        "[&>[data-slot=input]]:min-w-0 [&>[data-slot=input]]:flex-1 [&>[data-slot=select-trigger]]:min-w-0 [&>[data-slot=select-trigger]]:flex-1",
        // фокус контрола внутри группы не должен обводить его отдельно —
        // обводку принимает на себя вся полоса
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
        "*:focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

// Приставка работает в двух режимах: собственная плашка (иконка сервиса на
// своём фоне) и, через asChild, место для настоящей кнопки — она должна
// остаться Button со своими состояниями и фокусом, а не перерисованным блоком.
function InputGroupAddon({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="input-group-addon"
      className={cn(
        // раскладка — высоту диктует контрол в середине, приставка тянется
        "flex shrink-0 items-center justify-center gap-2 self-stretch px-4",
        // оформление
        "text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon }

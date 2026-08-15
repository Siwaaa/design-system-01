import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // раскладка
        "peer inline-flex h-6 w-10 shrink-0 items-center",
        // оформление — прозрачная граница держит габарит наравне с Input
        "cursor-pointer rounded-pill border border-transparent bg-secondary transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out outline-none",
        // состояния
        "active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-5 rounded-pill bg-card transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

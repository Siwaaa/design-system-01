import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // раскладка
        "flex h-[52px] w-full min-w-0 px-4",
        // оформление
        "rounded-lg border border-border bg-secondary text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        // кнопка выбора файла у type="file"
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // состояния
        "disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:outline-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }

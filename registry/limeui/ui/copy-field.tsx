"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/limeui/ui/button"

function CopyField({
  className,
  value,
  label = "Copy",
  copiedLabel = "Copied",
  inputProps,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  value: string
  label?: string
  copiedLabel?: string
  // Доступное имя, id, name самого поля — потребитель адресует их сюда,
  // а не в остаточные пропсы обёртки: те уходят на внешний div.
  inputProps?: Omit<React.ComponentProps<"input">, "value" | "readOnly">
}) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Таймер сбрасывается при размонтировании: без этого обновление состояния
  // прилетело бы в уже снятый компонент.
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Буфер обмена недоступен без защищённого контекста или разрешения —
      // молча остаёмся в исходном состоянии, значение видно и выделяемо.
      return
    }
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      data-slot="copy-field"
      className={cn("relative w-full", className)}
      {...props}
    >
      <input
        data-slot="copy-field-input"
        {...inputProps}
        readOnly
        value={value}
        className={cn(
          // раскладка — правый отступ освобождает место под кнопку
          "h-12 w-full px-4 pr-11",
          // оформление — строка, которую копируют посимвольно, читается моноширинно
          "rounded-md border border-border bg-secondary font-mono text-[12.5px] text-foreground outline-none transition-colors",
          // состояния
          "focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          inputProps?.className
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={copy}
        aria-label={label}
        className="absolute top-1/2 right-1.5 -translate-y-1/2"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      {/* Подтверждение копирования для скринридера: визуальной смены иконки
          недостаточно, объявление нужно голосом. */}
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  )
}

export { CopyField }

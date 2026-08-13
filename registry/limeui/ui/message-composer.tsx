"use client"

import * as React from "react"
import { ArrowUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/limeui/ui/button"
import { Textarea } from "@/registry/limeui/ui/textarea"

function MessageComposer({
  className,
  onSend,
  placeholder = "Message…",
  disabled = false,
  maxRows = 6,
  sendLabel = "Send",
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit"> & {
  onSend: (value: string) => void
  placeholder?: string
  disabled?: boolean
  maxRows?: number
  sendLabel?: string
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = React.useState("")

  const trimmed = value.trim()
  const canSend = trimmed.length > 0 && !disabled

  // Авторост: высота сбрасывается перед замером, иначе scrollHeight
  // запомнит предыдущее, большее значение и поле никогда не уменьшится.
  React.useLayoutEffect(() => {
    const element = textareaRef.current
    if (!element) return

    element.style.height = "auto"

    const styles = getComputedStyle(element)
    const lineHeight = parseFloat(styles.lineHeight) || 24
    const vertical =
      parseFloat(styles.paddingTop) +
      parseFloat(styles.paddingBottom) +
      parseFloat(styles.borderTopWidth) +
      parseFloat(styles.borderBottomWidth)
    const maxHeight = lineHeight * maxRows + vertical

    element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`
    element.style.overflowY = element.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [value, maxRows])

  function send() {
    if (!canSend) return
    onSend(trimmed)
    setValue("")
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // isComposing защищает ввод через IME: во время подбора иероглифа или
    // диакритики Enter принадлежит редактору метода ввода, а не форме.
    if (event.key !== "Enter" || event.shiftKey) return
    if (event.nativeEvent.isComposing) return
    event.preventDefault()
    send()
  }

  return (
    <form
      data-slot="message-composer"
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
      className={cn(
        // раскладка
        "flex w-full items-end gap-2",
        className
      )}
      {...props}
    >
      <Textarea
        ref={textareaRef}
        value={value}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-0 resize-none py-3 text-[13px]"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!canSend}
        aria-label={sendLabel}
        className="shrink-0"
      >
        <ArrowUpIcon />
      </Button>
    </form>
  )
}

export { MessageComposer }

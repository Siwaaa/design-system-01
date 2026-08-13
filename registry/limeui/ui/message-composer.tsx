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
  textareaProps,
  textareaRef,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit"> & {
  onSend: (value: string) => void
  placeholder?: string
  disabled?: boolean
  maxRows?: number
  sendLabel?: string
  textareaProps?: Omit<React.ComponentProps<typeof Textarea>, "ref">
  textareaRef?: React.Ref<HTMLTextAreaElement>
}) {
  const innerTextareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Реф авторóста должен продолжать работать вместе с внешним рефом
  // потребителя, поэтому оба объединяются в один колбэк-реф.
  const setTextareaRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerTextareaRef.current = node
      if (typeof textareaRef === "function") {
        textareaRef(node)
      } else if (textareaRef) {
        ;(textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current =
          node
      }
    },
    [textareaRef]
  )

  const [value, setValue] = React.useState("")

  const trimmed = value.trim()
  const canSend = trimmed.length > 0 && !disabled

  // Авторост: высота сбрасывается перед замером, иначе scrollHeight
  // запомнит предыдущее, большее значение и поле никогда не уменьшится.
  React.useLayoutEffect(() => {
    const element = innerTextareaRef.current
    if (!element) return

    element.style.height = "auto"

    const styles = getComputedStyle(element)
    const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.5
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
    // Очистка делает кнопку отправки неактивной, а отключение сфокусированной
    // кнопки сбрасывает фокус на тело документа — возвращаем его в поле,
    // иначе клавиатурный пользователь после каждой отправки начинает обход
    // табом заново с начала страницы.
    innerTextareaRef.current?.focus()
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
        {...textareaProps}
        ref={setTextareaRef}
        value={value}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        className={cn("min-h-0 resize-none py-3 text-[13px]", textareaProps?.className)}
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

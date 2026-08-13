"use client"

import * as React from "react"
import { ArrowDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/limeui/ui/button"

function MessageList({
  className,
  children,
  scrollButtonLabel = "Scroll to latest",
  ...props
}: React.ComponentProps<"div"> & { scrollButtonLabel?: string }) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  const [atBottom, setAtBottom] = React.useState(true)
  // Зеркало состояния в рефе: колбэк MutationObserver создаётся один раз
  // и через замыкание видел бы навсегда первое значение atBottom.
  const atBottomRef = React.useRef(true)

  React.useEffect(() => {
    const viewport = viewportRef.current
    const sentinel = sentinelRef.current
    if (!viewport || !sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        atBottomRef.current = entry.isIntersecting
        setAtBottom(entry.isIntersecting)
      },
      { root: viewport, threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const content = contentRef.current
    if (!content) return

    // Автоскролл только когда пользователь уже внизу: иначе чтение истории
    // сбивалось бы каждым новым сообщением.
    const observer = new MutationObserver(() => {
      if (!atBottomRef.current) return
      sentinelRef.current?.scrollIntoView({ block: "end" })
    })
    observer.observe(content, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [])

  // Первый показ открывается на свежих сообщениях, без анимации.
  React.useEffect(() => {
    sentinelRef.current?.scrollIntoView({ block: "end" })
  }, [])

  return (
    <div
      data-slot="message-list"
      className={cn("relative flex min-h-0 flex-1 flex-col", className)}
      {...props}
    >
      <div
        ref={viewportRef}
        data-slot="message-list-viewport"
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-6"
      >
        <div ref={contentRef} className="flex flex-col gap-5">
          {children}
          <div ref={sentinelRef} aria-hidden className="h-px shrink-0" />
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        aria-label={scrollButtonLabel}
        onClick={() =>
          sentinelRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          })
        }
        inert={atBottom}
        className={cn(
          // раскладка
          "absolute bottom-4 left-1/2 -translate-x-1/2",
          // оформление — плавающий контрол несёт тень плавающего слоя
          "shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)] transition-opacity",
          // состояния
          atBottom && "pointer-events-none opacity-0"
        )}
      >
        <ArrowDownIcon />
      </Button>
    </div>
  )
}

export { MessageList }

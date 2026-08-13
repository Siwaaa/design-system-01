"use client"

import * as React from "react"
import { ArrowDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/limeui/ui/button"

// Прокрутка вьюпорта к низу без перехода к маяку по спецификации
// scrollIntoView: тот метод прокручивает все прокручиваемые предки, а не
// только ближайший, и на неограниченной по высоте странице потребителя
// уводит окно документа вместе с лентой.
function scrollViewportToBottom(viewport: HTMLDivElement, smooth: boolean) {
  if (smooth) {
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" })
  } else {
    viewport.scrollTop = viewport.scrollHeight
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function MessageList({
  className,
  children,
  scrollButtonLabel = "Scroll to latest",
  "aria-label": ariaLabel = "Message history",
  viewportRef,
  ...props
}: React.ComponentProps<"div"> & {
  scrollButtonLabel?: string
  viewportRef?: React.Ref<HTMLDivElement>
}) {
  const innerViewportRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  const [atBottom, setAtBottom] = React.useState(true)
  // Зеркало состояния в рефе: колбэк MutationObserver создаётся один раз
  // и через замыкание видел бы навсегда первое значение atBottom.
  const atBottomRef = React.useRef(true)

  // Реф вьюпорта нужен и снаружи (подгрузка истории при скролле вверх —
  // обычное требование чата), и внутри для собственной прокрутки, поэтому
  // объединяем оба, не теряя внутренний.
  const setViewportRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      innerViewportRef.current = node
      if (typeof viewportRef === "function") {
        viewportRef(node)
      } else if (viewportRef) {
        ;(viewportRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node
      }
    },
    [viewportRef]
  )

  React.useEffect(() => {
    const viewport = innerViewportRef.current
    const sentinel = sentinelRef.current
    if (!viewport || !sentinel || typeof IntersectionObserver === "undefined") {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        atBottomRef.current = entry.isIntersecting
        setAtBottom(entry.isIntersecting)
      },
      // Запас снизу: без него отрыв от низа на один пиксель уже выключал бы
      // автоскролл.
      { root: viewport, threshold: 0, rootMargin: "0px 0px 80px 0px" }
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
      const viewport = innerViewportRef.current
      if (!viewport) return
      scrollViewportToBottom(viewport, false)
    })
    observer.observe(content, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [])

  // Первый показ открывается на свежих сообщениях, без анимации.
  React.useEffect(() => {
    const viewport = innerViewportRef.current
    if (!viewport) return
    scrollViewportToBottom(viewport, false)
  }, [])

  function handleScrollButtonClick() {
    const viewport = innerViewportRef.current
    if (!viewport) return
    // Явное значение поведения в скриптовой прокрутке перебивает CSS,
    // поэтому системную настройку уменьшения движения проверяем сами.
    scrollViewportToBottom(viewport, !prefersReducedMotion())
  }

  return (
    <div
      data-slot="message-list"
      className={cn("relative flex min-h-0 flex-1 flex-col", className)}
      {...props}
    >
      <div
        ref={setViewportRef}
        data-slot="message-list-viewport"
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-6"
      >
        <div
          ref={contentRef}
          role="log"
          aria-label={ariaLabel}
          className="flex flex-col gap-5"
        >
          {children}
          <div ref={sentinelRef} aria-hidden className="h-px shrink-0" />
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        aria-label={scrollButtonLabel}
        onClick={handleScrollButtonClick}
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

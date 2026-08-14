import { useRef, useState } from "react"

import { Avatar, AvatarFallback } from "@/registry/limeui/ui/avatar"
import {
  ConversationBadge,
  ConversationBody,
  ConversationItem,
  ConversationList,
  ConversationMeta,
  ConversationPreview,
  ConversationTitle,
} from "@/registry/limeui/ui/conversation-list"
import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageTime,
  MessageTyping,
} from "@/registry/limeui/ui/message"
import { MessageComposer } from "@/registry/limeui/ui/message-composer"
import { MessageList } from "@/registry/limeui/ui/message-list"
import { MessageSeparator } from "@/registry/limeui/ui/message-separator"
import { Eyebrow } from "@/registry/limeui/ui/typography"
import DemoShell from "@/demo/DemoShell"

type ChatMessage = {
  id: number
  author: "them" | "me" | "system"
  initials?: string
  text: string
  time: string
}

const CONVERSATIONS = [
  { id: 1, name: "Gloox", initials: "GX", preview: "Отлично, тогда ждём черновик", time: "14:32", unread: 0 },
  { id: 2, name: "Luminary", initials: "LM", preview: "Прислали бриф на октябрь", time: "12:05", unread: 3 },
  { id: 3, name: "Поддержка", initials: "ПД", preview: "Реквизиты подтверждены", time: "вчера", unread: 0 },
  { id: 4, name: "Nord Studio", initials: "NS", preview: "Можем обсудить ставку?", time: "11 авг", unread: 1 },
]

const HISTORY: ChatMessage[] = [
  { id: 1, author: "system", text: "Кампания «Gloox — ИИ-тренер» началась 10 августа", time: "" },
  { id: 2, author: "them", initials: "GX", text: "Привет! Видели ваш последний ролик — заходит очень хорошо.", time: "14:02" },
  { id: 3, author: "them", initials: "GX", text: "Хотим предложить вам кампанию на сентябрь. Ставка 150 ₽ за 1000 просмотров.", time: "14:03" },
  { id: 4, author: "me", text: "Привет! Спасибо. Звучит интересно — какой объём планируется?", time: "14:15" },
  { id: 5, author: "me", text: "И есть ли ограничения по формату?", time: "14:15" },
  { id: 6, author: "them", initials: "GX", text: "Четыре ролика в месяц, вертикаль до 60 секунд. Сценарий свободный, только логотип в конце.", time: "14:28" },
  { id: 7, author: "me", text: "Тогда давайте попробуем. Пришлю черновик первого до пятницы.", time: "14:31" },
  { id: 8, author: "them", initials: "GX", text: "Отлично, тогда ждём черновик 🙌", time: "14:32" },
]

export default function MessagesDemo() {
  const [messages, setMessages] = useState(HISTORY)
  const [activeChat, setActiveChat] = useState(1)
  // Счётчик id не завязан на длину массива: длина меняется при удалении
  // сообщений, а идентификатор должен оставаться уникальным независимо от неё.
  const nextIdRef = useRef(HISTORY.length + 1)

  function send(text: string) {
    const id = nextIdRef.current++
    setMessages((current) => [
      ...current,
      {
        id,
        author: "me",
        text,
        time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ])
  }

  return (
    <DemoShell active="Сообщения" fill>
      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[300px_1fr]">
        {/* Панель и лента лежат на белой поверхности, а не на полотне:
            наведение и активный пункт читаются вниз от белого. На полотне
            те же состояния давали около процента светлоты и были не видны. */}
        <aside className="hidden min-h-0 flex-col border-r border-border bg-card xl:flex">
          <div className="border-b border-border px-4 py-4">
            <Eyebrow>Диалоги</Eyebrow>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto py-2">
            <ConversationList>
              {CONVERSATIONS.map((chat) => (
                <ConversationItem
                  key={chat.id}
                  isActive={chat.id === activeChat}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <Avatar size="sm">
                    <AvatarFallback>{chat.initials}</AvatarFallback>
                  </Avatar>
                  <ConversationBody>
                    <ConversationTitle>{chat.name}</ConversationTitle>
                    <ConversationPreview>{chat.preview}</ConversationPreview>
                  </ConversationBody>
                  <ConversationMeta>
                    <span>{chat.time}</span>
                    {chat.unread > 0 && (
                      <ConversationBadge value={chat.unread} />
                    )}
                  </ConversationMeta>
                </ConversationItem>
              ))}
            </ConversationList>
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col bg-card">
          <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3.5 lg:px-6">
            <Avatar size="sm">
              <AvatarFallback>GX</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold">
                Gloox
              </span>
              <span className="block truncate text-[12px] text-muted-foreground">
                Кампания «ИИ-тренер» · онлайн
              </span>
            </span>
          </header>

          <MessageList scrollButtonLabel="К последним сообщениям">
            <MessageSeparator>12 августа</MessageSeparator>

            {messages.map((message, index) => {
              if (message.author === "system") {
                return (
                  <MessageBubble key={message.id} variant="system">
                    {message.text}
                  </MessageBubble>
                )
              }

              const mine = message.author === "me"
              const showUnread = index === 5

              return (
                <div key={message.id}>
                  {showUnread && (
                    <MessageSeparator variant="unread" className="mb-5">
                      Непрочитанные
                    </MessageSeparator>
                  )}
                  <Message align={mine ? "end" : "start"}>
                    <MessageAvatar>
                      <Avatar size="sm">
                        <AvatarFallback>
                          {mine ? "АС" : message.initials}
                        </AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
                    <MessageContent>
                      <MessageBubble variant={mine ? "outgoing" : "incoming"}>
                        {message.text}
                      </MessageBubble>
                      <MessageFooter>
                        <MessageTime>{message.time}</MessageTime>
                      </MessageFooter>
                    </MessageContent>
                  </Message>
                </div>
              )
            })}

            <MessageGroup>
              <Message>
                <MessageAvatar>
                  <Avatar size="sm">
                    <AvatarFallback>GX</AvatarFallback>
                  </Avatar>
                </MessageAvatar>
                <MessageContent>
                  <MessageTyping label="Собеседник печатает" />
                </MessageContent>
              </Message>
            </MessageGroup>
          </MessageList>

          <div className="shrink-0 border-t border-border px-4 py-3.5 lg:px-6">
            <MessageComposer
              onSend={send}
              placeholder="Написать сообщение…"
              sendLabel="Отправить"
            />
          </div>
        </section>
      </div>
    </DemoShell>
  )
}

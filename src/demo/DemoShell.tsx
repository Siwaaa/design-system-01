import {
  BarChartIcon,
  BellIcon,
  LayoutGridIcon,
  MessageSquareIcon,
  PlayIcon,
  TrophyIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/registry/limeui/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/limeui/ui/sidebar"
import { Eyebrow, Num } from "@/registry/limeui/ui/typography"

const NAV = [
  {
    label: "Работа",
    items: [
      { title: "Кампании", icon: LayoutGridIcon, badge: undefined },
      { title: "Мои клипы", icon: PlayIcon, badge: "7" },
      { title: "Сообщения", icon: MessageSquareIcon, badge: undefined },
    ],
  },
  {
    label: "Рост",
    items: [
      { title: "Аналитика", icon: BarChartIcon, badge: undefined },
      { title: "Лидерборд", icon: TrophyIcon, badge: undefined },
      { title: "Команда", icon: UsersIcon, badge: undefined },
    ],
  },
  {
    label: "Деньги",
    items: [{ title: "Выплаты", icon: WalletIcon, badge: undefined }],
  },
  {
    label: "Кабинет",
    items: [{ title: "Уведомления", icon: BellIcon, badge: "3" }],
  },
]

const BALANCE = 150000

export default function DemoShell({
  active,
  children,
}: {
  active: string
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
            <span className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
              <span className="text-[18px] font-extrabold leading-none tracking-[-0.04em]">
                limeui
              </span>
              <Eyebrow
                size="sm"
                className="inline-block rounded-sm bg-foreground px-1.5 py-0.5 font-semibold tracking-[0.08em] text-background"
              >
                beta
              </Eyebrow>
            </span>
            {/* В свёрнутом виде триггер встаёт на ту же 40-пиксельную
                колонку, что и иконки меню, иначе в рейле оказывается
                три разных оптических центра. */}
            <SidebarTrigger className="group-data-[collapsible=icon]:size-10" />
          </div>
        </SidebarHeader>

        <SidebarContent className="no-scrollbar">
          {NAV.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={item.title === active}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-baseline justify-between group-data-[collapsible=icon]:hidden">
            <Eyebrow size="sm">Баланс</Eyebrow>
            <Num value={BALANCE} className="text-[13px] font-semibold" />
          </div>
          <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
            <Avatar size="sm">
              <AvatarFallback>АС</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
              Профиль
            </span>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Триггер обязан жить снаружи Sidebar: на мобильном сам Sidebar
            рендерится внутри Sheet, который этой кнопкой и открывается. */}
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background px-4 py-3 md:hidden">
          <SidebarTrigger />
          <span className="text-[15px] font-extrabold tracking-[-0.04em]">
            limeui
          </span>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

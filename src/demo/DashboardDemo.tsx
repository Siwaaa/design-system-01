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

import { BarChart, type BarChartDatum } from "@/registry/limeui/ui/bar-chart"
import { Button } from "@/registry/limeui/ui/button"
import { Chip } from "@/registry/limeui/ui/chip"
import {
  DataList,
  DataListBody,
  DataListLabel,
  DataListRow,
  DataListValue,
} from "@/registry/limeui/ui/data-list"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderTitle,
} from "@/registry/limeui/ui/page-header"
import { Progress } from "@/registry/limeui/ui/progress"
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
import { Stat, StatCaption, StatLabel, StatValue } from "@/registry/limeui/ui/stat"
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/limeui/ui/table"
import { Eyebrow, Num } from "@/registry/limeui/ui/typography"
import { Avatar, AvatarFallback } from "@/registry/limeui/ui/avatar"

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

const ACTIVE = "Выплаты"

// 12 дней августа: часть с начислениями, часть нулевых — так видно оба
// состояния столбца одновременно.
const EARNINGS: BarChartDatum[] = [
  { label: "01 авг", value: 0 },
  { label: "02 авг", value: 4200 },
  { label: "03 авг", value: 11800 },
  { label: "04 авг", value: 6400 },
  { label: "05 авг", value: 0 },
  { label: "06 авг", value: 19300 },
  { label: "07 авг", value: 24100 },
  { label: "08 авг", value: 9700 },
  { label: "09 авг", value: 0 },
  { label: "10 авг", value: 31500 },
  { label: "11 авг", value: 27600 },
  { label: "12 авг", value: 15400 },
]

const TOTAL = EARNINGS.reduce((sum, day) => sum + day.value, 0)

const money = (value: number) =>
  `${new Intl.NumberFormat("ru-RU").format(value)} ₽`

export default function DashboardDemo() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
              <span className="text-[18px] font-extrabold leading-none tracking-[-0.04em]">
                limeui
              </span>
              <span className="rounded-[3px] bg-foreground px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-background">
                beta
              </span>
            </span>
            <SidebarTrigger />
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
                        isActive={item.title === ACTIVE}
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
            <Num value={TOTAL} className="text-[13px] font-semibold" />
          </div>
          <div className="flex items-center gap-2.5">
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
        <div className="mx-auto w-full max-w-[1320px] px-6 py-8 lg:px-10 lg:py-10">
          <PageHeader>
            <PageHeaderContent>
              <Eyebrow>Выплаты</Eyebrow>
              <PageHeaderTitle>Заработок</PageHeaderTitle>
            </PageHeaderContent>
            <PageHeaderActions>
              <Chip pressed>Август 2026</Chip>
              <Chip>Все каналы</Chip>
            </PageHeaderActions>
          </PageHeader>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_380px]">
            <div className="min-w-0 space-y-7">
              <div className="rounded-lg border border-foreground bg-foreground p-6 text-background lg:p-8">
                <Eyebrow className="mb-3.5 text-background opacity-60">
                  Заработано · август 2026
                </Eyebrow>
                <Num
                  value={TOTAL}
                  className="block text-[64px] font-semibold leading-[0.9] tracking-[-0.04em] lg:text-[88px]"
                />
                <BarChart
                  className="mt-9"
                  data={EARNINGS}
                  tone="inverse"
                  formatValue={money}
                  endLabel="сегодня · 12 авг"
                />
              </div>

              <div>
                <div className="mb-3.5 flex items-baseline justify-between">
                  <Eyebrow>История начислений</Eyebrow>
                  <span className="text-[12px] text-muted-foreground">
                    <Num value={2} /> записи
                  </span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Кампания</TableHead>
                      <TableHead className="text-right">Просмотров</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Num>10 авг</Num>
                      </TableCell>
                      <TableCell>Gloox</TableCell>
                      <TableCell className="text-right">
                        <Num value={798000} />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        <Num value={31500} /> ₽
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Num>11 авг</Num>
                      </TableCell>
                      <TableCell>Luminary</TableCell>
                      <TableCell className="text-right">
                        <Num value={313000} />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        <Num value={27600} /> ₽
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <Eyebrow className="mb-3.5">Пустая таблица</Eyebrow>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Кампания</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableEmpty colSpan={3}>
                      Когда модератор одобрит клипы — здесь появятся начисления.
                    </TableEmpty>
                  </TableBody>
                </Table>
              </div>
            </div>

            <aside className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:flex xl:flex-col">
              <Stat variant="card">
                <StatLabel size="sm">К выводу</StatLabel>
                <StatValue value={TOTAL} />
                <StatCaption>минимума нет</StatCaption>
                <Button className="mt-2 w-full" size="sm">
                  Подключить реквизиты →
                </Button>
              </Stat>

              <div className="rounded-lg border border-border bg-card p-5">
                <Eyebrow size="sm" className="mb-2.5">
                  Лига · Бронза
                </Eyebrow>
                <Progress value={42} size="sm" />
                <p className="mt-2.5 text-[12px] text-muted-foreground">
                  До серебра осталось <Num value={58000} /> ₽
                </p>
              </div>

              <DataList>
                <Eyebrow size="sm" className="mb-2.5">
                  За всё время
                </Eyebrow>
                <DataListBody>
                  <DataListRow>
                    <DataListLabel>Заработано за клипы</DataListLabel>
                    <DataListValue value={TOTAL} />
                  </DataListRow>
                  <DataListRow>
                    <DataListLabel>Просмотров</DataListLabel>
                    <DataListValue value={11100000} />
                  </DataListRow>
                  <DataListRow>
                    <DataListLabel>Клипов одобрено</DataListLabel>
                    <DataListValue>7 / 9</DataListValue>
                  </DataListRow>
                </DataListBody>
              </DataList>
            </aside>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

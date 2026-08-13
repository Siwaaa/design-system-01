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

import DemoShell from "@/demo/DemoShell"

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
    <DemoShell active="Выплаты">
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
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <Num
                  value={TOTAL}
                  className="text-[64px] font-semibold leading-[0.9] tracking-[-0.04em] lg:text-[88px]"
                />
                <span className="text-[24px] opacity-40 lg:text-[32px]">₽</span>
              </div>
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
    </DemoShell>
  )
}

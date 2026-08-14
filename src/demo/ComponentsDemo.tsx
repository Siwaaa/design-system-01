import { useState } from "react"
import { ArrowRightIcon, InboxIcon } from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/registry/limeui/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/limeui/ui/avatar"
import { Badge } from "@/registry/limeui/ui/badge"
import { BarChart, type BarChartDatum } from "@/registry/limeui/ui/bar-chart"
import { Button } from "@/registry/limeui/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/limeui/ui/card"
import { Checkbox } from "@/registry/limeui/ui/checkbox"
import { Chip } from "@/registry/limeui/ui/chip"
import { CopyField } from "@/registry/limeui/ui/copy-field"
import {
  DataList,
  DataListBody,
  DataListLabel,
  DataListRow,
  DataListValue,
} from "@/registry/limeui/ui/data-list"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/limeui/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/limeui/ui/dropdown-menu"
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/registry/limeui/ui/empty-state"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/limeui/ui/field"
import { Input } from "@/registry/limeui/ui/input"
import { Label } from "@/registry/limeui/ui/label"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/registry/limeui/ui/page-header"
import { Progress } from "@/registry/limeui/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/limeui/ui/select"
import { SegmentedControl, SegmentedControlItem } from "@/registry/limeui/ui/segmented-control"
import { Separator } from "@/registry/limeui/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/limeui/ui/sheet"
import { Skeleton } from "@/registry/limeui/ui/skeleton"
import { Stat, StatLabel, StatValue, StatCaption } from "@/registry/limeui/ui/stat"
import { Switch } from "@/registry/limeui/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/limeui/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/limeui/ui/tabs"
import { Textarea } from "@/registry/limeui/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/limeui/ui/tooltip"
import { Eyebrow, Num } from "@/registry/limeui/ui/typography"

// 7 дней просмотров клипов: пара нулевых дней вперемешку с активными —
// видно оба состояния столбца (полоска 2px vs заполненный) одновременно.
const CLIP_VIEWS: BarChartDatum[] = [
  { label: "05 авг", value: 0 },
  { label: "06 авг", value: 1200 },
  { label: "07 авг", value: 4300 },
  { label: "08 авг", value: 0 },
  { label: "09 авг", value: 8100 },
  { label: "10 авг", value: 5600 },
  { label: "11 авг", value: 9900 },
]

// Лаймовый квадрат как data:-изображение — гарантированно грузится без сети,
// чтобы показать успешный AvatarImage рядом с примером неудачной загрузки.
const AVATAR_IMAGE_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23d9da26'/%3E%3C/svg%3E"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

export default function ComponentsDemo() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">limeui</h1>
        <p className="text-muted-foreground">Реестр @limeui — тема, хук и 29 компонентов (31 итем), в стиле klipni.com</p>
      </header>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Войти →</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-2">
          <Eyebrow>Заработано · август 2026</Eyebrow>
          <div className="flex items-baseline gap-4">
            <Num value={150000} className="text-[38px] font-semibold tracking-[-0.03em]" />
            <Num value={0.42} format={{ style: "percent" }} className="text-sm text-muted-foreground" />
            <Num className="text-sm text-muted-foreground">12 авг</Num>
          </div>
          <Eyebrow size="sm">Мелкий вариант · 9.5px</Eyebrow>
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge>Активна</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">100% подходит</Badge>
          <Badge variant="warning">На проверке</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="neutral">Черновик</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Section>

      <Section title="Chip / SegmentedControl">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-wrap gap-2">
            <Chip pressed>Все</Chip>
            <Chip>UGC</Chip>
            <Chip>Нарезки</Chip>
          </div>
          <SegmentedControl defaultValue="creator">
            <SegmentedControlItem value="creator">Я креатор</SegmentedControlItem>
            <SegmentedControlItem value="brand">Я бренд</SegmentedControlItem>
          </SegmentedControl>
        </div>
      </Section>

      <Section title="Stat">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat variant="card">
            <StatLabel size="sm">Креаторов</StatLabel>
            <StatValue value={2603} />
            <StatCaption>на платформе</StatCaption>
          </Stat>
          <Stat variant="card">
            <StatLabel size="sm">Просмотры</StatLabel>
            <StatValue>11,1 млн</StatValue>
            <StatCaption>на принятых клипах</StatCaption>
          </Stat>
          <Stat variant="card">
            <StatLabel size="sm">Заработано</StatLabel>
            <StatValue>113 тыс ₽</StatValue>
            <StatCaption>в этой доске</StatCaption>
          </Stat>
        </div>
      </Section>

      <Section title="Avatar">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar>
            <AvatarImage src={AVATAR_IMAGE_SRC} alt="Аня Смирнова" />
            <AvatarFallback>АС</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>ПК</AvatarFallback>
          </Avatar>
          <Avatar size="lg" ring>
            <AvatarFallback>ЛГ</AvatarFallback>
          </Avatar>
          <Avatar ring>
            <AvatarImage src="/does-not-exist.jpg" alt="Пример неудачной загрузки" />
            <AvatarFallback>ФБ</AvatarFallback>
          </Avatar>
        </div>
      </Section>

      <Section title="Progress">
        <div className="max-w-md space-y-5">
          <div className="space-y-1.5">
            <Eyebrow size="sm">Default · 68%</Eyebrow>
            <Progress value={68} />
          </div>
          <div className="space-y-1.5">
            <Eyebrow size="sm">Primary · 34%</Eyebrow>
            <Progress value={34} tone="primary" />
          </div>
          <div className="space-y-1.5">
            <Eyebrow size="sm">Small · 52%</Eyebrow>
            <Progress value={52} size="sm" />
          </div>
          <div className="space-y-1.5">
            <Eyebrow size="sm">Small, primary · 80%</Eyebrow>
            <Progress value={80} size="sm" tone="primary" />
          </div>
          <div className="space-y-1.5">
            <Eyebrow size="sm">Indeterminate</Eyebrow>
            <Progress />
          </div>
        </div>
      </Section>

      <Section title="Bar Chart">
        <div className="max-w-2xl space-y-2.5">
          <BarChart
            data={CLIP_VIEWS}
            formatValue={(value) => `${value.toLocaleString("ru-RU")} просмотров`}
            onBarClick={(datum) => setSelectedDay(datum.label)}
          />
          <p className="text-sm text-muted-foreground">
            {selectedDay
              ? `Выбран день: ${selectedDay}`
              : "Кликните по столбцу, чтобы выбрать день."}
          </p>
        </div>
      </Section>

      <Section title="Data List">
        <DataList className="max-w-sm">
          <Eyebrow size="sm" className="mb-2.5">
            Сводка за неделю
          </Eyebrow>
          <DataListBody>
            <DataListRow>
              <DataListLabel>Просмотров</DataListLabel>
              <DataListValue value={284500} />
            </DataListRow>
            <DataListRow>
              <DataListLabel>Заработано</DataListLabel>
              <DataListValue value={15400} />
            </DataListRow>
            <DataListRow>
              <DataListLabel>Клипов одобрено</DataListLabel>
              <DataListValue>9 / 11</DataListValue>
            </DataListRow>
          </DataListBody>
        </DataList>
      </Section>

      <Section title="Inputs">
        <div className="grid max-w-md gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Textarea</Label>
            <Textarea id="bio" placeholder="Пара слов о себе…" />
          </div>
          <div className="grid gap-2">
            <Label>Select</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Выберите проект" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limeui">limeui</SelectItem>
                <SelectItem value="klipni">Klipni</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Согласен с условиями</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="notify" />
            <Label htmlFor="notify">Уведомления</Label>
          </div>
        </div>
      </Section>

      <Section title="Card">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Gloox — ИИ-тренер</CardTitle>
            <CardDescription>Сними ролик про Gloox — 150 000 ₽ за 1M просмотров.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Радиус и цвета — из темы @limeui/theme.</p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button>Сохранить</Button>
            <Button variant="outline">Отмена</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Alert">
        <div className="grid max-w-md gap-3">
          <Alert>
            <AlertTitle>Обновление готово</AlertTitle>
            <AlertDescription>Новая версия дизайн-системы опубликована в реестре.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>100% подходит</AlertTitle>
            <AlertDescription>Кампания соответствует вашему профилю.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Документы на проверке</AlertTitle>
            <AlertDescription>Обычно это занимает до двух рабочих дней.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>Не удалось сохранить реквизиты.</AlertDescription>
          </Alert>
          <Alert variant="neutral">
            <AlertTitle>Черновик не опубликован</AlertTitle>
            <AlertDescription>Его видите только вы.</AlertDescription>
          </Alert>
          <Alert variant="primary">
            <AlertTitle>Добавьте фото профиля</AlertTitle>
            <AlertDescription>
              Бренды листают каталог глазами: карточку без лица пропускают.
            </AlertDescription>
            <AlertAction asChild>
              <a href="#profile" aria-label="Перейти к загрузке фото">
                <ArrowRightIcon />
              </a>
            </AlertAction>
          </Alert>
          <Alert variant="primary-muted">
            <AlertTitle>Нужна самозанятость</AlertTitle>
            <AlertDescription>
              Зарегистрируйтесь через приложение «Мой налог» — это бесплатно и
              занимает пять минут.
            </AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section title="Field">
        <FieldGroup className="max-w-md">
          <Field>
            <FieldLabel htmlFor="demo-inn">ИНН</FieldLabel>
            <Input
              id="demo-inn"
              placeholder="123456789012"
              aria-describedby="demo-inn-description"
            />
            <FieldDescription id="demo-inn-description">
              12 цифр — найдёте в приложении «Мой налог» или на{" "}
              <a href="#gosuslugi">Госуслугах</a>.
            </FieldDescription>
          </Field>

          <Field>
            <div className="flex items-baseline justify-between">
              <FieldLabel htmlFor="demo-about">О себе</FieldLabel>
              <Num className="text-[10px] text-foreground-subtle">0/300</Num>
            </div>
            <Textarea
              id="demo-about"
              placeholder="Пара предложений о себе."
              aria-describedby="demo-about-description"
            />
            <FieldDescription id="demo-about-description">
              Бренд увидит это на вашей публичной странице.
            </FieldDescription>
          </Field>

          <Field data-invalid="true">
            <FieldLabel htmlFor="demo-bik">БИК банка</FieldLabel>
            <Input
              id="demo-bik"
              defaultValue="0445"
              aria-invalid
              aria-describedby="demo-bik-error"
            />
            <FieldError id="demo-bik-error" errors={[{ message: "БИК состоит из 9 цифр." }]} />
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="demo-notify" />
            <FieldLabel htmlFor="demo-notify" variant="default">
              Присылать письма
            </FieldLabel>
          </Field>
        </FieldGroup>
      </Section>

      <Section title="Copy Field">
        <div className="max-w-md space-y-1.5">
          <FieldLabel htmlFor="demo-copy-link">Ссылка на профиль</FieldLabel>
          <CopyField
            value="https://klipni.com/u/anton-vereschagin"
            label="Скопировать ссылку"
            copiedLabel="Скопировано"
            inputProps={{ id: "demo-copy-link", name: "profile-link" }}
          />
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="account" className="max-w-md">
          <TabsList>
            <TabsTrigger value="account">Аккаунт</TabsTrigger>
            <TabsTrigger value="password">Пароль</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Содержимое вкладки «Аккаунт».</TabsContent>
          <TabsContent value="password">Содержимое вкладки «Пароль».</TabsContent>
          <TabsContent value="settings">Содержимое вкладки «Настройки».</TabsContent>
        </Tabs>
      </Section>

      <Section title="Table">
        <div className="max-w-2xl space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Кампания</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Ставка</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Gloox</TableCell>
                <TableCell>
                  <Badge variant="success">Активна</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Num value={150000} /> ₽
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Luminary</TableCell>
                <TableCell>
                  <Badge variant="secondary">Скоро</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Num value={200000} /> ₽
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Кампания</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Ставка</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableEmpty colSpan={3}>Нет кампаний</TableEmpty>
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section title="Empty State">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card">
            <EmptyState>
              <EmptyStateIcon>
                <InboxIcon />
              </EmptyStateIcon>
              <EmptyStateTitle>Кампаний пока нет</EmptyStateTitle>
              <EmptyStateDescription>
                Как только бренд одобрит вашу заявку, кампания появится здесь.
              </EmptyStateDescription>
              <Button size="sm" className="mt-1">
                Найти кампанию
              </Button>
            </EmptyState>
          </div>
          <div className="rounded-lg border border-border bg-card">
            <EmptyState>Ничего не найдено по вашему запросу.</EmptyState>
          </div>
        </div>
      </Section>

      <Section title="Page Header">
        <div className="rounded-lg border border-border bg-card p-6">
          <PageHeader className="mb-0">
            <PageHeaderContent>
              <Eyebrow>Кампании</Eyebrow>
              <PageHeaderTitle>Активные заявки</PageHeaderTitle>
              <PageHeaderDescription>
                9 клипов на модерации, 2 кампании ждут вашего отклика.
              </PageHeaderDescription>
            </PageHeaderContent>
            <PageHeaderActions>
              <Button variant="outline" size="sm">
                Фильтры
              </Button>
              <Button size="sm">Новая заявка</Button>
            </PageHeaderActions>
          </PageHeader>
        </div>
      </Section>

      <Section title="Dialog / Dropdown / Tooltip">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Открыть диалог</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Подтверждение</DialogTitle>
                <DialogDescription>Это диалог из дизайн-системы limeui.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Ок</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Меню</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Редактировать</DropdownMenuItem>
              <DropdownMenuItem>Дублировать</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Удалить</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">Наведи на меня</Button>
            </TooltipTrigger>
            <TooltipContent>Подсказка из @limeui/tooltip</TooltipContent>
          </Tooltip>
        </div>
      </Section>

      <Section title="Sheet">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Открыть панель</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Настройки уведомлений</SheetTitle>
              <SheetDescription>
                Управляйте тем, какие события присылать на почту.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <Button>Сохранить</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Section>

      <Section title="Skeleton / Separator">
        <div className="max-w-md space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-pill" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">Под разделителем.</p>
        </div>
      </Section>
    </div>
  )
}

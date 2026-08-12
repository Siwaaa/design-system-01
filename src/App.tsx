import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/registry/limeui/ui/alert"
import { Badge } from "@/registry/limeui/ui/badge"
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
import { Input } from "@/registry/limeui/ui/input"
import { Label } from "@/registry/limeui/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/limeui/ui/select"
import { SegmentedControl, SegmentedControlItem } from "@/registry/limeui/ui/segmented-control"
import { Separator } from "@/registry/limeui/ui/separator"
import { Skeleton } from "@/registry/limeui/ui/skeleton"
import { Stat, StatLabel, StatValue } from "@/registry/limeui/ui/stat"
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

export default function App() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className="mx-auto max-w-4xl space-y-10 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">limeui</h1>
          <p className="text-muted-foreground">Реестр @limeui — тема + 20 компонентов, в стиле klipni.com</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setDark(!dark)}>
          {dark ? <SunIcon /> : <MoonIcon />}
        </Button>
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
          <Badge variant="destructive">Destructive</Badge>
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
        <div className="flex flex-wrap gap-10">
          <Stat>
            <StatLabel>Текущий баланс</StatLabel>
            <StatValue>150 000 ₽</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Клипов</StatLabel>
            <StatValue>7</StatValue>
          </Stat>
        </div>
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
          <Alert variant="destructive">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>Не удалось сохранить реквизиты.</AlertDescription>
          </Alert>
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

import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/registry/linkz/ui/alert"
import { Badge } from "@/registry/linkz/ui/badge"
import { Button } from "@/registry/linkz/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/linkz/ui/card"
import { Checkbox } from "@/registry/linkz/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/linkz/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/linkz/ui/dropdown-menu"
import { Input } from "@/registry/linkz/ui/input"
import { Label } from "@/registry/linkz/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/linkz/ui/select"
import { Separator } from "@/registry/linkz/ui/separator"
import { Skeleton } from "@/registry/linkz/ui/skeleton"
import { Switch } from "@/registry/linkz/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/linkz/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/linkz/ui/tabs"
import { Textarea } from "@/registry/linkz/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/linkz/ui/tooltip"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
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
    <TooltipProvider>
      <div className="mx-auto max-w-4xl space-y-10 p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Linkz Design System</h1>
            <p className="text-muted-foreground">Реестр @linkz — тема + 17 компонентов</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => setDark(!dark)}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </Button>
        </header>

        <Section title="Button">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        <Section title="Badge">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
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
                  <SelectItem value="linkz">Linkz</SelectItem>
                  <SelectItem value="avito">Avito Chats</SelectItem>
                  <SelectItem value="hunting">Hunting Emocia</SelectItem>
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
              <CardTitle>Заголовок карточки</CardTitle>
              <CardDescription>Описание карточки с деталями.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Контент карточки. Радиус и цвета — из темы @linkz/theme.</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button>Сохранить</Button>
              <Button variant="outline">Отмена</Button>
            </CardFooter>
          </Card>
        </Section>

        <Section title="Alert">
          <Alert className="max-w-md">
            <AlertTitle>Обновление готово</AlertTitle>
            <AlertDescription>
              Новая версия дизайн-системы опубликована в реестре.
            </AlertDescription>
          </Alert>
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
          <Table className="max-w-md">
            <TableHeader>
              <TableRow>
                <TableHead>Проект</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Компонентов</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Linkz</TableCell>
                <TableCell>
                  <Badge>active</Badge>
                </TableCell>
                <TableCell className="text-right">17</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Avito Chats</TableCell>
                <TableCell>
                  <Badge variant="secondary">planned</Badge>
                </TableCell>
                <TableCell className="text-right">—</TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
                  <DialogDescription>Это диалог из дизайн-системы.</DialogDescription>
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
              <TooltipContent>Подсказка из @linkz/tooltip</TooltipContent>
            </Tooltip>
          </div>
        </Section>

        <Section title="Skeleton / Separator">
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Separator />
            <p className="text-muted-foreground text-sm">Под разделителем.</p>
          </div>
        </Section>
      </div>
    </TooltipProvider>
  )
}

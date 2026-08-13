import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/registry/limeui/ui/button"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/limeui/ui/segmented-control"
import ComponentsDemo from "@/demo/ComponentsDemo"
import DashboardDemo from "@/demo/DashboardDemo"
import MessagesDemo from "@/demo/MessagesDemo"

export default function App() {
  const [dark, setDark] = useState(false)
  const [view, setView] = useState("dashboard")

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className="min-h-svh">
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 md:top-4 md:right-4 md:bottom-auto md:left-auto md:translate-x-0">
        <SegmentedControl value={view} onValueChange={setView}>
          <SegmentedControlItem value="dashboard">Дашборд</SegmentedControlItem>
          <SegmentedControlItem value="messages">Сообщения</SegmentedControlItem>
          <SegmentedControlItem value="components">
            Компоненты
          </SegmentedControlItem>
        </SegmentedControl>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDark(!dark)}
          aria-label={dark ? "Светлая тема" : "Тёмная тема"}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      {view === "dashboard" && <DashboardDemo />}
      {view === "messages" && <MessagesDemo />}
      {view === "components" && (
        <div className="mx-auto max-w-4xl space-y-10 p-8">
          <ComponentsDemo />
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/registry/limeui/ui/button"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/limeui/ui/segmented-control"
import ComponentsDemo from "@/demo/ComponentsDemo"
import DashboardDemo from "@/demo/DashboardDemo"

export default function App() {
  const [dark, setDark] = useState(false)
  const [view, setView] = useState("dashboard")

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className="min-h-svh">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <SegmentedControl value={view} onValueChange={setView}>
          <SegmentedControlItem value="dashboard">Дашборд</SegmentedControlItem>
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

      {view === "dashboard" ? (
        <DashboardDemo />
      ) : (
        <div className="mx-auto max-w-4xl space-y-10 p-8">
          <ComponentsDemo />
        </div>
      )}
    </div>
  )
}

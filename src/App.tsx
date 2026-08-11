import { useEffect, useState } from "react"

export default function App() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className="mx-auto max-w-4xl space-y-10 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Linkz Design System</h1>
          <p className="text-muted-foreground">Реестр @linkz — каркас, компоненты в разработке</p>
        </div>
        <button
          className="rounded-md border px-3 py-1.5 text-sm"
          onClick={() => setDark(!dark)}
        >
          {dark ? "Light" : "Dark"}
        </button>
      </header>
    </div>
  )
}

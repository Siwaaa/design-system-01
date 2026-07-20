// Синхронизирует cssVars итема "theme" в registry.json из
// registry/linkz/theme/theme.css (единый источник темы), затем
// `shadcn build` собирает раздаваемые JSON в r/.
// Запуск: pnpm build:registry
import { readFileSync, writeFileSync } from "node:fs"

const css = readFileSync("registry/linkz/theme/theme.css", "utf8")

function parseBlock(selector) {
  const re = new RegExp(selector.replace(".", "\\.") + "\\s*\\{([^}]*)\\}")
  const m = css.match(re)
  if (!m) throw new Error(`Блок ${selector} не найден в theme.css`)
  const vars = {}
  for (const line of m[1].split("\n")) {
    const v = line.match(/^\s*--([\w-]+):\s*(.+?);\s*$/)
    if (v) vars[v[1]] = v[2]
  }
  return vars
}

const registry = JSON.parse(readFileSync("registry.json", "utf8"))
const theme = registry.items.find((i) => i.name === "theme")
theme.cssVars = { light: parseBlock(":root"), dark: parseBlock(".dark") }
writeFileSync("registry.json", JSON.stringify(registry, null, 2) + "\n")
console.log(
  `theme: ${Object.keys(theme.cssVars.light).length} light / ${Object.keys(theme.cssVars.dark).length} dark переменных`
)

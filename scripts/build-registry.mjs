// Синхронизирует cssVars итема "theme" в registry.json из
// registry/limeui/theme/theme.css (единый источник темы), затем
// `shadcn build` собирает раздаваемые JSON в r/.
// Запуск: pnpm build:registry
import { readFileSync, writeFileSync } from "node:fs"

const css = readFileSync("registry/limeui/theme/theme.css", "utf8")

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

const light = parseBlock(":root")
const dark = parseBlock(".dark")

// Именованный радиус (`--radius-*`) и шрифты (`--font-*`) должны попасть
// в бакет `theme` cssVars, а не в `light`/`dark`: только `theme` CLI пишет
// напрямую в блок `@theme inline` проекта-потребителя, перезаписывая
// дефолтные shadcn-маппинги (`--radius-lg: var(--radius)` и т.п.).
// Значения одинаковы в обеих темах.
const THEME_BUCKET_PREFIXES = ["radius-", "font-"]
const inThemeBucket = (key) =>
  THEME_BUCKET_PREFIXES.some((prefix) => key.startsWith(prefix))

const themeVars = {}
for (const key of Object.keys(light)) {
  if (inThemeBucket(key)) {
    themeVars[key] = light[key]
    delete light[key]
  }
}
for (const key of Object.keys(dark)) {
  if (inThemeBucket(key)) delete dark[key]
}

theme.cssVars = { theme: themeVars, light, dark }
writeFileSync("registry.json", JSON.stringify(registry, null, 2) + "\n")
console.log(
  `theme: ${Object.keys(theme.cssVars.theme).length} theme / ${Object.keys(theme.cssVars.light).length} light / ${Object.keys(theme.cssVars.dark).length} dark переменных`
)

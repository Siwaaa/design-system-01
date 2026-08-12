import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// `pill` — значение radius-группы из темы limeui (rounded-pill), но
// tailwind-merge о нём не знает (дефолтный список: sm/md/lg/xl/2xl/3xl/4xl/full/none),
// поэтому без этого расширения `rounded-pill` и `rounded-lg` считаются
// неконфликтующими и оба остаются в выводе cn().
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      rounded: [{ rounded: ["pill"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

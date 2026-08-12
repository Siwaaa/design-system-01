import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Eyebrow, Num } from "@/registry/limeui/ui/typography"

const statVariants = cva("flex flex-col", {
  variants: {
    variant: {
      plain: "gap-1.5",
      card: "gap-3 rounded-lg border border-border bg-card px-6 py-5",
    },
  },
  defaultVariants: {
    variant: "plain",
  },
})

function Stat({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof statVariants>) {
  return (
    <div
      data-slot="stat"
      className={cn(statVariants({ variant, className }))}
      {...props}
    />
  )
}

function StatLabel({
  className,
  ...props
}: React.ComponentProps<typeof Eyebrow>) {
  return <Eyebrow data-slot="stat-label" className={className} {...props} />
}

function StatValue({ className, ...props }: React.ComponentProps<typeof Num>) {
  return (
    <Num
      data-slot="stat-value"
      className={cn(
        "text-[38px] font-semibold leading-[1] tracking-[-0.03em] text-foreground",
        className
      )}
      {...props}
    />
  )
}

function StatCaption({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-caption"
      className={cn(
        "font-mono text-[11px] tabular-nums text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Stat, StatLabel, StatValue, StatCaption, statVariants }

import * as React from "react"

import { cn } from "@/lib/utils"
import { EmptyState } from "@/registry/limeui/ui/empty-state"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-lg border border-border bg-card"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-muted [&_tr]:border-b [&_tr]:border-border", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-border bg-muted font-medium", className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        // раскладка и оформление
        "border-b border-border transition-colors",
        // состояния — непрозрачные уровни шкалы: строка лежит на белой
        // поверхности таблицы, и доля непрозрачности осветляла бы её
        "hover:bg-muted data-[state=selected]:bg-accent",
        className
      )}
      {...props}
    />
  )
}

// Шапка таблицы — одно из мест, где Geist Mono ставится вручную; полный
// список — в CLAUDE.md, правило 8.
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "px-4 py-3 text-left align-middle font-mono text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase whitespace-nowrap lg:px-6 [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-4 align-middle text-[13px] whitespace-nowrap lg:px-6 [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableEmpty({
  className,
  colSpan,
  children,
  ...props
}: React.ComponentProps<"td"> & { colSpan: number }) {
  return (
    <tr data-slot="table-empty-row" className="hover:bg-transparent">
      <td
        data-slot="table-empty"
        colSpan={colSpan}
        className={cn("p-0", className)}
        {...props}
      >
        <EmptyState>{children}</EmptyState>
      </td>
    </tr>
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableEmpty,
  TableCaption,
}

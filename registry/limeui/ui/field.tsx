import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/registry/limeui/ui/label"
import { Separator } from "@/registry/limeui/ui/separator"
import { eyebrowVariants } from "@/registry/limeui/ui/typography"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-5 *:data-[slot=field-group]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  "group/field flex w-full gap-1.5 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
        className
      )}
      {...props}
    />
  )
}

// Лейбл поля — тот же микро-лейбл, что Eyebrow, но настоящим элементом label:
// обёртка над Eyebrow дала бы div и потеряла связь лейбла с полем.
// variant="default" отключает микро-начертание и оставляет обычное
// начертание Label (нормальный регистр, размер текста формы, основной цвет) —
// нужно, например, для строки с чекбоксом.
function FieldLabel({
  className,
  variant = "eyebrow",
  required = false,
  children,
  ...props
}: React.ComponentProps<typeof Label> & {
  variant?: "eyebrow" | "default"
  required?: boolean
}) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        // раскладка
        "group/field-label peer/field-label flex w-fit gap-2",
        // оформление — микро-начертание по умолчанию, обычное — по запросу
        variant === "eyebrow" && eyebrowVariants({ size: "default" }),
        // состояния
        "group-data-[disabled=true]/field:opacity-50 group-data-[invalid=true]/field:text-destructive",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        // Глиф декоративен: обязательность скринридер берёт из атрибута
        // required на самом контроле, дублировать её звёздочкой не нужно.
        <span aria-hidden className="-ml-1.5 text-destructive">
          *
        </span>
      )}
    </Label>
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        // оформление
        "text-left text-[11px] leading-[1.4] font-normal text-muted-foreground",
        // ссылки внутри подсказки подчёркиваются
        "[&>a]:text-foreground [&>a]:underline [&>a]:underline-offset-2 [&>a:hover]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { children?: React.ReactNode }) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn("relative -my-2 h-5 text-sm", className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          data-slot="field-separator-content"
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
        >
          {children}
        </span>
      )}
    </div>
  )
}

// Мемоизация апстрима убрана: вычисление тривиальное, а хук потребовал бы
// клиентской директивы для файла, который иначе полностью серверный.
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  let content: React.ReactNode = children

  if (!content && errors?.length) {
    const unique = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ].filter((error) => error?.message)

    if (unique.length === 1) {
      content = unique[0]?.message
    } else if (unique.length > 1) {
      content = (
        <ul className="ml-4 flex list-disc flex-col gap-1">
          {unique.map((error, index) => (
            <li key={index}>{error?.message}</li>
          ))}
        </ul>
      )
    }
  }

  if (!content) return null

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-[11px] leading-[1.4] font-normal text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
  fieldVariants,
}

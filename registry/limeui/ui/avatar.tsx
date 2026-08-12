import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Размер шрифта задаётся на корне, чтобы AvatarFallback наследовал его
// и не приходилось дублировать вариант размера во втором компоненте.
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-pill",
  {
    variants: {
      size: {
        sm: "size-8 text-[12px]",
        default: "size-10 text-[15px]",
        lg: "size-14 text-[21px]",
      },
      ring: {
        true: "ring-2 ring-primary",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      ring: false,
    },
  }
)

function Avatar({
  className,
  size,
  ring,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, ring, className }))}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-pill bg-muted font-mono font-semibold tracking-[-0.02em] text-muted-foreground select-none",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

const attachmentVariants = cva(
  "relative group/attachment flex items-center bg-white border border-slate-200 shadow-sm rounded-xl max-w-sm transition-colors overflow-hidden",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col items-start",
      },
      size: {
        default: "p-3 gap-3",
        sm: "p-2 gap-2 text-sm",
        xs: "p-1.5 gap-1.5 text-xs",
      },
      state: {
        idle: "",
        uploading: "",
        processing: "",
        error: "border-red-200 bg-red-50",
        done: "",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "default",
      state: "done",
    },
  }
)

export interface AttachmentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof attachmentVariants> {}

const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  ({ className, orientation, size, state, ...props }, ref) => (
    <div
      ref={ref}
      data-state={state}
      className={cn(attachmentVariants({ orientation, size, state, className }))}
      {...props}
    />
  )
)
Attachment.displayName = "Attachment"

const AttachmentMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "icon" | "image" }
>(({ className, variant = "icon", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 text-zinc-500",
      variant === "image"
        ? "w-full max-h-48 aspect-video [&>img]:object-cover [&>img]:w-full [&>img]:h-full"
        : "h-10 w-10",
      className
    )}
    {...props}
  />
))
AttachmentMedia.displayName = "AttachmentMedia"

const AttachmentContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col min-w-0 z-10 w-full", className)}
      {...props}
    />
  )
)
AttachmentContent.displayName = "AttachmentContent"

const AttachmentTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "truncate text-sm font-medium text-zinc-900",
        "group-data-[state=uploading]/attachment:animate-pulse",
        "group-data-[state=processing]/attachment:animate-pulse",
        className
      )}
      {...props}
    />
  )
)
AttachmentTitle.displayName = "AttachmentTitle"

const AttachmentDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-xs text-zinc-500 truncate",
        "group-data-[state=error]/attachment:text-red-600",
        className
      )}
      {...props}
    />
  )
)
AttachmentDescription.displayName = "AttachmentDescription"

const AttachmentActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex shrink-0 gap-1 ml-auto z-20", className)}
      {...props}
    />
  )
)
AttachmentActions.displayName = "AttachmentActions"

const AttachmentAction = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "icon", variant = "ghost", ...props }, ref) => (
    <Button
      ref={ref}
      size={size}
      variant={variant}
      className={cn("h-8 w-8 text-zinc-500 hover:text-zinc-900", className)}
      {...props}
    />
  )
)
AttachmentAction.displayName = "AttachmentAction"

const AttachmentTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { render?: React.ReactNode }
>(({ className, render, ...props }, ref) => {
  if (render) {
    return (
      <Slot
        ref={ref}
        className={cn("absolute inset-0 z-0 outline-none rounded-xl", className)}
        {...props}
      >
        {render}
      </Slot>
    )
  }
  return (
    <button
      ref={ref}
      className={cn("absolute inset-0 z-0 outline-none rounded-xl", className)}
      {...props}
    />
  )
})
AttachmentTrigger.displayName = "AttachmentTrigger"

const AttachmentGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex w-full overflow-x-auto snap-x snap-mandatory gap-3 pb-2", className)}
      {...props}
    />
  )
)
AttachmentGroup.displayName = "AttachmentGroup"

export {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
  AttachmentGroup,
}

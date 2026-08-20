import * as React from "react"
import { cn } from "@/lib/utils"

const Bubble = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "muted" }>(
  ({ className, variant = "default", ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        "rounded-2xl px-5 py-3.5 shadow-sm text-[15px]",
        variant === "default" 
          ? "bg-blue-600 text-white rounded-br-sm" 
          : "bg-zinc-100 text-zinc-900 rounded-bl-sm",
        className
      )} 
      {...props} 
    />
  )
)
Bubble.displayName = "Bubble"

const BubbleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("leading-relaxed break-words", className)} 
      {...props} 
    />
  )
)
BubbleContent.displayName = "BubbleContent"

export { Bubble, BubbleContent }

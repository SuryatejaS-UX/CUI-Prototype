import * as React from "react"
import { cn } from "@/lib/utils"

const Message = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" }>(
  ({ className, align = "start", ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("flex w-full gap-4", align === "end" ? "justify-end" : "justify-start", className)} 
      {...props} 
    />
  )
)
Message.displayName = "Message"

const MessageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("flex flex-col gap-2 max-w-[80%]", className)} 
      {...props} 
    />
  )
)
MessageContent.displayName = "MessageContent"

export { Message, MessageContent }

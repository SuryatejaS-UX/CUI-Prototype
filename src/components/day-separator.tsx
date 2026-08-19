"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { mono } from "@/lib/surfaces";

export interface DatedMessage {
  id: string;
  day: string;
  time: string;
  role: "user" | "assistant";
  text: string;
}

export function DaySeparator({
  messages,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children" | "messages"> & {
  messages: readonly DatedMessage[];
}) {
  let lastDay = "";

  return (
    <div
      data-slot="day-separator"
      className={cn("flex w-full flex-col gap-2", className)}

      {...props}
    >
      {messages.map((message) => {
        const newDay = message.day !== lastDay;
        lastDay = message.day;

        return (
          <div key={message.id} className="flex flex-col gap-2">
            {newDay && (
              <div className="flex items-center gap-2.5 py-1">
                <span className="bg-foreground/[0.08] h-px flex-1" />
                <span className={cn(mono, "text-foreground/30")}>
                  {message.day}
                </span>
                <span className="bg-foreground/[0.08] h-px flex-1" />
              </div>
            )}
            <div
              className={cn(
                "group flex items-baseline gap-2",
                message.role === "user" && "flex-row-reverse",
              )}
            >
              <span
                className={cn(
                  "max-w-[80%] leading-relaxed break-words",
                  message.role === "user"
                    ? "bg-gray-100 text-gray-900 rounded-3xl rounded-tr-sm px-5 py-4 shadow-sm text-[15px]"
                    : "text-foreground/75 text-[15px]",
                )}
              >
                {message.text}
              </span>
              <span
                className={cn(
                  mono,
                  "text-foreground/0 group-hover:text-foreground/30 shrink-0 tabular-nums transition-colors",
                )}
              >
                {message.time}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

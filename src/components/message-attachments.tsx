"use client";

import type { ComponentProps } from "react";
import { Download, FileTextIcon, ImageIcon, PaperclipIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const mono = "font-mono";
const paper = "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm";

export interface MessageAttachmentItem {
  id: string;
  name: string;
  size: string;
  kind: "image" | "document" | "file";
  pages?: number;
  swatch?: string;
}

export function MessageAttachments({
  attachments,
  onOpen,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children" | "attachments" | "onOpen"> & {
  attachments: readonly MessageAttachmentItem[];
  onOpen?: (id: string) => void;
}) {
  return (
    <div
      data-slot="message-attachments"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {attachments.map((item, index) =>
        item.kind === "image" ? (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6, delay: index * 0.1 }}
            type="button"
            onClick={() => onOpen?.(item.id)}
            className={cn(
              paper,
              "group flex w-full max-w-xs cursor-pointer items-center gap-3 rounded-[20px] p-3.5 transition-transform duration-150 hover:-translate-y-px active:scale-[0.98]"
            )}
          >
            <span
              aria-hidden
              className="h-9 w-9 shrink-0 rounded-xl bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none"
              style={{
                backgroundImage: item.swatch,
                backgroundColor: "#f3f4f6", // fallback color
              }}
            />
            <span className="flex min-w-0 flex-1 flex-col gap-0 text-start">
              <span className="truncate text-[13.5px] font-medium text-zinc-900 dark:text-zinc-100">
                {item.name}
              </span>
              <span className={cn(mono, "text-[12px] text-zinc-400")}>
                {item.size}
              </span>
            </span>
            <Download className="h-4 w-4 shrink-0 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
          </motion.button>
        ) : (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6, delay: index * 0.1 }}
            type="button"
            onClick={() => onOpen?.(item.id)}
            className={cn(
              paper,
              "group flex w-full max-w-xs cursor-pointer items-center gap-3 rounded-[20px] p-3.5 transition-transform duration-150 hover:-translate-y-px active:scale-[0.98]"
            )}
          >
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
              {item.kind === "document" ? (
                <FileTextIcon className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <PaperclipIcon className="h-4 w-4" strokeWidth={1.5} />
              )}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0 text-start">
              <span className="truncate text-[13.5px] font-medium text-zinc-900 dark:text-zinc-100">
                {item.name}
              </span>
              <span className={cn(mono, "text-[12px] text-zinc-400")}>
                {item.size}
                {item.pages !== undefined && ` · ${item.pages} pages`}
              </span>
            </span>
            <Download className="h-4 w-4 shrink-0 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
          </motion.button>
        ),
      )}
    </div>
  );
}

import type { ComponentProps } from "react";
import { ArrowUpRightIcon, FileTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Inline definitions for the missing surfaces
const mono = "font-mono";
const paper = "bg-white border border-slate-200 shadow-sm";
const ShimmerLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("animate-pulse", className)}>{children}</span>
);

export function ArtifactCard({
  title,
  meta,
  generating = false,
  words = 0,
  className,
  ...props
}: Omit<
  ComponentProps<"div">,
  "children" | "title" | "meta" | "generating" | "words"
> & {
  title: string;
  meta: string;
  generating?: boolean;
  words?: number;
}) {
  return (
    <div
      data-slot="artifact-card"
      className={cn(
        paper,
        "group flex w-full max-w-xs cursor-pointer items-center gap-3 rounded-[20px] p-3.5 transition-transform duration-150 hover:-translate-y-px active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      <span className="bg-gray-100 text-gray-500 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
        <FileTextIcon
          className={cn(
            "h-4 w-4",
            generating && "animate-pulse motion-reduce:animate-none",
          )}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-gray-900">{title}</p>
        {generating ? (
          <p className={cn(mono, "text-gray-400 flex items-center gap-1 text-[12px]")}>
            <ShimmerLabel className="relative inline-block leading-none">
              Writing
            </ShimmerLabel>
            <span>·</span>
            <span className="tabular-nums">{words} words</span>
          </p>
        ) : (
          <p
            className={cn(
              mono,
              "fade-in blur-in-[2px] animate-in text-gray-400 duration-300 motion-reduce:animate-none text-[12px]",
            )}
          >
            {meta}
          </p>
        )}
      </div>
      <ArrowUpRightIcon className="text-gray-400 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

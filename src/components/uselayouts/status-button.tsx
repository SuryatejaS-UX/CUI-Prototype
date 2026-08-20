"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

export type ButtonStatus = "idle" | "loading" | "success";

interface StatusButtonProps {
  status: ButtonStatus;
  onClick?: () => void;
  idleText?: string;
  loadingText?: string;
  successText?: string;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function StatusButton({
  status,
  onClick,
  idleText = "Save",
  loadingText = "Saving...",
  successText = "Saved",
  disabled = false,
  className,
  type = "button"
}: StatusButtonProps) {

  const text = useMemo(() => {
    switch (status) {
      case "idle":
        return idleText;
      case "loading":
        return loadingText;
      case "success":
        return successText;
    }
  }, [status, idleText, loadingText, successText]);

  return (
    <div className={cn("relative inline-flex group font-sans", className)}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || status !== "idle"}
        className={cn(
          "relative rounded-xl h-[42px] px-6 text-[14px] font-medium transition-all duration-300 min-w-[120px]",
          status === "idle" && !disabled
            ? "bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            : status === "success"
              ? "bg-blue-600 text-white shadow-sm cursor-default"
              : status === "loading"
                ? "bg-blue-600/80 text-white cursor-wait shadow-sm"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed shadow-none",
          disabled && status === "idle" && "opacity-60"
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === "success" && <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4" />}
          <span>{text}</span>
        </span>
      </button>
    </div>
  );
}

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
            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed shadow-none",
          disabled && status === "idle" && "opacity-60"
        )}
      >
        <span className="flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {text.split("").map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                }}
                className="inline-block whitespace-pre"
              >
                {char}
              </motion.span>
            ))}
          </AnimatePresence>
        </span>
      </button>

      {/* Status Indicator */}
      <div className={cn("absolute -top-1.5 -right-1.5 z-10 pointer-events-none")}>
        <AnimatePresence mode="wait">
          {status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0, x: -8, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "flex items-center justify-center size-5 rounded-full ring-2 ring-white dark:ring-zinc-950 overflow-visible",
                status === "success"
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
              )}
            >
              <AnimatePresence mode="popLayout">
                {status === "loading" && (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Loader2 className="w-3 h-3 animate-spin" />
                  </motion.div>
                )}
                {status === "success" && (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    exit={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <HugeiconsIcon icon={Tick02Icon} className="size-3" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

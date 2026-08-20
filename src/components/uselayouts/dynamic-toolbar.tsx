"use client";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import useMeasure from "react-use-measure";

const ICON_SIZE = 20;

export type Tool = {
  icon: any;
  label: string;
  onClick?: () => void;
  className?: string;
  lucide?: boolean;
};

function ToolbarButton({
  item,
  size = ICON_SIZE,
}: {
  item: Tool;
  size?: number;
}) {
  const IconComponent = item.icon;
  
  const iconElement = item.lucide ? (
    <IconComponent className={`text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors ${item.className || ''}`} width={size} height={size} />
  ) : (
    <HugeiconsIcon
      icon={IconComponent}
      className={`text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors ${item.className || ''}`}
      width={size}
      height={size}
    />
  );

  return (
    <button 
      onClick={item.onClick}
      className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group flex items-center justify-center gap-2 relative"
      title={item.label}
    >
      {iconElement}
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors whitespace-nowrap">
        {item.label}
      </span>
    </button>
  );
}

export function DynamicToolbar({
  primaryTools = [],
  secondaryTools = [],
}: {
  primaryTools?: Tool[];
  secondaryTools?: Tool[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [primaryRef, primaryBounds] = useMeasure();
  const [secondaryRef, secondaryBounds] = useMeasure();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentWidth = isExpanded ? secondaryBounds.width : primaryBounds.width;
  const hasMeasurements = primaryBounds.width > 0;

  const initialWidth = hasMeasurements ? primaryBounds.width : "auto";

  const springTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
    duration: isExpanded ? 0.3 : 0.4,
  };

  return (
    <motion.div
      className="relative h-12 rounded-xl bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden"
      initial={{ width: initialWidth }}
      animate={
        hasMeasurements ? { width: typeof currentWidth === 'number' ? currentWidth + 2 : currentWidth } : { width: initialWidth }
      }
      transition={isMounted ? springTransition : { duration: 0 }}
    >
      <motion.div
        className="h-full flex w-max"
        initial={false}
        animate={{ x: isExpanded ? -primaryBounds.width : 0 }}
        transition={isMounted ? springTransition : { duration: 0 }}
      >
        {/* Primary Tools Panel */}
        <div
          ref={primaryRef as any}
          className="flex items-center h-full px-1.5 flex-shrink-0 gap-0.5"
        >
          {primaryTools.map((item, index) => (
            <ToolbarButton
              key={index}
              item={item}
            />
          ))}
          {secondaryTools.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(true)}
              className="h-9 w-9 ml-1 flex justify-center items-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg group transition-colors"
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors"
                width={20}
                height={20}
              />
            </motion.button>
          )}
        </div>

        {/* Secondary Tools Panel */}
        <div
          ref={secondaryRef as any}
          className="flex items-center h-full px-1.5 flex-shrink-0 gap-0.5"
          style={{
            position: isExpanded ? "relative" : "absolute",
            opacity: isExpanded ? 1 : 0,
            pointerEvents: isExpanded ? "auto" : "none",
          }}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(false)}
            className="h-9 w-9 mr-1 flex justify-center items-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg group transition-colors"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors"
              width={20}
              height={20}
            />
          </motion.button>
          {secondaryTools.map((item, index) => (
            <ToolbarButton
              key={index}
              item={item}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

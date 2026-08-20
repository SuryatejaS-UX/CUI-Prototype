"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type TabItem = {
  id: string;
  title: string;
  icon?: any; // Lucide icon or similar
};

export function DiscreteTabs({
  tabs,
  activeTab,
  onTabChange,
  className
}: {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end overflow-x-auto no-scrollbar", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-[13px] border-r border-zinc-200 dark:border-zinc-800/80 min-w-[140px] max-w-[200px] transition-colors group cursor-pointer",
            activeTab === tab.id
              ? "bg-[#fdfdfd] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-t border-t-blue-500 dark:border-t-blue-400"
              : "bg-zinc-100 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 border-t border-t-transparent hover:bg-zinc-200/50 dark:hover:bg-zinc-800/80"
          )}
        >
          {tab.icon && <tab.icon className={cn("w-4 h-4 shrink-0", activeTab === tab.id ? "text-blue-500 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500")} />}
          <span className="truncate flex-1 text-left font-medium">
            {tab.title}
          </span>
          <div className={cn(
            "w-4 h-4 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
            activeTab === tab.id ? "opacity-100" : ""
          )}>
            <X className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
          </div>
        </button>
      ))}
    </div>
  );
}

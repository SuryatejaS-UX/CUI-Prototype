"use client";

import { SetStateAction, useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  title: string;
  icon: any; // Lucide icon or similar
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
    <div className={cn("flex gap-3 items-center", className)}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          id={tab.id}
          title={tab.title}
          ButtonIcon={tab.icon}
          isActive={activeTab === tab.id}
          setActiveButton={onTabChange}
        />
      ))}
    </div>
  );
}

function Button({
  id,
  title,
  ButtonIcon,
  isActive,
  setActiveButton,
}: {
  id: string;
  title: string;
  ButtonIcon: any;
  isActive: boolean;
  setActiveButton: (id: string) => void;
}) {
  const [showShine, setShowShine] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isActive && isLoaded) {
      setShowShine(true);
      const timer = setTimeout(() => setShowShine(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isActive, isLoaded]);

  const activeColor = "text-blue-600 dark:text-blue-400";

  return (
    <motion.div
      layoutId={"button-id-" + id}
      transition={{
        layout: {
          type: "spring",
          damping: 20,
          stiffness: 230,
          mass: 1.2,
          ease: [0.215, 0.61, 0.355, 1],
        },
      }}
      onClick={() => {
        setActiveButton(id);
        setIsLoaded(true);
      }}
      className="w-fit h-fit flex"
      style={{ willChange: "transform" }}
    >
      <motion.div
        layout
        transition={{
          layout: {
            type: "spring",
            damping: 20,
            stiffness: 230,
            mass: 1.2,
          },
        }}
        className={cn(
          "flex items-center gap-1.5 bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-transparent shadow-sm transition-colors duration-150 ease-out py-1.5 cursor-pointer relative",
          isActive && activeColor,
          !isActive && "text-zinc-600 dark:text-zinc-400",
          isActive ? "px-3" : "px-2.5"
        )}
        style={{
          borderRadius: "16px",
          borderColor: isActive ? "var(--border)" : "transparent",
        }}
      >
        <motion.div
          layoutId={"icon-id-" + id}
          className="shrink-0"
          style={{ willChange: "transform" }}
        >
          <ButtonIcon size={16} className="w-4 h-4" />
        </motion.div>
        {isActive && (
          <motion.div
            className="flex items-center"
            initial={isLoaded ? { opacity: 0, filter: "blur(4px)", width: 0 } : false}
            animate={{ opacity: 1, filter: "blur(0px)", width: "auto" }}
            transition={{
              duration: isLoaded ? 0.2 : 0,
              ease: [0.86, 0, 0.07, 1],
            }}
          >
            <motion.span
              layoutId={"text-id-" + id}
              className="text-[13px] font-medium whitespace-nowrap relative inline-block pl-0.5 pr-1"
              style={{ willChange: "transform" }}
            >
              {title}
            </motion.span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

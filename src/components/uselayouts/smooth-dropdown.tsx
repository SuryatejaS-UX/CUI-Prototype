"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import useMeasure from "react-use-measure";
import {
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
  LogoutIcon,
} from "@hugeicons/core-free-icons";

const menuItems = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "upgrade", label: "Upgrade Plan", icon: CreditCardIcon },
  { id: "divider", label: "", icon: null },
  { id: "settings", label: "Settings", icon: SettingsIcon },
  { id: "logout", label: "Logout", icon: LogoutIcon },
];

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("profile");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [contentRef, contentBounds] = useMeasure();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const openHeight = Math.max(56, Math.ceil(contentBounds.height) + 56);

  return (
    <div ref={containerRef} className="relative w-full h-[56px] not-prose">
      <motion.div
        layout
        initial={false}
        animate={{
          height: isOpen ? openHeight : 56,
          borderRadius: isOpen ? 12 : 8,
        }}
        transition={{
          type: "spring" as const,
          damping: 34,
          stiffness: 380,
          mass: 0.8,
        }}
        className="absolute bottom-0 left-0 right-0 w-full bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800 shadow-none open:shadow-lg overflow-hidden cursor-pointer origin-bottom"
        onClick={() => !isOpen && setIsOpen(true)}
        style={{
          boxShadow: isOpen ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" : "none",
          borderColor: isOpen ? "var(--zinc-200)" : "transparent",
        }}
      >
        {/* Profile Trigger (Visible open or closed) */}
        <motion.div
          layout="position"
          className="flex items-center gap-3 px-2 py-2 h-[56px] rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          onClick={(e) => {
            if (isOpen) {
              e.stopPropagation();
              setIsOpen(false);
            }
          }}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
            JS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-zinc-100 truncate">John Smith</p>
            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">Pro Plan</p>
          </div>
        </motion.div>

        {/* Menu Content - visible when open */}
        <div ref={contentRef} className="pb-2">
          <motion.div
            layout
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              filter: isOpen ? "blur(0px)" : "blur(4px)",
            }}
            transition={{
              duration: 0.15,
              delay: isOpen ? 0.1 : 0,
            }}
            style={{
              pointerEvents: isOpen ? "auto" : "none",
            }}
            className="flex flex-col px-1"
          >
            {menuItems.map((item) => {
              if (item.id === "divider") {
                return (
                  <div
                    key={item.id}
                    className="h-px bg-zinc-100 dark:bg-zinc-800 my-1 mx-2"
                  />
                );
              }

              const isActive = activeItem === item.id;
              const isHovered = hoveredItem === item.id;

              return (
                <motion.div
                  key={item.id}
                  className="relative px-2 py-2 rounded-md mx-1 my-0.5 flex items-center gap-3 cursor-pointer group z-10"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveItem(item.id);
                    setIsOpen(false);
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isHovered && (
                    <motion.div
                      layoutId="profile-menu-hover"
                      className="absolute inset-0 bg-slate-100 dark:bg-zinc-800 rounded-md -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="profile-menu-active"
                      className="absolute left-0 w-[3px] h-4 bg-blue-600 rounded-r-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  {item.icon && (
                    <HugeiconsIcon
                      icon={item.icon}
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-100"
                      }`}
                    />
                  )}
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-zinc-300 group-hover:text-slate-900 dark:group-hover:text-zinc-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

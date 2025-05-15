"use client";

import { motion } from "motion/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "~/components/ui/sidebar";
import type { Pack } from "~/lib/schemas";

export function PackViewSidebar({
  words,
  activeWordIndex,
  setActiveWordIndex,
  isMobile,
}: {
  words: Pack["words"];
  activeWordIndex: number;
  setActiveWordIndex: (index: number) => void;
  isMobile?: boolean;
}) {
  const { state, setOpenMobile } = useSidebar();

  const handleWordSelect = (index: number) => {
    setActiveWordIndex(index);

    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="offcanvas"
      className={`relative max-h-full max-w-[250px] border-r-0 transition-all duration-300 ease-in-out ${
        state === "collapsed"
          ? "w-0 -translate-x-4 transform opacity-0"
          : "w-[250px] translate-x-0 transform opacity-100"
      }`}
    >
      <SidebarContent className="bg-white pt-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:pt-0 [&::-webkit-scrollbar]:hidden">
        <SidebarGroup className="bg-white">
          <SidebarGroupContent className="flex h-full flex-col gap-2 overflow-y-auto px-2 sm:px-0 sm:pr-2">
            {words.map((word, index) => (
              <motion.div
                key={word.original}
                whileHover={{
                  scale: 1.01,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 0.5,
                  },
                }}
                whileTap={{
                  scale: 0.99,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 0.5,
                  },
                }}
                onClick={() => handleWordSelect(index)}
                className={`cursor-pointer rounded-lg p-3 transition-colors ${
                  index === activeWordIndex
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100/80 hover:bg-neutral-200/80"
                }`}
              >
                <p className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border bg-neutral-900 font-serif text-xs text-white ${index === activeWordIndex ? "border-white" : "border-transparent"}`}
                  >
                    lt
                  </span>
                  <span
                    className={`truncate text-xl font-medium ${
                      index === activeWordIndex
                        ? "text-white"
                        : "text-neutral-900"
                    }`}
                  >
                    {word.original}
                  </span>
                </p>
                <p
                  className={`truncate text-sm ${index === activeWordIndex ? "text-white" : "text-neutral-900"}`}
                >
                  {word.translation}
                </p>
              </motion.div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

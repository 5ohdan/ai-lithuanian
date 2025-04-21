"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "~/lib/utils";

export function MotionDiv({
  children,
  className,
  ...props
}: HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
        delay: 0.2,
      }}
      {...props}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

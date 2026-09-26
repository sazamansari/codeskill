"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-card/50 dark:border-white/[0.05] bg-white border border-transparent justify-between flex flex-col space-y-4 backdrop-blur-xl relative overflow-hidden",
        className
      )}
    >
      {/* Background Gradient Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300" />
      
      {header}
      <div className="group-hover/bento:-translate-y-2 transition duration-200 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover/bento:scale-110 transition-transform duration-300 border border-primary/20">
          {icon}
        </div>
        <div className="font-sans font-bold text-neutral-800 dark:text-white mb-2 mt-2 text-lg">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-sm dark:text-muted-foreground leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};

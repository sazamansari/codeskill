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
        "row-span-1 rounded-2xl group/bento transition duration-200 p-6 bg-card border border-border justify-between flex flex-col space-y-4 relative overflow-hidden hover:border-primary/40 hover:shadow-lg shadow-black/20",
        className
      )}
    >
      {/* Background Gradient Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300" />
      
      {header}
      <div className="group-hover/bento:-translate-y-1 transition duration-200 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover/bento:scale-105 transition-transform duration-300 border border-primary/20">
          {icon}
        </div>
        <div className="font-heading font-semibold text-foreground mb-2 text-lg">
          {title}
        </div>
        <div className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};

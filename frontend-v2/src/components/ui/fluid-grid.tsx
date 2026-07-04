"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function useOutsideClick(
  ref: React.RefObject<HTMLDivElement | null>,
  callback: Function
) {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
}

interface Item {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  color?: string;
  className?: string;
}

export const FluidExpandingGrid = ({
  items,
  className,
}: {
  items: Item[];
  className?: string;
}) => {
  const [active, setActive] = useState<Item | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }
    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/80 h-full w-full z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] px-4 py-10 pointer-events-none">
            <motion.div
              layoutId={`card-${active.id}`}
              ref={ref}
              className="w-full max-w-2xl h-full md:h-[500px] md:max-h-[90%] flex flex-col bg-card dark:bg-card/90 sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl pointer-events-auto"
            >
              <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 bg-white/5 relative z-10">
                <div className="flex items-center gap-4">
                  <motion.div
                    layoutId={`icon-${active.id}`}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10",
                      active.color
                    )}
                  >
                    {active.icon}
                  </motion.div>
                  <div>
                    <motion.h3
                      layoutId={`title-${active.id}`}
                      className="font-bold text-white text-xl"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`subtitle-${active.id}`}
                      className="text-muted-foreground text-sm"
                    >
                      {active.subtitle}
                    </motion.p>
                  </div>
                </div>
                <button
                  className="rounded-full bg-white/10 text-white p-2 hover:bg-white/20 transition"
                  onClick={() => setActive(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  {active.content}
                </motion.div>
              </div>
              
              {/* Decorative background element inside active card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 z-0 pointer-events-none" />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
          className
        )}
      >
        {items.map((item) => (
          <motion.div
            layoutId={`card-${item.id}`}
            key={item.id}
            onClick={() => setActive(item)}
            className={cn(
              "p-6 rounded-2xl bg-card/50 backdrop-blur-xl border border-white/5 hover:border-white/20 transition-colors relative overflow-hidden group cursor-pointer flex flex-col justify-between",
              item.className
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <motion.div layoutId={`icon-bg-${item.id}`}>
                {item.icon && React.cloneElement(item.icon as React.ReactElement<any>, { className: cn("w-12 h-12", item.color) })}
              </motion.div>
            </div>
            <motion.p
              layoutId={`subtitle-${item.id}`}
              className="text-sm font-medium text-muted-foreground mb-4 relative z-10"
            >
              {item.subtitle}
            </motion.p>
            <motion.h3
              layoutId={`title-${item.id}`}
              className="text-3xl font-bold text-white relative z-10 flex items-baseline gap-1"
            >
              {item.title}
            </motion.h3>
          </motion.div>
        ))}
      </div>
    </>
  );
};

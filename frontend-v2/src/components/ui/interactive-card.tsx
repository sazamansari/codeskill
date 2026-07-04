"use client";

import React, { useRef, useState } from "react";
import { HTMLMotionProps, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface InteractiveCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  tilt?: boolean;
}

export function InteractiveCard({ className, children, tilt = true, ...props }: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], tilt ? ["7deg", "-7deg"] : ["0deg", "0deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], tilt ? ["-7deg", "7deg"] : ["0deg", "0deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative rounded-3xl p-6 bg-card border border-white/5 shadow-2xl overflow-hidden group cursor-pointer transition-colors hover:border-primary/50",
        className
      )}
      {...props}
    >
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500",
          isHovered && "opacity-100"
        )} 
      />
      
      {/* Gloss effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 mix-blend-overlay pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]).get()} ${useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]).get()}, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}
      />
      
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

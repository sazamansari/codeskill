"use client";

import { motion, useInView } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Arjun Singhal",
    role: "Software Development Engineer",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    review: "CU CodeSkill's rigorous DSA challenges and proctored timed tests mirror actual Tier-1 tech interviews. Practicing here directly helped me crack my Microsoft campus placement.",
    rating: 5,
    featured: false,
  },
  {
    name: "Harshita Sharma",
    role: "AI/ML Systems Engineer",
    company: "Google Cloud",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    review: "The proctored assessment simulation with instant test case verdicts gave me the exact rigor needed to excel. The UI is exceptionally fast, modern, and built for competitive coders.",
    rating: 5,
    featured: true,
  },
  {
    name: "Rohan Verma",
    role: "Full Stack Engineer",
    company: "Amazon",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    review: "The instant feedback loop and deep topic breakdown reports allowed me to identify weak spots in tree and graph algorithms immediately. It sets the gold standard for campus coding portals.",
    rating: 5,
    featured: false,
  },
];

const stats = [
  { label: "Active Engineers", value: 25, suffix: "K+" },
  { label: "Assessments Taken", value: 120, suffix: "K+" },
  { label: "Interview Pass Rate", value: 94, suffix: "%" },
  { label: "Community Rating", value: 4.9, suffix: "★", isDecimal: true },
];

function AnimatedCounter({ value, suffix, isDecimal }: { value: number, suffix: string, isDecimal?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 1800;
      const increment = value / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  const displayValue = isDecimal ? count.toFixed(1) : Math.floor(count);

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground font-mono">
      {displayValue}<span className="text-primary">{suffix}</span>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative w-full py-24 sm:py-32 px-6 bg-background overflow-hidden font-sans border-t border-border">
      {/* Subtle floating background ambient glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-primary/10 to-transparent blur-[140px] rounded-full pointer-events-none opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-t from-primary/5 to-transparent blur-[120px] rounded-full pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-md shadow-sm"
          >
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Proven by candidates worldwide</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
          >
            Loved by engineers & universities
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            See how CodeSkill helps candidates build confidence, measure readiness, and land high-impact technical engineering roles.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-24 sm:mb-32">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.12 + 0.2, ease: "easeOut" }}
              className={cn(
                "relative flex flex-col p-6 sm:p-8 bg-card border border-border rounded-2xl transition-all duration-300 hover:border-primary/50 group shadow-lg",
                t.featured ? "md:scale-105 z-10 border-primary/40 shadow-primary/5" : ""
              )}
            >
              {/* Subtle accent hover indicator */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
              
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 relative z-10 flex-grow">
                "{t.review}"
              </p>
              
              <div className="flex items-center gap-3.5 relative z-10 pt-4 border-t border-border">
                <div className="relative">
                  <img src={t.image} alt={t.name} className="w-11 h-11 rounded-full object-cover border border-border shadow-sm" />
                  <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5">
                    <BadgeCheck className="w-4 h-4 text-primary fill-background" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    {t.name}
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium">{t.role} {t.company && <span className="text-primary font-semibold">@ {t.company}</span>}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-center border-t border-border pt-12 sm:pt-16 relative"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 p-4 rounded-xl bg-card/40 border border-border/60">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} isDecimal={stat.isDecimal} />
              <p className="text-xs sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

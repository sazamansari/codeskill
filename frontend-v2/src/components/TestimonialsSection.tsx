"use client";

import { motion, useInView } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Engineer",
    company: "Vercel",
    image: "https://i.pravatar.cc/150?u=sarah",
    review: "CodeSkill's curated problems perfectly mirror real interviews. The interactive environment made my preparation incredibly efficient. I landed my dream job within weeks.",
    rating: 5,
    featured: false,
  },
  {
    name: "Alex Developer",
    role: "Software Engineer",
    company: "Google",
    image: "https://i.pravatar.cc/150?u=alex",
    review: "The focused coding environment and curated problem set helped me ace my technical interviews. It feels just like the real thing. Highly recommended for anyone serious about tech.",
    rating: 5,
    featured: true,
  },
  {
    name: "David Kim",
    role: "Fullstack Developer",
    company: "Stripe",
    image: "https://i.pravatar.cc/150?u=david",
    review: "I've tried many platforms, but CodeSkill stands out with its premium UI and instant feedback loop. The global leaderboards push me to write more optimized code every day.",
    rating: 5,
    featured: false,
  },
];

const stats = [
  { label: "Developers", value: 25, suffix: "K+" },
  { label: "Problems Solved", value: 500, suffix: "K+" },
  { label: "Interview Success", value: 92, suffix: "%" },
  { label: "Average Rating", value: 4.9, suffix: "★", isDecimal: true },
];

function AnimatedCounter({ value, suffix, isDecimal }: { value: number, suffix: string, isDecimal?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
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
    <div ref={ref} className="text-5xl font-bold tracking-tight text-[#09090B]">
      {displayValue}<span className="text-[#22C55E]">{suffix}</span>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative w-full py-32 px-6 bg-white overflow-hidden font-sans">
      {/* Subtle floating background gradients */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#22C55E]/10 to-transparent blur-[120px] rounded-full pointer-events-none opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-t from-blue-500/5 to-transparent blur-[120px] rounded-full pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#EAEAEA] bg-white/50 backdrop-blur-md shadow-sm"
          >
            <Star className="w-4 h-4 text-[#22C55E] fill-[#22C55E]" />
            <span className="text-sm font-medium text-slate-700">Trusted by 25,000+ Developers</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#09090B] mb-6"
          >
            Loved by engineers
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto"
          >
            See how CodeSkill is helping developers land their dream jobs at the world's most innovative companies.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center mb-32">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.15 + 0.3, ease: "easeOut" }}
              className={cn(
                "relative flex flex-col p-8 lg:p-10 bg-white/60 backdrop-blur-xl border border-[#EAEAEA] rounded-[28px] transition-all duration-500 hover:-translate-y-2 group",
                t.featured ? "md:scale-105 shadow-xl shadow-black/[0.04] z-10 bg-white border-[#EAEAEA]" : "shadow-lg shadow-black/[0.02]"
              )}
            >
              {/* Green subtle glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px] pointer-events-none" />

              <div className="flex gap-1 mb-8 relative z-10">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#22C55E] fill-[#22C55E]" />
                ))}
              </div>
              
              <p className="text-slate-700 text-lg leading-relaxed mb-10 relative z-10 flex-grow font-medium">
                "{t.review}"
              </p>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border border-[#EAEAEA] shadow-sm" />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    <BadgeCheck className="w-5 h-5 text-[#22C55E] fill-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[#09090B] flex items-center gap-2">
                    {t.name}
                  </h4>
                  <p className="text-sm text-slate-500 font-medium">{t.role} {t.company && <span className="text-[#22C55E]">@ {t.company}</span>}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center border-t border-[#EAEAEA] pt-16 relative"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-3">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} isDecimal={stat.isDecimal} />
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

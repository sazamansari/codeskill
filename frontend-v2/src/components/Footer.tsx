"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, ShieldCheck } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  const isHidden =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.includes("/take") ||
    pathname.match(/^\/(problems|contest)\/[^/]+$/);

  if (isHidden) return null;

  return (
    <footer className="w-full bg-card/50 border-t border-border mt-auto py-12 px-4 sm:px-6 md:px-8 text-foreground font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Grid: Brand & Categorized Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {/* CodeSkill Primary Logo */}
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-950 border border-primary/40 shadow-xs flex items-center justify-center p-1">
                <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
                  <polygon points="80,10 145,45 145,115 80,150 15,115 15,45" fill="#0F172A" stroke="#C8102E" strokeWidth="8" strokeLinejoin="round" />
                  <path d="M60 62 L40 80 L60 98" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M85 55 L75 105" stroke="#C8102E" strokeWidth="10" strokeLinecap="round" />
                  <path d="M100 62 L120 80 L100 98" stroke="#38BDF8" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">CodeSkill</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-400">
                    <span className="text-white/80 font-normal">by</span> Chandigarh University
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-400/40 text-amber-300 font-bold text-[11px] sm:text-xs tracking-tight mt-0.5 shadow-xs w-fit">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span>Under Chandigarh University Department of Skill Development and Lab</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 dark:text-slate-300 leading-relaxed max-w-sm">
              Standardized examination portal and algorithmic skill-building platform engineered for developers, students, and technical evaluations.
            </p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Proctored &amp; Verified Examination Infrastructure</span>
            </div>
          </div>

          {/* Links: Platform (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/assessments" className="hover:text-foreground transition-colors">Assessments</Link></li>
              <li><Link href="/problems" className="hover:text-foreground transition-colors">Problems</Link></li>
              <li><Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Links: Resources (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/problems" className="hover:text-foreground transition-colors">Practice Tracks</Link></li>
              <li><Link href="/problems" className="hover:text-foreground transition-colors">Algorithms &amp; DSA</Link></li>
              <li><Link href="/assessments" className="hover:text-foreground transition-colors">Interview Preparation</Link></li>
              <li><Link href="/leaderboard" className="hover:text-foreground transition-colors">Campus Rankings</Link></li>
            </ul>
          </div>

          {/* Links: Support & Institutional (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Support &amp; Legal</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Help &amp; Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Examination</Link></li>
              <li><Link href="/admin/login" className="hover:text-foreground transition-colors">Faculty / Controller Login</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Operational Status */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="text-slate-300">
            © {new Date().getFullYear()} <span className="text-white font-bold">CodeSkill</span> <span className="text-amber-400 font-semibold">by Chandigarh University</span> • <strong className="font-bold text-amber-300">Under Chandigarh University Department of Skill Development and Lab</strong>. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">All Examination Nodes Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

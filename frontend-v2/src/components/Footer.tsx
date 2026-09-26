"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <footer className="w-full bg-card/50 border-t border-border mt-auto py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Row: Branding + Links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            {/* CU Logo */}
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm border border-border p-0.5 flex items-center justify-center">
              <img
                src="/cu-seal.png"
                alt="Chandigarh University"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/cu-logo.jpg";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-foreground">CU CodeSkill</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-500">
                  This is a product of Chandigarh University
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Chandigarh University — Official Technical Assessment & Algorithmic Learning Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <Link href="/assessments" className="hover:text-foreground transition-colors">Assessments</Link>
            <Link href="/problems" className="hover:text-foreground transition-colors">Problems</Link>
            <Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Chandigarh University. All rights reserved. Powered by{" "}
            <a href="https://www.evolvian.in/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-semibold">
              Evolvian
            </a>.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

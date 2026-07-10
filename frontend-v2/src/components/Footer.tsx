"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


export function Footer() {
  const pathname = usePathname();

  // Hide footer on editor and contest pages to maximize screen real estate
  const isHidden = pathname.match(/^\/(problems|contest)\/[^/]+$/);

  if (isHidden) return null;

  return (
    <footer className="w-full bg-background border-t border-border mt-auto py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative flex items-center justify-center">
            <img src="/logo.svg" alt="CodeSkill Logo" className="w-full h-full object-contain dark:hidden block" />
            <img src="/logo-dark.svg" alt="CodeSkill Logo" className="w-full h-full object-contain hidden dark:block" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">CodeSkill</span>
          <a 
            href="https://www.evolvian.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase px-2 py-0.5 rounded-md border border-border bg-muted hover:bg-border transition-colors ml-1 mt-1"
          >
            By Evolvian
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 <a href="https://www.evolvian.in/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-medium">Evolvian</a>. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

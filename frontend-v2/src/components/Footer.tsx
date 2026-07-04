"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on editor and contest pages to maximize screen real estate
  const isHidden = pathname.match(/^\/(problems|contest)\/[^/]+$/);

  if (isHidden) return null;

  return (
    <footer className="w-full bg-[#09090B] text-white py-12 px-6 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8">
            <img src="/logo-dark.svg" alt="CodeSkill" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-xl tracking-tight">CodeSkill</span>
          <a 
            href="https://www.evolvian.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-gray-200 font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm border border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:text-white transition-all ml-1 mt-1"
          >
            By Evolvian
          </a>
        </div>
        <p className="text-sm text-gray-200">
          © 2026 <a href="https://www.evolvian.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">Evolvian</a>. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm text-gray-200">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

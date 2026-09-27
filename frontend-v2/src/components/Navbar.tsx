"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, Menu, X, Code2, ShieldCheck, GraduationCap } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname.startsWith("/admin");
  const isWorkspacePage = pathname.match(/^\/(problems|contest)\/[^/]+$/);
  const isExamTakingPage = pathname.includes("/take");

  if (!mounted || isAuthPage || isAdminPage || isWorkspacePage || isExamTakingPage) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    { name: "Assessments", href: "/assessments" },
    { name: "Problems", href: "/problems" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs py-2.5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-md overflow-hidden bg-white shrink-0 border border-slate-200 p-0.5 flex items-center justify-center">
              <img
                src="https://images.seeklogo.com/logo-png/43/1/chandigarh-university-cu-logo-png_seeklogo-432515.png"
                alt="Chandigarh University"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/cu-logo.png";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight leading-none">
                  Chandigarh University
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-red-50 text-[#c8102e] border border-red-200">
                  Assessment Portal
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Official Examination & Algorithmic Learning System
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1.5"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.isAdmin && (
                  <Link href="/admin/dashboard" className="flex items-center gap-1.5 h-8.5 px-3 rounded-md text-xs font-semibold bg-red-50 text-[#c8102e] border border-red-200 hover:bg-[#c8102e] hover:text-white transition-colors">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Portal</span>
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-1.5 h-8.5 px-3 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors">
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center h-8.5 px-3 rounded-md text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <Link href="/login" className="flex items-center justify-center h-8.5 px-4 rounded-md text-xs font-semibold bg-[#c8102e] hover:bg-[#a90c25] text-white transition-colors shadow-xs">
                Student Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden flex items-center justify-center text-slate-700 p-1.5 rounded-md border border-slate-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-24 px-6 pb-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 text-xl font-medium tracking-tight">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-border/50 text-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-4 pt-8 border-t border-border/50">
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-primary/10 text-primary font-semibold border border-primary/20">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full h-12 rounded-xl bg-muted text-foreground font-medium">
                    View Profile
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center justify-center w-full h-12 rounded-md border border-border text-foreground font-medium">
                    Log out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full h-11 rounded-md bg-[#c8102e] text-white font-semibold shadow-xs">
                  Student Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

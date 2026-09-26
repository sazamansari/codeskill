"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, Menu, X, Code2, ShieldCheck, GraduationCap } from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname.startsWith("/admin");
  const isWorkspacePage = pathname.match(/^\/(problems|contest)\/[^/]+$/);
  const isExamTakingPage = pathname.includes("/take");

  if (isAuthPage || isAdminPage || isWorkspacePage || isExamTakingPage) {
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
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm border border-border/50 group-hover:scale-105 transition-transform p-0.5 flex items-center justify-center">
              <img
                src="/cu-seal.png"
                alt="Chandigarh University"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/cu-logo.jpg";
                }}
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-foreground leading-tight tracking-tight">CU CodeSkill</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                  A Product of Chandigarh University
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">Chandigarh University Official Technical Platform</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group py-2"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {user.isAdmin && (
                  <Link href="/admin/dashboard" className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Portal</span>
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link href="/login" className="flex items-center justify-center h-9 px-4 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-sm shadow-primary/20">
                Student Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden flex items-center justify-center text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full h-12 rounded-md bg-amber-500 text-zinc-950 font-semibold shadow-sm">
                  Student Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

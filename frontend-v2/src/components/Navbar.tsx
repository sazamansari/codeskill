"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, Menu, X, ShieldCheck, GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

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
    setScrolled(latest > 10);
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
    { name: "Problems", href: "/problems" },
    { name: "Assessments", href: "/assessments" },
    { name: "Contests", href: "/leaderboard" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-xs py-2"
            : "bg-background/80 backdrop-blur-sm border-b border-border/60 py-2.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between h-11">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            {/* CodeSkill Primary Logo */}
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-950 border border-amber-400/40 shadow-xs flex items-center justify-center p-1 group-hover:scale-105 transition-transform z-10">
              <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
                <polygon points="80,10 145,45 145,115 80,150 15,115 15,45" fill="#0F172A" stroke="#FACC15" strokeWidth="8" strokeLinejoin="round" />
                <path d="M60 62 L40 80 L60 98" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M85 55 L75 105" stroke="#FACC15" strokeWidth="10" strokeLinecap="round" />
                <path d="M100 62 L120 80 L100 98" stroke="#38BDF8" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-foreground tracking-tight leading-none">
                  CodeSkill
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <span className="text-amber-500 dark:text-amber-400 font-medium">by</span> Chandigarh University
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-muted-foreground font-normal leading-none mt-0.5">
                Department of Skill Development &amp; Lab
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-1.5 rounded-md text-xs sm:text-[13px] font-medium transition-colors ${
                    isActive
                      ? "text-foreground bg-muted font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-amber-400 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Controls: Theme Toggle & CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                {user.isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium bg-amber-400/10 text-amber-500 dark:text-amber-400 border border-amber-400/30 hover:bg-amber-400 hover:text-slate-950 transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium text-foreground bg-muted/60 hover:bg-muted border border-border transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{user.name?.split(" ")[0] || "Profile"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="flex items-center justify-center h-8 px-3 rounded-md text-xs sm:text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center h-8 px-3.5 rounded-md text-xs sm:text-[13px] font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Bar: Theme + Hamburger */}
          <div className="md:hidden flex items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-foreground hover:bg-muted border border-border"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md flex flex-col pt-20 px-6 pb-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-2 py-4">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-semibold text-foreground hover:bg-muted border border-transparent hover:border-border transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-border">
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary/10 text-primary font-semibold border border-primary/20"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full h-11 rounded-xl bg-muted text-foreground font-medium"
                  >
                    Profile ({user.name})
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full h-11 rounded-xl border border-border text-muted-foreground hover:text-foreground font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold shadow-xs"
                  >
                    Student Sign In
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full h-11 rounded-xl bg-muted text-foreground font-medium border border-border"
                  >
                    Faculty / Admin Login
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

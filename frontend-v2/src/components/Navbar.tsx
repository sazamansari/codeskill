"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Code2,
  ClipboardList,
  Trophy,
  BarChart3,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isShimmering, setIsShimmering] = useState(false);

  useEffect(() => {
    setMounted(true);

    const triggerShimmer = () => {
      setIsShimmering(true);
      const timer = setTimeout(() => {
        setIsShimmering(false);
      }, 2200);
      return timer;
    };

    // 1. Initial Load: trigger automatically as soon as component mounts
    const initialTimer = setTimeout(() => {
      triggerShimmer();
    }, 400);

    // 2. 2-Minute Interval: repeat exactly every 2 minutes (120,000 ms)
    const intervalId = setInterval(() => {
      triggerShimmer();
    }, 120000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, []);

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
    { name: "Problems", href: "/problems", icon: Code2 },
    { name: "Assessments", href: "/assessments", icon: ClipboardList },
    { name: "Contests", href: "/leaderboard", icon: Trophy },
    { name: "Leaderboard", href: "/leaderboard", icon: BarChart3 },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <>
      <header className="fixed top-2.5 sm:top-3 left-0 right-0 z-50 px-3 sm:px-6 max-w-7xl mx-auto transition-all duration-200">
        <div
          className={`w-full bg-[#0D0D0D]/92 backdrop-blur-md border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 px-3 sm:px-5 h-12 flex items-center justify-between transition-all duration-200 ${
            scrolled ? "bg-[#090909]/96 border-white/[0.12] shadow-black/80" : ""
          }`}
        >
          {/* 2. LEFT — BRAND */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 select-none">
            {/* CodeSkill Primary Logo */}
            <div
              className={`relative w-8 h-8 rounded-lg overflow-hidden bg-slate-950 border shadow-xs flex items-center justify-center p-1 group-hover:scale-105 transition-all duration-700 z-10 ${
                isShimmering
                  ? "border-[#FFB800] ring-2 ring-[#FFB800]/40 shadow-[#FFB800]/20 shadow-md scale-[1.03]"
                  : "border-[#FFB800]/40"
              }`}
            >
              <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
                <polygon
                  points="80,10 145,45 145,115 80,150 15,115 15,45"
                  fill="#0F172A"
                  stroke="#FFB800"
                  strokeWidth="8"
                  strokeLinejoin="round"
                />
                <path
                  d="M60 62 L40 80 L60 98"
                  stroke="#FFFFFF"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M85 55 L75 105"
                  stroke="#FFB800"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M100 62 L120 80 L100 98"
                  stroke="#38BDF8"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Shimmer sweep beam */}
              <AnimatePresence>
                {isShimmering && (
                  <motion.div
                    initial={{ x: "-130%", opacity: 0 }}
                    animate={{ x: "220%", opacity: [0, 0.9, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                    className="pointer-events-none absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/55 to-transparent -skew-x-25 z-20"
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-extrabold text-base tracking-tight leading-none text-[#F5F5F5] transition-all duration-700 ${
                    isShimmering
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F5] via-[#FFB800] to-[#F5F5F5]"
                      : ""
                  }`}
                >
                  CodeSkill
                </span>
                <span className="text-[11px] font-medium text-[#9A9A9A] flex items-center gap-1">
                  <span className="text-[#FFB800] font-semibold">by</span> Chandigarh University
                </span>
              </div>
              <span className="hidden sm:block text-[9.5px] text-[#9A9A9A]/80 font-normal leading-none mt-0.5">
                Department of Skill Development &amp; Lab
              </span>
            </div>
          </Link>

          {/* 3. CENTER — NAVIGATION (14px, Clean Icons, Yellow Active Indicator) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13.5px] font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[#F5F5F5] bg-amber-400/10 border border-amber-400/20 font-semibold"
                      : "text-[#9A9A9A] hover:text-[#F5F5F5] hover:bg-white/[0.05] border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors duration-200 ${
                      isActive ? "text-[#FFB800]" : "text-[#9A9A9A] group-hover:text-[#F5F5F5]"
                    }`}
                  />
                  <span>{item.name}</span>

                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-[5px] left-3 right-3 h-[2px] bg-[#FFB800] rounded-full shadow-[0_0_8px_rgba(255,184,0,0.6)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 4. RIGHT SIDE — Theme Toggle, Log In & Get Started */}
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                {user.isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30 hover:bg-[#FFB800] hover:text-black transition-all duration-200"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-[#F5F5F5] bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-colors duration-200"
                >
                  <User className="w-3.5 h-3.5 text-[#9A9A9A]" />
                  <span>{user.name?.split(" ")[0] || "Profile"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center h-8 w-8 rounded-lg text-[#9A9A9A] hover:text-[#F5F5F5] hover:bg-white/[0.06] border border-white/[0.08] transition-colors duration-200 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="flex items-center justify-center h-8 px-3 rounded-lg text-xs sm:text-[13px] font-medium text-[#9A9A9A] hover:text-[#FFB800] transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg text-xs sm:text-[13px] font-bold bg-[#FFB800] hover:bg-[#FFC400] text-black shadow-xs hover:shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Theme + Hamburger */}
          <div className="lg:hidden flex items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[#F5F5F5] hover:bg-white/[0.08] border border-white/[0.08]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Floating Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-3 right-3 z-40 bg-[#0D0D0D]/98 backdrop-blur-xl border border-white/[0.1] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/30 font-semibold"
                        : "text-[#9A9A9A] hover:text-[#F5F5F5] hover:bg-white/[0.05]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#FFB800]" : "text-[#9A9A9A]"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-[#FFB800]/10 text-[#FFB800] font-semibold border border-[#FFB800]/30 text-xs"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full h-10 rounded-xl bg-white/[0.05] text-[#F5F5F5] font-medium text-xs border border-white/[0.08]"
                  >
                    Profile ({user.name})
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full h-10 rounded-xl border border-white/[0.08] text-[#9A9A9A] hover:text-[#F5F5F5] font-medium text-xs"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full h-10 rounded-xl bg-[#FFB800] hover:bg-[#FFC400] text-black font-bold text-xs shadow-xs"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full h-10 rounded-xl bg-white/[0.05] text-[#F5F5F5] font-medium text-xs border border-white/[0.08]"
                  >
                    Log In
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

export default Navbar;

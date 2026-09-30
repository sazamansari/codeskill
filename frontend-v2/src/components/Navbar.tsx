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
          className={`w-full bg-[#121212]/96 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.30)] px-3 sm:px-5 h-12 flex items-center justify-between transition-all duration-200 ${
            scrolled ? "bg-[#111111]/98 border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.45)]" : ""
          }`}
        >
          {/* 2. LEFT — BRAND */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 select-none">
            {/* CodeSkill Primary Logo */}
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-950 border border-white/15 shadow-xs flex items-center justify-center p-1 group-hover:scale-105 transition-all duration-300 z-10">
              <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
                <polygon
                  points="80,10 145,45 145,115 80,150 15,115 15,45"
                  fill="#0F172A"
                  stroke="#FFFFFF"
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
                  stroke="#FFFFFF"
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
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[15.5px] tracking-tight leading-none text-[#F5F5F5]">
                  CodeSkill
                </span>
                <span className="text-[11px] font-medium text-[#A3A3A3] flex items-center gap-1">
                  <span className="text-white/80 font-semibold">by</span> Chandigarh University
                </span>
              </div>
              <span className="hidden sm:block text-[9.5px] text-[#A3A3A3]/80 font-normal leading-none mt-0.5">
                Department of Skill Development &amp; Lab
              </span>
            </div>
          </Link>

          {/* 3. CENTER — NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] transition-all duration-150 ${
                    isActive
                      ? "text-white bg-white/[0.06] font-semibold border border-white/10"
                      : "text-[#A3A3A3] hover:text-white hover:bg-white/[0.04] font-normal border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors duration-150 ${
                      isActive ? "text-[#3B82F6]" : "text-[#A3A3A3] group-hover:text-white"
                    }`}
                  />
                  <span>{item.name}</span>

                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-[5px] left-3 right-3 h-[2px] bg-[#2563EB] rounded-full shadow-[0_0_6px_rgba(37,99,235,0.4)]"
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
                    className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-semibold bg-white/10 text-white border border-white/15 hover:bg-white hover:text-black transition-all duration-150"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-[#F5F5F5] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-colors duration-150"
                >
                  <User className="w-3.5 h-3.5 text-[#A3A3A3]" />
                  <span>{user.name?.split(" ")[0] || "Profile"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center h-8 w-8 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-white/[0.06] border border-white/10 transition-colors duration-150 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="flex items-center justify-center h-8 px-3 rounded-lg text-[13.5px] font-medium text-[#D4D4D4] hover:text-white transition-colors duration-150"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg text-[13.5px] font-bold bg-white hover:bg-neutral-100 text-[#111111] shadow-xs hover:shadow transition-all duration-150"
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
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[#F5F5F5] hover:bg-white/[0.08] border border-white/10"
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
            className="fixed top-16 left-3 right-3 z-40 bg-[#121212]/98 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] flex flex-col gap-4 lg:hidden"
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
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                      isActive
                        ? "text-white bg-white/[0.08] border border-white/10 font-semibold"
                        : "text-[#A3A3A3] hover:text-white hover:bg-white/[0.04] font-normal"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#3B82F6]" : "text-[#A3A3A3]"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-white/10 text-white font-semibold border border-white/15 text-xs"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full h-10 rounded-xl bg-white/[0.05] text-[#F5F5F5] font-medium text-xs border border-white/10"
                  >
                    Profile ({user.name})
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full h-10 rounded-xl border border-white/10 text-[#A3A3A3] hover:text-white font-medium text-xs"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full h-10 rounded-xl bg-white hover:bg-neutral-100 text-[#111111] font-bold text-xs shadow-xs"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full h-10 rounded-xl bg-white/[0.05] text-[#F5F5F5] font-medium text-xs border border-white/10"
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

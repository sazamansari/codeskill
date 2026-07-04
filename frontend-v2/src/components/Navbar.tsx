"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const isTransparentOnLanding = pathname === "/" && !scrolled;
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname.startsWith("/admin");

  if (isAuthPage || isAdminPage) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isDarkTop = pathname === "/leaderboard" && !scrolled;

  const textColor = isDarkTop ? "text-white" : "text-[#475569]";
  const textHoverColor = isDarkTop ? "hover:text-white/80" : "hover:text-[#0F172A]";
  const brandColor = isDarkTop ? "text-white" : "text-[#0F172A]";
  const buttonBg = isDarkTop ? "hover:bg-white/10" : "hover:bg-gray-100";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-200 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 relative group-hover:scale-105 transition-transform">
            <img 
              src="/logo-dark.svg" 
              alt="CodeSkill Logo" 
              className={`w-full h-full object-contain ${!isDarkTop ? 'filter invert' : ''}`} 
            />
          </div>
          <span className={`font-heading font-bold text-xl tracking-tight ${brandColor} group-hover:text-[#2563EB] transition-colors`}>CodeSkill</span>
          <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm border ${isDarkTop ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : 'border-[#0F172A]/20 bg-[#0F172A]/5 text-[#0F172A] hover:bg-[#0F172A]/10'} transition-all ml-1 mt-1 hidden sm:block`}>
            By Evolvian
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Problems", "Leaderboard", "Dashboard"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className={`text-sm font-semibold ${textColor} ${textHoverColor} transition-colors relative group py-2`}
            >
              {item}
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2563EB] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" 
              />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Link href="/profile" title="Profile" className={`flex items-center gap-2 h-10 px-3 sm:px-4 rounded-full text-sm font-semibold ${textColor} ${textHoverColor} ${buttonBg} transition-colors`}>
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button 
                onClick={handleLogout}
                title="Logout"
                className={`flex items-center justify-center gap-2 h-10 px-3 sm:px-5 rounded-full text-sm font-medium ${isDarkTop ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-[#334155] hover:bg-gray-200'} transition-colors`}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={`flex items-center justify-center h-10 px-3 sm:px-4 rounded-full text-sm font-semibold ${textColor} ${textHoverColor} ${buttonBg} transition-colors`}>
                Login
              </Link>
              <Link href="/register" className="flex items-center justify-center h-10 px-4 sm:px-6 rounded-full text-sm font-medium bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm transition-transform hover:scale-105 active:scale-95">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

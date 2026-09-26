"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Code2, 
  Users, 
  Trophy, 
  Building2, 
  GraduationCap, 
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Question Bank", href: "/admin/questions", icon: Code2 },
  { name: "Contests", href: "/admin/contests", icon: Trophy },
  { name: "Candidates", href: "/admin/candidates", icon: Users },
  { name: "Companies", href: "/admin/companies", icon: Building2 },
  { name: "Universities", href: "/admin/universities", icon: GraduationCap },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-zinc-950 text-slate-300 flex flex-col h-full border-r border-border relative overflow-hidden z-20">
      <div className="absolute top-0 inset-x-0 h-[300px] bg-red-500/10 blur-[80px] pointer-events-none" />
      
      <div className="h-16 flex items-center px-6 border-b border-border relative z-10">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-white group">
          <ShieldCheck className="w-6 h-6 text-red-500 group-hover:text-red-400 transition-colors" />
          <span className="font-bold text-lg tracking-tight">Admin Portal</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative z-10 ${
                  isActive 
                    ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                    : "hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-red-500" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider relative z-10">
          Portals
        </div>
        <nav className="space-y-1">
          <Link
            href="/company"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-colors relative z-10 group text-slate-400"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 group-hover:text-blue-500" />
              Company Portal
            </div>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="/campus"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors relative z-10 group text-slate-400"
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 group-hover:text-emerald-500" />
              Campus Portal
            </div>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-border relative z-10">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </div>
  );
}

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
  LogOut
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
    <div className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-white group">
          <ShieldCheck className="w-6 h-6 text-blue-500 group-hover:text-blue-400 transition-colors" />
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-600/10 text-blue-500" 
                    : "hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-500" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </div>
  );
}

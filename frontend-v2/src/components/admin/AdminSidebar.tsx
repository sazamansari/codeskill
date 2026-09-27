"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
  ExternalLink,
  ClipboardList,
  BookOpen,
  BarChart3,
  Terminal,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    name: "Students",
    href: "/admin/students",
    icon: GraduationCap,
    subItems: [
      { name: "All Students", href: "/admin/students" },
      { name: "Import Students", href: "/admin/students/import" },
      { name: "Credentials", href: "/admin/students/credentials" },
    ],
  },
  {
    name: "Question Bank",
    href: "/admin/questions",
    icon: Code2,
    subItems: [
      { name: "All Questions", href: "/admin/questions" },
      { name: "Create Question", href: "/admin/questions/create" },
      { name: "Bulk Import", href: "/admin/questions/import" },
      { name: "Pending Review", href: "/admin/questions/pending" },
      { name: "Topics", href: "/admin/questions/topics" },
    ],
  },
  {
    name: "Assessments",
    href: "/admin/assessments",
    icon: ClipboardList,
    subItems: [
      { name: "All Assessments", href: "/admin/assessments" },
      { name: "Create Assessment", href: "/admin/assessments/create" },
    ],
  },
  { name: "Results & Scores", href: "/admin/candidates", icon: BarChart3 },
  { name: "Contests", href: "/admin/contests", icon: Trophy },
  { name: "Companies", href: "/admin/companies", icon: Building2 },
  { name: "Universities", href: "/admin/universities", icon: BookOpen },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-full border-r border-sidebar-border relative z-20">
      {/* Header with CodeSkill Branding */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border gap-3 bg-sidebar">
        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-950 border border-primary/40 shadow-xs flex items-center justify-center p-1">
          <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
            <polygon points="80,10 145,45 145,115 80,150 15,115 15,45" fill="#0F172A" stroke="#C8102E" strokeWidth="8" strokeLinejoin="round" />
            <path d="M60 62 L40 80 L60 98" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M85 55 L75 105" stroke="#C8102E" strokeWidth="10" strokeLinecap="round" />
            <path d="M100 62 L120 80 L100 98" stroke="#38BDF8" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-sidebar-foreground truncate leading-tight">CodeSkill</p>
          <p className="text-[10px] text-primary font-semibold tracking-wide uppercase">Admin Console</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isCategoryActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <div key={item.name} className="space-y-0.5">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isCategoryActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "hover:bg-muted/40 hover:text-foreground border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isCategoryActive ? "text-primary" : "text-muted-foreground"}`} />
                  {item.name}
                </Link>

                {item.subItems && isCategoryActive && (
                  <div className="pl-8 pr-2 pb-1 space-y-0.5">
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            isSubActive
                              ? "bg-primary/15 text-primary font-bold"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-6 mb-2 px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
          Portals
        </div>
        <nav className="space-y-0.5">
          <Link
            href="/company"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-500/10 hover:text-blue-500 transition-colors group text-muted-foreground"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 group-hover:text-blue-500" />
              Company Portal
            </div>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="/campus"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors group text-muted-foreground"
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 group-hover:text-emerald-500" />
              Campus Portal
            </div>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </nav>
      </div>

      {/* Footer with university name */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="px-2 py-1.5 bg-muted/30 rounded-lg">
          <p className="text-[9px] text-muted-foreground/70 uppercase tracking-wider">Institution</p>
          <p className="text-xs font-semibold text-foreground">Chandigarh University</p>
          <p className="text-[9px] text-muted-foreground">Mohali, Punjab</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

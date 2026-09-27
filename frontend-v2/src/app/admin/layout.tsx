"use client";

import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { authAPI } from "@/config/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, updateUserLocal } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      if (loading) return;

      if (isLoginPage) {
        if (user && user.isAdmin) {
          router.push("/admin/dashboard");
        } else {
          setIsVerifying(false);
        }
        return;
      }

      if (!user) {
        router.push("/admin/login");
        return;
      }

      if (user.isAdmin) {
        if (isMounted) setIsVerifying(false);
        return;
      }

      // User exists but local state has isAdmin = false.
      // Re-verify with backend in case user was recently promoted.
      try {
        const res = await authAPI.getMe();
        const freshUser = res.data?.user;
        if (freshUser && freshUser.isAdmin) {
          updateUserLocal(freshUser);
          if (isMounted) setIsVerifying(false);
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        router.push("/dashboard");
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [user, loading, router, isLoginPage, updateUserLocal]);

  if (loading || isVerifying) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Standardized Admin Header with CU Branding */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md overflow-hidden bg-white shrink-0 border border-slate-200 p-0.5 flex items-center justify-center">
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
              <p className="text-xs font-bold text-slate-900 leading-tight">Chandigarh University</p>
              <p className="text-[10px] text-slate-500 font-medium">Assessment Administration System</p>
            </div>
            <div className="hidden md:flex items-center gap-1.5 ml-3 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-700">Campus Live</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-50 border border-red-200 text-[#c8102e] rounded-md flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-900">{user?.name || "Administrator"}</p>
              <p className="text-[10px] text-slate-500 font-medium">Institutional Admin</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}

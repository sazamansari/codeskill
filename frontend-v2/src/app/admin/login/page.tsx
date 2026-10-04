"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {  ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().optional(),
  otp: z.string().optional(),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const { adminLogin, adminLoginVerify } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();
      tl.from(".brand-logo", { opacity: 0, y: 20, duration: 0.6 })
        .from(".brand-title", { opacity: 0, y: 15, duration: 0.4 }, "-=0.4")
        .from(".brand-description", { opacity: 0, y: 10, duration: 0.4 }, "-=0.3")
        .from(".brand-feature", { opacity: 0, x: -10, stagger: 0.1, duration: 0.4 }, "-=0.2")
        .from(".login-card", { opacity: 0, y: 25, scale: 0.97, duration: 0.6 }, 0.2)
        .from(".login-element", { opacity: 0, y: 10, stagger: 0.05, duration: 0.3 }, "-=0.3");
    });
  }, { scope: containerRef });

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true);
    form.clearErrors("root");
    setInfoMessage(null);
    try {
      if (!showOTP) {
        const res = await adminLogin({ email: data.email, password: data.password });
        if (res.requireOTP) {
          setShowOTP(true);
          if (res.message) setInfoMessage(res.message);
        } else {
          window.location.href = "/admin/dashboard";
        }
      } else {
        if (!data.otp) {
          form.setError("otp", { type: "manual", message: "OTP is required" });
          return;
        }
        await adminLoginVerify({ email: data.email, otp: data.otp });
        window.location.href = "/admin/dashboard";
      }
    } catch (err: any) {
      form.setError("root", { type: "manual", message: err.message || "Failed to authenticate admin" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="flex min-h-screen bg-[#F8FAFC] text-zinc-900 font-sans">
      {/* Left Column - Institutional Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-white border-r border-[#E5E7EB] flex-col p-12 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
          {/* Logo Area */}
          <div className="mb-10">
            <img src="/logo-dark.svg" alt="CodeSkill" className="h-10 w-auto mb-6 brand-logo" />
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2 brand-title">CodeSkill Admin</h1>
            <h2 className="text-lg font-medium text-zinc-600 mb-4 brand-title">Assessment & Examination Administration</h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-md brand-description">
              Secure assessment administration for Chandigarh University.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-4">
            {[
              "Question Bank Management",
              "Live Examination Monitoring",
              "Exam Scheduling",
              "Candidate Submission Auditing"
            ].map((feature, i) => (
              <div key={i} className="brand-feature flex items-center gap-3 text-[13px] font-medium text-zinc-700">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FFF7D6] text-[#D99F00]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Attribution */}
        <div className="mt-auto pt-8 border-t border-[#E5E7EB] flex items-center gap-4">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Developed for
          </div>
          <img src="/cu-logo.png" alt="Chandigarh University" className="h-12 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
        </div>
      </div>

      {/* Right Column - Admin Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-[#F8FAFC]">
        {/* Mobile Attribution (Visible only on mobile) */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-3">
          <img src="/logo-dark.svg" alt="CodeSkill" className="h-6 w-auto" />
          <div className="w-px h-4 bg-border" />
          <img src="/cu-logo.png" alt="Chandigarh University" className="h-6 w-auto" />
        </div>

        <div className="w-full max-w-sm flex flex-col login-card">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[10px] font-bold tracking-widest uppercase mb-4">
              Admin Portal
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">CodeSkill Admin</h2>
            <p className="text-sm text-zinc-500">Sign in to access the assessment administration console.</p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.formState.errors.root && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-[8px] flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-[#991B1B] leading-snug">
                  {form.formState.errors.root.message}
                </p>
              </div>
            )}

            {infoMessage && (
              <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[8px] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-[#166534] leading-snug">
                  {infoMessage}
                </p>
              </div>
            )}

            <div className="space-y-1.5 login-element">
              <label className="text-[13px] font-semibold text-[#111827]">Email / Institutional ID</label>
              <input
                type="email"
                placeholder="admin@institution.edu"
                disabled={showOTP || isLoading}
                {...form.register("email")}
                className={`w-full h-12 bg-white border ${form.formState.errors.email ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#D1D5DB] focus:border-[#F5B800] focus:ring-[#F5B800]'} rounded-[8px] px-3 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 transition-all text-sm disabled:opacity-50`}
              />
              {form.formState.errors.email && (
                <p className="text-[12px] font-medium text-[#DC2626] mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5 login-element relative">
              <label className="text-[13px] font-semibold text-[#111827]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={showOTP || isLoading}
                  {...form.register("password")}
                  className={`w-full h-12 bg-white border ${form.formState.errors.password ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#D1D5DB] focus:border-[#F5B800] focus:ring-[#F5B800]'} rounded-[8px] px-3 pr-10 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 transition-all text-sm disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-[12px] font-medium text-[#DC2626] mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            {showOTP && (
              <div className="space-y-1.5 pt-2 login-element">
                <label className="text-[13px] font-semibold text-[#111827]">Verification Code</label>
                <input
                  type="text"
                  placeholder="000000"
                  disabled={isLoading}
                  {...form.register("otp")}
                  className={`w-full h-12 bg-white border ${form.formState.errors.otp ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#D1D5DB] focus:border-[#F5B800] focus:ring-[#F5B800]'} rounded-[8px] px-3 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 transition-all text-sm tracking-widest font-mono text-center`}
                />
                {form.formState.errors.otp && (
                  <p className="text-[12px] font-medium text-[#DC2626] mt-1">{form.formState.errors.otp.message}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] rounded-[10px] bg-[#F5B800] text-[#111827] font-semibold text-[14px] transition-colors flex items-center justify-center mt-6 disabled:opacity-70 shadow-sm login-element btn-interactive"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.015, backgroundColor: "#D99F00", duration: 0.15 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, backgroundColor: "#F5B800", duration: 0.15 })}
              onMouseDown={(e) => gsap.to(e.currentTarget, { scale: 0.98, duration: 0.15 })}
              onMouseUp={(e) => gsap.to(e.currentTarget, { scale: 1.015, duration: 0.15 })}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4 animate-spin text-[#111827]" />
                  <span>Authenticating...</span>
                </div>
              ) : (showOTP ? "Verify Login" : "Authenticate as Admin")}
            </button>
          </form>
          
          <div className="mt-8 text-center flex flex-col items-center gap-4">
            <p className="text-[11px] font-medium text-zinc-500">
              Authorized faculty and examination controllers only.
            </p>
            <Link href="/" className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
              Return to Portal Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

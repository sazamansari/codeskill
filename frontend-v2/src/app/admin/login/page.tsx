"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Database, 
  MonitorPlay, 
  Calendar, 
  ClipboardList 
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
      tl.from(".brand-element", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 })
        .from(".feature-item", { opacity: 0, x: -10, stagger: 0.1, duration: 0.4 }, "-=0.2")
        .from(".login-panel", { opacity: 0, x: 20, duration: 0.6 }, "-=0.6")
        .from(".login-element", { opacity: 0, y: 10, stagger: 0.05, duration: 0.4 }, "-=0.4");
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

  const features = [
    { icon: Database, label: "Question Bank Management" },
    { icon: MonitorPlay, label: "Live Examination Monitoring" },
    { icon: Calendar, label: "Exam Scheduling" },
    { icon: ClipboardList, label: "Candidate Submission Auditing" },
  ];

  return (
    <div ref={containerRef} className="flex min-h-screen bg-white text-zinc-900 font-sans selection:bg-[#F5B800] selection:text-zinc-900 overflow-hidden">
      
      {/* Left Panel - Brand Information */}
      <div className="hidden lg:flex w-[48%] relative flex-col justify-between p-12 xl:p-20 bg-white">
        <div className="flex-1 max-w-lg w-full pt-8">
          {/* Official Logo */}
          <div className="brand-element mb-12">
            <img 
              src="/logo.svg" 
              alt="CodeSkill" 
              className="h-14 xl:h-16 w-auto object-contain"
            />
          </div>
          
          <div className="brand-element space-y-4 mb-12">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
              CodeSkill Admin
            </h1>
            <h2 className="text-xl xl:text-2xl font-semibold text-zinc-600">
              Assessment &amp; Examination Administration
            </h2>
            <p className="text-base text-zinc-500 max-w-[90%] leading-relaxed">
              Secure assessment administration for Chandigarh University.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, i) => (
              <div key={i} className="feature-item flex items-center gap-4 text-base font-medium text-zinc-700">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F5B800]/10 border border-[#F5B800]/20 text-[#D99F00] shadow-sm">
                  <feature.icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
                {feature.label}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Attribution */}
        <div className="brand-element mt-12 pt-8 border-t border-zinc-100 flex flex-col gap-3">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
            Developed for
          </div>
          <div className="flex items-center gap-3">
            <img 
              src="/cu-logo.png" 
              alt="Chandigarh University" 
              className="h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
            />
            <span className="text-sm font-semibold text-zinc-500">Chandigarh University</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-zinc-50 lg:border-l lg:border-zinc-200/60 shadow-[inset_1px_0_10px_rgba(0,0,0,0.02)] login-panel">
        
        {/* Mobile Header (Visible only on mobile) */}
        <div className="absolute top-8 left-8 lg:hidden flex flex-col gap-4">
          <img src="/logo.svg" alt="CodeSkill" className="h-10 w-auto" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-600 text-[10px] font-bold tracking-widest uppercase shadow-sm w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F5B800]" />
            Admin Portal
          </div>
        </div>

        <div className="w-full max-w-[400px] flex flex-col bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 relative mt-16 lg:mt-0">
          
          {/* Form Header */}
          <div className="flex flex-col mb-8 login-element">
            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600 text-[10px] font-bold tracking-widest uppercase mb-6 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F5B800]" />
              Admin Portal
            </div>
            <h2 className="text-[28px] font-bold tracking-tight text-zinc-900 mb-2">CodeSkill Admin</h2>
            <p className="text-sm text-zinc-500">Sign in to access the assessment administration console.</p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {form.formState.errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 login-element">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800 leading-snug">
                  {form.formState.errors.root.message}
                </p>
              </div>
            )}

            {infoMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 login-element">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-emerald-800 leading-snug">
                  {infoMessage}
                </p>
              </div>
            )}

            <div className="space-y-2 login-element">
              <label className="text-sm font-semibold text-zinc-800">Email / Institutional ID</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="admin@institution.edu"
                  disabled={showOTP || isLoading}
                  {...form.register("email")}
                  className={`w-full h-[46px] bg-white border ${form.formState.errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-zinc-200 focus:border-[#F5B800] focus:ring-[#F5B800]/20'} rounded-xl pl-10 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 transition-all text-sm font-medium disabled:opacity-50`}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs font-medium text-red-500 ml-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2 login-element relative">
              <label className="text-sm font-semibold text-zinc-800">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={showOTP || isLoading}
                  {...form.register("password")}
                  className={`w-full h-[46px] bg-white border ${form.formState.errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-zinc-200 focus:border-[#F5B800] focus:ring-[#F5B800]/20'} rounded-xl pl-10 pr-11 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 transition-all text-sm font-medium tracking-wide disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs font-medium text-red-500 ml-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            {showOTP && (
              <div className="space-y-2 pt-2 login-element">
                <label className="text-sm font-semibold text-zinc-800">Verification Code</label>
                <input
                  type="text"
                  placeholder="000000"
                  disabled={isLoading}
                  {...form.register("otp")}
                  className={`w-full h-[46px] bg-zinc-50 border ${form.formState.errors.otp ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-zinc-200 focus:border-[#F5B800] focus:ring-[#F5B800]/20'} rounded-xl px-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 transition-all text-sm tracking-[0.2em] font-mono text-center font-bold`}
                />
                {form.formState.errors.otp && (
                  <p className="text-xs font-medium text-red-500 ml-1 text-center">{form.formState.errors.otp.message}</p>
                )}
              </div>
            )}

            <div className="pt-4 login-element">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[46px] rounded-xl bg-[#F5B800] hover:bg-[#E5AC00] active:bg-[#D9A100] text-zinc-900 font-bold text-sm transition-all flex items-center justify-center disabled:opacity-70 shadow-sm disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="w-4 h-4 animate-spin text-zinc-900" />
                    <span>Authenticating...</span>
                  </div>
                ) : (showOTP ? "Verify Login" : "Authenticate as Admin")}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col items-center gap-4 login-element">
            <div className="flex items-center gap-2 text-zinc-500">
              <ShieldCheck className="w-4 h-4" />
              <p className="text-[11px] font-semibold">
                Authorized faculty and examination controllers only.
              </p>
            </div>
            <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-800 transition-colors">
              Return to Portal Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

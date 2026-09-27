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
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().optional(),
  otp: z.string().optional(),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const { adminLogin, adminLoginVerify } = useAuth();
  const router = useRouter();

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
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
          router.push("/admin/dashboard");
        }
      } else {
        if (!data.otp) {
          form.setError("otp", { type: "manual", message: "OTP is required" });
          return;
        }
        await adminLoginVerify({ email: data.email, otp: data.otp });
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      form.setError("root", { type: "manual", message: err.message || "Failed to authenticate admin" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-800 font-sans">
      
      {/* Left Column - Brand / Graphic */}
      <div className="hidden lg:flex flex-1 relative bg-slate-50 border-r border-slate-200 items-center justify-center overflow-hidden flex-col p-12 text-slate-800 text-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
        
        {/* Brand Content */}
        <div className="relative z-10 max-w-md flex flex-col items-center">
          <Link href="/" className="w-24 h-24 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center mb-6 shadow-xs">
            <img
              src="https://images.seeklogo.com/logo-png/43/1/chandigarh-university-cu-logo-png_seeklogo-432515.png"
              alt="Chandigarh University"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/cu-logo.png";
              }}
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-50 border border-red-200 text-[#c8102e] text-xs font-semibold tracking-wide uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Institutional Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-slate-900">
            Chandigarh University
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
            Assessment & Examination Administration Console. Manage question banks, monitor live sessions, schedule exams, and audit candidate submissions.
          </p>
        </div>
      </div>

      {/* Right Column - Admin Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-white">
        <div className="w-full max-w-sm flex flex-col gap-6 bg-white border border-slate-200 p-8 rounded-lg shadow-xs">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-center mb-3 shadow-xs">
              <img
                src="https://images.seeklogo.com/logo-png/43/1/chandigarh-university-cu-logo-png_seeklogo-432515.png"
                alt="Chandigarh University"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/cu-logo.png";
                }}
              />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Admin Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Authorized faculty and examination controllers only</p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {form.formState.errors.root && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-500 leading-snug">
                  {form.formState.errors.root.message}
                </p>
              </div>
            )}

            {infoMessage && (
              <div className="p-4 bg-primary/10 border border-primary/50 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-primary leading-snug">
                  {infoMessage}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <input
                type="email"
                placeholder="Admin Email"
                disabled={showOTP}
                {...form.register("email")}
                className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm disabled:opacity-50"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <input
                type="password"
                placeholder="Password"
                disabled={showOTP}
                {...form.register("password")}
                className="w-full h-10 bg-white border border-slate-300 rounded-md px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#c8102e] focus:border-[#c8102e] transition-all text-sm disabled:opacity-50 shadow-xs"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-rose-600 mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            {showOTP && (
              <div className="space-y-1.5 pt-2">
                <input
                  type="text"
                  placeholder="6-Digit Verification Code"
                  {...form.register("otp")}
                  className="w-full h-10 bg-white border border-slate-300 rounded-md px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#c8102e] focus:border-[#c8102e] transition-all text-sm tracking-widest font-mono text-center shadow-xs"
                />
                {form.formState.errors.otp && (
                  <p className="text-xs text-rose-600 mt-1">{form.formState.errors.otp.message}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-md bg-[#c8102e] hover:bg-[#a90c25] active:bg-[#910b20] text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center mt-3 disabled:opacity-70 shadow-xs"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (showOTP ? "Verify Login" : "Authenticate as Admin")}
            </button>
          </form>
          
          <div className="mt-4 pt-4 border-t border-slate-200 text-center">
            <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              Return to Portal Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

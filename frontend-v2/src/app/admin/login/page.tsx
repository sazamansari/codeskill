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
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      
      {/* Left Column - Brand / Graphic */}
      <div className="hidden lg:flex flex-1 relative bg-muted/20 border-r border-border items-center justify-center overflow-hidden flex-col p-12 text-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
        
        {/* Brand Content */}
        <div className="relative z-10 max-w-md flex flex-col items-center">
          <Link href="/" className="w-24 h-24 bg-card border border-border rounded-xl p-2 flex items-center justify-center mb-6 shadow-xs">
            <img
              src="https://images.seeklogo.com/logo-png/43/1/chandigarh-university-cu-logo-png_seeklogo-432515.png"
              alt="Chandigarh University"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/cu-logo.png";
              }}
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold tracking-wide uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Institutional Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-foreground">
            Chandigarh University
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Assessment & Examination Administration Console. Manage question banks, monitor live sessions, schedule exams, and audit candidate submissions.
          </p>
        </div>
      </div>

      {/* Right Column - Admin Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-background">
        <div className="w-full max-w-sm flex flex-col gap-6 bg-card border border-border p-8 rounded-2xl shadow-sm">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-muted/40 border border-border rounded-xl p-1.5 flex items-center justify-center mb-3 shadow-xs">
              <img
                src="https://images.seeklogo.com/logo-png/43/1/chandigarh-university-cu-logo-png_seeklogo-432515.png"
                alt="Chandigarh University"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/cu-logo.png";
                }}
              />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Admin Sign In</h2>
            <p className="text-xs text-muted-foreground mt-1">Authorized faculty and examination controllers only</p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {form.formState.errors.root && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-500 leading-snug">
                  {form.formState.errors.root.message}
                </p>
              </div>
            )}

            {infoMessage && (
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
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
                className="w-full h-11 bg-background border border-input rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm disabled:opacity-50"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <input
                type="password"
                placeholder="Password"
                disabled={showOTP}
                {...form.register("password")}
                className="w-full h-11 bg-background border border-input rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm disabled:opacity-50"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            {showOTP && (
              <div className="space-y-1.5 pt-2">
                <input
                  type="text"
                  placeholder="6-Digit Verification Code"
                  {...form.register("otp")}
                  className="w-full h-11 bg-background border border-input rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm tracking-widest font-mono text-center"
                />
                {form.formState.errors.otp && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.otp.message}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center mt-3 disabled:opacity-70 shadow-xs"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (showOTP ? "Verify Login" : "Authenticate as Admin")}
            </button>
          </form>
          
          <div className="mt-4 pt-4 border-t border-border text-center">
            <Link href="/" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Return to Portal Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

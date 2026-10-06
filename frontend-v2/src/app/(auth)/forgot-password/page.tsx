"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {  AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const resetSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword, resetPassword } = useAuth();
  const router = useRouter();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", newPassword: "" },
  });

  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      await forgotPassword({ email: data.email });
      setEmail(data.email);
      setStep(2);
      toast.success("Reset code sent to your email!");
    } catch (err: any) {
      emailForm.setError("root", { type: "manual", message: err.message || "Failed to send reset link" });
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      await resetPassword({ email, otp: data.otp, newPassword: data.newPassword });
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (err: any) {
      resetForm.setError("root", { type: "manual", message: err.message || "Failed to reset password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      
      {/* Left Column - Brand/Graphic (Hidden on smaller screens) */}
      <div className="hidden lg:flex flex-1 relative bg-muted/20 border-r border-border items-center justify-center overflow-hidden flex-col p-12 lg:p-20 text-center">
        {/* Abstract Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        
        {/* Brand Content */}
        <div className="relative z-10 w-full max-w-lg flex flex-col justify-between h-full">
          <div className="text-left mt-auto mb-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check w-4 h-4"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1.2 7 2a1 1 0 0 1 1 1v7z"/><path d="m9 12 2 2 4-4"/></svg> 
              Account Recovery
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-foreground leading-tight">
              Reset your <br />
              password.
            </h1>
            <p className="text-xl text-foreground/90 font-medium leading-relaxed max-w-md">
              Securely regain access to your CodeSkill account and continue building your dream projects.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto bg-background text-foreground">
        {/* Subtle Background Pattern for Right Side */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 min-h-[120%]" />

        <div className="w-full max-w-[420px] flex flex-col gap-6 my-auto py-8 bg-card border border-border p-8 rounded-2xl shadow-xl">
          
          {/* Mobile Logo Header */}
          <div className="flex lg:hidden flex-col items-center text-center mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/5 bg-card border border-border">
              <img src="/logo-dark.svg" alt="CodeSkill Logo" className="w-8 h-8 object-contain" />
            </div>
          </div>

          <div className="mb-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {step === 1 ? "Enter your email to receive a reset code." : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              {emailForm.formState.errors.root && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-500 leading-snug">
                    {emailForm.formState.errors.root.message}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <input
                  type="email"
                  {...emailForm.register("email")}
                  placeholder="Email Address"
                  className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                />
                {emailForm.formState.errors.email && (
                  <p className="text-xs text-destructive mt-1">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all flex items-center justify-center mt-2 disabled:opacity-70 shadow-md shadow-primary/20"
              >
                {isLoading ? <Spinner className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
              {resetForm.formState.errors.root && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-500 leading-snug">
                    {resetForm.formState.errors.root.message}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <input
                  type="text"
                  maxLength={6}
                  {...resetForm.register("otp")}
                  placeholder="6-Digit Code"
                  className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm tracking-widest font-mono text-center"
                />
                {resetForm.formState.errors.otp && (
                  <p className="text-xs text-destructive mt-1">{resetForm.formState.errors.otp.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <input
                  type="password"
                  {...resetForm.register("newPassword")}
                  placeholder="New Password"
                  className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                />
                {resetForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive mt-1">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all flex items-center justify-center mt-2 disabled:opacity-70 shadow-md shadow-primary/20"
              >
                {isLoading ? <Spinner className="w-5 h-5 animate-spin" /> : "Reset Password"}
              </button>
              
              <button
                disabled={isLoading}
                type="button"
                onClick={() => setStep(1)}
                className="w-full h-11 rounded-xl bg-transparent border border-border hover:bg-muted text-foreground font-medium text-sm transition-colors flex items-center justify-center mt-2 disabled:opacity-70 shadow-sm"
              >
                Back
              </button>
            </form>
          )}

          <div className="mt-4 pt-4 border-t border-border text-center">
            <Link href="/login" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Return to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

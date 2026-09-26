"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

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
      <div className="hidden lg:flex flex-1 relative bg-black items-center justify-center overflow-hidden flex-col p-12 text-white text-center">
        {/* Abstract Globe / Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
        
        {/* Brand Content */}
        <div className="relative z-10 max-w-md flex flex-col items-center">
          <Link href="/" className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-8 shadow-2xl hover:bg-white/20 transition-colors">
            <img src="/logo-dark.svg" alt="CodeSkill" className="w-10 h-10 object-contain" />
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Reset Your<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Password</span>
          </h1>
          <p className="text-lg text-gray-400">
            Securely regain access to your CodeSkill account and continue building your dream projects.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto bg-white dark:bg-zinc-950">
        {/* Subtle Background Pattern for Right Side */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 min-h-[120%]" />

        <div className="w-full max-w-[420px] flex flex-col gap-6 my-auto py-8">
          
          {/* Mobile Logo Header */}
          <div className="flex lg:hidden flex-col items-center text-center mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/5 bg-card border border-border">
              <img src="/logo.svg" alt="CodeSkill Logo" className="w-8 h-8 object-contain dark:hidden block" />
              <img src="/logo-dark.svg" alt="CodeSkill Logo" className="w-8 h-8 object-contain hidden dark:block" />
            </div>
          </div>

          <div className="mb-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Reset Password</h2>
            <p className="text-sm text-muted-foreground mt-4">
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
                  className="w-full h-12 bg-transparent border border-border rounded-md px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
                {emailForm.formState.errors.email && (
                  <p className="text-xs text-destructive mt-1">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full h-12 rounded-md bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm transition-all flex items-center justify-center mt-2 disabled:opacity-70 shadow-md"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
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
                  className="w-full h-12 bg-transparent border border-border rounded-md px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm tracking-widest font-medium text-center"
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
                  className="w-full h-12 bg-transparent border border-border rounded-md px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
                {resetForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive mt-1">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full h-12 rounded-md bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm transition-all flex items-center justify-center mt-2 disabled:opacity-70 shadow-md"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
              </button>
              
              <button
                disabled={isLoading}
                type="button"
                onClick={() => setStep(1)}
                className="w-full h-12 rounded-md bg-transparent border border-border hover:bg-muted text-foreground font-medium text-sm transition-colors flex items-center justify-center mt-2 disabled:opacity-70 shadow-sm"
              >
                Back
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Return to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

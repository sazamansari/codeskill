"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#1E293B] font-sans items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <img src="/logo-dark.svg" alt="CodeSkill Logo" className="w-8 h-8 object-contain filter invert" />
            <span className="text-xl font-bold tracking-tight text-[#0F172A]">CodeSkill</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-2">Reset Password</h2>
          <p className="text-[#64748B] text-sm text-center">
            {step === 1 ? "Enter your email to receive a reset code." : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            {emailForm.formState.errors.root && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[6px]">
                {emailForm.formState.errors.root.message}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#334155]">Email Address</label>
              <input
                type="email"
                {...emailForm.register("email")}
                placeholder="you@example.com"
                className="w-full h-11 bg-white border border-gray-300 rounded-[6px] px-3 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all text-sm"
              />
              {emailForm.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1">{emailForm.formState.errors.email.message}</p>
              )}
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full h-11 rounded-[6px] bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-semibold text-sm transition-colors flex items-center justify-center mt-2 disabled:opacity-70 shadow-sm"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
            {resetForm.formState.errors.root && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[6px]">
                {resetForm.formState.errors.root.message}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#334155]">6-Digit Code</label>
              <input
                type="text"
                maxLength={6}
                {...resetForm.register("otp")}
                placeholder="123456"
                className="w-full h-11 bg-white border border-gray-300 rounded-[6px] px-3 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all text-sm text-center tracking-[0.5em] font-mono text-lg"
              />
              {resetForm.formState.errors.otp && (
                <p className="text-xs text-red-500 mt-1">{resetForm.formState.errors.otp.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#334155]">New Password</label>
              <input
                type="password"
                {...resetForm.register("newPassword")}
                placeholder="••••••••"
                className="w-full h-11 bg-white border border-gray-300 rounded-[6px] px-3 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all text-sm"
              />
              {resetForm.formState.errors.newPassword && (
                <p className="text-xs text-red-500 mt-1">{resetForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full h-11 rounded-[6px] bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-semibold text-sm transition-colors flex items-center justify-center mt-2 disabled:opacity-70 shadow-sm"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
            </button>
            
            <button
              disabled={isLoading}
              type="button"
              onClick={() => setStep(1)}
              className="w-full h-11 rounded-[6px] bg-transparent border border-gray-200 hover:bg-gray-50 text-[#334155] font-semibold text-sm transition-colors flex items-center justify-center mt-2 disabled:opacity-70 shadow-sm"
            >
              Back
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <Link href="/login" className="text-sm font-medium text-[#2563EB] hover:underline transition-colors">
            Return to Login
          </Link>
        </div>

      </div>
    </div>
  );
}

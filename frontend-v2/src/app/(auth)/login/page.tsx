"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { LoginForm, LoginFormValues } from "@/components/auth/LoginForm";
import { Building2, ShieldCheck, Quote } from "lucide-react";

// Modal specific schemas
const forcePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Temporary password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Must contain at least one number.")
      .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ForcePasswordFormValues = z.infer<typeof forcePasswordSchema>;

export default function AppLoginPage() {
  const [loading, setLoading] = useState(false);
  const [showForcePasswordModal, setShowForcePasswordModal] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const { studentLogin, adminLogin, forceChangePassword } = useAuth();
  const router = useRouter();

  const forceForm = useForm<ForcePasswordFormValues>({
    resolver: zodResolver(forcePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const emailLower = data.email.toLowerCase().trim();

      if (emailLower.includes("@")) {
        const res = await adminLogin({ email: emailLower, password: data.password });
        if (res?.requireOTP) {
          router.push(`/admin/login?email=${encodeURIComponent(data.email)}`);
        } else {
          window.location.href = "/admin/dashboard";
        }
        return;
      }

      const res = await studentLogin({ uid: data.email.toUpperCase().trim(), password: data.password });
      if (res?.user?.forcePasswordChange) {
        forceForm.setValue("currentPassword", data.password);
        setShowForcePasswordModal(true);
      } else if (res?.user?.isAdmin) {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } finally {
      setLoading(false);
    }
  };

  const onForcePasswordSubmit = async (data: ForcePasswordFormValues) => {
    setLoading(true);
    try {
      await forceChangePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordChangeSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update password. Please try again.";
      forceForm.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Left Column - Visual Section */}
      <div className="hidden lg:flex flex-1 relative bg-muted/20 border-r border-border items-center justify-center overflow-hidden flex-col p-12 lg:p-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg flex flex-col justify-between h-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide mb-8">
              <ShieldCheck className="w-4 h-4" /> Secure Authentication
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-foreground leading-tight">
              Build your technical <br />
              foundation.
            </h1>
            <p className="text-xl text-foreground/90 font-medium leading-relaxed max-w-md">
              Access your personalized learning environment, track your progress, and master your technical skills securely.
            </p>
          </div>

          <div className="space-y-6 mt-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground">CodeSkill</h2>
              <p className="text-sm font-semibold text-primary mt-1">by Chandigarh University</p>
              <p className="text-xs text-muted-foreground mt-0.5">Department of Skill Development & Lab</p>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed max-w-md border-l-2 border-primary/30 pl-4 py-1">
              Standardized examination portal and algorithmic skill-building platform engineered for developers, students, and technical evaluations.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50 text-foreground/80 text-xs font-medium backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Proctored & Verified Examination Infrastructure
            </div>
          </div>

        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-background">
        <div className="w-full max-w-[400px] flex flex-col gap-8">

          <div className="flex flex-col">
            <div className="w-24 h-24 bg-card border border-border rounded-2xl p-2.5 flex items-center justify-center mb-6 shadow-sm">
              <img
                src="https://images.seeklogo.com/logo-png/43/1/chandigarh-university-cu-logo-png_seeklogo-432515.png"
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/cu-logo.png";
                }}
              />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Please enter your credentials to access your account.
            </p>
          </div>

          <LoginForm onSubmit={handleLogin} loading={loading} />

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground transition-colors">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
          </p>

          <div className="mt-4 pt-4 border-t border-border/50 text-center">
            <Link href="/" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              &larr; Return to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Modal: First-Time Mandatory Password Change */}
      {showForcePasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Mandatory Password Setup
                </h3>
                <p className="text-xs text-muted-foreground">
                  This is your first login. You must set a permanent secure password before proceeding.
                </p>
              </div>
            </div>

            {passwordChangeSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-emerald-400">
                  Password Updated Successfully!
                </h4>
                <p className="text-xs text-emerald-300">
                  Redirecting to your student assessment dashboard...
                </p>
              </div>
            ) : (
              <form
                onSubmit={forceForm.handleSubmit(onForcePasswordSubmit)}
                className="space-y-4"
              >
                {forceForm.formState.errors.root && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{forceForm.formState.errors.root.message}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Temporary / Initial Password
                  </label>
                  <input
                    type="password"
                    readOnly
                    className="w-full h-10 px-3 rounded-xl border border-border bg-muted/40 text-muted-foreground text-xs font-mono cursor-not-allowed"
                    {...forceForm.register("currentPassword")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    New Permanent Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special char"
                    className="w-full h-10 px-3 rounded-xl border border-border bg-muted/30 text-foreground text-xs focus:ring-2 focus:ring-primary outline-none"
                    {...forceForm.register("newPassword")}
                  />
                  {forceForm.formState.errors.newPassword && (
                    <p className="text-xs text-rose-400">
                      {forceForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter your new permanent password"
                    className="w-full h-10 px-3 rounded-xl border border-border bg-muted/30 text-foreground text-xs focus:ring-2 focus:ring-primary outline-none"
                    {...forceForm.register("confirmPassword")}
                  />
                  {forceForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-rose-400">
                      {forceForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-muted/30 border border-border/50 rounded-xl text-[11px] text-muted-foreground space-y-1">
                  <span className="font-semibold text-foreground block">Password Requirements:</span>
                  <p>• At least 8 characters long</p>
                  <p>• At least one uppercase letter (A-Z) and one number (0-9)</p>
                  <p>• At least one special symbol (!@#$%^&*)</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 animate-spin" /> Saving Password...
                    </>
                  ) : (
                    "Save Password & Enter Dashboard"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

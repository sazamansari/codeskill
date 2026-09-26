"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  GraduationCap,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight,
  Info,
  CheckCircle2,
  HelpCircle,
  X,
  Building,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const studentLoginSchema = z.object({
  uid: z
    .string()
    .min(3, { message: "University UID is required (min 3 characters)." })
    .transform((val) => val.trim().toUpperCase()),
  password: z
    .string()
    .min(1, { message: "Password is required." }),
});

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

type StudentLoginFormValues = z.infer<typeof studentLoginSchema>;
type ForcePasswordFormValues = z.infer<typeof forcePasswordSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showForcePasswordModal, setShowForcePasswordModal] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const { studentLogin, forceChangePassword, user } = useAuth();
  const router = useRouter();

  const form = useForm<StudentLoginFormValues>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: { uid: "", password: "" },
  });

  const forceForm = useForm<ForcePasswordFormValues>({
    resolver: zodResolver(forcePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: StudentLoginFormValues) => {
    setIsLoading(true);
    setEnteredPassword(data.password);
    try {
      const res = await studentLogin(data);
      if (res?.user?.forcePasswordChange) {
        forceForm.setValue("currentPassword", data.password);
        setShowForcePasswordModal(true);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      form.setError("root", {
        type: "manual",
        message:
          err.message ||
          "Invalid UID or password. Please verify your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onForcePasswordSubmit = async (data: ForcePasswordFormValues) => {
    setIsLoading(true);
    try {
      await forceChangePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordChangeSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      forceForm.setError("root", {
        type: "manual",
        message: err.message || "Failed to update password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Left Column - University Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary/20 via-card to-background border-r border-border items-center justify-center overflow-hidden flex-col p-12 text-foreground text-center">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:36px_36px] opacity-40" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-lg flex flex-col items-center">
          <div className="w-20 h-20 bg-card/80 backdrop-blur-md border border-border rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> University Assessment System
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
            CodeSkill Assessment Portal
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Secure, timed university examinations and evaluations. Please sign in
            using the official University Identification Number (UID) provided
            by your institution.
          </p>

          <div className="w-full bg-card/80 backdrop-blur-md rounded-2xl p-5 border border-border text-left text-xs space-y-2 text-muted-foreground">
            <div className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
              <Info className="w-4 h-4 text-primary" /> Candidate Notice:
            </div>
            <p>• Assessment sessions are monitored with anti-cheating audit telemetry.</p>
            <p>• First-time users will be prompted to set a personalized, secure password.</p>
            <p>• Ensure a stable internet connection before beginning your test.</p>
          </div>
        </div>
      </div>

      {/* Right Column - UID Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-card shadow-2xl">
        <div className="w-full max-w-md flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Student Sign In
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Enter your University UID and Assessment Password
            </p>
          </div>

          {/* Form Error Banner */}
          {form.formState.errors.root && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <span>{form.formState.errors.root.message}</span>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* UID Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="uid-input"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                University UID / Roll Number
              </label>
              <div className="relative">
                <input
                  id="uid-input"
                  type="text"
                  placeholder="e.g. CU202600123"
                  className="w-full h-11 px-3.5 pl-10 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm tracking-wide uppercase transition-all"
                  {...form.register("uid")}
                />
                <Building className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              </div>
              {form.formState.errors.uid && (
                <p className="text-xs text-rose-400 mt-1">
                  {form.formState.errors.uid.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password-input"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowSupportModal(true)}
                  className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" /> Contact Administrator
                </button>
              </div>
              <div className="relative">
                <input
                  id="password-input"
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full h-11 px-3.5 pl-10 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-all"
                  {...form.register("password")}
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-rose-400 mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="student-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground font-semibold rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  Enter Examination Portal <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Institutional Compliance Notice */}
          <div className="pt-4 border-t border-border text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Accounts are created and managed by your university administration. Public self-registration is disabled.
            </p>
          </div>
        </div>
      </div>

      {/* Modal 1: Contact Administrator / Forgot Password info */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-base">
                <Building className="w-5 h-5 text-primary" />
                <span>Institution Administration</span>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <p>
                To maintain assessment integrity, candidate accounts cannot be
                reset through public online links.
              </p>
              <div className="p-3.5 bg-muted/40 border border-border rounded-xl space-y-1.5 text-foreground">
                <span className="font-semibold block text-primary">Need your UID or Password?</span>
                <p>
                  1. Contact your department examination coordinator or lab proctor.
                </p>
                <p>
                  2. Present your valid student ID card for identity verification.
                </p>
                <p>
                  3. The administrator will issue a temporary one-time password and log
                  the security event.
                </p>
              </div>
              <p className="text-muted-foreground">
                For platform support emergencies during an active contest, alert your proctor immediately.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-semibold shadow-md shadow-primary/20"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: First-Time Mandatory Password Change */}
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
                  disabled={isLoading}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Password...
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

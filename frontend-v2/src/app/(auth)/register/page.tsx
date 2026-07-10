"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  otp: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const { register: registerUser, registerSendOTP, googleLogin } = useAuth();
  const router = useRouter();

  const googleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        await googleLogin(tokenResponse.access_token);
        router.push("/dashboard");
      } catch (err: any) {
        form.setError("root", { type: "manual", message: err.message || "Google login failed" });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      form.setError("root", { type: "manual", message: "Google Login failed" });
    }
  });

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    form.clearErrors("root");
    try {
      if (!showOTP) {
        // Step 1: Request OTP
        await registerSendOTP({ email: data.email });
        setShowOTP(true);
      } else {
        // Step 2: Verify OTP and Register
        if (!data.otp) {
          form.setError("otp", { type: "manual", message: "OTP is required" });
          return;
        }
        await registerUser(data);
        router.push("/dashboard");
      }
    } catch (err: any) {
      form.setError("root", { type: "manual", message: err.message || "Failed to register" });
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
            Join the<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">CodeSkill Community</span>
          </h1>
          <p className="text-lg text-gray-400">
            Home to millions of developers worldwide. Build your skills, prepare for interviews, and land your dream job.
          </p>
        </div>
      </div>

      {/* Right Column - Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto bg-white dark:bg-zinc-950">
        {/* Subtle Background Pattern for Right Side */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 min-h-[120%]" />

        <div className="w-full max-w-[420px] flex flex-col gap-6 my-auto py-8">
          
          {/* Mobile Logo Header */}
          <div className="flex lg:hidden flex-col items-center text-center mb-2">
            <Link href="/" className="flex items-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/5 bg-card border border-border">
                <img src="/logo.svg" alt="CodeSkill Logo" className="w-8 h-8 object-contain dark:hidden block" />
                <img src="/logo-dark.svg" alt="CodeSkill Logo" className="w-8 h-8 object-contain hidden dark:block" />
              </div>
            </Link>
          </div>

          <div className="mb-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create your account</h2>
            <h3 className="text-xl font-medium text-muted-foreground">Join us today</h3>
            <p className="text-sm text-muted-foreground mt-4">Start your coding journey with CodeSkill.</p>
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

            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Full Name"
                disabled={showOTP}
                {...form.register("name")}
                className="w-full h-12 bg-transparent border border-border rounded-md px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:opacity-50"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <input
                type="email"
                placeholder="Email address"
                disabled={showOTP}
                {...form.register("email")}
                className="w-full h-12 bg-transparent border border-border rounded-md px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:opacity-50"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <input
                type="password"
                placeholder="Create password"
                disabled={showOTP}
                {...form.register("password")}
                className="w-full h-12 bg-transparent border border-border rounded-md px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:opacity-50"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            {showOTP && (
              <div className="space-y-1.5 pt-2">
                <input
                  type="text"
                  placeholder="6-Digit Verification Code"
                  {...form.register("otp")}
                  className="w-full h-12 bg-transparent border border-border rounded-md px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm tracking-widest font-medium text-center"
                />
                {form.formState.errors.otp && (
                  <p className="text-xs text-destructive">{form.formState.errors.otp.message}</p>
                )}
              </div>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className="w-full h-12 rounded-md bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm transition-all flex items-center justify-center mt-2 disabled:opacity-70 shadow-md"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                showOTP ? "Verify & Register" : "Sign Up"
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <button 
              type="button"
              onClick={() => googleAuth()}
              className="h-11 flex items-center justify-center gap-2 border border-border bg-transparent rounded-md hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            
            <button type="button" className="h-11 flex items-center justify-center gap-2 border border-border bg-transparent rounded-md hover:bg-muted/50 transition-colors text-sm font-medium text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

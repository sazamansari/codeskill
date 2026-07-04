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
import { Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser, googleLogin } = useAuth();
  const router = useRouter();

  const handleGoogleSuccess = async (credential: string) => {
    setIsLoading(true);
    try {
      await googleLogin(credential);
      router.push("/dashboard");
    } catch (err: any) {
      form.setError("root", { type: "manual", message: err.message || "Google login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      router.push("/dashboard");
    } catch (err: any) {
      form.setError("root", { type: "manual", message: err.message || "Failed to register" });
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
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-2">Create your account</h2>
          <p className="text-[#64748B] text-sm">Join millions of developers worldwide</p>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="w-full flex justify-center h-11 mb-1">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  handleGoogleSuccess(credentialResponse.credential);
                }
              }}
              onError={() => {
                form.setError("root", { type: "manual", message: "Google Login failed" });
              }}
              shape="rectangular"
              size="large"
              width="356"
              text="signup_with"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="h-11 flex items-center justify-center gap-2 border border-gray-200 rounded-[6px] hover:bg-gray-50 transition-colors text-sm font-semibold text-[#0A66C2]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              LinkedIn
            </button>
            <button className="h-11 flex items-center justify-center gap-2 border border-gray-200 rounded-[6px] hover:bg-gray-50 transition-colors text-sm font-semibold text-[#334155]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {form.formState.errors.root && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[6px]">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#334155]">Name</label>
            <input
              type="text"
              {...form.register("name")}
              className="w-full h-11 bg-white border border-gray-300 rounded-[6px] px-3 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all text-sm"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#334155]">Email</label>
            <input
              type="email"
              {...form.register("email")}
              className="w-full h-11 bg-white border border-gray-300 rounded-[6px] px-3 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all text-sm"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#334155]">Password</label>
            <input
              type="password"
              {...form.register("password")}
              className="w-full h-11 bg-white border border-gray-300 rounded-[6px] px-3 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all text-sm"
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full h-11 rounded-[6px] bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-semibold text-sm transition-colors flex items-center justify-center mt-2 disabled:opacity-70 shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748B] mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-[#2563EB] hover:underline font-medium">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}

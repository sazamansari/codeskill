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
import { Loader2, ShieldCheck } from "lucide-react";

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  otp: z.string().optional(),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const { adminLogin, adminLoginVerify } = useAuth();
  const router = useRouter();

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "md.shadab.azam.ansari@gmail.com", password: "password123" },
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true);
    form.clearErrors("root");
    try {
      if (!showOTP) {
        const res = await adminLogin({ email: data.email, password: data.password });
        if (res.requireOTP) {
          setShowOTP(true);
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
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#1E293B] font-sans items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-2">Admin Portal</h2>
          <p className="text-[#64748B] text-sm">Secure access for CodeSkill administrators</p>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {form.formState.errors.root && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[6px]">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#334155]">Admin Email</label>
            <input
              type="email"
              placeholder="md.shadab.azam.ansari@gmail.com"
              disabled={showOTP}
              {...form.register("email")}
              className="w-full h-11 px-3 border border-gray-200 rounded-[6px] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all bg-white disabled:opacity-50"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 font-medium">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-semibold text-[#334155]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              disabled={showOTP}
              {...form.register("password")}
              className="w-full h-11 px-3 border border-gray-200 rounded-[6px] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all bg-white disabled:opacity-50"
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-500 font-medium">{form.formState.errors.password.message}</p>
            )}
          </div>

          {showOTP && (
            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-semibold text-[#334155]">Verification Code</label>
              <input
                type="text"
                placeholder="123456"
                {...form.register("otp")}
                className="w-full h-11 px-3 border border-gray-200 rounded-[6px] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all bg-white tracking-[0.2em] font-medium"
              />
              {form.formState.errors.otp && (
                <p className="text-xs text-red-500 font-medium">{form.formState.errors.otp.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-[6px] transition-colors flex items-center justify-center mt-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (showOTP ? "Verify Login" : "Authenticate as Admin")}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

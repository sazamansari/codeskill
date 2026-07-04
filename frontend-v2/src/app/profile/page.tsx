"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User as UserIcon, 
  Settings, 
  BookOpen, 
  Trophy, 
  Code2, 
  Target,
  CheckCircle2,
  Loader2,
  Building2,
  GraduationCap
} from "lucide-react";
import { useForm } from "react-hook-form";

type ProfileFormValues = {
  name: string;
  bio: string;
  institution: string;
  role: string;
  preferredLanguage: string;
};

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>();

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      // Pre-fill form values
      reset({
        name: user.name || "",
        bio: user.bio || "",
        institution: user.profile?.institution || "",
        role: user.profile?.role || "student",
        preferredLanguage: user.profile?.preferredLanguage || "python"
      });
    }
  }, [user, loading, router, reset]);

  if (!mounted || loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      await updateProfile({
        name: data.name,
        bio: data.bio,
        profile: {
          institution: data.institution,
          role: data.role,
          preferredLanguage: data.preferredLanguage
        }
      });
      setSuccessMessage("Profile updated successfully.");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const stats = [
    { label: "Total Solved", value: user.stats?.totalSolved || 0, icon: CheckCircle2, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
    { label: "Current Streak", value: `${user.stats?.currentStreak || 0} days`, icon: Trophy, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
    { label: "Total Submissions", value: user.stats?.totalSubmissions || 0, icon: Target, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#1E293B] font-sans min-h-screen">
      <div className="max-w-[1000px] mx-auto w-full px-6 py-8 mt-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-1">Profile Settings</h1>
            <p className="text-[#64748B]">Manage your account details and preferences.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: User Card & Stats */}
          <div className="space-y-6">
            
            {/* User Identification Card */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-[#E2E8F0] border-4 border-white shadow-md mx-auto mb-4 flex items-center justify-center overflow-hidden relative group cursor-pointer">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10 text-[#94A3B8]" />
                )}
                {/* Overlay for avatar edit (mock) */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-1">{user.name}</h2>
              <p className="text-[#64748B] text-sm mb-4">{user.email}</p>
              
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] text-xs font-semibold uppercase tracking-wider">
                {user.profile?.role || "Student"}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#0F172A] mb-4">Your Progress</h3>
              <div className="space-y-4">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${stat.bg} ${stat.color}`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[#334155] font-medium text-sm">{stat.label}</span>
                    </div>
                    <span className="text-[#0F172A] font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#64748B]" /> General Information
                </h3>
              </div>
              
              <div className="p-6">
                
                {successMessage && (
                  <div className="mb-6 p-4 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-[8px] flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> {successMessage}
                  </div>
                )}
                
                {errorMessage && (
                  <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-[8px] flex items-center gap-2 text-sm font-medium">
                    <span className="w-5 h-5 flex items-center justify-center bg-[#EF4444] text-white rounded-full text-xs font-bold">!</span> 
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#334155]">Full Name</label>
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className="w-full h-11 bg-white border border-gray-300 rounded-[6px] px-3 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all text-sm"
                      placeholder="e.g. Jane Doe"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  {/* Bio field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#334155]">Bio</label>
                    <textarea
                      {...register("bio")}
                      rows={4}
                      className="w-full bg-white border border-gray-300 rounded-[6px] p-3 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all text-sm resize-none"
                      placeholder="Tell us a little about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Institution */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#64748B]" /> Institution / Company
                      </label>
                      <input
                        type="text"
                        {...register("institution")}
                        className="w-full h-11 bg-white border border-gray-300 rounded-[6px] px-3 text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all text-sm"
                        placeholder="e.g. Stanford University"
                      />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#64748B]" /> Primary Role
                      </label>
                      <select
                        {...register("role")}
                        className="w-full h-11 bg-white border border-gray-300 rounded-[6px] px-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all text-sm appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right .5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                      >
                        <option value="student">Student</option>
                        <option value="professional">Professional Developer</option>
                        <option value="educator">Educator</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Language */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#334155] flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#64748B]" /> Preferred Language
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["python", "cpp", "java", "javascript"].map((lang) => (
                        <label key={lang} className="relative">
                          <input type="radio" value={lang} {...register("preferredLanguage")} className="peer sr-only" />
                          <div className="h-11 flex items-center justify-center rounded-[6px] border border-gray-200 bg-white cursor-pointer peer-checked:border-[#2563EB] peer-checked:bg-[#EFF6FF] peer-checked:text-[#1D4ED8] hover:bg-gray-50 transition-all">
                            <span className="text-sm font-semibold capitalize">{lang === "cpp" ? "C++" : lang}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      disabled={isSaving}
                      type="submit"
                      className="h-11 px-6 rounded-[6px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition-colors flex items-center justify-center disabled:opacity-70 shadow-sm"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

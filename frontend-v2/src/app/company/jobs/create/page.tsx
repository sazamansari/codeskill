"use client";

import { useState, useEffect } from "react";
import { companyJobsAPI, companyAPI } from "@/config/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Briefcase } from "lucide-react";
import Link from "next/link";

export default function CreateJobPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "", // Will split by comma
    experienceLevel: "Entry Level",
    workplaceType: "Remote",
    employmentType: "Full-time",
    location: "",
    salaryMin: "",
    salaryMax: "",
  });

  useEffect(() => {
    fetchCompanyContext();
  }, []);

  const fetchCompanyContext = async () => {
    try {
      setLoading(true);
      const res = await companyAPI.getMyCompanies();
      if (res.data.companies.length > 0) {
        setCompanyId(res.data.companies[0].company._id);
      } else {
        alert("Please create a company profile first.");
        router.push("/company/profile");
      }
    } catch (err) {
      console.error("Failed to load company", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;

    try {
      setSaving(true);
      
      const payload = {
        title: formData.title,
        description: formData.description,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        experienceLevel: formData.experienceLevel,
        workplaceType: formData.workplaceType,
        employmentType: formData.employmentType,
        location: formData.location,
        salaryRange: {
          min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
          max: formData.salaryMax ? Number(formData.salaryMax) : undefined,
          currency: "USD"
        },
        status: "Published"
      };

      await companyJobsAPI.create(companyId, payload);
      alert("Job posted successfully!");
      router.push("/company/jobs");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create job");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading context...</div>
      </div>
    );
  }

  return (
    <div className="p-8 font-sans max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/company/jobs" 
          className="p-2 bg-card border border-border hover:bg-muted text-muted-foreground rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Post a New Job
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Create a new opportunity to attract top candidates.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Job Details</h2>
              <p className="text-sm text-muted-foreground">The core information about this role.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Job Title *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Job Description *</label>
              <textarea 
                required
                rows={6}
                placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground resize-y"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Required Skills</label>
              <input 
                type="text" 
                placeholder="e.g. React, Node.js, TypeScript (comma separated)"
                value={formData.skills}
                onChange={e => setFormData({...formData, skills: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
              >
                <option value="Internship">Internship</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={e => setFormData({...formData, employmentType: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="mb-6 pb-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Location & Compensation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Workplace Type</label>
              <select
                value={formData.workplaceType}
                onChange={e => setFormData({...formData, workplaceType: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Office Location</label>
              <input 
                type="text" 
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Minimum Salary (USD)</label>
              <input 
                type="number" 
                placeholder="e.g. 80000"
                value={formData.salaryMin}
                onChange={e => setFormData({...formData, salaryMin: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Maximum Salary (USD)</label>
              <input 
                type="number" 
                placeholder="e.g. 120000"
                value={formData.salaryMax}
                onChange={e => setFormData({...formData, salaryMax: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Link 
            href="/company/jobs" 
            className="px-6 py-2.5 rounded-lg font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Publishing..." : "Publish Job"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { companyAPI } from "@/config/api";
import { Users, Briefcase, FileCheck, Target, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CompanyDashboardPage() {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyCompany();
  }, []);

  const fetchMyCompany = async () => {
    try {
      setLoading(true);
      const res = await companyAPI.getMyCompanies();
      if (res.data.companies.length > 0) {
        // For Phase 1, just load the first company the user belongs to
        const companyId = res.data.companies[0].company._id;
        const companyRes = await companyAPI.getCompany(companyId);
        setCompany(companyRes.data.company);
      }
    } catch (err) {
      console.error("Failed to load company", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-8 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <Briefcase className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to CodeSkill Work</h1>
        <p className="text-muted-foreground max-w-lg mb-8">
          It looks like you haven't registered a company yet. Set up your organization profile to start recruiting top talent.
        </p>
        <Link 
          href="/company/profile"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Create Company Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground">{company.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
              {company.isVerified && (
                <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-500/20">
                  Verified
                </span>
              )}
            </div>
            <p className="text-muted-foreground">{company.industry} • {company.headquarters || "Remote"}</p>
          </div>
        </div>
        
        <Link 
          href={`/${company.username}`} 
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium transition-colors"
        >
          View Public Page <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>

      {/* Stats Grid (Placeholders for Phase 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Jobs", value: "0", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Total Candidates", value: "0", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "Assessments Sent", value: "0", icon: Target, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "Hired", value: "0", icon: FileCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-start justify-between group hover:border-border/80 transition-colors">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</p>
              <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Overview Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Hiring Pipeline (Coming Soon)</h2>
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/30">
              <Users className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground font-medium">No candidates in pipeline</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Post a job to start receiving applications</p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/company/profile" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group">
                <span className="font-medium text-muted-foreground group-hover:text-foreground">Edit Company Profile</span>
                <span className="text-muted-foreground">→</span>
              </Link>
              <Link href="/company/jobs" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group">
                <span className="font-medium text-muted-foreground group-hover:text-foreground">Post a New Job</span>
                <span className="text-muted-foreground">→</span>
              </Link>
              <Link href="/company/team" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group">
                <span className="font-medium text-muted-foreground group-hover:text-foreground">Invite Recruiters</span>
                <span className="text-muted-foreground">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { campusAPI } from "@/config/api";
import { GraduationCap, Users, BookOpen, ExternalLink, Target } from "lucide-react";
import Link from "next/link";

export default function CampusDashboardPage() {
  const [university, setUniversity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyUniversity();
  }, []);

  const fetchMyUniversity = async () => {
    try {
      setLoading(true);
      const res = await campusAPI.getMyUniversities();
      if (res.data.universities.length > 0) {
        const id = res.data.universities[0].university._id;
        const uniRes = await campusAPI.getUniversity(id);
        setUniversity(uniRes.data.university);
      }
    } catch (err) {
      console.error("Failed to load university", err);
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

  if (!university) {
    return (
      <div className="p-8 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <GraduationCap className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to CodeSkill Campus</h1>
        <p className="text-muted-foreground max-w-lg mb-8">
          Register your university to start tracking student performance, managing batches, and participating in campus placements.
        </p>
        <Link 
          href="/campus/profile"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Create University Profile
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
            {university.logo ? (
              <img src={university.logo} alt={university.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground">{university.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-foreground">{university.name}</h1>
              {university.isVerified && (
                <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">
                  Verified
                </span>
              )}
            </div>
            <p className="text-muted-foreground">{university.domain} • {university.location || "Location not set"}</p>
          </div>
        </div>
        
        <Link 
          href={`/${university.username}`} 
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium transition-colors"
        >
          View Public Page <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>

      {/* Stats Grid (Placeholders for Phase 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Batches", value: "0", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Total Students", value: "0", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Avg. Problems Solved", value: "0", icon: Target, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Campus Placements", value: "0", icon: GraduationCap, color: "text-amber-500", bg: "bg-amber-500/10" },
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
            <h2 className="text-lg font-bold text-foreground mb-4">Student Performance Overview (Coming Soon)</h2>
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/30">
              <Users className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground font-medium">No students enrolled</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Create a batch and invite students to see analytics</p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/campus/profile" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group">
                <span className="font-medium text-muted-foreground group-hover:text-foreground">Edit University Profile</span>
                <span className="text-muted-foreground">→</span>
              </Link>
              <div className="flex items-center justify-between p-3 rounded-lg opacity-50 cursor-not-allowed">
                <span className="font-medium text-muted-foreground">Create New Batch (Phase 2)</span>
                <span className="text-muted-foreground">→</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg opacity-50 cursor-not-allowed">
                <span className="font-medium text-muted-foreground">Invite Faculty (Phase 2)</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

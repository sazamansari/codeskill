"use client";

import { useEffect, useState } from "react";
import { companyApplicationsAPI, companyAPI } from "@/config/api";
import { Users, GripVertical, FileText, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";

const STAGES = ["Applied", "Assessment", "Interview", "Technical Round", "HR Round", "Offer", "Hired", "Rejected"];

export default function CandidatesPipelinePage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await companyAPI.getMyCompanies();
      if (res.data.companies.length > 0) {
        const id = res.data.companies[0].company._id;
        setCompanyId(id);
        fetchApplications(id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to load company context", err);
      setLoading(false);
    }
  };

  const fetchApplications = async (cId: string) => {
    try {
      const res = await companyApplicationsAPI.getAll(cId);
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMock = async () => {
    if (!companyId) return;
    try {
      setGenerating(true);
      await companyApplicationsAPI.generateMock(companyId);
      await fetchApplications(companyId);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to generate mocks");
    } finally {
      setGenerating(false);
    }
  };

  // --- HTML5 Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData("appId", appId);
    // Optional: make it look slightly transparent while dragging
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = "0.5";
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = "1";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData("appId");
    if (!appId || !companyId) return;

    // Optimistically update UI
    setApplications(prev => prev.map(app => 
      app._id === appId ? { ...app, stage: targetStage } : app
    ));

    // Persist to backend
    try {
      await companyApplicationsAPI.updateStage(companyId, appId, targetStage);
    } catch (err) {
      console.error("Failed to update stage", err);
      // Revert on failure
      fetchApplications(companyId);
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading hiring pipeline...</div>
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="p-8 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">No Company Found</h1>
        <p className="text-muted-foreground mb-8">Please create a company profile first before managing candidates.</p>
        <Link href="/company/profile" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium">Create Company Profile</Link>
      </div>
    );
  }

  // Group applications by stage
  const groupedApps = STAGES.reduce((acc, stage) => {
    acc[stage] = applications.filter(app => app.stage === stage);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-8 h-full flex flex-col min-w-0">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hiring Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-1">Drag and drop candidates across stages.</p>
        </div>
        
        <button 
          onClick={handleGenerateMock}
          disabled={generating}
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-colors disabled:opacity-50"
        >
          {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {generating ? "Generating..." : "Generate Mock Candidates"}
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-6 h-full min-w-max items-start">
          {STAGES.map((stage) => (
            <div 
              key={stage} 
              className="w-80 h-full max-h-full flex flex-col bg-muted/30 border border-border rounded-xl shrink-0"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-card/50 rounded-t-xl shrink-0">
                <h3 className="font-semibold text-foreground">{stage}</h3>
                <span className="bg-background text-muted-foreground text-xs font-bold px-2.5 py-1 rounded-full border border-border">
                  {groupedApps[stage].length}
                </span>
              </div>

              {/* Column Content */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {groupedApps[stage].length === 0 ? (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-border/50 rounded-lg text-muted-foreground/50 text-sm">
                    Drop candidates here
                  </div>
                ) : (
                  groupedApps[stage].map((app) => (
                    <div 
                      key={app._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app._id)}
                      onDragEnd={handleDragEnd}
                      className="bg-card border border-border p-4 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                            {app.user?.avatar ? (
                              <img src={app.user.avatar} alt={app.user.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-medium text-muted-foreground text-xs">{app.user?.name?.charAt(0) || 'U'}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm leading-tight">{app.user?.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate w-32">{app.job?.title}</p>
                          </div>
                        </div>
                        <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                        <button className="text-blue-500 hover:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 p-1.5 rounded text-xs transition-colors" title="View Resume">
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

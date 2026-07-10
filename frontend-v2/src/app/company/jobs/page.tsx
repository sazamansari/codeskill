"use client";

import { useEffect, useState } from "react";
import { companyJobsAPI, companyAPI } from "@/config/api";
import { Search, Briefcase, Plus, MapPin, Clock, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);

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
        fetchJobs(id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to load company context", err);
      setLoading(false);
    }
  };

  const fetchJobs = async (cId: string) => {
    try {
      const res = await companyJobsAPI.getAll(cId);
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string, jobTitle: string) => {
    if (!companyId) return;
    if (confirm(`Are you sure you want to delete the job posting for "${jobTitle}"?`)) {
      try {
        await companyJobsAPI.delete(companyId, jobId);
        fetchJobs(companyId);
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete job");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading jobs...</div>
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="p-8 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">No Company Found</h1>
        <p className="text-muted-foreground mb-8">Please create a company profile first before managing jobs.</p>
        <Link href="/company/profile" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium">Create Company Profile</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Postings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage active openings and recruit top engineering talent.</p>
        </div>
        <Link 
          href="/company/jobs/create" 
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Post a Job
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-foreground transition-all"
            />
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {jobs.length} Active {jobs.length === 1 ? 'Job' : 'Jobs'}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-3">Job Role</th>
                <th className="px-6 py-3">Location & Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                        <Briefcase className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium">No active jobs</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Post a new job to start hiring.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground text-base">{job.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-2">
                        {job.skills?.slice(0, 3).map((skill: string) => (
                          <span key={skill} className="px-2 py-0.5 bg-muted rounded-md border border-border">{skill}</span>
                        ))}
                        {job.skills?.length > 3 && <span className="px-2 py-0.5 bg-muted rounded-md border border-border">+{job.skills.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-foreground font-medium mb-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {job.workplaceType} {job.location && `- ${job.location}`}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        {job.employmentType} • {job.experienceLevel}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === "Published" ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        job.status === "Closed" ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors" title="Edit Job">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(job._id, job.title)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors" 
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

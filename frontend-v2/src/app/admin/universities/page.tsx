"use client";

import { useEffect, useState } from "react";
import { adminUniversitiesAPI } from "@/config/api";
import { Search, GraduationCap, BadgeCheck, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUniversities();
  }, [search]); // Normally debounce this

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await adminUniversitiesAPI.getAll(search);
      setUniversities(res.data.universities);
    } catch (err) {
      console.error("Failed to fetch universities", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to toggle verification for ${name}?`)) {
      try {
        await adminUniversitiesAPI.toggleVerify(id);
        fetchUniversities();
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to verify university");
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`CRITICAL WARNING: Are you sure you want to permanently delete ${name}? This action cannot be undone.`)) {
      try {
        await adminUniversitiesAPI.delete(id);
        fetchUniversities();
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete university");
      }
    }
  };

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Registered Universities</h1>
          <p className="text-muted-foreground text-sm mt-1">View, verify, and manage all academic institutions using the platform.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search universities by name or domain..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-foreground transition-all"
            />
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {universities.length} {universities.length === 1 ? 'university' : 'universities'}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-3">Institution Details</th>
                <th className="px-6 py-3">Tier</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Registered On</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading universities...</td>
                </tr>
              ) : universities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                        <GraduationCap className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium">No universities found</p>
                      <p className="text-xs text-muted-foreground/70">There are no institutions matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                universities.map((uni) => (
                  <tr key={uni._id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                          {uni.logo ? (
                            <img src={uni.logo} alt={uni.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-lg text-muted-foreground">{uni.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-1.5">
                            <Link href={`/${uni.username}`} target="_blank" className="hover:text-blue-500 hover:underline transition-colors">
                              {uni.name}
                            </Link>
                            {uni.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">{uni.domain}</div>
                          <div className="text-[10px] text-muted-foreground/70 mt-1 uppercase tracking-wider">
                            Owner: {uni.createdBy?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {uni.tier || <span className="text-muted-foreground italic">Not ranked</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        uni.isVerified ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {uni.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(uni.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleVerify(uni._id, uni.name)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                            uni.isVerified 
                              ? "bg-muted text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500" 
                              : "bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white"
                          }`}
                          title={uni.isVerified ? "Revoke Verification" : "Verify University"}
                        >
                          {uni.isVerified ? "Revoke" : "Verify"}
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(uni._id, uni.name)}
                          className="p-1.5 bg-muted text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors"
                          title="Delete University"
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

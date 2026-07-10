"use client";

import { useEffect, useState } from "react";
import { campusStudentsAPI, campusAPI } from "@/config/api";
import { Search, Users, RefreshCw, Sparkles, Filter } from "lucide-react";
import Link from "next/link";

export default function CampusStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityId, setUniversityId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await campusAPI.getMyUniversities();
      if (res.data.universities.length > 0) {
        const id = res.data.universities[0].university._id;
        setUniversityId(id);
        fetchStudents(id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to load university context", err);
      setLoading(false);
    }
  };

  const fetchStudents = async (uId: string) => {
    try {
      const res = await campusStudentsAPI.getAll(uId);
      setStudents(res.data.students);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMock = async () => {
    if (!universityId) return;
    try {
      setGenerating(true);
      await campusStudentsAPI.generateMock(universityId);
      await fetchStudents(universityId);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to generate mock students");
    } finally {
      setGenerating(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.student?.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.student?.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.batch?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading student directory...</div>
      </div>
    );
  }

  if (!universityId) {
    return (
      <div className="p-8 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">No University Found</h1>
        <p className="text-muted-foreground mb-8">Please create a university profile first before viewing the directory.</p>
        <Link href="/campus/profile" className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium">Create University Profile</Link>
      </div>
    );
  }

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">Master roster of all students enrolled across all batches.</p>
        </div>
        <button 
          onClick={handleGenerateMock}
          disabled={generating}
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-colors disabled:opacity-50"
        >
          {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {generating ? "Generating..." : "Generate Mock Students"}
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search students by name, email, roll number or batch..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-foreground transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-md border border-border text-xs font-medium transition-colors">
              <Filter className="w-3.5 h-3.5" /> Filter by Batch
            </button>
            <div className="text-sm text-muted-foreground font-medium border-l border-border pl-3">
              {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-3">Student Identity</th>
                <th className="px-6 py-3">Assigned Batch</th>
                <th className="px-6 py-3">Roll Number</th>
                <th className="px-6 py-3">Enrollment Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium">No students found</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Try adjusting your search query or generate mock students.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                          {s.student?.avatar ? (
                            <img src={s.student.avatar} alt={s.student.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-muted-foreground text-sm">{s.student?.name?.charAt(0) || 'U'}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{s.student?.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{s.student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground text-sm">{s.batch?.name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                        Class of {s.batch?.graduationYear}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground font-mono text-sm">
                      {s.rollNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(s.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/candidates/${s.student?._id}`}
                        target="_blank"
                        className="text-emerald-500 hover:text-emerald-600 font-medium text-xs hover:underline"
                      >
                        View Report
                      </Link>
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

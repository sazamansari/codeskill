"use client";

import { useEffect, useState } from "react";
import { campusBatchesAPI, campusAPI } from "@/config/api";
import { Users, ArrowLeft, Download, Mail } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BatchDetailsPage() {
  const { id } = useParams();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityId, setUniversityId] = useState<string | null>(null);
  
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await campusAPI.getMyUniversities();
      if (res.data.universities.length > 0) {
        const uId = res.data.universities[0].university._id;
        setUniversityId(uId);
        fetchStudents(uId, id as string);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to load university context", err);
      setLoading(false);
    }
  };

  const fetchStudents = async (uId: string, batchId: string) => {
    try {
      const res = await campusBatchesAPI.getStudents(uId, batchId);
      setStudents(res.data.students);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading batch details...</div>
      </div>
    );
  }

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/campus/batches" 
            className="p-2 bg-card border border-border hover:bg-muted text-muted-foreground rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Enrolled Students</h1>
            <p className="text-muted-foreground text-sm mt-1">View all candidates enrolled in this batch.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 bg-card border border-border hover:bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Mail className="w-4 h-4 text-muted-foreground" /> Email All
          </button>
          <button className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/20 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-muted/30">
          <div className="text-sm font-medium text-foreground">
            {students.length} Total Enrolled
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Roll Number</th>
                <th className="px-6 py-3">Enrollment Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium">No students enrolled yet</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Share the invite code for this batch with your students so they can join.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((enrollment) => (
                  <tr key={enrollment._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                          {enrollment.student?.avatar ? (
                            <img src={enrollment.student.avatar} alt={enrollment.student.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-medium text-muted-foreground text-xs">{enrollment.student?.name?.charAt(0) || 'U'}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{enrollment.student?.name}</div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">{enrollment.student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground font-mono text-xs">
                      {enrollment.rollNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(enrollment.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/candidates/${enrollment.student?._id}`}
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

"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Download,
  Search,
  RefreshCw,
  BarChart3,
  Calendar,
  Eye,
  X,
  Mic,
  Maximize2,
  FileText,
  Key
} from "lucide-react";
import { adminAssessmentsAPI } from "@/config/api";

export default function AssessmentResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const res = await adminAssessmentsAPI.getResults(id);
      setData(res.data);
    } catch (err) {
      console.error("Failed to load results:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [id]);

  const handleExportCSV = () => {
    if (!data || !data.attempts || data.attempts.length === 0) return;

    const headers = [
      "Student UID",
      "Student Name",
      "Email",
      "Score",
      "Max Score",
      "Percentage",
      "Result",
      "Total Attempted",
      "Total Correct",
      "Total Wrong",
      "Accuracy (%)",
      "Time Spent (sec)",
      "Tab Switches",
      "Total Violations",
      "Submitted At",
    ];

    const rows = data.attempts.map((a: any) => [
      a.studentUid,
      `"${a.studentName}"`,
      a.studentEmail,
      a.score,
      a.maxScore,
      `${a.percentage}%`,
      a.passed ? "PASSED" : "FAILED",
      a.totalAttempted,
      a.totalCorrect,
      a.totalWrong,
      `${a.accuracy}%`,
      a.timeSpentSeconds,
      a.tabSwitchCount || 0,
      a.violations?.length || 0,
      a.submittedAt ? new Date(a.submittedAt).toISOString() : "IN_PROGRESS",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e: any[]) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `assessment_results_${data?.assessment?.code || id}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAttempts = (data?.attempts || []).filter((a: any) => {
    const q = search.toLowerCase();
    return (
      (a.studentUid && a.studentUid.toLowerCase().includes(q)) ||
      (a.studentName && a.studentName.toLowerCase().includes(q)) ||
      (a.studentEmail && a.studentEmail.toLowerCase().includes(q))
    );
  });

  const getViolationIcon = (type: string) => {
    switch (type) {
      case "voice_detected":
        return <Mic className="w-3.5 h-3.5 text-amber-400" />;
      case "shortcut_attempt":
        return <Key className="w-3.5 h-3.5 text-rose-400" />;
      case "fullscreen_exit":
        return <Maximize2 className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/assessments"
            className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {data?.assessment?.title || "Assessment Results"}
              </h1>
              {data?.assessment?.code && (
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                  {data.assessment.code}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Candidate performance scores, pass rates, and proctoring telemetry audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={!data?.attempts || data.attempts.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-primary" /> Export Results (.CSV)
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {data?.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-5 rounded-2xl">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" /> Candidates
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2 font-mono">
              {data.stats.totalCandidates}
            </div>
          </div>

          <div className="bg-card border border-emerald-500/30 p-5 rounded-2xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Pass Rate
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
              {data.stats.passPercentage}%
            </div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              {data.stats.passedCount} of {data.stats.totalCandidates} passed
            </span>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-primary" /> Avg Score
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2 font-mono">
              {data.stats.avgScore} <span className="text-xs text-muted-foreground">/ {data.assessment.totalMarks}</span>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" /> Submissions
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2 font-mono">
              {data.stats.submittedCount}
            </div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              Completed attempts
            </span>
          </div>
        </div>
      )}

      {/* Candidate Attempts Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student UID or name..."
              className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            onClick={fetchResults}
            className="p-1.5 border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg text-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
            Loading test results...
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            No student attempt records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-foreground">
              <thead className="bg-muted/30 uppercase text-[10px] font-bold text-foreground border-b border-border">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">UID</th>
                  <th className="p-3.5 text-center">Score</th>
                  <th className="p-3.5 text-center">Accuracy</th>
                  <th className="p-3.5 text-center">Result</th>
                  <th className="p-3.5 text-center">Time Spent</th>
                  <th className="p-3.5 text-center">Proctoring Telemetry</th>
                  <th className="p-3.5 text-right">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAttempts.map((att: any) => {
                  const totalV = att.violations?.length || 0;
                  const isSuspicious = totalV >= 3 || (att.tabSwitchCount || 0) >= 3;

                  return (
                    <tr key={att._id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-foreground">{att.studentName}</div>
                        <div className="text-[11px] text-muted-foreground">{att.studentEmail}</div>
                      </td>
                      <td className="p-3.5 font-mono font-medium text-foreground">
                        {att.studentUid}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="font-bold text-foreground text-sm">{att.score}</span>
                        <span className="text-[11px] text-muted-foreground"> / {att.maxScore}</span>
                      </td>
                      <td className="p-3.5 text-center font-medium text-foreground">
                        {att.accuracy || 0}%
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            att.passed
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {att.passed ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> PASSED
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> FAILED
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono">
                        {Math.floor((att.timeSpentSeconds || 0) / 60)}m {(att.timeSpentSeconds || 0) % 60}s
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setSelectedCandidate(att)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                            isSuspicious
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                              : totalV > 0
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                          }`}
                          title="Click to view proctoring audit log"
                        >
                          <Eye className="w-3 h-3" />
                          <span>
                            {totalV === 0 ? "Clean (0 Flags)" : `${totalV} Incident${totalV > 1 ? "s" : ""}`}
                          </span>
                        </button>
                      </td>
                      <td className="p-3.5 text-right font-mono text-[11px]">
                        {att.submittedAt ? new Date(att.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "In Progress"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Proctoring Violation Telemetry Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-xl w-full space-y-5 animate-in fade-in zoom-in-95 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Proctoring Telemetry Audit</h3>
                  <p className="text-xs text-muted-foreground">
                    Candidate: <strong>{selectedCandidate.studentName}</strong> ({selectedCandidate.studentUid})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Candidate Summary Pills */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-xl bg-muted/30 border border-border font-mono">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Score</span>
                <div className="font-bold text-foreground">{selectedCandidate.score} / {selectedCandidate.maxScore}</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Accuracy</span>
                <div className="font-bold text-foreground">{selectedCandidate.accuracy || 0}%</div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Tab Switches</span>
                <div className="font-bold text-amber-400">{selectedCandidate.tabSwitchCount || 0}</div>
              </div>
            </div>

            {/* Infraction Log List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[200px]">
              {(!selectedCandidate.violations || selectedCandidate.violations.length === 0) ? (
                <div className="text-center py-10 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-sm font-semibold text-foreground">Clean Exam Session</div>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    No suspicious shortcuts, tab switches, audio disturbances, or fullscreen violations were detected during this attempt.
                  </p>
                </div>
              ) : (
                selectedCandidate.violations.map((v: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-muted/40 border border-border/80 text-xs flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 p-1 rounded-lg bg-background border border-border">
                        {getViolationIcon(v.type)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground capitalize">
                          {v.type ? v.type.replace(/_/g, " ") : "Proctoring Alert"}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {v.details || "Security incident recorded during exam session"}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      {v.timestamp ? new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "Logged"}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-sm"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Trophy, 
  Clock, 
  Award, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  RefreshCw,
  Search,
  Sparkles,
  BarChart3,
  RotateCcw,
  GraduationCap
} from "lucide-react";
import { studentAssessmentsAPI } from "@/config/api";
import { useAuth } from "@/context/AuthContext";

export default function StudentAssessmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"available" | "completed">("available");
  const [retakingId, setRetakingId] = useState<string | null>(null);

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      const res = await studentAssessmentsAPI.getMyAssessments();
      setAssessments(res.data.assessments || []);
    } catch (err) {
      console.error("Failed to load student assessments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = async (assessmentId: string) => {
    setRetakingId(assessmentId);
    try {
      await studentAssessmentsAPI.retakeAttempt(assessmentId);
      router.push(`/assessments/${assessmentId}/take`);
    } catch (err) {
      console.error("Failed to initiate reattempt:", err);
      router.push(`/assessments/${assessmentId}/take`);
    } finally {
      setRetakingId(null);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const availableTests = assessments.filter(
    (a) => a.attemptStatus !== "submitted" && a.attemptStatus !== "auto_submitted"
  );
  const completedTests = assessments.filter(
    (a) => a.attemptStatus === "submitted" || a.attemptStatus === "auto_submitted"
  );

  const displayedTests = filterTab === "available" ? availableTests : completedTests;

  return (
    <div className="flex-1 bg-white text-slate-900 font-sans min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 mt-16 md:mt-24 space-y-6">
        {/* Banner with Official CU Branding */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-200">
            <div className="w-10 h-10 rounded-md overflow-hidden bg-white shrink-0 border border-slate-200 p-0.5 flex items-center justify-center">
              <img
                src="https://images.seeklogo.com/logo-png/43/1/chandigarh-university-cu-logo-png_seeklogo-432515.png"
                alt="Chandigarh University"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/cu-logo.png";
                }}
              />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Chandigarh University</p>
              <p className="text-[10px] text-[#c8102e] font-semibold uppercase tracking-wider">Academic Assessment & Evaluation Portal</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-[#c8102e] border border-red-200 text-xs font-semibold mb-3">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Chandigarh University Examination System</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Course Assessments & Examinations
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
                Take standardized timed tests, evaluate your core engineering concepts, and track verified institutional benchmarks.
              </p>
            </div>

            {user?.uid && (
              <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-md text-left md:text-right shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Enrolled Candidate
                </span>
                <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{user.name}</div>
                <div className="text-xs font-mono text-[#c8102e] font-semibold">{user.uid}</div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              onClick={() => setFilterTab("available")}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                filterTab === "available"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Available Tests ({availableTests.length})
            </button>
            <button
              onClick={() => setFilterTab("completed")}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                filterTab === "completed"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Completed ({completedTests.length})
            </button>
          </div>

          <button
            onClick={fetchAssessments}
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-md text-xs transition-colors"
            title="Refresh Assessments"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Assessment Cards */}
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
            Loading assigned assessments...
          </div>
        ) : displayedTests.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-3xl p-8 space-y-3">
            <Trophy className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
            <h3 className="text-base font-bold text-foreground">
              {filterTab === "available"
                ? "No pending assessments"
                : "No completed assessments yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {filterTab === "available"
                ? "You have completed all scheduled tests or no upcoming exams are assigned to your batch."
                : "Complete a scheduled assessment to view your score and detailed performance review."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayedTests.map((test) => (
              <div
                key={test._id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-6 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {test.code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-semibold capitalize ${
                        test.attemptStatus === "submitted"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-[#c8102e] border border-red-200"
                      }`}
                    >
                      {test.attemptStatus === "submitted" ? "Completed" : "Ready to Start"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 hover:text-[#c8102e] transition-colors">
                    {test.title}
                  </h3>
                  {test.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {test.description}
                    </p>
                  )}

                  {/* Test Details */}
                  <div className="grid grid-cols-3 gap-2 py-3.5 my-3.5 border-y border-slate-200 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#c8102e]" /> Duration
                      </span>
                      <p className="font-bold text-slate-800">{test.durationMinutes} mins</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#c8102e]" /> Questions
                      </span>
                      <p className="font-bold text-slate-800">{test.questionCount} Questions</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-600" /> Total Marks
                      </span>
                      <p className="font-bold text-slate-800">{test.totalMarks} pts</p>
                    </div>
                  </div>

                  {test.proctoring && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                      <span>Proctored (Tab & Window Monitor Active)</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  {test.attemptStatus === "submitted" ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                      <div className="text-xs">
                        <span className="text-slate-500">Best Score: </span>
                        <strong className="text-slate-900 text-sm font-mono">{test.attemptScore} / {test.totalMarks} pts</strong>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            test.attemptPassed
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {test.attemptPassed ? "PASSED" : "COMPLETED"}
                        </span>
                        {test.totalAttempts && test.totalAttempts > 1 && (
                          <span className="ml-2 text-[10px] text-slate-500 font-mono">
                            ({test.totalAttempts} attempts)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {test.canRetake ? (
                          <button
                            type="button"
                            onClick={() => handleRetake(test._id)}
                            disabled={retakingId === test._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#c8102e] text-xs font-semibold rounded-md border border-red-200 transition-colors disabled:opacity-50"
                          >
                            <RotateCcw className={`w-3.5 h-3.5 ${retakingId === test._id ? "animate-spin" : ""}`} />
                            <span>{retakingId === test._id ? "Launching..." : "Re-attempt"}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-500 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                            1 Attempt Allowed
                          </span>
                        )}

                        <Link
                          href={`/assessments/${test._id}/result`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition-colors border border-slate-200"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-[#c8102e]" /> Scorecard
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-slate-500 font-medium">
                        {test.allowedAttempts === 1
                          ? "1 Attempt Allowed"
                          : test.allowedAttempts === 0
                          ? "Multiple Attempts Allowed"
                          : `${test.allowedAttempts} Attempts Allowed`}
                      </span>
                      <Link
                        href={`/assessments/${test._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c8102e] hover:bg-[#a90c25] active:bg-[#910b20] text-white text-xs font-semibold rounded-md transition-all shadow-xs"
                      >
                        Start Test <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

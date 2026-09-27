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
  RotateCcw
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
    <div className="flex-1 bg-background text-foreground font-sans min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8 mt-16 md:mt-24 space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" /> University Assessment Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                MCQ Assessments & Exams
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
                Take standardized timed tests, evaluate your core engineering concepts, and track verified institutional benchmarks.
              </p>
            </div>

            {user?.uid && (
              <div className="bg-card/80 border border-border px-5 py-3 rounded-2xl text-left md:text-right shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Enrolled Candidate
                </span>
                <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">{user.name}</div>
                <div className="text-xs font-mono text-primary font-medium">{user.uid}</div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl border border-border">
            <button
              onClick={() => setFilterTab("available")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterTab === "available"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Available Tests ({availableTests.length})
            </button>
            <button
              onClick={() => setFilterTab("completed")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterTab === "completed"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Completed ({completedTests.length})
            </button>
          </div>

          <button
            onClick={fetchAssessments}
            className="p-2 border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl text-xs transition-colors"
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
                className="bg-card border border-border hover:border-primary/40 rounded-2xl p-6 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                      {test.code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        test.attemptStatus === "submitted"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {test.attemptStatus === "submitted" ? "Completed" : "Ready to Start"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                    {test.title}
                  </h3>
                  {test.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {test.description}
                    </p>
                  )}

                  {/* Test Details */}
                  <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-border/60 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary" /> Duration
                      </span>
                      <p className="font-bold text-foreground">{test.durationMinutes} mins</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Layers className="w-3 h-3 text-primary" /> Questions
                      </span>
                      <p className="font-bold text-foreground">{test.questionCount} Questions</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-400" /> Total Marks
                      </span>
                      <p className="font-bold text-foreground">{test.totalMarks} pts</p>
                    </div>
                  </div>

                  {test.proctoring && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      <span>Proctored (Tab & Window Monitor Active)</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border/40">
                  {test.attemptStatus === "submitted" ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Best Score: </span>
                        <strong className="text-foreground text-sm font-mono">{test.attemptScore} / {test.totalMarks} pts</strong>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            test.attemptPassed
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {test.attemptPassed ? "PASSED" : "COMPLETED"}
                        </span>
                        {test.totalAttempts && test.totalAttempts > 1 && (
                          <span className="ml-2 text-[10px] text-muted-foreground font-mono">
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded-xl border border-primary/20 transition-colors disabled:opacity-50"
                          >
                            <RotateCcw className={`w-3.5 h-3.5 ${retakingId === test._id ? "animate-spin" : ""}`} />
                            <span>{retakingId === test._id ? "Launching..." : "Re-attempt"}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-medium text-muted-foreground px-2.5 py-1 rounded-lg bg-muted/40 border border-border">
                            1 Attempt Allowed
                          </span>
                        )}

                        <Link
                          href={`/assessments/${test._id}/result`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl transition-colors border border-border"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-primary" /> View Scorecard
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-muted-foreground font-medium">
                        {test.allowedAttempts === 1
                          ? "1 Attempt Allowed"
                          : test.allowedAttempts === 0
                          ? "Multiple Attempts Allowed"
                          : `${test.allowedAttempts} Attempts Allowed`}
                      </span>
                      <Link
                        href={`/assessments/${test._id}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl transition-all shadow-md shadow-primary/20"
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

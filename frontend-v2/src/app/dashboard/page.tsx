"use client";

import {
  Code2,
  GitCommit,
  Trophy,
  CheckCircle2,
  Clock,
  ChevronRight,
  Target,
  BookOpen,
  ArrowRight,
  BarChart3,
  ClipboardList,
  Loader2,
  AlertCircle,
  Play,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { studentAssessmentsAPI } from "@/config/api";

interface Assessment {
  _id: string;
  title: string;
  description?: string;
  status: "draft" | "published" | "ongoing" | "completed" | "archived";
  duration?: number;
  durationMinutes?: number;
  totalQuestions?: number;
  questionCount?: number;
  totalMarks?: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  attemptStatus?: string;
  attemptScore?: number | null;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentsLoading, setAssessmentsLoading] = useState(true);
  const [assessmentsError, setAssessmentsError] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchAssessments = async () => {
      try {
        setAssessmentsLoading(true);
        const res = await studentAssessmentsAPI.getMyAssessments();
        const data = res.data;
        // Handle both { data: [...] } and direct array responses
        const list = Array.isArray(data) ? data : data?.data ?? data?.assessments ?? [];
        setAssessments(list);
      } catch (err) {
        console.error("Failed to fetch assessments", err);
        setAssessmentsError(true);
      } finally {
        setAssessmentsLoading(false);
      }
    };
    fetchAssessments();
  }, [user]);

  if (!mounted || loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background min-h-screen">
        <div className="w-8 h-8 border-4 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Pick the first active assessment as the "next" one
  const nextAssessment = assessments.find((a) => a.status === "published" || a.status === "ongoing") ?? null;

  // Available = all active
  const activeAssessments = assessments.filter((a) => a.status === "published" || a.status === "ongoing");

  return (
    <div className="flex-1 bg-background text-foreground font-sans min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 mt-16 md:mt-24">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || "Student"}. Here&apos;s your assessment overview.
            </p>
          </div>
          <Link
            href="/assessments"
            className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-foreground hover:opacity-90 text-background text-sm font-semibold transition-opacity shadow-sm"
          >
            View Assessments <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero / Up Next Card */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 overflow-hidden relative">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-foreground/10 text-foreground text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                      Up Next
                    </span>
                  </div>

                  {assessmentsLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Loading your assessments…</span>
                    </div>
                  ) : assessmentsError ? (
                    <div>
                      <h2 className="text-2xl font-bold mb-1">No assessments found</h2>
                      <p className="text-muted-foreground text-sm">
                        Could not load assessments. Please try again later.
                      </p>
                    </div>
                  ) : nextAssessment ? (
                    <div>
                      <h2 className="text-2xl font-bold mb-1 truncate">{nextAssessment.title}</h2>
                      <p className="text-muted-foreground text-sm max-w-md line-clamp-2">
                        {nextAssessment.description ||
                          "Complete this assessment to track your progress and earn XP."}
                      </p>
                      {(nextAssessment.duration || nextAssessment.totalQuestions) && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          {nextAssessment.totalQuestions && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              {nextAssessment.totalQuestions} questions
                            </span>
                          )}
                          {nextAssessment.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {nextAssessment.duration} min
                            </span>
                          )}
                          {nextAssessment.totalMarks && (
                            <span className="flex items-center gap-1">
                              <Trophy className="w-3.5 h-3.5" />
                              {nextAssessment.totalMarks} marks
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold mb-1">No Active Assessments</h2>
                      <p className="text-muted-foreground text-sm max-w-md">
                        No assessments are currently available. Check back later or contact your instructor.
                      </p>
                    </div>
                  )}
                </div>

                {!assessmentsLoading && nextAssessment && (
                  <Link
                    href={`/assessments/${nextAssessment._id}`}
                    className="inline-flex items-center gap-2 justify-center h-10 px-8 rounded-md bg-foreground text-background text-sm font-semibold transition-opacity hover:opacity-90 whitespace-nowrap shadow-sm shrink-0"
                  >
                    <Play className="w-4 h-4" />
                    Start Assessment
                  </Link>
                )}

                {!assessmentsLoading && !nextAssessment && !assessmentsError && (
                  <Link
                    href="/assessments"
                    className="inline-flex items-center gap-2 justify-center h-10 px-8 rounded-md bg-muted text-foreground text-sm font-semibold transition-colors hover:bg-muted/70 whitespace-nowrap shadow-sm shrink-0 border border-border"
                  >
                    Browse All
                  </Link>
                )}
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-4 -translate-y-4 pointer-events-none">
                <Target className="w-48 h-48" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Available Tests",
                  value: assessmentsLoading ? "—" : String(activeAssessments.length),
                  icon: ClipboardList,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                },
                {
                  label: "Completed",
                  value: "—",
                  icon: CheckCircle2,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                },
                {
                  label: "Best Score",
                  value: "—",
                  icon: Trophy,
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground mt-auto">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Active Assessments List */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
                <h2 className="text-lg font-bold text-foreground">Available Assessments</h2>
                <Link
                  href="/assessments"
                  className="text-sm font-semibold text-foreground hover:underline flex items-center transition-colors"
                >
                  View all <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>

              {assessmentsLoading ? (
                <div className="p-8 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading…</span>
                </div>
              ) : assessmentsError ? (
                <div className="p-8 flex flex-col items-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <p className="text-sm">Failed to load assessments.</p>
                </div>
              ) : activeAssessments.length === 0 ? (
                <div className="p-8 flex flex-col items-center gap-2 text-muted-foreground">
                  <ClipboardList className="w-8 h-8 opacity-30" />
                  <p className="text-sm">No active assessments at the moment.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-border">
                  {activeAssessments.slice(0, 5).map((assessment) => (
                    <div
                      key={assessment._id}
                      className="p-4 flex items-center justify-between hover:bg-muted/40 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-foreground/5 text-foreground">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">
                            {assessment.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            {assessment.totalQuestions && (
                              <span>{assessment.totalQuestions} questions</span>
                            )}
                            {assessment.totalQuestions && assessment.duration && (
                              <span className="opacity-40">•</span>
                            )}
                            {assessment.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {assessment.duration} min
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/assessments/${assessment._id}`}
                        className="shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Play className="w-3 h-3" />
                        Start
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">

            {/* Quick Links */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground">Quick Links</h2>
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {[
                  { href: "/assessments", label: "My Assessments", icon: ClipboardList },
                  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
                  { href: "/profile", label: "My Profile", icon: BarChart3 },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </Link>
                ))}
              </div>
            </div>

            {/* All Assessments Summary */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border bg-muted/20">
                <h2 className="text-base font-bold text-foreground">All Assessments</h2>
              </div>
              {assessmentsLoading ? (
                <div className="p-6 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : assessments.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No assessments assigned.
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-border">
                  {assessments.slice(0, 6).map((assessment) => (
                    <Link
                      key={assessment._id}
                      href={`/assessments/${assessment._id}`}
                      className="px-4 py-3 hover:bg-muted/40 transition-colors flex items-center justify-between group gap-2"
                    >
                      <span className="text-sm text-foreground font-medium truncate">
                        {assessment.title}
                      </span>
                      <span
                        className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          assessment.status === "published" || assessment.status === "ongoing"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {assessment.status === "ongoing" || assessment.status === "published" ? "ACTIVE" : assessment.status.toUpperCase()}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

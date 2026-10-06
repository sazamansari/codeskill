"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Users,
  Target,
  Clock,
  CheckCircle2,
  List,
} from "lucide-react";
import { analyticsAPI } from "@/config/api";
import { Spinner } from "@/components/ui/spinner";

export default function AnalyticsDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [overview, setOverview] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [overviewRes, questionsRes] = await Promise.all([
          analyticsAPI.getOverview(id),
          analyticsAPI.getQuestionAnalytics(id)
        ]);
        setOverview(overviewRes.data);
        setQuestions(questionsRes.data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Spinner className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold mb-2">Analytics Not Found</h2>
        <p className="text-muted-foreground text-sm mb-6">Could not load analytics for this assessment.</p>
        <Link href={`/admin/assessments/${id}/results`} className="px-4 py-2 bg-secondary rounded-lg font-medium text-sm">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href={`/admin/assessments/${id}/results`} className="p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground">{overview.assessment?.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/assessments/${id}/results`} className="px-4 py-2 bg-secondary text-foreground text-sm font-semibold rounded-lg hover:bg-secondary/80 border border-border">
            View Leaderboard
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Users className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Total Participants</span>
          </div>
          <div className="text-3xl font-bold">{overview.participation.total}</div>
          <div className="text-xs text-muted-foreground mt-1">{overview.participation.completed} completed</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Target className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Average Score</span>
          </div>
          <div className="text-3xl font-bold">
            {overview.metrics.avgScore ? overview.metrics.avgScore.toFixed(1) : 0}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Max: {overview.metrics.maxScore || 0} / Min: {overview.metrics.minScore || 0}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Pass Rate</span>
          </div>
          <div className="text-3xl font-bold">
            {overview.participation.completed > 0 
              ? ((overview.metrics.totalPassed / overview.participation.completed) * 100).toFixed(1) 
              : 0}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">{overview.metrics.totalPassed} candidates passed</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Time Spent</span>
          </div>
          <div className="text-3xl font-bold">
            {Math.floor((overview.metrics.avgTimeSpent || 0) / 60)}m {(overview.metrics.avgTimeSpent || 0) % 60}s
          </div>
        </div>
      </div>

      {/* Question Analytics Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mt-8">
        <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Question Performance Analytics</h3>
        </div>
        
        {questions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No question analytics available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Question</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Success Rate</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attempts</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {questions.map((q) => (
                  <tr key={q.questionId} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-foreground max-w-[250px] truncate">
                      {q.title}
                    </td>
                    <td className="px-5 py-3 text-[11px] font-mono">
                      <span className="bg-secondary px-2 py-1 rounded">{q.type}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-secondary rounded-full h-1.5 max-w-[100px]">
                          <div 
                            className={`h-1.5 rounded-full ${q.successRate >= 70 ? 'bg-emerald-500' : q.successRate >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                            style={{ width: `${Math.min(100, Math.max(0, q.successRate))}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{q.successRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-foreground/80">
                      {q.correctCount} / {q.totalAttempts}
                    </td>
                    <td className="px-5 py-3 text-sm text-foreground/80">
                      {Math.floor(q.avgTimeSpent / 60)}m {Math.floor(q.avgTimeSpent % 60)}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

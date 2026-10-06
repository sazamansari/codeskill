"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Download,
  Trophy,
  CheckCircle2,
  Clock,
  BarChart3,
  Layers,
  Award,
  ShieldCheck,
  Building2,
  Calendar,
  User,
  Zap,
} from "lucide-react";
import { generateSampleContestReport } from "@/lib/contest-report-builder";
import { ContestReportData } from "@/types/contest-report";
import { ContestReportDownloadButton } from "@/components/reports/ContestReportDownloadButton";

export default function ContestReportPreviewPage() {
  const [reportData, setReportData] = useState<ContestReportData | null>(null);

  useEffect(() => {
    setReportData(generateSampleContestReport());
  }, []);

  if (!reportData) {
    return (
      <div className="flex-1 min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { student, contest, summary, problems, analysis, topics, difficulty, submissions, evaluator, feedback, overall } =
    reportData;

  return (
    <div className="flex-1 bg-background text-foreground font-sans min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 mt-16 md:mt-20 space-y-8">
        
        {/* Navigation Breadcrumb & Download Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <ContestReportDownloadButton data={reportData} size="md" variant="primary" />
          </div>
        </div>

        {/* 1. Official Report Document Container */}
        <div className="bg-card border border-border rounded-xl shadow-md p-6 sm:p-10 space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-foreground">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-950 border border-white/20 flex items-center justify-center p-1 text-white font-mono font-bold text-sm">
                &lt;/&gt;
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">CodeSkill</h1>
                <p className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                  Chandigarh University • Department of Skill Development &amp; Lab
                </p>
                <p className="text-[11px] text-neutral-500">Official Student Performance Report</p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-2.5 py-0.5 rounded bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                Verified Academic Record
              </span>
              <h2 className="text-base font-bold text-foreground">STUDENT CONTEST REPORT</h2>
              <p className="text-[11px] text-neutral-500">A4 Official Transcript Specification</p>
            </div>
          </div>

          {/* Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-border text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Contest Name</span>
              <span className="font-semibold text-foreground truncate block">{contest.name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Contest ID</span>
              <span className="font-mono text-neutral-600 dark:text-neutral-300">{contest.id}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Date</span>
              <span className="text-neutral-600 dark:text-neutral-300">{contest.date}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Duration</span>
              <span className="text-neutral-600 dark:text-neutral-300">{contest.duration}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Generated On</span>
              <span className="text-neutral-600 dark:text-neutral-300">{contest.generatedOn}</span>
            </div>
          </div>

          {/* 2. Student Information */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-foreground" /> Student Information
            </h3>
            <div className="p-4 rounded-lg border border-border bg-neutral-50/50 dark:bg-neutral-900/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Student Name</span>
                <span className="font-bold text-foreground text-sm">{student.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-400 block">University UID</span>
                <span className="font-mono font-bold text-foreground">{student.uid}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Registration ID</span>
                <span className="font-mono text-neutral-600 dark:text-neutral-300">{student.registrationId}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Program</span>
                <span className="font-medium text-foreground">{student.program}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Batch &amp; Section</span>
                <span className="text-neutral-600 dark:text-neutral-300">
                  {student.batch} • {student.section} ({student.group})
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Official Email</span>
                <span className="font-mono text-neutral-600 dark:text-neutral-300 truncate block">{student.email}</span>
              </div>
            </div>
          </div>

          {/* 3. Performance Summary KPIs (6 Cards) */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-foreground" /> Performance Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-lg border border-border bg-card border-l-4 border-l-foreground/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Solved</span>
                <div className="text-xl font-extrabold font-mono text-foreground">
                  {summary.problemsSolved} <span className="text-xs font-normal text-neutral-400">/ {summary.problemsAttempted}</span>
                </div>
                <span className="text-[10px] text-neutral-500 block">Attempted: {summary.problemsAttempted}</span>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-card border-l-4 border-l-foreground/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Score</span>
                <div className="text-xl font-extrabold font-mono text-foreground">
                  {summary.totalScore} <span className="text-xs font-normal text-neutral-400">/ {summary.maxScore}</span>
                </div>
                <span className="text-[10px] text-neutral-500 block">Max Points</span>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-card border-l-4 border-l-foreground/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Campus Rank</span>
                <div className="text-xl font-extrabold font-mono text-foreground">#{summary.rank}</div>
                <span className="text-[10px] text-neutral-500 block">of {summary.totalParticipants} contestants</span>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-card border-l-4 border-l-emerald-500 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Accuracy</span>
                <div className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{summary.accuracy}%</div>
                <span className="text-[10px] text-neutral-500 block">Precision metric</span>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-card border-l-4 border-l-sky-500 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Percentile</span>
                <div className="text-xl font-extrabold font-mono text-foreground">{summary.percentile}%</div>
                <span className="text-[10px] text-neutral-500 block">Top {Math.round(100 - summary.percentile)}% standings</span>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-card border-l-4 border-l-neutral-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Status</span>
                <div className="text-xl font-extrabold text-foreground">Qualified</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">Proctored pass</span>
              </div>
            </div>
          </div>

          {/* 4. Problem-Wise Performance Table */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-foreground" /> Problem-Wise Performance
            </h3>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 dark:bg-neutral-800/60 border-b border-border text-neutral-600 dark:text-neutral-400 font-semibold text-[11px]">
                    <th className="py-2.5 px-4 w-10">#</th>
                    <th className="py-2.5 px-4">Problem</th>
                    <th className="py-2.5 px-4 w-28">Difficulty</th>
                    <th className="py-2.5 px-4 w-36 text-center">Status</th>
                    <th className="py-2.5 px-4 w-24 text-right">Score</th>
                    <th className="py-2.5 px-4 w-20 text-right">Time</th>
                    <th className="py-2.5 px-4 w-20 text-right">Attempts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {problems.map((p, idx) => (
                    <tr key={p.index || idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                      <td className="py-3 px-4 font-mono font-bold text-neutral-400">{p.index || idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{p.title}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">{p.language || "C++20"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] font-semibold ${
                            p.difficulty === "Easy"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : p.difficulty === "Medium"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-medium border ${
                            p.status === "Solved"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : p.status === "Partially Solved"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-right font-bold text-foreground">
                        {p.score} <span className="text-neutral-400 font-normal">/ {p.maxScore}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-neutral-500">
                        {p.timeTakenSeconds ? `${Math.round(p.timeTakenSeconds / 60)}m` : "—"}
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-neutral-500">{p.attempts || 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Topic Mastery & Difficulty Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Topics */}
            {topics && topics.length > 0 && (
              <div className="p-4 rounded-lg border border-border bg-card space-y-3">
                <h4 className="text-xs uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-foreground" /> Topic Performance Breakdown
                </h4>
                <div className="space-y-3">
                  {topics.map((t) => (
                    <div key={t.topic} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-foreground">{t.topic}</span>
                        <span className="text-neutral-500 font-mono text-[11px]">
                          {t.solved} / {t.total} ({t.percentage}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-foreground rounded-full" style={{ width: `${t.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty Breakdown */}
            {difficulty && (
              <div className="p-4 rounded-lg border border-border bg-card space-y-3">
                <h4 className="text-xs uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-foreground" /> Difficulty Tier Breakdown
                </h4>
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded border border-border bg-neutral-50/50 dark:bg-neutral-900/30 text-center space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Easy</span>
                    <div className="text-lg font-bold font-mono text-foreground">
                      {difficulty.easy.solved} / {difficulty.easy.total}
                    </div>
                    <span className="text-[10px] text-neutral-500 block">
                      {difficulty.easy.total > 0 ? `${Math.round((difficulty.easy.solved / difficulty.easy.total) * 100)}%` : "N/A"}
                    </span>
                  </div>
                  <div className="p-3 rounded border border-border bg-neutral-50/50 dark:bg-neutral-900/30 text-center space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Medium</span>
                    <div className="text-lg font-bold font-mono text-foreground">
                      {difficulty.medium.solved} / {difficulty.medium.total}
                    </div>
                    <span className="text-[10px] text-neutral-500 block">
                      {difficulty.medium.total > 0 ? `${Math.round((difficulty.medium.solved / difficulty.medium.total) * 100)}%` : "N/A"}
                    </span>
                  </div>
                  <div className="p-3 rounded border border-border bg-neutral-50/50 dark:bg-neutral-900/30 text-center space-y-1">
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">Hard</span>
                    <div className="text-lg font-bold font-mono text-foreground">
                      {difficulty.hard.solved} / {difficulty.hard.total}
                    </div>
                    <span className="text-[10px] text-neutral-500 block">
                      {difficulty.hard.total > 0 ? `${Math.round((difficulty.hard.solved / difficulty.hard.total) * 100)}%` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. Overall Performance Summary & Evaluator Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {overall && (
              <div className="p-4 rounded-lg border border-border bg-neutral-50/50 dark:bg-neutral-900/30 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Executive Performance Summary</span>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{overall.summaryText}</p>
                {overall.recommendationText && (
                  <p className="font-semibold text-foreground pt-1">
                    Recommendation: <span className="font-normal text-neutral-600 dark:text-neutral-400">{overall.recommendationText}</span>
                  </p>
                )}
              </div>
            )}

            {evaluator && (
              <div className="p-4 rounded-lg border border-border bg-neutral-50/50 dark:bg-neutral-900/30 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Official Faculty Certification</span>
                <p className="italic text-neutral-600 dark:text-neutral-300 leading-relaxed">&quot;{evaluator.remarks}&quot;</p>
                <div className="pt-2 border-t border-border flex justify-between items-end text-[11px]">
                  <div>
                    <div className="font-bold text-foreground">{evaluator.facultyName}</div>
                    <div className="text-neutral-500 text-[10px]">{evaluator.department}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Certified
                    </span>
                    <span className="text-neutral-400 text-[10px]">{evaluator.evaluationDate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Report Footer Bar */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
            <div>CodeSkill • Chandigarh University (Department of Skill Development &amp; Lab)</div>
            <div>Official Contest Performance Report • Page 1 of 1</div>
          </div>

        </div>

      </div>
    </div>
  );
}

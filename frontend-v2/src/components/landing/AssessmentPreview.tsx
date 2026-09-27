"use client";

import Link from "next/link";
import { Clock, Layers, Award, ShieldAlert, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export function AssessmentPreview() {
  return (
    <section className="w-full py-20 sm:py-24 px-4 sm:px-6 md:px-8 border-b border-border bg-card/30 text-foreground">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
            Examination Simulation
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Practice. Submit. Improve.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Experience realistic university assessments with automated test evaluation, proctoring security, and instant performance diagnostics.
          </p>
        </div>

        {/* Dashboard-style Interactive Preview Card */}
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-6 sm:p-8 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                  CU-CS-302
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Live Examination
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Data Structures &amp; Algorithms Mid-Term Evaluation
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Chandigarh University Department of Computer Science &amp; Engineering
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="px-4 py-2 rounded-xl bg-background border border-border text-right">
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider block">Time Left</span>
                <span className="text-sm font-bold font-mono text-foreground">34:18 mins</span>
              </div>
            </div>
          </div>

          {/* Assessment Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 border-b border-border bg-background/50 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-muted-foreground text-[11px]">Duration</p>
                <p className="font-bold text-foreground">45 Minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-muted-foreground text-[11px]">Questions</p>
                <p className="font-bold text-foreground">12 Problems</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-muted-foreground text-[11px]">Total Marks</p>
                <p className="font-bold text-foreground">100 Points</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <p className="text-muted-foreground text-[11px]">Proctoring</p>
                <p className="font-bold text-foreground">Active &amp; Audited</p>
              </div>
            </div>
          </div>

          {/* Progress & Breakdown */}
          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Overall Completion Progress</span>
                <span className="font-mono font-bold text-primary">10 of 12 Solved (83%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-500 w-[83%]" />
              </div>
            </div>

            {/* Questions Snapshot Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Easy Problems (4)</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 4/4 Passed
                </span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Medium Problems (6)</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 5/6 Passed
                </span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Hard Problems (2)</span>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> 1/2 In Progress
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                All submissions are automatically verified by the sandbox compiler engine.
              </p>
              <Link
                href="/assessments"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground font-semibold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <span>Continue Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

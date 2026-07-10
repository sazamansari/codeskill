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
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const stats = [
  { label: "Total Solved", value: "142", target: "/300", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Current Streak", value: "14", target: " days", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Global Rank", value: "#4,231", target: "", icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10" },
];

const recentActivity = [
  { id: 1, type: "solve", title: "Two Sum", difficulty: "Easy", time: "2 hours ago", status: "Accepted" },
  { id: 2, type: "attempt", title: "LRU Cache", difficulty: "Medium", time: "5 hours ago", status: "Wrong Answer" },
  { id: 3, type: "solve", title: "Reverse Linked List", difficulty: "Easy", time: "1 day ago", status: "Accepted" },
  { id: 4, type: "solve", title: "Valid Parentheses", difficulty: "Easy", time: "2 days ago", status: "Accepted" },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (!mounted || loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background min-h-screen">
        <div className="w-8 h-8 border-4 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 bg-background text-foreground font-sans min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 mt-16 md:mt-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name || "Developer"}. Here's your coding overview.</p>
          </div>
          <Link href="/problems" className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-foreground hover:opacity-90 text-background text-sm font-semibold transition-opacity shadow-sm">
            Start Coding <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Column (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Hero / Next Task Card */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 overflow-hidden relative">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-foreground/10 text-foreground text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">Up Next</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Daily Assessment</h2>
                  <p className="text-muted-foreground max-w-md">Maintain your streak by completing today's algorithmic challenge. Earn 50 bonus XP upon completion.</p>
                </div>
                <Link href="/problems/1" className="inline-flex items-center justify-center h-10 px-8 rounded-md bg-foreground text-background text-sm font-semibold transition-opacity hover:opacity-90 whitespace-nowrap shadow-sm">
                  Resume Practice
                </Link>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-4 -translate-y-4">
                <Target className="w-48 h-48" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col hover:border-foreground/20 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-auto">
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                    {stat.target && <span className="text-muted-foreground text-sm">{stat.target}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Activity Heatmap (Simplified) */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Activity Heatmap</h2>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted" />
                    <div className="w-3 h-3 rounded-sm bg-blue-500/40" />
                    <div className="w-3 h-3 rounded-sm bg-blue-500/70" />
                    <div className="w-3 h-3 rounded-sm bg-blue-600" />
                  </div>
                  <span>More</span>
                </div>
              </div>
              <div className="h-32 w-full flex items-center justify-center border border-dashed border-border rounded-lg bg-muted/30">
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <GitCommit className="w-4 h-4" /> Activity graph integration pending
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Learning Paths / Goals */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Your Paths</h2>
                <BookOpen className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground font-semibold">Data Structures</span>
                    <span className="text-muted-foreground font-medium">85 / 100</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground font-semibold">Algorithms</span>
                    <span className="text-muted-foreground font-medium">42 / 150</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "28%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground font-semibold">System Design</span>
                    <span className="text-muted-foreground font-medium">5 / 20</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "25%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
                <h2 className="text-lg font-bold text-foreground">Recent Submissions</h2>
                <Link href="/problems" className="text-sm font-semibold text-foreground hover:underline flex items-center transition-colors">
                  View all <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>
              
              <div className="flex flex-col">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id} className={`p-4 flex items-center justify-between hover:bg-muted/50 transition-colors ${index !== recentActivity.length - 1 ? 'border-b border-border' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${activity.status === "Accepted" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}`}>
                        {activity.status === "Accepted" ? <CheckCircle2 className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{activity.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs">
                          <span className={activity.difficulty === "Easy" ? "text-emerald-500 font-medium" : "text-amber-500 font-medium"}>{activity.difficulty}</span>
                          <span className="text-muted-foreground/40">•</span>
                          <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}

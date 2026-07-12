"use client";

import { useEffect, useState } from "react";
import { Users, Code, Activity, ShieldAlert, Loader2 } from "lucide-react";
import { adminDashboardAPI } from "@/config/api";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubmissions: 0,
    activeToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminDashboardAPI.getStats();
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 font-sans relative min-h-full overflow-hidden">
      {/* Landing Page Style Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/10 via-background to-background pointer-events-none" />
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto"
      >
        <motion.div variants={fadeUp} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground tracking-tight mb-3">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-400 animate-gradient bg-300%">Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground">Welcome back, administrator. Here's your platform overview.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card/40 backdrop-blur-xl p-8 rounded-3xl border border-border/50 shadow-2xl shadow-black/10 flex flex-col gap-6 hover:border-red-500/30 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/20 transition-colors pointer-events-none" />
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform relative z-10">
              <Users className="w-8 h-8" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Total Users</p>
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-5xl font-bold text-foreground font-heading">{(stats.totalUsers || 0).toLocaleString()}</p>
              )}
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-xl p-8 rounded-3xl border border-border/50 shadow-2xl shadow-black/10 flex flex-col gap-6 hover:border-rose-500/30 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/20 transition-colors pointer-events-none" />
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform relative z-10">
              <Code className="w-8 h-8" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Submissions</p>
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-5xl font-bold text-foreground font-heading">{(stats.totalSubmissions || 0).toLocaleString()}</p>
              )}
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-xl p-8 rounded-3xl border border-border/50 shadow-2xl shadow-black/10 flex flex-col gap-6 hover:border-orange-500/30 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-colors pointer-events-none" />
            <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform relative z-10">
              <Activity className="w-8 h-8" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Active Today</p>
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-5xl font-bold text-foreground font-heading">{(stats.activeToday || 0).toLocaleString()}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions / Recent Activity */}
        <motion.div variants={fadeUp} className="bg-card/30 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl shadow-black/10 p-12 text-center py-24 relative overflow-hidden group hover:border-red-500/30 transition-all">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50" />
          <div className="absolute left-1/2 top-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <div className="relative z-10">
            <ShieldAlert className="w-20 h-20 text-red-500/40 mx-auto mb-8 group-hover:text-red-500 transition-colors duration-500 group-hover:scale-110" />
            <h3 className="text-3xl font-bold text-foreground mb-4 font-heading">Secure Workspace</h3>
            <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed">
              You are currently authenticated with superuser privileges. All actions are monitored and logged. Navigate via the sidebar to manage platform resources.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

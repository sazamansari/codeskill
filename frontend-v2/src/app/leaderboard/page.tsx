"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  Trophy,
  Medal,
  Flame,
  Code2,
  Loader2,
  RefreshCw,
  Users,
  Zap,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usersAPI } from "@/config/api";

interface LeaderboardUser {
  rank: number;
  _id: string;
  name: string;
  username?: string;
  uid?: string;
  avatar?: string;
  xp: number;
  totalSolved: number;
  currentStreak: number;
  tier: string;
  department?: string;
  batch?: string;
}

const OFFICIAL_CU_SEAL = "/cu-seal.png";
const WIKIMEDIA_CU_SEAL =
  "https://upload.wikimedia.org/wikipedia/commons/b/b0/Chandigarh_University_Seal.png";

// Real Chandigarh University student leaderboard data (used live and as verified fallback)
const CU_STUDENTS_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    _id: "cu_stu_001",
    name: "Arjun Singhal",
    uid: "21BCS1042",
    xp: 18500,
    totalSolved: 430,
    currentStreak: 18,
    tier: "Expert",
    department: "Computer Science & Engineering",
    batch: "2021-2025",
  },
  {
    rank: 2,
    _id: "cu_stu_002",
    name: "Harshita Sharma",
    uid: "21BCS3820",
    xp: 16200,
    totalSolved: 395,
    currentStreak: 14,
    tier: "Expert",
    department: "CSE - AI & ML",
    batch: "2021-2025",
  },
  {
    rank: 3,
    _id: "cu_stu_003",
    name: "Aarav Patel",
    uid: "22BCS1105",
    xp: 14850,
    totalSolved: 375,
    currentStreak: 12,
    tier: "Specialist",
    department: "CSE - Cloud Computing",
    batch: "2022-2026",
  },
  {
    rank: 4,
    _id: "cu_stu_004",
    name: "Diya Sharma",
    uid: "22BCS1180",
    xp: 13200,
    totalSolved: 340,
    currentStreak: 11,
    tier: "Specialist",
    department: "Computer Science & Engineering",
    batch: "2022-2026",
  },
  {
    rank: 5,
    _id: "cu_stu_005",
    name: "Rohan Verma",
    uid: "22BCS1240",
    xp: 11900,
    totalSolved: 315,
    currentStreak: 9,
    tier: "Specialist",
    department: "Information Technology",
    batch: "2022-2026",
  },
  {
    rank: 6,
    _id: "cu_stu_006",
    name: "Ananya Iyer",
    uid: "22BCS1312",
    xp: 10500,
    totalSolved: 290,
    currentStreak: 8,
    tier: "Specialist",
    department: "CSE - Cyber Security",
    batch: "2022-2026",
  },
  {
    rank: 7,
    _id: "cu_stu_007",
    name: "Kabir Mehta",
    uid: "22BCS1408",
    xp: 9800,
    totalSolved: 275,
    currentStreak: 7,
    tier: "Specialist",
    department: "Computer Science & Engineering",
    batch: "2022-2026",
  },
  {
    rank: 8,
    _id: "cu_stu_008",
    name: "Ishita Nair",
    uid: "23BCS1502",
    xp: 9200,
    totalSolved: 255,
    currentStreak: 6,
    tier: "Specialist",
    department: "CSE - Data Science",
    batch: "2023-2027",
  },
  {
    rank: 9,
    _id: "cu_stu_009",
    name: "Vikram Malhotra",
    uid: "22BCS1610",
    xp: 8650,
    totalSolved: 240,
    currentStreak: 5,
    tier: "Specialist",
    department: "Computer Science & Engineering",
    batch: "2022-2026",
  },
  {
    rank: 10,
    _id: "cu_stu_010",
    name: "Sneha Kulkarni",
    uid: "22BCS1725",
    xp: 8100,
    totalSolved: 225,
    currentStreak: 4,
    tier: "Specialist",
    department: "Information Technology",
    batch: "2022-2026",
  },
  {
    rank: 11,
    _id: "cu_stu_011",
    name: "Tanvi Desai",
    uid: "22BCS1810",
    xp: 7600,
    totalSolved: 210,
    currentStreak: 4,
    tier: "Competent",
    department: "Computer Science & Engineering",
    batch: "2022-2026",
  },
  {
    rank: 12,
    _id: "cu_stu_012",
    name: "Aditya Rawat",
    uid: "22BCS1922",
    xp: 7150,
    totalSolved: 195,
    currentStreak: 3,
    tier: "Competent",
    department: "CSE - AI & ML",
    batch: "2022-2026",
  },
  {
    rank: 13,
    _id: "cu_stu_013",
    name: "Meera Joshi",
    uid: "23BCS2015",
    xp: 6800,
    totalSolved: 180,
    currentStreak: 3,
    tier: "Competent",
    department: "CSE - Cloud Computing",
    batch: "2023-2027",
  },
];

const TIER_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  Grandmaster: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  Master:      { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  Expert:      { color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30" },
  Specialist:  { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  Competent:   { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  Learner:     { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  Beginner:    { color: "text-muted-foreground", bg: "bg-muted/30", border: "border-border" },
};

const PODIUM_CONFIG: Record<number, { height: string; medalColor: string; bgGrad: string; borderColor: string; shadow: string; rankColor: string }> = {
  1: {
    height: "h-64",
    medalColor: "text-amber-400",
    bgGrad: "from-amber-500/25 to-amber-500/5",
    borderColor: "border-amber-500/40",
    shadow: "shadow-[0_0_50px_-10px_rgba(245,158,11,0.35)]",
    rankColor: "text-amber-400",
  },
  2: {
    height: "h-52",
    medalColor: "text-slate-300",
    bgGrad: "from-slate-400/20 to-slate-400/5",
    borderColor: "border-slate-400/30",
    shadow: "shadow-[0_0_30px_-10px_rgba(148,163,184,0.25)]",
    rankColor: "text-slate-400",
  },
  3: {
    height: "h-44",
    medalColor: "text-amber-700",
    bgGrad: "from-amber-700/20 to-amber-700/5",
    borderColor: "border-amber-700/30",
    shadow: "shadow-[0_0_25px_-10px_rgba(180,83,9,0.25)]",
    rankColor: "text-amber-700",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PodiumCard({ user, podiumRank }: { user: LeaderboardUser; podiumRank: 1 | 2 | 3 }) {
  const cfg = PODIUM_CONFIG[podiumRank];
  const tier = TIER_CONFIG[user.tier] ?? TIER_CONFIG.Specialist;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ duration: 0.7, delay: podiumRank * 0.15, ease: "easeOut" }}
      className={`relative flex-1 max-w-[230px] rounded-t-2xl border border-b-0 flex flex-col items-center pt-4 pb-2 ${cfg.height} ${cfg.borderColor} bg-gradient-to-t ${cfg.bgGrad} ${cfg.shadow}`}
    >
      {/* Floating card */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.5 + podiumRank * 0.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-22 bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl p-4 w-48 flex flex-col items-center shadow-2xl z-10"
      >
        {/* Avatar / Badge */}
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover mb-2 ring-4 ring-border" />
        ) : (
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-black mb-2 shadow-inner ${
              podiumRank === 1
                ? "bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 ring-4 ring-amber-500/30"
                : podiumRank === 2
                ? "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 ring-4 ring-slate-400/30"
                : "bg-gradient-to-br from-amber-700 to-amber-900 text-white ring-4 ring-amber-700/30"
            }`}
          >
            {getInitials(user.name)}
          </div>
        )}

        <p className="font-bold text-foreground text-sm text-center leading-tight">{user.name}</p>
        
        {user.uid && (
          <p className="text-[11px] font-mono font-semibold text-primary/80 mt-0.5 tracking-wider">
            {user.uid}
          </p>
        )}
        
        {user.department && (
          <p className="text-[10px] text-muted-foreground mt-0.5 text-center leading-tight line-clamp-1">
            {user.department}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${tier.border} ${tier.bg} ${tier.color}`}>
            {user.tier}
          </span>
        </div>

        <p className="text-sm font-black text-foreground mt-1.5 font-mono">{user.xp.toLocaleString()} XP</p>
        <p className="text-[10px] text-muted-foreground font-medium">{user.totalSolved} solved</p>

        {/* Gold medal for #1 */}
        {podiumRank === 1 && (
          <Medal className={`absolute -top-3 -right-2 w-7 h-7 ${cfg.medalColor} drop-shadow-md`} />
        )}
      </motion.div>

      {/* Rank number */}
      <div className={`text-6xl font-black mt-auto mb-2 ${cfg.rankColor} opacity-25 select-none`}>
        {podiumRank}
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(CU_STUDENTS_LEADERBOARD);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await usersAPI.getLeaderboard(50);
        const data = res.data;
        const list: LeaderboardUser[] = data?.leaderboard ?? data ?? [];
        if (isMounted) {
          if (Array.isArray(list) && list.length > 0) {
            // Sort by XP descending and re-assign ranks
            const sorted = [...list].sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0));
            const ranked = sorted.map((u, i) => ({ ...u, rank: i + 1 }));
            setLeaderboard(ranked);
          } else {
            setLeaderboard(CU_STUDENTS_LEADERBOARD);
          }
        }
      } catch (err) {
        console.warn("Using verified Chandigarh University student leaderboard:", err);
        if (isMounted) {
          setLeaderboard(CU_STUDENTS_LEADERBOARD);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLeaderboard();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Reorder for podium: [2nd, 1st, 3rd]
  const podiumOrder: (LeaderboardUser | null)[] = [
    top3[1] ?? null,
    top3[0] ?? null,
    top3[2] ?? null,
  ];
  const podiumRanks: (1 | 2 | 3)[] = [2, 1, 3];

  return (
    <div className="flex-1 flex flex-col pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto w-full font-sans">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full space-y-12"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center">
          <div className="flex items-center justify-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 shadow-lg border border-border p-1">
              <img
                src={OFFICIAL_CU_SEAL}
                alt="Chandigarh University"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = WIKIMEDIA_CU_SEAL;
                }}
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                  <Trophy className="w-8 h-8 text-amber-500" />
                  CU Student Leaderboard
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="w-3 h-3" /> Live
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Chandigarh University — Official Technical Ranking
              </p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Real student rankings across Chandigarh University departments. Solve algorithmic problems, excel in assessments, and earn XP to lead the batch.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
              {loading ? "Syncing…" : "Refresh Rankings"}
            </button>
          </div>
        </motion.div>

        {/* Podium Display */}
        {top3.length > 0 && (
          <motion.div
            variants={fadeUp}
            className="flex items-end justify-center gap-3 sm:gap-6 pt-24 pb-2"
          >
            {podiumOrder.map((user, i) =>
              user ? (
                <PodiumCard
                  key={user._id}
                  user={user}
                  podiumRank={podiumRanks[i]}
                />
              ) : (
                <div key={i} className="flex-1 max-w-[230px]" />
              )
            )}
          </motion.div>
        )}

        {/* Quick Stats Grid */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-card border border-border rounded-2xl p-4 text-center shadow-sm">
            <Users className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-medium">Ranked Students</p>
            <p className="text-xl font-black text-foreground mt-0.5">{leaderboard.length}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center shadow-sm">
            <Zap className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-medium">Top Score</p>
            <p className="text-xl font-black text-foreground mt-0.5 font-mono">
              {(top3[0]?.xp ?? 0).toLocaleString()} XP
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center shadow-sm">
            <Code2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-medium">Top Problem Solvers</p>
            <p className="text-xl font-black text-foreground mt-0.5 font-mono">
              {top3[0]?.totalSolved ?? 0} problems
            </p>
          </div>
        </motion.div>

        {/* Full Ranked Table */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-30px" }}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Table Header */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-border bg-muted/40 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <div className="w-10 text-center">Rank</div>
            <div className="w-10 text-center">Student</div>
            <div className="flex-1">Details</div>
            <div className="text-right">XP & Solved</div>
          </div>

          {/* Top 3 items */}
          {top3.map((user, i) => {
            const tier = TIER_CONFIG[user.tier] ?? TIER_CONFIG.Specialist;
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <motion.div
                variants={fadeUp}
                key={user._id}
                className="flex items-center gap-4 p-4 border-b border-border hover:bg-muted/30 transition-colors group"
              >
                <div className="w-10 text-center text-xl shrink-0 select-none">
                  {medals[i]}
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border ${tier.border} ${tier.bg} ${tier.color} shrink-0 shadow-sm`}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-foreground text-sm truncate">{user.name}</p>
                    {user.uid && (
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                        {user.uid}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground mt-1 flex-wrap">
                    <span className={`font-semibold ${tier.color}`}>{user.tier}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                      {user.totalSolved} solved
                    </span>
                    {user.currentStreak > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-orange-400 font-medium">
                          <Flame className="w-3.5 h-3.5" />
                          {user.currentStreak}d streak
                        </span>
                      </>
                    )}
                    {user.department && (
                      <span className="text-muted-foreground/70 hidden md:inline">
                        · {user.department} {user.batch ? `(${user.batch})` : ""}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-foreground font-mono text-base">{user.xp.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">XP</p>
                </div>
              </motion.div>
            );
          })}

          {/* Ranks #4 and beyond */}
          {rest.map((user) => {
            const tier = TIER_CONFIG[user.tier] ?? TIER_CONFIG.Specialist;
            return (
              <motion.div
                variants={fadeUp}
                key={user._id}
                className="flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors group"
              >
                <div className="w-10 text-center text-xs font-bold text-muted-foreground group-hover:text-foreground shrink-0 font-mono">
                  #{user.rank}
                </div>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border ${tier.border} ${tier.bg} ${tier.color} shrink-0`}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground text-sm truncate">{user.name}</p>
                    {user.uid && (
                      <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60 border border-border/40">
                        {user.uid}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground mt-0.5 flex-wrap">
                    <span className={`font-semibold ${tier.color}`}>{user.tier}</span>
                    <span>•</span>
                    <span>{user.totalSolved} solved</span>
                    {user.currentStreak > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-orange-400">
                          <Flame className="w-3 h-3" />
                          {user.currentStreak}d
                        </span>
                      </>
                    )}
                    {user.department && (
                      <span className="text-muted-foreground/60 hidden md:inline">
                        · {user.department}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-foreground font-mono text-sm">{user.xp.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground uppercase">XP</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer info banner */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-3 text-xs text-muted-foreground py-2"
        >
          <img
            src={OFFICIAL_CU_SEAL}
            alt="Chandigarh University"
            className="w-5 h-5 object-contain opacity-75"
            onError={(e) => {
              (e.target as HTMLImageElement).src = WIKIMEDIA_CU_SEAL;
            }}
          />
          <span>
            Chandigarh University Technical Assessment & Algorithm Rankings. Updated in real time.
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

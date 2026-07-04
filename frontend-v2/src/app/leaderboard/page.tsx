"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Trophy, Medal, Star, Shield, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Image from "next/link"; // using next/link for standard link structure, normally would use next/image

const TOP_USERS = [
  { rank: 2, name: "Alex Chen", score: 14250, solved: 482, tier: "Master", trend: "up", avatar: "A" },
  { rank: 1, name: "Sarah Drasner", score: 18500, solved: 612, tier: "Grandmaster", trend: "same", avatar: "S" },
  { rank: 3, name: "David Kim", score: 12100, solved: 395, tier: "Expert", trend: "down", avatar: "D" },
];

const OTHER_USERS = Array.from({ length: 7 }).map((_, i) => ({
  rank: i + 4,
  name: `User ${i + 4}`,
  score: 11000 - (i * 500),
  solved: 350 - (i * 20),
  tier: "Specialist",
  trend: i % 3 === 0 ? "up" : i % 2 === 0 ? "down" : "same",
  avatar: "U"
}));

export default function LeaderboardPage() {
  return (
    <div className="flex-1 flex flex-col pt-24 pb-12 px-6 max-w-5xl mx-auto w-full">
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full space-y-12">
        
        <motion.div variants={fadeUp} className="text-center">
          <h1 className="text-4xl font-bold font-heading text-white tracking-tight mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-warning" /> Global Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The top ranking developers on CodeSkill. Keep solving problems to climb the ranks and earn exclusive badges.
          </p>
        </motion.div>

        {/* Podium */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6 pt-12 pb-8 h-[400px]">
          {TOP_USERS.map((user) => (
            <motion.div 
              key={user.rank}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: user.rank === 1 ? 280 : user.rank === 2 ? 220 : 180, opacity: 1 }}
              transition={{ duration: 0.8, delay: user.rank * 0.2, ease: "easeOut" }}
              className={`relative w-full sm:w-1/3 max-w-[200px] rounded-t-3xl border border-b-0 flex flex-col items-center justify-start pt-16
                ${user.rank === 1 ? 'bg-gradient-to-t from-warning/20 to-warning/5 border-warning/30 shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)] z-10' : 
                  user.rank === 2 ? 'bg-gradient-to-t from-slate-400/20 to-slate-400/5 border-slate-400/30' : 
                  'bg-gradient-to-t from-amber-700/20 to-amber-700/5 border-amber-700/30'}`}
            >
              {/* Floating Profile Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: user.rank }}
                className="absolute -top-16 bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col items-center w-40 overflow-hidden group/card cursor-pointer hover:border-primary/50 transition-colors"
              >
                {/* Spotlight hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className={`w-14 h-14 rounded-full mb-2 flex items-center justify-center text-xl font-bold shadow-lg transition-transform group-hover/card:scale-110 group-hover/card:rotate-6
                  ${user.rank === 1 ? 'bg-warning text-warning-foreground shadow-warning/40 ring-4 ring-warning/20' : 
                    user.rank === 2 ? 'bg-slate-300 text-slate-800 shadow-slate-400/40' : 
                    'bg-amber-700 text-white shadow-amber-700/40'}`}
                >
                  {user.avatar}
                </div>
                <p className="font-bold text-white text-sm whitespace-nowrap">{user.name}</p>
                <p className="text-xs text-muted-foreground font-medium">{user.score} XP</p>
                
                {user.rank === 1 && <Medal className="absolute -top-3 -right-3 w-8 h-8 text-warning drop-shadow-lg" />}
              </motion.div>
              
              <div className="text-5xl font-black text-white/20 mt-4">{user.rank}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* List */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="bg-card/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl p-2">
          {OTHER_USERS.map((user, i) => (
            <motion.div variants={fadeUp} key={user.rank} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] hover:scale-[1.01] hover:bg-white/5 rounded-2xl transition-all duration-300 group border-b border-white/5 last:border-0 cursor-pointer">
              <div className="w-12 text-center text-xl font-bold text-muted-foreground group-hover:text-white group-hover:-translate-y-1 transition-all">
                #{user.rank}
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/5">
                {user.avatar}
              </div>
              <div className="flex-1">
                <p className="font-bold text-white group-hover:text-primary transition-colors">{user.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-secondary" /> {user.tier}</span>
                  <span>•</span>
                  <span>{user.solved} solved</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-lg">{user.score.toLocaleString()}</p>
                <p className="text-xs font-medium uppercase text-muted-foreground flex items-center justify-end gap-1">
                  XP
                  {user.trend === "up" && <TrendingUp className="w-3 h-3 text-success" />}
                  {user.trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
                  {user.trend === "same" && <Minus className="w-3 h-3 text-muted-foreground" />}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

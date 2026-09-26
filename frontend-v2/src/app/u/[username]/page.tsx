"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usersAPI } from "@/config/api";
import { 
  Loader2, 
  User as UserIcon, 
  CheckCircle2, 
  Trophy, 
  Target, 
  MapPin, 
  Building, 
  Calendar, 

  ExternalLink,
  Code2
} from "lucide-react";
import Link from "next/link";

type PublicProfile = {
  _id: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  profile?: {
    institution?: string;
    role?: string;
    preferredLanguage?: string;
  };
  stats?: {
    totalSolved: number;
    currentStreak: number;
    totalSubmissions: number;
  };
  solvedProblemsDetails?: Array<{
    _id: string;
    slug: string;
    title: string;
    difficulty: string;
    tags: string[];
    acceptanceRate?: number;
  }>;
  createdAt: string;
};

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await usersAPI.getPublicProfile(username);
        setProfile(res.data.profile);
      } catch (err: any) {
        setError(err.response?.data?.message || "User not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-background">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <UserIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">User Not Found</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          {error || "The user profile you are looking for does not exist or has been removed."}
        </p>
        <button 
          onClick={() => router.push("/")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "hard": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="flex-1 bg-background text-foreground min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Profile Details */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* User ID Card */}
            <div className="bg-card rounded-2xl border border-border p-8 text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent -z-10" />
              
              <div className="w-32 h-32 rounded-full border-4 border-background bg-muted mx-auto mb-6 flex items-center justify-center shadow-md overflow-hidden relative z-10">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              
              <h1 className="text-2xl font-bold mb-1 tracking-tight">{profile.name}</h1>
              {profile.username && (
                <p className="text-emerald-500 font-medium mb-4">@{profile.username}</p>
              )}
              
              {profile.bio && (
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {profile.bio}
                </p>
              )}
              
              <div className="flex flex-col gap-3 text-sm text-muted-foreground text-left mt-6 pt-6 border-t border-border">
                {profile.profile?.institution && (
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-emerald-500/70" />
                    <span className="font-medium text-foreground/80">{profile.profile.institution}</span>
                  </div>
                )}
                {profile.profile?.role && (
                  <div className="flex items-center gap-3 capitalize">
                    <UserIcon className="w-4 h-4 text-emerald-500/70" />
                    <span className="font-medium text-foreground/80">{profile.profile.role}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-emerald-500/70" />
                  <span className="font-medium text-foreground/80">Joined {joinDate}</span>
                </div>
              </div>
            </div>

            {/* Skills & Badges Area */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-500" /> Preferences
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.profile?.preferredLanguage ? (
                  <span className="px-3 py-1 bg-muted text-foreground rounded-full text-xs font-medium capitalize">
                    {profile.profile.preferredLanguage}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">Not specified</span>
                )}
              </div>
            </div>
            
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Solved</p>
                  <p className="text-4xl font-bold tracking-tight text-foreground">{profile.stats?.totalSolved || 0}</p>
                </div>
              </div>
              
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Trophy className="w-16 h-16 text-amber-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Current Streak</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold tracking-tight text-foreground">{profile.stats?.currentStreak || 0}</p>
                    <span className="text-sm font-medium text-muted-foreground">days</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Target className="w-16 h-16 text-blue-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Submissions</p>
                  <p className="text-4xl font-bold tracking-tight text-foreground">{profile.stats?.totalSubmissions || 0}</p>
                </div>
              </div>
            </div>

            {/* Solved Problems List */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">Solved Problems</h2>
                  <p className="text-sm text-muted-foreground">Recent algorithmic challenges completed successfully.</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {profile.solvedProblemsDetails?.length || 0}
                </div>
              </div>
              
              {profile.solvedProblemsDetails && profile.solvedProblemsDetails.length > 0 ? (
                <div className="divide-y divide-border">
                  {profile.solvedProblemsDetails.map((problem) => (
                    <Link 
                      href={`/problems/${problem.slug}`} 
                      key={problem._id}
                      className="block p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-emerald-500 transition-colors mb-1">
                            {problem.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                            {problem.acceptanceRate && (
                              <span className="text-xs text-muted-foreground">
                                Acceptance: {problem.acceptanceRate}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No problems solved yet</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    {profile.name} hasn't completed any coding challenges on the platform yet.
                  </p>
                </div>
              )}
            </div>

          </div>
          
        </div>
        
      </div>
    </div>
  );
}

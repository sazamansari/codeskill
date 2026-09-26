"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldAlert, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground font-sans">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
            <ShieldAlert className="w-3.5 h-3.5" /> Institution System
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Registration Closed
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Public self-registration is disabled. Candidate accounts are created and managed directly by university administration.
          </p>
        </div>

        <div className="p-4 bg-muted/30 border border-border/50 rounded-xl text-xs text-muted-foreground text-left space-y-1">
          <p className="font-semibold text-foreground">Already enrolled?</p>
          <p>Please log in using your official University UID and issued assessment password.</p>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm transition-all shadow-md shadow-primary/20"
        >
          Go to Student Login <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-xs text-muted-foreground font-mono">
          Redirecting automatically to Student Login in 4 seconds...
        </p>
      </div>
    </div>
  );
}

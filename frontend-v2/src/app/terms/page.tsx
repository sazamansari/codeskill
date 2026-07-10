import React from 'react';
import { Globe, User, Lightbulb, AlertTriangle, ArrowRight, Scale } from "lucide-react";
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | CodeSkill',
  description: 'Terms of Service for CodeSkill by Evolvian',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-20" />
      <div className="absolute top-0 inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 shadow-inner shadow-primary/20">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Service</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Welcome to CodeSkill, an Evolvian company. By accessing or using our platform, 
            you agree to be bound by these Terms of Service.
          </p>
        </div>
        
        {/* Content Container */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/5 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 space-y-12">
            
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">1. Use of the Platform</h2>
              </div>
              <div className="pl-14 text-muted-foreground leading-relaxed">
                <p>
                  CodeSkill provides an online coding environment, algorithm challenges, and technical assessments. 
                  You agree to use the platform only for lawful purposes and in accordance with these Terms. You must 
                  not use the platform to conduct malicious attacks, distribute malware, or attempt to compromise the 
                  automated grading environments.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">2. User Accounts</h2>
              </div>
              <div className="pl-14 text-muted-foreground leading-relaxed">
                <p>
                  When you create an account with us, you must provide accurate, complete, and current information. 
                  You are responsible for safeguarding the password that you use to access the platform and for any 
                  activities or actions under your password.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">3. Intellectual Property</h2>
              </div>
              <div className="pl-14 text-muted-foreground leading-relaxed">
                <p>
                  The platform and its original content (excluding user-submitted code), features, and functionality 
                  are and will remain the exclusive property of Evolvian and its licensors. User-submitted code 
                  remains the intellectual property of the user, though you grant CodeSkill a license to execute, 
                  analyze, and store it for the purpose of the platform's functionality.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">4. Code of Conduct</h2>
              </div>
              <div className="pl-14 text-muted-foreground leading-relaxed">
                <p>
                  Users are strictly prohibited from cheating during contests, sharing solutions during active competitive 
                  periods, or attempting to exploit the code execution environments. Any violation of these rules may 
                  result in immediate account suspension or termination.
                </p>
              </div>
            </section>
            
          </div>
          
          <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>Last updated: <span className="font-medium text-foreground">July 2026</span></p>
            <Link href="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
              Return to Homepage
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Shield, Lock, FileText, Mail, ArrowRight } from "lucide-react";
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | CodeSkill',
  description: 'Privacy Policy for CodeSkill by Evolvian',
};

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Policy</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            At CodeSkill (an Evolvian company), we believe that your data is yours. 
            We are committed to safeguarding your privacy while providing a world-class coding experience.
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
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">1. Information We Collect</h2>
              </div>
              <div className="pl-14 text-muted-foreground leading-relaxed space-y-4">
                <p>
                  We collect information that you provide directly to us when you register for an account, 
                  participate in coding contests, or communicate with us. This may include:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                  <li>Your name and email address</li>
                  <li>Account password (securely hashed)</li>
                  <li>Coding submissions, performance metrics, and leaderboard scores</li>
                  <li>Profile information such as institution or bio</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">2. How We Use Your Information</h2>
              </div>
              <div className="pl-14 text-muted-foreground leading-relaxed space-y-4">
                <p>
                  We use the information we collect to operate, maintain, and provide the features and functionality 
                  of the CodeSkill platform. This enables us to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                  <li>Analyze code submissions and generate real-time execution results</li>
                  <li>Calculate global and contest-specific leaderboard rankings</li>
                  <li>Personalize your user experience and suggest relevant problems</li>
                  <li>Ensure the security and integrity of our contest environment</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">3. Data Security</h2>
              </div>
              <div className="pl-14 text-muted-foreground leading-relaxed">
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal 
                  information. Your code is executed in isolated, secure sandboxes. While we have taken reasonable 
                  steps to secure the personal information you provide to us, please be aware that despite our 
                  efforts, no security measures are perfect or impenetrable.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">4. Contact Us</h2>
              </div>
              <div className="pl-14 text-muted-foreground leading-relaxed">
                <p>
                  If you have questions, comments, or concerns about this Privacy Policy or our data practices, 
                  please don't hesitate to reach out to our privacy team.
                </p>
                <a 
                  href="mailto:support@evolvian.in" 
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-medium transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  support@evolvian.in
                </a>
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

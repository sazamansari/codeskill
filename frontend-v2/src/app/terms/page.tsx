import React from 'react';

export const metadata = {
  title: 'Terms of Service | CodeSkill',
  description: 'Terms of Service for CodeSkill by Evolvian',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-gray-600">
          <p>
            Welcome to CodeSkill, an Evolvian company. By accessing or using our platform, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Use of the Platform</h2>
          <p>
            CodeSkill provides an online coding environment, algorithm challenges, and technical assessments. You agree to use the platform only for lawful purposes and in accordance with these Terms. You must not use the platform to conduct malicious attacks, distribute malware, or attempt to compromise the automated grading environments.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the platform and for any activities or actions under your password.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Intellectual Property</h2>
          <p>
            The platform and its original content (excluding user-submitted code), features, and functionality are and will remain the exclusive property of Evolvian and its licensors. User-submitted code remains the intellectual property of the user, though you grant CodeSkill a license to execute, analyze, and store it for the purpose of the platform's functionality.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Code of Conduct</h2>
          <p>
            Users are strictly prohibited from cheating during contests, sharing solutions during active competitive periods, or attempting to exploit the code execution environments.
          </p>

          <p className="text-sm text-gray-400 mt-12 pt-8 border-t border-gray-100">
            Last updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}

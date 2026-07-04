import React from 'react';

export const metadata = {
  title: 'Privacy Policy | CodeSkill',
  description: 'Privacy Policy for CodeSkill by Evolvian',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-gray-600">
          <p>
            At CodeSkill (an Evolvian company), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our coding platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you register for an account, participate in coding contests, or communicate with us. This may include your name, email address, password, and coding submissions.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to operate, maintain, and provide the features and functionality of the CodeSkill platform. This includes analyzing code submissions, calculating leaderboard rankings, and personalizing your user experience.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at <a href="mailto:support@evolvian.in" className="text-blue-600 hover:underline">support@evolvian.in</a>.
          </p>
          
          <p className="text-sm text-gray-400 mt-12 pt-8 border-t border-gray-100">
            Last updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}

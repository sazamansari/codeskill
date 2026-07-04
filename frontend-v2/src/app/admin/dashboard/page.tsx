"use client";

import { Users, Code, Activity, ShieldAlert } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="p-8 font-sans">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, administrator. Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">1,248</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Code Submissions</p>
            <p className="text-2xl font-bold text-gray-900">45,912</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Today</p>
            <p className="text-2xl font-bold text-gray-900">324</p>
          </div>
        </div>
      </div>

      {/* Quick Actions / Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center text-gray-500 py-16">
        <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Dashboard Ready</h3>
        <p className="max-w-md mx-auto text-sm">
          This is a secure area accessible only to users with administrative privileges. 
          You can expand this dashboard to include user management, problem creation, and system monitoring.
        </p>
      </div>
    </div>
  );
}

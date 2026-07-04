"use client";

import { useEffect, useState } from "react";
import { adminContestsAPI } from "@/config/api";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Eye, Calendar, Clock } from "lucide-react";

export default function ContestsAdminPage() {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const res = await adminContestsAPI.getAll();
      setContests(res.data.data);
    } catch (err) {
      console.error("Failed to fetch contests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contest?")) {
      try {
        await adminContestsAPI.delete(id);
        fetchContests();
      } catch (err) {
        console.error("Failed to delete contest", err);
      }
    }
  };

  const getStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) return { label: "Upcoming", color: "bg-blue-100 text-blue-700" };
    if (now >= start && now <= end) return { label: "Active", color: "bg-green-100 text-green-700" };
    return { label: "Ended", color: "bg-gray-100 text-gray-700" };
  };

  const filteredContests = contests.filter((c) => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contest Management</h1>
          <p className="text-gray-500 text-sm mt-1">Schedule and manage coding competitions and assessments.</p>
        </div>
        <Link 
          href="/admin/contests/create" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Contest
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search contests by title or slug..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {filteredContests.length} {filteredContests.length === 1 ? 'contest' : 'contests'}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Contest Details</th>
                <th className="px-6 py-3">Schedule</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Access</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading contests...</td>
                </tr>
              ) : filteredContests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-medium">No contests found</p>
                      <p className="text-gray-500 text-sm mt-1">Try adjusting your search or create a new contest.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContests.map((contest) => {
                  const status = getStatus(contest.startTime, contest.endTime);
                  return (
                    <tr key={contest._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{contest.title}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{contest.slug}</div>
                        <div className="text-xs text-blue-500 mt-1 font-medium">{contest.problems?.length || 0} problems</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(contest.startTime).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(contest.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(contest.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {contest.isPrivate ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Private
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Public
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/contests/${contest.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="View Contest">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Contest">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(contest._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Contest">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

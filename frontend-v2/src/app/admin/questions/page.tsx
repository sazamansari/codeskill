"use client";

import { useEffect, useState } from "react";
import { adminProblemsAPI } from "@/config/api";
import Link from "next/link";
import { Plus, Search, MoreVertical, Edit2, Trash2, Eye } from "lucide-react";

export default function QuestionsAdminPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await adminProblemsAPI.getAll();
      setProblems(res.data.data);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this problem?")) {
      try {
        await adminProblemsAPI.delete(id);
        fetchProblems();
      } catch (err) {
        console.error("Failed to delete problem", err);
      }
    }
  };

  const filteredProblems = problems.filter((p) => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-500 text-sm mt-1">Manage coding problems, test cases, and editorials.</p>
        </div>
        <Link 
          href="/admin/questions/create" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Question
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search questions by title or slug..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {filteredProblems.length} {filteredProblems.length === 1 ? 'question' : 'questions'}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Difficulty</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading questions...</td>
                </tr>
              ) : filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-medium">No questions found</p>
                      <p className="text-gray-500 text-sm mt-1">Try adjusting your search or create a new question.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem) => (
                  <tr key={problem._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{problem.title}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{problem.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {problem.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(problem.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/problems/${problem.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="View Problem">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Problem">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(problem._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Problem">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

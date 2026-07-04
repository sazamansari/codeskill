"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminContestsAPI, adminProblemsAPI } from "@/config/api";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Search, CheckCircle2 } from "lucide-react";

export default function CreateContestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    startTime: "",
    endTime: "",
    isPrivate: false,
    password: "",
    isPublished: false,
  });
  
  // Problems State
  const [allProblems, setAllProblems] = useState<any[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [problemSearch, setProblemSearch] = useState("");

  useEffect(() => {
    // Fetch all problems for the selection UI
    const fetchProblems = async () => {
      try {
        const res = await adminProblemsAPI.getAll();
        setAllProblems(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch problems", err);
      }
    };
    fetchProblems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Auto-generate slug from title
    if (name === "title") {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, title: value, slug }));
      return;
    }

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleProblemSelection = (id: string) => {
    setSelectedProblems(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminContestsAPI.create({
        ...formData,
        problems: selectedProblems
      });
      router.push("/admin/contests");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create contest");
      setLoading(false);
    }
  };

  const filteredProblems = allProblems.filter(p => 
    p.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(problemSearch.toLowerCase())
  );

  return (
    <div className="p-8 font-sans max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/contests" className="text-gray-500 hover:text-gray-900 inline-flex items-center gap-2 text-sm font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Contests
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Contest</h1>
        <p className="text-gray-500 text-sm mt-1">Schedule a new coding competition and select problems.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details (Left Col) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Contest Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Contest Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Weekly Algorithm Challenge #1"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">URL Slug <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="e.g. weekly-algo-1"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe the contest rules and objectives..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Start Time <span className="text-red-500">*</span></label>
                  <input 
                    type="datetime-local" 
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">End Time <span className="text-red-500">*</span></label>
                  <input 
                    type="datetime-local" 
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Problem Selection Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6 flex flex-col h-[500px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h2 className="text-lg font-semibold text-gray-900">Select Problems</h2>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {selectedProblems.length} Selected
                </span>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search problem bank..." 
                  value={problemSearch}
                  onChange={(e) => setProblemSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {filteredProblems.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-8">No problems found.</div>
                ) : (
                  filteredProblems.map(problem => {
                    const isSelected = selectedProblems.includes(problem._id);
                    return (
                      <div 
                        key={problem._id}
                        onClick={() => toggleProblemSelection(problem._id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_0_1px_rgba(59,130,246,0.1)]' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <p className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{problem.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{problem.difficulty} • {problem.slug}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Details (Right Col) */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Access & Publishing</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5">
                    <input 
                      type="checkbox"
                      id="isPrivate"
                      name="isPrivate"
                      checked={formData.isPrivate}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700 cursor-pointer">Private Contest</label>
                    <p className="text-xs text-gray-500 mt-1">Require a password for users to access this contest.</p>
                  </div>
                </div>

                {formData.isPrivate && (
                  <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="text-sm font-medium text-gray-700">Contest Password</label>
                    <input 
                      type="text" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter access code..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                )}
                
                <hr className="border-gray-100 my-4" />

                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5">
                    <input 
                      type="checkbox"
                      id="isPublished"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 cursor-pointer">Publish Contest</label>
                    <p className="text-xs text-gray-500 mt-1">Make this contest visible on the platform (respects Start Time for actual access).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                type="submit"
                disabled={loading || selectedProblems.length === 0}
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Create Contest
              </button>
              <Link 
                href="/admin/contests"
                className="flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

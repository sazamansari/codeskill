"use client";

import { useEffect, useState } from "react";
import { adminQuestionsAPI, adminQuestionBanksAPI, adminProblemsAPI } from "@/config/api";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Code, 
  Filter, 
  FolderPlus,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  X
} from "lucide-react";

export default function QuestionsAdminPage() {
  const [activeTab, setActiveTab] = useState<"questions" | "banks" | "coding">("questions");

  // Questions State
  const [questions, setQuestions] = useState<any[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [topicsList, setTopicsList] = useState<any[]>([]);

  // Modals & Inspect
  const [inspectQuestion, setInspectQuestion] = useState<any | null>(null);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [createBankModal, setCreateBankModal] = useState(false);
  const [newBank, setNewBank] = useState({ name: "", topic: "", description: "", difficulty: "medium" });

  // Question Banks State
  const [banks, setBanks] = useState<any[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  // Coding Problems State
  const [codingProblems, setCodingProblems] = useState<any[]>([]);
  const [loadingCoding, setLoadingCoding] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (activeTab === "questions") {
      fetchQuestions();
    } else if (activeTab === "banks") {
      fetchBanks();
    } else if (activeTab === "coding") {
      fetchCodingProblems();
    }
  }, [activeTab, page, selectedTopic, selectedDifficulty, selectedType, selectedStatus]);

  const fetchTopics = async () => {
    try {
      const res = await adminQuestionsAPI.getTopics();
      const list = Array.isArray(res.data?.topics)
        ? res.data.topics
        : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setTopicsList(list);
    } catch (err) {
      console.error("Failed to fetch topics distribution", err);
      setTopicsList([]);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await adminQuestionsAPI.getAll({
        page,
        limit: 15,
        search: search || undefined,
        topic: selectedTopic || undefined,
        difficulty: selectedDifficulty || undefined,
        questionType: selectedType || undefined,
        status: selectedStatus || undefined,
      });
      setQuestions(res.data.questions || []);
      setTotalQuestions(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    setLoadingBanks(true);
    try {
      const res = await adminQuestionBanksAPI.getAll();
      const list = Array.isArray(res.data?.banks)
        ? res.data.banks
        : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setBanks(list);
    } catch (err) {
      console.error("Failed to fetch question banks", err);
      setBanks([]);
    } finally {
      setLoadingBanks(false);
    }
  };

  const fetchCodingProblems = async () => {
    setLoadingCoding(true);
    try {
      const res = await adminProblemsAPI.getAll();
      const list = Array.isArray(res.data?.problems)
        ? res.data.problems
        : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setCodingProblems(list);
    } catch (err) {
      console.error("Failed to fetch coding problems", err);
      setCodingProblems([]);
    } finally {
      setLoadingCoding(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const handleApprove = async (id: string) => {
    try {
      await adminQuestionsAPI.approve(id);
      fetchQuestions();
      if (inspectQuestion?._id === id) {
        setInspectQuestion((prev: any) => ({ ...prev, status: "active" }));
      }
    } catch (err) {
      console.error("Failed to approve question", err);
      alert("Failed to approve question");
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModalId) return;
    try {
      await adminQuestionsAPI.reject(rejectModalId, rejectionReason);
      setRejectModalId(null);
      setRejectionReason("");
      fetchQuestions();
      if (inspectQuestion?._id === rejectModalId) {
        setInspectQuestion((prev: any) => ({ ...prev, status: "rejected", rejectionReason }));
      }
    } catch (err) {
      console.error("Failed to reject question", err);
      alert("Failed to reject question");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to archive/delete this assessment question?")) return;
    try {
      await adminQuestionsAPI.delete(id);
      fetchQuestions();
      if (inspectQuestion?._id === id) setInspectQuestion(null);
    } catch (err) {
      console.error("Failed to delete question", err);
    }
  };

  const handleCreateBank = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminQuestionBanksAPI.create(newBank);
      setCreateBankModal(false);
      setNewBank({ name: "", topic: "", description: "", difficulty: "medium" });
      fetchBanks();
    } catch (err) {
      console.error("Failed to create bank", err);
      alert("Failed to create question bank");
    }
  };

  // Metrics calculations
  const pendingCount = questions.filter(q => q.status === "pending_review").length;
  const activeCount = questions.filter(q => q.status === "active").length;

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Question Bank</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Assessment v2.0
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Standardized university assessment repository with leak-prevention & automated options verification.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/questions/pending"
            className="inline-flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground border border-border px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Clock className="w-4 h-4 text-primary" />
            Review Queue
          </Link>
          <Link
            href="/admin/questions/create"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Create Question
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Questions</span>
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2 font-mono">{totalQuestions}</div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            Across all topics & courses
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active in Pool</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500 mt-2 font-mono">{activeCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Ready for assessment assembly</div>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary mt-2 font-mono">{pendingCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Requires faculty validation</div>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Indexed Topics</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2 font-mono">{topicsList.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <Link href="/admin/questions/topics" className="text-primary hover:underline">
              View distribution &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex items-center gap-6">
        <button
          onClick={() => setActiveTab("questions")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "questions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Assessment Questions
          <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground font-mono">
            {totalQuestions}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("banks")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "banks"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="w-4 h-4" />
          Question Banks (Collections)
          <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground font-mono">
            {banks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("coding")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "coding"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code className="w-4 h-4" />
          Algorithmic Challenges
          <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground font-mono">
            {codingProblems.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Assessment Questions */}
      {activeTab === "questions" && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col space-y-4">
          {/* Filters Bar */}
          <div className="p-4 border-b border-border space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search questions by keyword, tags, or question text..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-foreground transition-all"
                />
              </div>

              {/* Topic Select */}
              <select
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-amber-500"
              >
                <option value="">All Topics</option>
                {Array.isArray(topicsList) && topicsList.map((t) => (
                  <option key={t.topic} value={t.topic}>
                    {t.topic} ({t.total})
                  </option>
                ))}
              </select>

              {/* Difficulty Select */}
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-amber-500"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              {/* Question Type Select */}
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-amber-500"
              >
                <option value="">All Types</option>
                <option value="single_choice">Single Choice (MCQ)</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="coding">Code Snippet / Logic</option>
                <option value="subjective">Subjective / Descriptive</option>
              </select>

              {/* Status Select */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-amber-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending_review">Pending Review</option>
                <option value="draft">Draft</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                type="submit"
                className="px-3.5 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors"
              >
                Filter
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-3">Question Statement</th>
                  <th className="px-6 py-3">Topic / Subtopic</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3">Marks</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                        Loading assessment questions...
                      </div>
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                          <BookOpen className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-foreground font-medium mb-1">No assessment questions found</p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Get started by authoring a new question or adjusting filters.
                        </p>
                        <Link
                          href="/admin/questions/create"
                          className="inline-flex items-center gap-2 bg-amber-500 text-zinc-950 px-3.5 py-1.5 rounded-lg text-xs font-semibold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Create First Question
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  questions.map((q) => (
                    <tr key={q._id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4 max-w-md">
                        <div className="font-medium text-foreground line-clamp-2 text-sm">
                          {q.question}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {q.codeSnippet && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              <Code className="w-3 h-3 text-blue-400" />
                              {q.language || "code"}
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground">
                            {q.options?.length || 0} options
                          </span>
                          {q.aiGenerated && (
                            <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              <Sparkles className="w-2.5 h-2.5" />
                              AI Generated
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground text-xs">{q.topic}</div>
                        {q.subtopic && (
                          <div className="text-[11px] text-muted-foreground">{q.subtopic}</div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-foreground border border-border">
                          {q.questionType === "single_choice"
                            ? "Single MCQ"
                            : q.questionType === "multiple_choice"
                            ? "Multi MCQ"
                            : q.questionType}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            q.difficulty === "easy"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : q.difficulty === "medium"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs font-mono">
                        <span className="text-emerald-500 font-semibold">+{q.marks || 1}</span>
                        {q.negativeMarks > 0 && (
                          <span className="text-rose-500 ml-1">-{q.negativeMarks}</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            q.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : q.status === "pending_review"
                              ? "bg-amber-500/10 text-amber-400"
                              : q.status === "rejected"
                              ? "bg-rose-500/10 text-rose-400"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              q.status === "active"
                                ? "bg-emerald-500"
                                : q.status === "pending_review"
                                ? "bg-amber-400"
                                : q.status === "rejected"
                                ? "bg-rose-500"
                                : "bg-zinc-400"
                            }`}
                          />
                          {q.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setInspectQuestion(q)}
                            className="p-1.5 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
                            title="Inspect & Validate Question"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {q.status === "pending_review" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(q._id)}
                                className="p-1.5 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
                                title="Approve Question"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectModalId(q._id)}
                                className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                                title="Reject Question"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(q._id)}
                            className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
                            title="Delete / Archive Question"
                          >
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 bg-muted hover:bg-muted/80 disabled:opacity-40 text-xs rounded-md font-medium text-foreground transition-all"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 bg-muted hover:bg-muted/80 disabled:opacity-40 text-xs rounded-md font-medium text-foreground transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Question Banks (Collections) */}
      {activeTab === "banks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Collections group curated assessment questions for designated semester exams and departmental evaluations.
            </p>
            <button
              onClick={() => setCreateBankModal(true)}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              New Collection
            </button>
          </div>

          {loadingBanks ? (
            <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-amber-500 mb-2" />
              Loading question banks...
            </div>
          ) : !Array.isArray(banks) || banks.length === 0 ? (
            <div className="p-12 text-center bg-card border border-border rounded-xl">
              <Layers className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-foreground font-semibold">No Question Banks Created Yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Organize your assessment questions into named collections for universities and courses.
              </p>
              <button
                onClick={() => setCreateBankModal(true)}
                className="bg-amber-500 text-zinc-950 px-3.5 py-1.5 rounded-lg text-xs font-semibold"
              >
                Create Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(banks) && banks.map((bank) => (
                <div key={bank._id} className="bg-card border border-border p-5 rounded-xl hover:border-amber-500/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground text-base">{bank.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 capitalize">
                        {bank.difficulty || "mixed"}
                      </span>
                    </div>
                    <span className="inline-block mt-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                      {bank.topic}
                    </span>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {bank.description || "No description provided."}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>{bank.questions?.length || 0} Questions</span>
                    <span className="font-mono">{new Date(bank.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Algorithmic Coding Challenges */}
      {activeTab === "coding" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Algorithmic Problem Catalog</span>
            <Link
              href="/admin/questions/create"
              className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-md font-medium"
            >
              + Create Coding Problem
            </Link>
          </div>
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border font-medium">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Difficulty</th>
                <th className="px-6 py-3">Visibility</th>
                <th className="px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.isArray(codingProblems) && codingProblems.map((prob) => (
                <tr key={prob._id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <Link href={`/problems/${prob.slug}`} target="_blank" className="hover:underline flex items-center gap-1.5">
                      {prob.title}
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-xs font-semibold">{prob.difficulty}</span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {prob.visibility || "Published"}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">
                    {new Date(prob.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Question Details / Inspection Modal */}
      {inspectQuestion && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-foreground text-base">Question Inspection</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span>Topic: <b className="text-foreground">{inspectQuestion.topic}</b></span>
                    <span>•</span>
                    <span>Type: <b className="text-foreground">{inspectQuestion.questionType}</b></span>
                    <span>•</span>
                    <span>Difficulty: <b className="text-foreground capitalize">{inspectQuestion.difficulty}</b></span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInspectQuestion(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Leak Prevention Notice */}
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Leak Prevention Active: Correct answer & explanation stripped from student session payloads.
              </div>
              <span className="text-[11px] font-mono text-emerald-500">SAFE MODE</span>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-sm">
              {/* Question Statement */}
              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground block mb-2">
                  Question Statement
                </label>
                <div className="bg-zinc-900/80 border border-border p-4 rounded-xl text-foreground whitespace-pre-wrap leading-relaxed">
                  {inspectQuestion.question}
                </div>
              </div>

              {/* Code Snippet if present */}
              {inspectQuestion.codeSnippet && (
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground block mb-2">
                    Code Snippet ({inspectQuestion.language || "General"})
                  </label>
                  <pre className="bg-zinc-900 border border-border p-4 rounded-xl text-xs font-mono text-amber-300 overflow-x-auto">
                    <code>{inspectQuestion.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Options */}
              {inspectQuestion.options && inspectQuestion.options.length > 0 && (
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground block mb-2">
                    Answer Options ({inspectQuestion.options.length})
                  </label>
                  <div className="space-y-2">
                    {inspectQuestion.options.map((opt: any, idx: number) => {
                      const isCorrect = Boolean(opt.isCorrect);
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                            isCorrect
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                              : "bg-zinc-900/40 border-border text-foreground"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                              isCorrect
                                ? "bg-emerald-500 text-zinc-950"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{opt.text}</div>
                            {opt.explanation && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {opt.explanation}
                              </p>
                            )}
                          </div>
                          {isCorrect && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* General Explanation */}
              {inspectQuestion.explanation && (
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground block mb-2">
                    General Explanation & Reference
                  </label>
                  <div className="bg-zinc-900/60 border border-border p-3.5 rounded-xl text-xs text-slate-300 leading-relaxed">
                    {inspectQuestion.explanation}
                  </div>
                </div>
              )}

              {/* Rejection notice if any */}
              {inspectQuestion.status === "rejected" && inspectQuestion.rejectionReason && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-4 h-4" />
                    Rejection Reason
                  </div>
                  <p className="text-xs text-rose-300">{inspectQuestion.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-zinc-900/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Marks: <b className="text-foreground">+{inspectQuestion.marks || 1}</b> /{" "}
                <b className="text-rose-400">-{inspectQuestion.negativeMarks || 0}</b>
              </span>
              <div className="flex items-center gap-2">
                {inspectQuestion.status === "pending_review" && (
                  <>
                    <button
                      onClick={() => handleApprove(inspectQuestion._id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-semibold text-xs hover:bg-emerald-400"
                    >
                      Approve Question
                    </button>
                    <button
                      onClick={() => {
                        setRejectModalId(inspectQuestion._id);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold text-xs hover:bg-rose-500/20"
                    >
                      Reject Question
                    </button>
                  </>
                )}
                <button
                  onClick={() => setInspectQuestion(null)}
                  className="px-4 py-1.5 rounded-lg bg-muted text-foreground text-xs font-medium hover:bg-muted/80"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-border rounded-xl w-full max-w-md p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-foreground text-base">Reject Assessment Question</h3>
            <p className="text-xs text-muted-foreground">
              Provide feedback for the question author describing why this question does not meet university assessment standards.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Ambiguous answer options, incorrect code snippet syntax, or missing topic tags."
              className="w-full p-3 bg-zinc-900 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-500 text-white rounded-lg hover:bg-rose-600"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Question Bank Modal */}
      {createBankModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateBank} className="bg-zinc-950 border border-border rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-foreground text-base">Create Question Bank Collection</h3>
            <p className="text-xs text-muted-foreground">
              Collections group questions by course curriculum or difficulty for university exams.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Collection Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Data Structures & Algorithms - Endsem 2026"
                  value={newBank.name}
                  onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Topic</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Data Structures"
                  value={newBank.topic}
                  onChange={(e) => setNewBank({ ...newBank, topic: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Difficulty Level</label>
                <select
                  value={newBank.difficulty}
                  onChange={(e) => setNewBank({ ...newBank, difficulty: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-amber-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes or syllabus scope..."
                  value={newBank.description}
                  onChange={(e) => setNewBank({ ...newBank, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateBankModal(false)}
                className="px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-amber-500 text-zinc-950 rounded-lg hover:bg-amber-400"
              >
                Save Collection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

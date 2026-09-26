"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  ShieldAlert,
  Search,
  Filter,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
  HelpCircle,
  Code2
} from "lucide-react";
import { adminAssessmentsAPI, adminQuestionsAPI } from "@/config/api";

export default function CreateAssessmentPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [code, setCode] = useState(`EXAM-${Date.now().toString().slice(-4)}`);
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [passingMarks, setPassingMarks] = useState<number | "">("");
  const [negativeMarking, setNegativeMarking] = useState(true);
  const [category, setCategory] = useState("exam");

  // Proctoring Settings
  const [enforceFullscreen, setEnforceFullscreen] = useState(true);
  const [blockCopyPaste, setBlockCopyPaste] = useState(true);
  const [detectTabSwitch, setDetectTabSwitch] = useState(true);
  const [maxTabSwitches, setMaxTabSwitches] = useState(3);
  const [autoSubmitOnViolation, setAutoSubmitOnViolation] = useState(true);

  // Question Selector State
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [filterTopic, setFilterTopic] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Questions for Selection
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoadingQuestions(true);
      try {
        const res = await adminQuestionsAPI.getAll({
          limit: 100,
          status: "approved",
          topic: filterTopic || undefined,
          difficulty: filterDifficulty || undefined,
          search: searchQuery || undefined,
        });
        const qList = res.data.questions || [];
        setAvailableQuestions(qList);

        // Extract topics
        const topicRes = await adminQuestionsAPI.getTopics();
        const topList = topicRes.data.topics || topicRes.data.data || [];
        if (Array.isArray(topList)) {
          setTopics(topList.map((t: any) => t.topic || t._id));
        }
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [filterTopic, filterDifficulty, searchQuery]);

  const toggleSelectQuestion = (id: string) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((qId) => qId !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  const handleSelectAllFiltered = () => {
    const ids = availableQuestions.map((q) => q._id);
    const newSelected = Array.from(new Set([...selectedQuestionIds, ...ids]));
    setSelectedQuestionIds(newSelected);
  };

  const handleDeselectAll = () => {
    setSelectedQuestionIds([]);
  };

  // Calculated Metrics
  const selectedQuestionsData = availableQuestions.filter((q) =>
    selectedQuestionIds.includes(q._id)
  );
  const totalCalculatedMarks = selectedQuestionsData.reduce(
    (sum, q) => sum + (q.marks || 1),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide an assessment title.");
      return;
    }
    if (selectedQuestionIds.length === 0) {
      setError("Please select at least 1 question for the assessment.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await adminAssessmentsAPI.create({
        title: title.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        category,
        durationMinutes: Number(durationMinutes),
        passingMarks: passingMarks !== "" ? Number(passingMarks) : Math.ceil(totalCalculatedMarks * 0.4),
        negativeMarking,
        questionIds: selectedQuestionIds,
        proctoring: {
          enforceFullscreen,
          blockCopyPaste,
          detectTabSwitch,
          maxTabSwitches: Number(maxTabSwitches),
          autoSubmitOnViolation,
        },
      });

      router.push("/admin/assessments");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create assessment");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/assessments"
            className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create MCQ Assessment
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Assemble questions, configure duration, and enforce anti-cheat rules.
            </p>
          </div>
        </div>

        {/* Live Metrics Header Pill */}
        <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-2xl shadow-sm">
          <div className="text-center pr-3 border-r border-border">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Selected</span>
            <div className="text-base font-bold text-primary font-mono">{selectedQuestionIds.length} Qs</div>
          </div>
          <div className="text-center pl-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Marks</span>
            <div className="text-base font-bold text-emerald-400 font-mono">{totalCalculatedMarks} pts</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information & Timings */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            1. Exam Details & Duration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Assessment Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mid-Term Examination: Data Structures & Algorithms"
                className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Exam Code <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. CS2026-DSA"
                className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Description & Candidate Instructions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Important guidelines, topics covered, and university instructions..."
              className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Duration (Minutes) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min={5}
                max={300}
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Passing Marks (Optional)
              </label>
              <input
                type="number"
                min={1}
                value={passingMarks}
                onChange={(e) => setPassingMarks(e.target.value ? Number(e.target.value) : "")}
                placeholder={`Default: ${Math.ceil(totalCalculatedMarks * 0.4)} pts`}
                className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="exam">Official Semester Exam</option>
                <option value="quiz">Weekly Quiz / Test</option>
                <option value="practice">Practice Drill</option>
                <option value="recruitment">Campus Placement Test</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Question Selector */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                2. Select Questions from Bank ({selectedQuestionIds.length} Selected)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pick questions across different topics and difficulties.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-medium text-foreground transition-colors"
              >
                Select All ({availableQuestions.length})
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-9 pr-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Question List Selection Table */}
          <div className="border border-border rounded-xl overflow-hidden max-h-96 overflow-y-auto divide-y divide-border">
            {isLoadingQuestions ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                Loading question bank...
              </div>
            ) : availableQuestions.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No questions found matching criteria. Upload questions via Bulk Import first.
              </div>
            ) : (
              availableQuestions.map((q) => {
                const isSelected = selectedQuestionIds.includes(q._id);
                return (
                  <div
                    key={q._id}
                    onClick={() => toggleSelectQuestion(q._id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary/10 hover:bg-primary/15"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1 rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted border border-border text-foreground">
                          {q.topic}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            q.difficulty === "easy"
                              ? "text-emerald-400 bg-emerald-500/10"
                              : q.difficulty === "medium"
                              ? "text-amber-400 bg-amber-500/10"
                              : "text-rose-400 bg-rose-500/10"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-[11px] text-muted-foreground ml-auto font-medium font-mono">
                          {q.marks || 1} mark(s)
                        </span>
                      </div>
                      <p className="text-xs font-medium text-foreground line-clamp-2">
                        {q.question}
                      </p>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {q.options?.length || 4} Options Available
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Step 3: Proctoring & Assessment Integrity */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            3. Anti-Cheat & Proctoring Controls
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-border hover:bg-muted/30 cursor-pointer">
              <input
                type="checkbox"
                checked={enforceFullscreen}
                onChange={(e) => setEnforceFullscreen(e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Mandatory Fullscreen Mode
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Locks the exam browser tab into fullscreen mode throughout the test.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-border hover:bg-muted/30 cursor-pointer">
              <input
                type="checkbox"
                checked={blockCopyPaste}
                onChange={(e) => setBlockCopyPaste(e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Disable Copy & Paste
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Prevents copying question statements or pasting answers from external sources.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-border hover:bg-muted/30 cursor-pointer">
              <input
                type="checkbox"
                checked={detectTabSwitch}
                onChange={(e) => setDetectTabSwitch(e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Tab Switch Detection & Strike Tracking
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Logs every instance where the candidate blurs or switches away from the window.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-border hover:bg-muted/30 cursor-pointer">
              <input
                type="checkbox"
                checked={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Enable Negative Marking
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Deducts marks for incorrect responses according to question parameters.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Allowed tab-switch strikes before auto-submission:</span>
            <input
              type="number"
              min={1}
              max={10}
              value={maxTabSwitches}
              onChange={(e) => setMaxTabSwitches(Number(e.target.value))}
              className="w-16 px-2.5 py-1 bg-muted/40 border border-border rounded-lg text-xs font-bold text-foreground text-center focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/assessments"
            className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-semibold text-foreground transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || selectedQuestionIds.length === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Publish Assessment ({selectedQuestionIds.length} Questions)
          </button>
        </div>
      </form>
    </div>
  );
}

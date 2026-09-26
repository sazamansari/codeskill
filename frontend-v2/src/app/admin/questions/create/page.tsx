"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminProblemsAPI, adminQuestionsAPI } from "@/config/api";
import { useQuestionStore } from "./_store/useQuestionStore";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Settings,
  FileText,
  Code2,
  Database,
  BarChart3,
  Rocket,
  LayoutTemplate,
  Shield,
  Search,
  Cpu,
  AlertTriangle,
  ArrowRightLeft,
  Lightbulb,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  ShieldCheck,
  Check,
  Code,
  Tag,
  ListChecks,
  ClipboardEdit,
} from "lucide-react";
import { motion } from "framer-motion";
import { ToastProvider, useToast } from "./_components/Toast";
import ProgressBar from "./_components/ProgressBar";

import BasicInfo from "./_components/BasicInfo";
import ProgrammingLanguages from "./_components/ProgrammingLanguages";
import ExecutionSettings from "./_components/ExecutionSettings";
import ProblemStatement from "./_components/ProblemStatement";
import Constraints from "./_components/Constraints";
import InputOutputFormat from "./_components/InputOutputFormat";
import SampleTestCases from "./_components/SampleTestCases";
import StarterCode from "./_components/StarterCode";
import ReferenceSolution from "./_components/ReferenceSolution";
import TestCases from "./_components/TestCases";
import CustomChecker from "./_components/CustomChecker";
import SolutionExplanation from "./_components/SolutionExplanation";
import AIAssistance from "./_components/AIAssistance";
import SEOSection from "./_components/SEOSection";
import AnalyticsSection from "./_components/AnalyticsSection";
import PublishingSection from "./_components/PublishingSection";

const NAV_ITEMS = [
  { id: "basic-info", label: "Basic Info", icon: Settings },
  { id: "languages", label: "Languages", icon: Code2 },
  { id: "execution-settings", label: "Execution", icon: Cpu },
  { id: "statement", label: "Statement", icon: FileText },
  { id: "constraints", label: "Constraints", icon: AlertTriangle },
  { id: "io-format", label: "I/O Format", icon: ArrowRightLeft },
  { id: "sample-test-cases", label: "Sample Cases", icon: Lightbulb },
  { id: "starter-code", label: "Starter Code", icon: LayoutTemplate },
  { id: "reference-solution", label: "Reference", icon: Shield },
  { id: "test-cases", label: "Test Cases", icon: Database },
  { id: "custom-checker", label: "Checker", icon: Shield },
  { id: "solution-explanation", label: "Editorial", icon: BookOpen },
  { id: "ai-assistance", label: "AI Tools", icon: Sparkles },
  { id: "seo", label: "SEO", icon: Search },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "publishing", label: "Publishing", icon: Rocket },
];

const SUGGESTED_TOPICS = [
  "Data Structures",
  "Algorithms",
  "Operating Systems",
  "Database Management Systems",
  "Computer Networks",
  "Object-Oriented Programming",
  "Software Engineering",
  "Web Technologies",
  "Discrete Mathematics",
  "General Aptitude",
];

// Shared field styles
const inputCls =
  "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all";
const selectCls =
  "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none cursor-pointer";
const labelCls =
  "block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wide";
const cardCls = "bg-card border border-border rounded-xl p-6";
const sectionHeadingCls =
  "text-sm font-semibold text-foreground flex items-center gap-2 mb-5 pb-3 border-b border-border";

// Assessment Question Form (MCQ / Snippet)
function AssessmentQuestionForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState<
    "single_choice" | "multiple_choice" | "coding" | "subjective"
  >("single_choice");
  const [topic, setTopic] = useState("Data Structures");
  const [customTopic, setCustomTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const [language, setLanguage] = useState("general");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [explanation, setExplanation] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"active" | "draft" | "pending_review">("active");

  const [options, setOptions] = useState<
    Array<{ text: string; isCorrect: boolean; explanation: string }>
  >([
    { text: "", isCorrect: true, explanation: "" },
    { text: "", isCorrect: false, explanation: "" },
    { text: "", isCorrect: false, explanation: "" },
    { text: "", isCorrect: false, explanation: "" },
  ]);

  const handleOptionTextChange = (index: number, val: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], text: val };
      return next;
    });
  };

  const handleOptionExplanationChange = (index: number, val: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], explanation: val };
      return next;
    });
  };

  const handleCorrectToggle = (index: number) => {
    if (questionType === "single_choice") {
      setOptions((prev) => prev.map((opt, i) => ({ ...opt, isCorrect: i === index })));
    } else {
      setOptions((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], isCorrect: !next[index].isCorrect };
        return next;
      });
    }
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, { text: "", isCorrect: false, explanation: "" }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 4) {
      addToast("error", "Minimum Options", "At least 4 options are required.");
      return;
    }
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!question.trim()) {
      addToast("error", "Missing Field", "Please enter the question statement.");
      return false;
    }
    const effectiveTopic = customTopic.trim() || topic;
    if (!effectiveTopic) {
      addToast("error", "Missing Field", "Please select or enter a topic.");
      return false;
    }
    if (questionType === "single_choice" || questionType === "multiple_choice") {
      if (options.length < 4) {
        addToast("error", "Options Required", "At least 4 options are required.");
        return false;
      }
      for (let i = 0; i < options.length; i++) {
        if (!options[i].text.trim()) {
          addToast("error", "Empty Option", `Option ${String.fromCharCode(65 + i)} cannot be empty.`);
          return false;
        }
      }
      if (!options.some((o) => o.isCorrect)) {
        addToast("error", "No Correct Answer", "Mark at least one option as correct.");
        return false;
      }
      if (
        questionType === "single_choice" &&
        options.filter((o) => o.isCorrect).length !== 1
      ) {
        addToast(
          "error",
          "Single Answer Only",
          "Single choice questions must have exactly one correct answer."
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const effectiveTopic = customTopic.trim() || topic;
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const payload = {
        question: question.trim(),
        questionType,
        topic: effectiveTopic,
        subtopic: subtopic.trim() || undefined,
        difficulty,
        marks: Number(marks) || 1,
        negativeMarks: Number(negativeMarks) || 0,
        language: language !== "general" ? language : undefined,
        codeSnippet: codeSnippet.trim() || undefined,
        options:
          questionType === "single_choice" || questionType === "multiple_choice"
            ? options
            : undefined,
        explanation: explanation.trim() || undefined,
        tags: tagList.length > 0 ? tagList : undefined,
        status,
      };
      await adminQuestionsAPI.create(payload);
      addToast("success", "Question Saved", "Question added to the question bank.");
      setTimeout(() => router.push("/admin/questions"), 1000);
    } catch (err: any) {
      addToast("error", "Save Failed", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const showOptions =
    questionType === "single_choice" || questionType === "multiple_choice";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      {/* Security Notice */}
      <div className="flex items-center gap-3 p-3.5 bg-emerald-500/8 border border-emerald-500/20 rounded-lg">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Correct answers and explanations are automatically hidden from students during
          assessment sessions.
        </p>
        <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-md shrink-0">
          SECURE
        </span>
      </div>

      {/* Section 1: Classification */}
      <div className={cardCls}>
        <h3 className={sectionHeadingCls}>
          <Settings className="w-4 h-4 text-amber-500" />
          Classification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={selectCls}
            >
              {SUGGESTED_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="__custom__">Custom topic…</option>
            </select>
            {topic === "__custom__" && (
              <input
                type="text"
                placeholder="Enter custom topic"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className={`${inputCls} mt-2`}
              />
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>
              Subtopic{" "}
              <span className="normal-case font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Binary Trees, Pointers, ACID Properties"
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Question Type</label>
            <select
              value={questionType}
              onChange={(e: any) => setQuestionType(e.target.value)}
              className={selectCls}
            >
              <option value="single_choice">Single Choice (MCQ)</option>
              <option value="multiple_choice">Multiple Choice (MSQ)</option>
              <option value="coding">Code Snippet / Debugging</option>
              <option value="subjective">Subjective / Descriptive</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Difficulty</label>
            <select
              value={difficulty}
              onChange={(e: any) => setDifficulty(e.target.value)}
              className={selectCls}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Marks</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Negative Marks</label>
            <input
              type="number"
              min="0"
              step="0.25"
              value={negativeMarks}
              onChange={(e) => setNegativeMarks(Number(e.target.value))}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Question Content */}
      <div className={cardCls}>
        <h3 className={sectionHeadingCls}>
          <ClipboardEdit className="w-4 h-4 text-amber-500" />
          Question Content
        </h3>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>
              Question Statement{" "}
              <span className="text-rose-500 normal-case font-normal">*required</span>
            </label>
            <textarea
              required
              rows={5}
              placeholder="Write the question statement here. Markdown and LaTeX are supported."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`${inputCls} resize-y leading-relaxed`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`${labelCls} mb-0`}>
                <Code className="w-3.5 h-3.5 inline mr-1.5 text-blue-400" />
                Code Snippet{" "}
                <span className="normal-case font-normal text-muted-foreground">(optional)</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
              >
                <option value="general">No language</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            <textarea
              rows={5}
              placeholder={"// Paste a code snippet if this question requires code analysis\nint countNodes(Node* root) {\n    if (root == NULL) return 0;\n    return 1 + countNodes(root->left) + countNodes(root->right);\n}"}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full p-3.5 bg-zinc-950 border border-border rounded-lg text-xs font-mono text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all resize-y"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Answer Options */}
      {showOptions && (
        <div className={cardCls}>
          <div className="flex items-start justify-between mb-5 pb-3 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-amber-500" />
                Answer Options
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {questionType === "single_choice"
                  ? "Select the single correct answer."
                  : "Check all options that are correct."}{" "}
                Minimum 4 options required.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddOption}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-muted hover:bg-muted/70 text-foreground transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Option
            </button>
          </div>

          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div
                key={idx}
                className={`rounded-lg border transition-all ${
                  opt.isCorrect
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-start gap-3 p-3.5">
                  <button
                    type="button"
                    onClick={() => handleCorrectToggle(idx)}
                    title={opt.isCorrect ? "Correct" : "Mark as correct"}
                    className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      opt.isCorrect
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-border bg-background hover:border-emerald-500/60"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground/70">
                        Option {String.fromCharCode(65 + idx)}
                        {opt.isCorrect && (
                          <span className="ml-2 text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                            CORRECT
                          </span>
                        )}
                      </span>
                      {options.length > 4 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="text-muted-foreground hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      className={inputCls}
                    />
                    <input
                      type="text"
                      placeholder="Explanation for this option (shown post-assessment)"
                      value={opt.explanation}
                      onChange={(e) => handleOptionExplanationChange(idx, e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-muted-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Editorial & Metadata */}
      <div className={cardCls}>
        <h3 className={sectionHeadingCls}>
          <BookOpen className="w-4 h-4 text-amber-500" />
          Editorial &amp; Metadata
        </h3>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>
              Solution Explanation{" "}
              <span className="normal-case font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Explain the correct answer, approach, time complexity, or edge cases for post-assessment review."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className={`${inputCls} resize-y leading-relaxed`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <Tag className="w-3.5 h-3.5 inline mr-1.5" />
                Tags{" "}
                <span className="normal-case font-normal text-muted-foreground">
                  (comma-separated)
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. recursion, tree, gate2024"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Initial Status</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className={selectCls}
              >
                <option value="active">Active — Available in bank</option>
                <option value="draft">Draft — Saved privately</option>
                <option value="pending_review">Pending Review — Sent for approval</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <Link
          href="/admin/questions"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save to Question Bank
        </button>
      </div>
    </form>
  );
}

// Main Create Question Page
function CreateQuestionContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authoringMode, setAuthoringMode] = useState<"assessment" | "algorithmic">(
    "assessment"
  );
  const { addToast } = useToast();

  const store = useQuestionStore();
  const { lastSaved, markSaved, getProgress, activeSection, setActiveSection, resetStore } =
    store;

  useEffect(() => {
    if (authoringMode !== "algorithmic") return;
    const interval = setInterval(() => markSaved(), 60000);
    return () => clearInterval(interval);
  }, [markSaved, authoringMode]);

  useEffect(() => {
    if (authoringMode !== "algorithmic") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [setActiveSection, authoringMode]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offsetPosition = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handleValidate = () => {
    if (!store.metadata.title.trim() || !store.metadata.slug.trim()) {
      addToast("error", "Validation Failed", "Question Title and URL Slug are required.");
      scrollToSection("basic-info");
      return false;
    }
    if (store.languages.supported.length === 0) {
      addToast("error", "Validation Failed", "Please select at least one programming language.");
      scrollToSection("languages");
      return false;
    }
    addToast("success", "Validation Passed", "All required fields look good.");
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!handleValidate()) return;
    setLoading(true);
    try {
      const visibility =
        store.metadata.visibility === "Published" || store.publishing.publishImmediately
          ? "Published"
          : store.metadata.visibility === "Draft" || store.publishing.saveAsDraft
          ? "Draft"
          : store.metadata.visibility || "Draft";

      const payload = {
        metadata: { ...store.metadata, visibility },
        languages: store.languages.supported || store.languages,
        execution: store.execution,
        statement: store.statement,
        sampleExamples: store.sampleExamples,
        starterCode: store.starterCode,
        referenceSolution: store.referenceSolution,
        testCases: { cases: store.testCases },
        customChecker: store.customChecker,
        solutionExplanation: store.solutionExplanation,
        seo: store.seo,
        analytics: store.analytics,
        publishing: { ...store.publishing, visibility },
      };

      await adminProblemsAPI.create(payload);
      addToast("success", "Question Created", "Algorithmic challenge created successfully.");
      setTimeout(() => router.push("/admin/questions"), 1000);
    } catch (err: any) {
      addToast("error", "Failed", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const progress = getProgress();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Left: breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/questions"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Question Bank
            </Link>
            <span className="text-border text-sm">/</span>
            <h1 className="text-sm font-semibold text-foreground truncate">Create Question</h1>
          </div>

          {/* Center: Mode tabs */}
          <div className="flex items-center bg-muted rounded-lg p-1 gap-1">
            <button
              type="button"
              onClick={() => setAuthoringMode("assessment")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                authoringMode === "assessment"
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              MCQ / Assessment
            </button>
            <button
              type="button"
              onClick={() => setAuthoringMode("algorithmic")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                authoringMode === "algorithmic"
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Algorithmic (LeetCode Style)
            </button>
          </div>

          {/* Right: progress / save status */}
          <div className="flex items-center gap-3 shrink-0">
            {authoringMode === "algorithmic" && (
              <>
                <div className="hidden md:block w-32">
                  <ProgressBar value={progress} />
                </div>
                {lastSaved && (
                  <span className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Saved{" "}
                    {new Date(lastSaved).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Page Body */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {authoringMode === "assessment" ? (
          <AssessmentQuestionForm />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar nav */}
            <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">
                Sections
              </p>
              <nav className="space-y-0.5">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all text-left ${
                      activeSection === item.id
                        ? "bg-amber-500/10 text-amber-500"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 shrink-0 ${
                        activeSection === item.id ? "text-amber-500" : "text-muted-foreground"
                      }`}
                    />
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main form */}
            <div className="flex-1 w-full min-w-0">
              <form id="question-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
                <BasicInfo />
                <ProgrammingLanguages />
                <ExecutionSettings />
                <ProblemStatement />
                <Constraints />
                <InputOutputFormat />
                <SampleTestCases />
                <StarterCode />
                <ReferenceSolution />
                <TestCases />
                <CustomChecker />
                <SolutionExplanation />
                <AIAssistance />
                <SEOSection />
                <AnalyticsSection />
                <PublishingSection />
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Sticky action bar (algorithmic mode) */}
      {authoringMode === "algorithmic" && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.4 }}
          className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border px-6 py-3 shadow-2xl z-50"
        >
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/admin/questions")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  markSaved();
                  addToast("info", "Draft Saved", "Progress saved locally.");
                }}
                className="px-4 py-2 text-xs font-semibold text-foreground bg-muted border border-border rounded-lg hover:bg-muted/70 transition-colors whitespace-nowrap"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handleValidate}
                className="px-4 py-2 text-xs font-semibold text-foreground bg-muted border border-border rounded-lg hover:bg-muted/70 transition-colors whitespace-nowrap"
              >
                Validate
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSubmit();
                  resetStore();
                }}
                disabled={loading}
                className="hidden sm:block px-4 py-2 text-xs font-semibold text-foreground bg-muted border border-border rounded-lg hover:bg-muted/70 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                Save &amp; Add Another
              </button>
              <button
                type="submit"
                form="question-form"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-zinc-950 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors shadow-md shadow-amber-500/20 disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Publish
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function CreateAdvancedQuestionPage() {
  return (
    <ToastProvider>
      <CreateQuestionContent />
    </ToastProvider>
  );
}

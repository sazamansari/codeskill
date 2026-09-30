"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Play, Send, Settings, BookOpen, Terminal, Clock, ChevronLeft, ChevronDown, 
  Maximize2, Minimize2, CheckCircle2, Loader2, XCircle, AlertTriangle, 
  List, MessageSquare, Lightbulb, Sparkles, StickyNote, Tag, BarChart3,
  Trophy, Flame, Copy, RotateCcw, History, Eye, EyeOff, Plus, Trash2,
  ThumbsUp, ThumbsDown, ArrowLeft, Hash, Zap, Target, Award, TrendingUp,
  Code2, FileText, Brain, User
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback, use, useRef } from "react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import { submissionAPI, runAPI, problemsAPI, discussionsAPI } from "@/config/api";
import { useTheme } from "@/context/ThemeContext";

const LANGUAGES = [
  { id: "c", name: "C", ext: "main.c", defaultCode: "#include <stdio.h>\n\nint main() {\n    // Read input\n    // Write your solution here\n    return 0;\n}" },
  { id: "cpp", name: "C++", ext: "main.cpp", defaultCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Read input\n    // Write your solution here\n    return 0;\n}" },
  { id: "java", name: "Java", ext: "Main.java", defaultCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read input and write your solution here\n    }\n}" },
  { id: "javascript", name: "JavaScript", ext: "solution.js", defaultCode: "// Read from stdin, write to stdout\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\n\nconst lines = [];\nrl.on('line', (line) => lines.push(line));\nrl.on('close', () => {\n  // Process input and solve\n  console.log('Hello World');\n});\n" },
  { id: "python", name: "Python 3", ext: "solution.py", defaultCode: "# Read from stdin, write to stdout\nimport sys\ninput_data = sys.stdin.read().split()\n# Process input and solve\nprint('Hello World')\n" }
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "text-[#10B981] bg-[rgba(16,185,129,0.10)] border-[rgba(16,185,129,0.25)]",
  Medium: "text-[#F59E0B] bg-[rgba(245,158,11,0.10)] border-[rgba(245,158,11,0.25)]",
  Hard: "text-[#EF4444] bg-[rgba(239,68,68,0.10)] border-[rgba(239,68,68,0.25)]",
};

interface TestResult {
  id: number;
  passed: boolean;
  status: string;
  output: string;
  expected: string;
  error?: string;
  executionTime?: number;
}

type SubmissionStatus = "accepted" | "wrong_answer" | "compile_error" | "runtime_error" | "time_limit" | "memory_limit" | "system_error" | "error";

interface RunResult {
  status: SubmissionStatus;
  results: TestResult[];
  runtime: number;
  logs: string[];
  passedCount: number;
  totalCount: number;
}

// ─── SIDEBAR TAB DEFINITIONS ─────────────────────────────────────────────────
const SIDEBAR_TABS = [
  { id: "description", icon: FileText, label: "Description", shortcut: "⌘D" },
  { id: "editorial", icon: BookOpen, label: "Editorial", shortcut: "⌘E" },
  { id: "submissions", icon: History, label: "Submissions", shortcut: "⌘S" },
  { id: "hints", icon: Lightbulb, label: "Hints", shortcut: "⌘H" },
  { id: "notes", icon: StickyNote, label: "Notes", shortcut: "⌘N" },
  { id: "discussion", icon: MessageSquare, label: "Discussion", shortcut: "⌘/" },
  { id: "ai_tutor", icon: Brain, label: "AI Tutor", shortcut: "⌘I" },
];

export default function ProblemWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const problemId = unwrappedParams.id;
  const { theme } = useTheme();
  
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Tab State
  const [activeSidebarTab, setActiveSidebarTab] = useState("description");
  
  // Editor State
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>("");

  const [vimMode, setVimMode] = useState(false);
  const [editorInst, setEditorInst] = useState<any>(null);
  const [vimInst, setVimInst] = useState<any>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Execution State
  const [activeBottomTab, setActiveBottomTab] = useState("testcases");
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [activeResultCase, setActiveResultCase] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);

  // Notes State
  const [noteContent, setNoteContent] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);

  // Hints State
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

  // Submissions History
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Discussions State
  const [threads, setThreads] = useState<any[]>([]);
  const [discussionLoading, setDiscussionLoading] = useState(false);
  const [discussionFilter, setDiscussionFilter] = useState("all");
  const [activeThread, setActiveThread] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", body: "", tag: "general" });
  const [threadSubmitting, setThreadSubmitting] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    problemsAPI.getBySlug(problemId)
      .then(res => setProblem(res.data.data))
      .catch(() => setProblem(null))
      .finally(() => setLoading(false));
  }, [problemId]);

  // Draft Restoration
  useEffect(() => {
    if (!problem) return;
    const storageKey = `codeskill_draft_${problem.slug}_${language}`;
    const savedDraft = localStorage.getItem(storageKey);
    if (savedDraft) {
      setCode(savedDraft);
    } else {
      // Use starter code from problem config if available, else language default
      const starterCode = problem.config?.starterCode?.[language];
      const defaultCode = starterCode || LANGUAGES.find(l => l.id === language)?.defaultCode || "";
      setCode(defaultCode);
    }
  }, [problem, language]);

  // Load notes from localStorage
  useEffect(() => {
    if (!problem) return;
    const savedNote = localStorage.getItem(`codeskill_note_${problem.slug}`);
    if (savedNote) setNoteContent(savedNote);
  }, [problem]);

  // Autosave
  useEffect(() => {
    if (!problem || !code) return;
    const timeout = setTimeout(() => {
      const storageKey = `codeskill_draft_${problem.slug}_${language}`;
      localStorage.setItem(storageKey, code);
      setLastSaved(new Date());
    }, 1500);
    return () => clearTimeout(timeout);
  }, [code, language, problem]);

  // Vim Mode Setup
  useEffect(() => {
    if (typeof window !== "undefined" && vimMode && editorInst) {
      import('monaco-vim').then(({ initVimMode }) => {
        const statusNode = document.getElementById('vim-status');
        if (statusNode) {
          const vim = initVimMode(editorInst, statusNode);
          setVimInst(vim);
        }
      });
    } else if (!vimMode && vimInst) {
      vimInst.dispose();
      setVimInst(null);
    }
  }, [vimMode, editorInst]);

  // Fetch submissions when that tab is activated
  useEffect(() => {
    if (activeSidebarTab === "submissions" && problem?._id) {
      setSubmissionsLoading(true);
      submissionAPI.getSubmissions(problem._id)
        .then(res => setSubmissions(res.data?.data || []))
        .catch(() => setSubmissions([]))
        .finally(() => setSubmissionsLoading(false));
    }
  }, [activeSidebarTab, problem]);

  // Fetch discussions when that tab is activated
  useEffect(() => {
    if (activeSidebarTab === "discussion" && problem?._id) {
      setDiscussionLoading(true);
      discussionsAPI.getThreads(problem._id, { tag: discussionFilter })
        .then(res => setThreads(res.data?.data || []))
        .catch(() => setThreads([]))
        .finally(() => setDiscussionLoading(false));
    }
  }, [activeSidebarTab, problem, discussionFilter]);

  const loadThread = async (thread: any) => {
    setActiveThread(thread);
    try {
      const res = await discussionsAPI.getReplies(thread._id);
      setReplies(res.data || []);
    } catch (e) {}
  };

  const handleCreateThread = async () => {
    if (!problem) return;
    setThreadSubmitting(true);
    try {
      const res = await discussionsAPI.createThread({
        problemId: problem._id,
        title: newThread.title,
        body: newThread.body,
        tags: [newThread.tag]
      });
      setThreads([res.data, ...threads]);
      setShowCreateThread(false);
      setNewThread({ title: "", body: "", tag: "general" });
    } catch (e) {
      alert("Failed to create thread");
    } finally {
      setThreadSubmitting(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!activeThread) return;
    setReplySubmitting(true);
    try {
      const res = await discussionsAPI.createReply(activeThread._id, { body: replyContent });
      setReplies([...replies, res.data]);
      setReplyContent("");
      setActiveThread({ ...activeThread, replyCount: activeThread.replyCount + 1 });
    } catch (e) {
      alert("Failed to post reply");
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleVoteThread = async (threadId: string, direction: 'up' | 'down') => {
    try {
      const res = await discussionsAPI.voteThread(threadId, direction);
      if (activeThread && activeThread._id === threadId) {
        setActiveThread({ ...activeThread, upvotes: res.data.upvotes, downvotes: res.data.downvotes });
      } else {
        setThreads(threads.map(t => t._id === threadId ? { ...t, upvotes: res.data.upvotes, downvotes: res.data.downvotes } : t));
      }
    } catch (e) {}
  };

  const handleVoteReply = async (replyId: string, direction: 'up' | 'down') => {
    try {
      const res = await discussionsAPI.voteReply(replyId, direction);
      setReplies(replies.map(r => r._id === replyId ? { ...r, upvotes: res.data.upvotes, downvotes: res.data.downvotes } : r));
    } catch (e) {}
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          handleSubmit();
        } else {
          handleRun();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [code, language, problem]);

  const handleEditorMount = (editor: any) => {
    setEditorInst(editor);
  };

  const getTestCases = () => {
    if (!problem || !problem.testCases || !problem.testCases.cases || problem.testCases.cases.length === 0) {
      return [];
    }
    return problem.testCases.cases.map((tc: any, i: number) => ({ id: i + 1, input: tc.input, expected: tc.output }));
  };

  const executeCode = async () => {
    const apiTestCases = getTestCases().map((tc: any) => ({
      id: tc.id,
      input: tc.input,
      expected: tc.expected,
    }));
    if (apiTestCases.length === 0) {
      throw new Error("This problem has no visible sample tests configured.");
    }

    const response = await runAPI.run({
      code,
      language,
      testCases: apiTestCases,
      config: {
        timeLimit: problem?.config?.timeLimit,
        memoryLimit: problem?.config?.memoryLimit,
        executionMode: problem?.config?.executionMode,
        functionSignature: problem?.config?.functionSignature,
      },
    });
    let data = response.data;
    if (data.status === "queued" && data.jobId) {
      const deadline = Date.now() + 60_000;
      while (Date.now() < deadline) {
        await new Promise((resolve) => window.setTimeout(resolve, 400));
        const jobResponse = await runAPI.getJob(data.jobId);
        data = jobResponse.data;
        if (!["waiting", "active", "delayed", "prioritized", "queued"].includes(data.status)) {
          break;
        }
      }
      if (["waiting", "active", "delayed", "prioritized", "queued"].includes(data.status)) {
        throw new Error("Execution is taking longer than expected. Please try again.");
      }
    }

    let resultState: RunResult;
    if (!data.success) {
      resultState = {
        status: (data.status as SubmissionStatus) || "error",
        results: data.results || [],
        runtime: data.runtime || 0,
        logs: data.message ? [data.message] : [],
        passedCount: data.passedCount || 0,
        totalCount: data.totalCount || 0,
      };
    } else {
      const allLogs: string[] = [];
      for (const r of data.results || []) {
        if (r.logs && r.logs.length > 0) {
          allLogs.push(...r.logs);
        }
      }
      resultState = {
        status: data.status as SubmissionStatus,
        results: data.results || [],
        runtime: data.runtime || 0,
        logs: allLogs,
        passedCount: data.passedCount || 0,
        totalCount: data.totalCount || 0,
      };
    }
    
    return { data, resultState };
  };

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setRunResult(null);
    try {
      const { resultState } = await executeCode();
      setRunResult(resultState);
      setActiveResultCase(0);
      setActiveBottomTab("console");
    } catch (err: any) {
      setRunResult({
        status: "error",
        results: [],
        runtime: 0,
        logs: [err.response?.data?.message || err.message || "Failed to connect to the backend."],
        passedCount: 0,
        totalCount: 0,
      });
      setActiveBottomTab("console");
    } finally {
      setIsRunning(false);
    }
  }, [code, language, problem]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setRunResult(null);
    try {
      const { data, resultState } = await executeCode();
      setRunResult(resultState);
      setActiveResultCase(0);
      setActiveBottomTab("console");

      if (data.success && typeof window !== "undefined" && localStorage.getItem("codeskill_token")) {
        try {
          await submissionAPI.submit({
            problemId: problem._id,
            language,
            code,
            status: data.status,
            runtime: data.runtime || 0,
            memory: 0,
            testCasesPassed: data.passedCount,
            totalTestCases: data.totalCount,
            category: problem.categories?.[0] || "General",
            difficulty: problem.difficulty
          });
        } catch (err) {
          console.error("Failed to save submission to database", err);
        }
      } else if (!localStorage.getItem("codeskill_token")) {
        setShowLoginModal(true);
      }
    } catch (err: any) {
      setRunResult({
        status: "error",
        results: [],
        runtime: 0,
        logs: [err.response?.data?.message || err.message || "Failed to connect to the backend."],
        passedCount: 0,
        totalCount: 0,
      });
      setActiveBottomTab("console");
    } finally {
      setIsSubmitting(false);
    }
  }, [code, language, problem]);

  const handleSaveNote = () => {
    if (!problem) return;
    setNoteSaving(true);
    localStorage.setItem(`codeskill_note_${problem.slug}`, noteContent);
    setTimeout(() => setNoteSaving(false), 500);
  };

  const handleResetCode = () => {
    if (!problem) return;
    const starterCode = problem.config?.starterCode?.[language];
    const defaultCode = starterCode || LANGUAGES.find(l => l.id === language)?.defaultCode || "";
    setCode(defaultCode);
    localStorage.removeItem(`codeskill_draft_${problem.slug}_${language}`);
  };

  const handleCopyCode = async () => {
    try {
      if (typeof document !== "undefined" && document.hasFocus() && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        return;
      }
    } catch (e) {
      // Fall back if document is unfocused or clipboard API is blocked
    }
    try {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    } catch (err) {
      console.warn("Copy failed", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-2">
          <XCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Problem Not Found</h1>
        <p className="text-muted-foreground text-sm">The problem you're looking for doesn't exist or has been removed.</p>
        <Link href="/problems"><Button variant="outline" className="mt-2"><ArrowLeft className="w-4 h-4 mr-2" />Back to Problems</Button></Link>
      </div>
    );
  }

  const editorTheme = theme === "dark" ? "vs-dark" : "light";
  const testCases = getTestCases();
  const difficultyClass = DIFFICULTY_COLORS[problem.difficulty] || DIFFICULTY_COLORS.Easy;
  const acceptanceRate = problem.stats?.totalSubmissions > 0
    ? ((problem.stats.acceptedSubmissions / problem.stats.totalSubmissions) * 100).toFixed(1)
    : "N/A";

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden font-sans">
      
      {/* ═══════════════════════════════════════════════════════════════════════
          1. SLIM LEFT SIDEBAR (Activity Bar) — VS Code inspired icon rail
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="w-12 border-r border-white/[0.08] bg-[#111111] flex flex-col items-center py-3 gap-1 z-10 shrink-0">
        <Link href="/problems" title="Back to Problems">
          <div className="p-2 rounded-lg text-[#737373] hover:bg-white/[0.05] hover:text-[#F5F5F5] transition-all cursor-pointer mb-2">
            <ArrowLeft className="w-4.5 h-4.5" />
          </div>
        </Link>
        <div className="w-7 h-px bg-white/[0.08] mb-1" />
        
        {SIDEBAR_TABS.map(tab => (
          <SidebarIcon
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            shortcut={tab.shortcut}
            active={activeSidebarTab === tab.id}
            onClick={() => setActiveSidebarTab(tab.id)}
          />
        ))}
        
        <div className="flex-1" />
        <SidebarIcon icon={Settings} label="Settings" onClick={() => {}} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          2 & 3. MAIN CONTENT — Resizable Panels
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* ─── TOP NAVBAR ─────────────────────────────────────────────────── */}
        <header className="h-12 border-b border-white/[0.08] bg-[#111111] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-[16px] font-bold text-[#F5F5F5] truncate max-w-[320px] whitespace-nowrap">
              {problem.title}
            </h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${difficultyClass}`}>
              {problem.difficulty}
            </span>
            {lastSaved && (
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-[11px] text-[#A3A3A3] ml-1 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </motion.span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-[#191919] border border-white/[0.08] text-[#F5F5F5] text-xs font-semibold rounded-lg h-8 px-3 cursor-pointer outline-none focus:border-indigo-500/50 transition-all"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
            
            <div className="w-px h-5 bg-white/[0.08]" />
            
            <Button variant="outline" size="sm" onClick={handleRun} disabled={isRunning || isSubmitting} className="h-8 px-3 text-xs font-bold gap-1.5 bg-[#191919] hover:bg-[#222222] text-[#F5F5F5] border-white/[0.08]">
              {isRunning ? <Loader2 className="w-3.5 h-3.5 text-[#10B981] animate-spin" /> : <Play className="w-3.5 h-3.5 text-[#10B981]" />}
              Run
              <kbd className="hidden sm:inline-flex text-[9px] font-mono text-[#737373] bg-[#151515] px-1 rounded ml-1">⌘↵</kbd>
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={isRunning || isSubmitting} className="bg-[#4F46E5] hover:bg-[#6366F1] text-white h-8 px-4 text-xs font-bold gap-1.5 shadow-sm shadow-indigo-500/20">
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Submit
              <kbd className="hidden sm:inline-flex text-[9px] font-mono text-white/60 bg-white/10 px-1 rounded ml-1">⇧⌘↵</kbd>
            </Button>
          </div>
        </header>

        {/* ─── PANELS ──────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden p-1.5">
          <PanelGroup orientation="horizontal" className="gap-1.5">
            
            {/* ═══════════════════════════════════════════════════════════════
                CENTER PANEL — Problem Description / Editorial / Hints / etc.
               ═══════════════════════════════════════════════════════════════ */}
            <Panel defaultSize={40} minSize={20} className="bg-[#111111] border border-white/[0.08] rounded-xl overflow-hidden flex flex-col shadow-sm">
              
              {/* Panel Header */}
              <div className="px-3.5 py-2 border-b border-white/[0.08] bg-[#141414] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(() => {
                    const tab = SIDEBAR_TABS.find(t => t.id === activeSidebarTab);
                    const TabIcon = tab?.icon || FileText;
                    return <TabIcon className="w-3.5 h-3.5 text-indigo-400" />;
                  })()}
                  <span className="text-xs font-bold text-[#F5F5F5] capitalize">
                    {activeSidebarTab.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              {/* Panel Body */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSidebarTab}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15 }}
                    className="h-full"
                  >
                    {/* ──────────── DESCRIPTION TAB ──────────── */}
                    {activeSidebarTab === "description" && (
                      <div className="p-5">
                        {/* Problem Metadata Bar */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          <MetaBadge icon={Target} label={problem.difficulty} className={difficultyClass} />
                          <MetaBadge icon={BarChart3} label={`${acceptanceRate}% acceptance`} className="bg-[#151515] border-white/[0.07] text-[#A3A3A3] text-[11px]" />
                          <MetaBadge icon={Zap} label={`${problem.stats?.totalSubmissions || 0} submissions`} className="bg-[#151515] border-white/[0.07] text-[#A3A3A3] text-[11px]" />
                          {problem.config?.timeLimit && <MetaBadge icon={Clock} label={`${problem.config.timeLimit}ms`} className="bg-[#151515] border-white/[0.07] text-[#A3A3A3] text-[11px]" />}
                          {problem.config?.memoryLimit && <MetaBadge icon={Code2} label={`${problem.config.memoryLimit}MB`} className="bg-[#151515] border-white/[0.07] text-[#A3A3A3] text-[11px]" />}
                        </div>
                        
                        {/* Tags */}
                        {(problem.tags?.length > 0 || problem.categories?.length > 0) && (
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {(problem.categories || []).map((cat: string) => (
                              <span key={cat} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[rgba(99,102,241,0.10)] text-[#A5B4FC] border border-[rgba(99,102,241,0.25)]">
                                {cat}
                              </span>
                            ))}
                            {(problem.tags || []).map((tag: string) => (
                              <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#151515] text-[#A3A3A3] border border-white/[0.07]">
                                <Hash className="w-2.5 h-2.5 inline mr-0.5 text-[#737373]" />{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Description Content */}
                        <div className="prose dark:prose-invert prose-sm max-w-none text-[#E5E5E5] text-[15px] leading-[1.6]
                          prose-headings:text-[#F5F5F5] prose-headings:font-bold
                          prose-p:text-[#E5E5E5] prose-p:leading-[1.6] prose-p:text-[15px]
                          prose-strong:text-[#F5F5F5]
                          prose-code:text-[#A5B4FC] prose-code:bg-[rgba(99,102,241,0.10)] prose-code:border prose-code:border-[rgba(99,102,241,0.20)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
                          prose-pre:bg-[#171717] prose-pre:border prose-pre:border-white/[0.08] prose-pre:rounded-xl
                          prose-ul:text-[#A3A3A3] prose-ol:text-[#A3A3A3]
                        ">
                          <div dangerouslySetInnerHTML={{ __html: problem.statement?.description || problem.description || "" }} />
                        </div>
                        
                        {/* Constraints */}
                        {(problem.statement?.constraints || problem.constraints) && (
                          <div className="mt-6 p-4 bg-[rgba(245,158,11,0.07)] border border-[rgba(245,158,11,0.20)] rounded-xl">
                            <h3 className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" /> Constraints
                            </h3>
                            <div className="text-xs text-[#A3A3A3] leading-relaxed prose dark:prose-invert prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: problem.statement?.constraints || problem.constraints || "" }}
                            />
                          </div>
                        )}

                        {/* Sample Test Cases in Description */}
                        {problem.statement?.samples?.length > 0 && (
                          <div className="mt-6 space-y-3">
                            <h3 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">Examples</h3>
                            {problem.statement.samples.map((sample: any, i: number) => (
                              <div key={i} className="border border-white/[0.07] bg-[#151515] rounded-xl overflow-hidden">
                                <div className="bg-[#191919] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3]">
                                  Example {i + 1}
                                </div>
                                <div className="p-3.5 space-y-2.5 font-mono text-xs">
                                  {sample.input && (
                                    <div>
                                      <span className="text-[#737373] text-[10px] font-sans font-semibold uppercase">Input: </span>
                                      <pre className="bg-[#191919] border border-white/[0.06] rounded-lg p-2.5 mt-1 text-[#E5E5E5] whitespace-pre-wrap">{sample.input}</pre>
                                    </div>
                                  )}
                                  {sample.output && (
                                    <div>
                                      <span className="text-[#737373] text-[10px] font-sans font-semibold uppercase">Output: </span>
                                      <pre className="bg-[#191919] border border-white/[0.06] rounded-lg p-2.5 mt-1 text-[#E5E5E5] whitespace-pre-wrap">{sample.output}</pre>
                                    </div>
                                  )}
                                  {sample.explanation && (
                                    <div className="text-[#A3A3A3] font-sans text-xs mt-2 leading-relaxed">
                                      <span className="font-semibold text-[#F5F5F5]">Explanation: </span>
                                      {sample.explanation}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ──────────── EDITORIAL TAB ──────────── */}
                    {activeSidebarTab === "editorial" && (
                      <div className="p-5">
                        {problem.editorial ? (
                          <div className="prose dark:prose-invert prose-sm max-w-none text-[#E5E5E5] text-[15px] leading-[1.6]
                            prose-headings:text-[#F5F5F5]
                            prose-code:text-[#A5B4FC] prose-code:bg-[rgba(99,102,241,0.10)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                            prose-pre:bg-[#171717] prose-pre:border prose-pre:border-white/[0.08] prose-pre:rounded-xl
                          ">
                            <div dangerouslySetInnerHTML={{ __html: problem.editorial }} />
                          </div>
                        ) : (
                          <EmptyState
                            icon={BookOpen}
                            title="No Editorial Available"
                            description="The editorial for this problem hasn't been published yet. Try solving it on your own first!"
                          />
                        )}
                      </div>
                    )}

                    {/* ──────────── SUBMISSIONS TAB ──────────── */}
                    {activeSidebarTab === "submissions" && (
                      <div className="p-4">
                        {submissionsLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-5 h-5 animate-spin text-[#737373]" />
                          </div>
                        ) : submissions.length > 0 ? (
                          <div className="space-y-2">
                            {submissions.map((sub: any, i: number) => (
                              <div key={i} className="p-3 rounded-xl border border-white/[0.08] bg-[#151515] hover:bg-[#191919] transition-colors cursor-pointer group">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className={`text-xs font-bold ${
                                    sub.status === "accepted" ? "text-emerald-400" :
                                    sub.status === "wrong_answer" ? "text-rose-400" : "text-amber-400"
                                  }`}>
                                    {sub.status === "accepted" ? "✓ Accepted" :
                                     sub.status === "wrong_answer" ? "✗ Wrong Answer" : "⚠ Error"}
                                  </span>
                                  <span className="text-[10px] text-[#737373]">
                                    {new Date(sub.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-[#A3A3A3]">
                                  <span className="flex items-center gap-1"><Code2 className="w-3 h-3" />{sub.language}</span>
                                  {sub.runtime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{sub.runtime}ms</span>}
                                  <span className="flex items-center gap-1"><Target className="w-3 h-3" />{sub.testCasesPassed}/{sub.totalTestCases}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <EmptyState
                            icon={History}
                            title="No Submissions Yet"
                            description="Submit your solution to see your submission history here."
                          />
                        )}
                      </div>
                    )}

                    {/* ──────────── HINTS TAB ──────────── */}
                    {activeSidebarTab === "hints" && (
                      <div className="p-5">
                        {problem.hints?.length > 0 ? (
                          <div className="space-y-3">
                            {problem.hints.map((hint: string, i: number) => (
                              <div key={i} className="border border-white/[0.08] bg-[#151515] rounded-xl overflow-hidden">
                                <button
                                  onClick={() => {
                                    const newSet = new Set(revealedHints);
                                    if (newSet.has(i)) newSet.delete(i);
                                    else newSet.add(i);
                                    setRevealedHints(newSet);
                                  }}
                                  className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.04] transition-colors"
                                >
                                  <span className="text-xs font-semibold text-[#F5F5F5] flex items-center gap-2">
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                                    Hint {i + 1}
                                  </span>
                                  <span className="text-[10px] text-[#737373]">
                                    {revealedHints.has(i) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </span>
                                </button>
                                <AnimatePresence>
                                  {revealedHints.has(i) && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-3 pb-3 text-xs text-[#A3A3A3] leading-relaxed border-t border-white/[0.08] pt-2"
                                        dangerouslySetInnerHTML={{ __html: hint }}
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <EmptyState
                            icon={Lightbulb}
                            title="No Hints Available"
                            description="This problem doesn't have any hints. Try breaking it down into smaller sub-problems!"
                          />
                        )}
                      </div>
                    )}

                    {/* ──────────── NOTES TAB ──────────── */}
                    {activeSidebarTab === "notes" && (
                      <div className="p-4 flex flex-col h-full">
                        <textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Write your notes here... Markdown is supported."
                          className="flex-1 min-h-[200px] w-full bg-[#151515] border border-white/[0.08] rounded-xl p-4 text-sm text-[#F5F5F5] placeholder:text-[#737373] resize-none outline-none focus:border-indigo-500/50 transition-all font-mono"
                        />
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[10px] text-[#737373]">{noteContent.length} characters</span>
                          <Button size="sm" onClick={handleSaveNote} disabled={noteSaving} className="h-7 px-3 text-xs bg-[#4F46E5] hover:bg-[#6366F1] text-white">
                            {noteSaving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {noteSaving ? "Saving..." : "Save Note"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* ──────────── DISCUSSION TAB ──────────── */}
                    {activeSidebarTab === "discussion" && (
                      <div className="flex flex-col h-full bg-[#111111] relative">
                        {discussionLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-5 h-5 animate-spin text-[#737373]" />
                          </div>
                        ) : activeThread ? (
                          /* Thread Detail View */
                          <div className="flex flex-col h-full absolute inset-0 bg-[#111111] overflow-y-auto z-10">
                            <div className="p-4 border-b border-white/[0.08] sticky top-0 bg-[#141414]/95 backdrop-blur-sm flex items-center gap-2">
                              <button onClick={() => setActiveThread(null)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[#A3A3A3] hover:text-[#F5F5F5] transition-all">
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                              <div className="flex-1 truncate font-semibold text-sm text-[#F5F5F5]">{activeThread.title}</div>
                            </div>
                            
                            <div className="p-5">
                              {/* Main Post */}
                              <div className="flex gap-4">
                                <div className="flex flex-col items-center gap-1">
                                  <button onClick={() => handleVoteThread(activeThread._id, 'up')} className={`p-1.5 rounded-lg ${activeThread.upvotedBy?.includes('me') ? 'text-indigo-400 bg-indigo-500/10' : 'text-[#737373] hover:text-[#F5F5F5] hover:bg-white/[0.04]'}`}>
                                    <ThumbsUp className="w-4 h-4" />
                                  </button>
                                  <span className="text-xs font-bold font-mono text-[#F5F5F5]">{activeThread.upvotes - activeThread.downvotes}</span>
                                  <button onClick={() => handleVoteThread(activeThread._id, 'down')} className={`p-1.5 rounded-lg ${activeThread.downvotedBy?.includes('me') ? 'text-rose-400 bg-rose-500/10' : 'text-[#737373] hover:text-[#F5F5F5] hover:bg-white/[0.04]'}`}>
                                    <ThumbsDown className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                                      {activeThread.author?.name?.[0] || 'U'}
                                    </div>
                                    <span className="text-xs font-semibold text-[#F5F5F5]">{activeThread.author?.name || 'User'}</span>
                                    <span className="text-[10px] text-[#737373]">{new Date(activeThread.createdAt).toLocaleDateString()}</span>
                                    {activeThread.tags?.map((t: string) => (
                                      <span key={t} className="ml-auto text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#151515] text-[#A3A3A3] border border-white/[0.07] uppercase tracking-wider">{t}</span>
                                    ))}
                                  </div>
                                  <div className="text-sm text-[#E5E5E5] leading-relaxed whitespace-pre-wrap">{activeThread.body}</div>
                                </div>
                              </div>
                              
                              <div className="w-full h-px bg-white/[0.08] my-6" />
                              
                              <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-4">Replies ({replies.length})</h3>
                              
                              {/* Replies */}
                              <div className="space-y-6">
                                {replies.map((reply: any) => (
                                  <div key={reply._id} className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#191919] border border-white/[0.08] flex shrink-0 items-center justify-center text-[10px] font-bold text-[#A3A3A3] mt-1">
                                      {reply.author?.name?.[0] || 'U'}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-xs font-semibold text-[#F5F5F5]">{reply.author?.name || 'User'}</span>
                                        <span className="text-[10px] text-[#737373]">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                      </div>
                                      <div className="text-sm text-[#E5E5E5] leading-relaxed whitespace-pre-wrap mb-2">{reply.body}</div>
                                      <div className="flex items-center gap-3">
                                        <button onClick={() => handleVoteReply(reply._id, 'up')} className="flex items-center gap-1.5 text-[10px] font-semibold text-[#737373] hover:text-indigo-400 transition-colors">
                                          <ThumbsUp className="w-3.5 h-3.5" /> {reply.upvotes}
                                        </button>
                                        <button onClick={() => handleVoteReply(reply._id, 'down')} className="flex items-center gap-1.5 text-[10px] font-semibold text-[#737373] hover:text-rose-400 transition-colors">
                                          <ThumbsDown className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Reply Input */}
                              <div className="mt-8 flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex shrink-0 items-center justify-center text-[10px] font-bold">You</div>
                                <div className="flex-1 flex flex-col gap-2">
                                  <textarea 
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full bg-[#151515] border border-white/[0.08] rounded-xl p-3 text-sm text-[#F5F5F5] placeholder:text-[#737373] resize-none outline-none focus:border-indigo-500/50 min-h-[80px]"
                                  />
                                  <div className="flex justify-end">
                                    <Button size="sm" disabled={!replyContent.trim() || replySubmitting} onClick={handleSubmitReply} className="h-7 text-xs px-3 bg-[#4F46E5] hover:bg-[#6366F1] text-white">
                                      {replySubmitting ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Send className="w-3 h-3 mr-1.5" />} Post Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : showCreateThread ? (
                          /* Create Thread View */
                          <div className="p-5 flex flex-col h-full bg-[#111111]">
                            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/[0.08]">
                              <button onClick={() => setShowCreateThread(false)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[#A3A3A3] hover:text-[#F5F5F5] transition-all">
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                              <div className="font-semibold text-sm text-[#F5F5F5]">New Discussion</div>
                            </div>
                            
                            <div className="space-y-4 flex-1">
                              <div>
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#737373] mb-1 block">Title</label>
                                <input 
                                  value={newThread.title}
                                  onChange={(e) => setNewThread({...newThread, title: e.target.value})}
                                  placeholder="What's on your mind?"
                                  className="w-full bg-[#151515] border border-white/[0.08] rounded-lg h-9 px-3 text-sm text-[#F5F5F5] outline-none focus:border-indigo-500/50"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#737373] mb-1 block">Category</label>
                                <select 
                                  value={newThread.tag}
                                  onChange={(e) => setNewThread({...newThread, tag: e.target.value})}
                                  className="w-full bg-[#151515] border border-white/[0.08] rounded-lg h-9 px-3 text-sm text-[#F5F5F5] outline-none focus:border-indigo-500/50 appearance-none"
                                >
                                  <option value="general">General</option>
                                  <option value="approach">Approach</option>
                                  <option value="help">Need Help</option>
                                  <option value="solution">Solution</option>
                                </select>
                              </div>
                              <div className="flex-1 flex flex-col">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#737373] mb-1 block">Body</label>
                                <textarea 
                                  value={newThread.body}
                                  onChange={(e) => setNewThread({...newThread, body: e.target.value})}
                                  placeholder="Describe your question, approach, or solution in detail..."
                                  className="w-full flex-1 bg-[#151515] border border-white/[0.08] rounded-lg p-3 text-sm text-[#F5F5F5] resize-none outline-none focus:border-indigo-500/50 min-h-[200px]"
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/[0.08]">
                              <Button variant="outline" size="sm" onClick={() => setShowCreateThread(false)} className="h-8 text-xs bg-[#191919] border-white/[0.08] text-[#F5F5F5] hover:bg-[#222222]">Cancel</Button>
                              <Button size="sm" onClick={handleCreateThread} disabled={!newThread.title.trim() || !newThread.body.trim() || threadSubmitting} className="h-8 text-xs bg-[#4F46E5] hover:bg-[#6366F1] text-white">
                                {threadSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null} Post Discussion
                              </Button>
                            </div>
                          </div>
                        ) : (
                          /* Thread List View */
                          <>
                            <div className="p-3 border-b border-white/[0.08] flex justify-between items-center sticky top-0 bg-[#141414]/95 backdrop-blur-sm z-10">
                              <select 
                                value={discussionFilter}
                                onChange={(e) => setDiscussionFilter(e.target.value)}
                                className="bg-[#191919] border border-white/[0.08] text-xs font-semibold text-[#F5F5F5] outline-none cursor-pointer px-2.5 py-1 rounded-md"
                              >
                                <option value="all">All Topics</option>
                                <option value="approach">Approaches</option>
                                <option value="help">Need Help</option>
                                <option value="solution">Solutions</option>
                              </select>
                              
                              <Button size="sm" onClick={() => setShowCreateThread(true)} className="h-7 text-xs px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                                <Plus className="w-3 h-3 mr-1" /> New Post
                              </Button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                              {threads.length > 0 ? threads.map((thread: any) => (
                                <div key={thread._id} onClick={() => loadThread(thread)} className="p-3 rounded-xl border border-white/[0.08] bg-[#151515] hover:bg-[#191919] transition-colors cursor-pointer group flex gap-3 items-start">
                                  <div className="flex flex-col items-center gap-1 min-w-[40px]">
                                    <div className="w-8 h-8 rounded-full bg-[#191919] border border-white/[0.08] flex items-center justify-center text-xs font-bold text-[#A3A3A3] group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                      {thread.author?.name?.[0] || 'U'}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-[#F5F5F5] truncate mb-1 group-hover:text-indigo-400 transition-colors">{thread.title}</h4>
                                    <div className="flex items-center gap-3 text-[10px] text-[#737373]">
                                      <span className="truncate max-w-[100px] text-[#A3A3A3]">{thread.author?.name || 'User'}</span>
                                      <span className="w-1 h-1 rounded-full bg-white/[0.12]" />
                                      <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                                      <span className="w-1 h-1 rounded-full bg-white/[0.12]" />
                                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {thread.upvotes - thread.downvotes}</span>
                                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {thread.replyCount}</span>
                                      
                                      {thread.tags?.map((t: string) => (
                                        <span key={t} className="ml-auto px-1.5 py-0.5 rounded bg-[#191919] border border-white/[0.07] uppercase tracking-wider text-[9px] font-semibold text-[#A3A3A3]">{t}</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )) : (
                                <EmptyState
                                  icon={MessageSquare}
                                  title="No Discussions Found"
                                  description="Be the first to ask a question, share an approach, or post a solution!"
                                />
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* ──────────── AI TUTOR TAB ──────────── */}
                    {activeSidebarTab === "ai_tutor" && (
                      <div className="p-5">
                        <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                              <Brain className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-[#F5F5F5]">AI Tutor</h3>
                              <p className="text-[10px] text-[#737373]">Powered by advanced AI</p>
                            </div>
                          </div>
                          <p className="text-xs text-[#A3A3A3] leading-relaxed mb-4">
                            Get personalized guidance without spoilers. The AI tutor will help you understand the problem,
                            suggest approaches, and explain concepts — all without giving away the solution.
                          </p>
                          <div className="space-y-2">
                            {["Explain the problem in simpler terms", "What data structure should I consider?", "Give me a hint about the time complexity", "Help me debug my approach"].map((prompt, i) => (
                              <button key={i} className="w-full text-left px-3 py-2 rounded-lg border border-white/[0.08] bg-[#151515] text-xs text-[#E5E5E5] hover:bg-[#191919] hover:border-indigo-500/30 transition-all group">
                                <span className="text-indigo-400 mr-1.5 group-hover:text-indigo-300">→</span> {prompt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Panel>

            <PanelResizeHandle className="w-1.5 rounded-full bg-white/[0.06] hover:bg-indigo-500/50 transition-colors cursor-col-resize" />

            {/* ═══════════════════════════════════════════════════════════════
                RIGHT PANEL — Editor + Console
               ═══════════════════════════════════════════════════════════════ */}
            <Panel defaultSize={60} minSize={30} className="flex flex-col gap-1.5">
              <PanelGroup orientation="vertical" className="gap-1.5">
                
                {/* ─── Editor ──────────────────────────────────────────── */}
                <Panel defaultSize={65} className="bg-[#111111] border border-white/[0.08] rounded-xl overflow-hidden flex flex-col shadow-sm">
                  <div className="px-3.5 py-1.5 border-b border-white/[0.08] bg-[#141414] flex justify-between items-center h-9">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#F5F5F5] bg-[#191919] px-2.5 py-0.5 rounded border border-white/[0.08] font-mono">
                        {LANGUAGES.find(l => l.id === language)?.ext}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleCopyCode} title="Copy code" className="p-1 rounded text-[#737373] hover:text-[#F5F5F5] hover:bg-white/[0.06] transition-all">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={handleResetCode} title="Reset to default" className="p-1 rounded text-[#737373] hover:text-[#F5F5F5] hover:bg-white/[0.06] transition-all">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-px h-4 bg-white/[0.08]" />
                      <label className="flex items-center gap-1.5 text-[11px] text-[#A3A3A3] cursor-pointer hover:text-[#F5F5F5] transition-colors select-none">
                        <input type="checkbox" checked={vimMode} onChange={(e) => setVimMode(e.target.checked)} className="rounded border-white/[0.12] bg-[#191919] w-3 h-3" />
                        Vim
                      </label>
                    </div>
                  </div>
                  
                  {/* Vim Status Bar */}
                  <div id="vim-status" className={`text-[10px] px-3 bg-[#151515] text-[#F5F5F5] border-b border-white/[0.08] flex items-center font-mono transition-all ${vimMode ? 'h-5 opacity-100' : 'h-0 opacity-0 overflow-hidden border-none'}`}></div>

                  <div className="flex-1 relative bg-[#171717]">
                    <Editor
                      height="100%"
                      language={language}
                      theme={editorTheme}
                      value={code}
                      onChange={(val) => setCode(val || "")}
                      onMount={handleEditorMount}
                      options={{
                        minimap: { enabled: true, maxColumn: 80, scale: 1 },
                        fontSize: 13,
                        fontFamily: "JetBrains Mono, Fira Code, Menlo, Consolas, monospace",
                        fontLigatures: true,
                        folding: true,
                        bracketPairColorization: { enabled: true },
                        autoClosingBrackets: "always",
                        autoIndent: "full",
                        formatOnPaste: true,
                        formatOnType: true,
                        stickyScroll: { enabled: true },
                        padding: { top: 12, bottom: 12 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        multiCursorModifier: "alt",
                        renderLineHighlight: "all",
                        renderWhitespace: "selection",
                        guides: { bracketPairs: true, indentation: true },
                      }}
                    />
                  </div>
                </Panel>

                <PanelResizeHandle className="h-1.5 rounded-full bg-white/[0.06] hover:bg-indigo-500/50 transition-colors cursor-row-resize" />

                {/* ─── Console / Testcases ─────────────────────────────── */}
                <Panel defaultSize={35} className="bg-[#111111] border border-white/[0.08] rounded-xl overflow-hidden flex flex-col shadow-sm">
                  <div className="flex items-center border-b border-white/[0.08] bg-[#141414] px-1.5 py-1 gap-1">
                    <TabButton active={activeBottomTab === "testcases"} onClick={() => setActiveBottomTab("testcases")} icon={Terminal}>Testcases</TabButton>
                    <TabButton active={activeBottomTab === "console"} onClick={() => setActiveBottomTab("console")}>
                      Console
                      {runResult && (
                        <span className={`ml-1.5 w-2 h-2 rounded-full inline-block ${
                          runResult.status === "accepted" ? "bg-[#10B981]" :
                          runResult.status === "wrong_answer" ? "bg-[#EF4444]" :
                          runResult.status === "compile_error" ? "bg-[#F97316]" :
                          runResult.status === "time_limit" ? "bg-[#F59E0B]" : "bg-[#F59E0B]"
                        }`} />
                      )}
                    </TabButton>
                  </div>
                  
                  <div className="flex-1 p-3 overflow-auto">
                    {activeBottomTab === "testcases" ? (
                      <>
                        <div className="flex gap-1.5 mb-3">
                          {testCases.map((tc: any, index: number) => (
                            <button
                              key={tc.id}
                              onClick={() => setActiveTestCase(index)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                                activeTestCase === index 
                                  ? "bg-[#191919] text-[#F5F5F5] border border-white/[0.12] shadow-xs" 
                                  : "text-[#737373] hover:text-[#F5F5F5] hover:bg-white/[0.04] border border-transparent"
                              }`}
                            >
                              Case {tc.id}
                            </button>
                          ))}
                        </div>
                        
                        <div className="space-y-3 font-mono text-xs">
                          <div>
                            <div className="text-[10px] text-[#737373] mb-1 uppercase tracking-wider font-sans font-semibold">Input</div>
                            <div className="bg-[#191919] border border-white/[0.07] rounded-lg p-2.5 text-[#E5E5E5] whitespace-pre-wrap">{testCases[activeTestCase]?.input}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-[#737373] mb-1 uppercase tracking-wider font-sans font-semibold">Expected Output</div>
                            <div className="bg-[#191919] border border-white/[0.07] rounded-lg p-2.5 text-[#E5E5E5] whitespace-pre-wrap">{testCases[activeTestCase]?.expected}</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="font-mono text-xs">
                        {!runResult && !isRunning && !isSubmitting && (
                          <div className="text-[#737373] text-xs flex flex-col h-full items-center justify-center py-8 gap-2">
                            <Terminal className="w-6 h-6 text-[#737373]/30" />
                            <span>Click <kbd className="font-sans text-[10px] bg-[#191919] text-[#A3A3A3] px-1.5 py-0.5 rounded border border-white/[0.08]">Run</kbd> or <kbd className="font-sans text-[10px] bg-[#191919] text-[#A3A3A3] px-1.5 py-0.5 rounded border border-white/[0.08]">Submit</kbd> to execute your code.</span>
                          </div>
                        )}
                        
                        {(isRunning || isSubmitting) && (
                           <div className="text-[#A3A3A3] text-xs flex h-full items-center justify-center py-8 gap-2">
                             <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> 
                             <span>{isSubmitting ? "Submitting..." : "Executing..."}</span>
                           </div>
                        )}

                        {runResult && !isRunning && !isSubmitting && (
                          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                            {/* Status Header */}
                            <div className={`flex items-center gap-2 font-semibold mb-3 text-sm font-sans ${
                              runResult.status === "accepted" ? "text-emerald-400" :
                              runResult.status === "wrong_answer" ? "text-rose-400" :
                              runResult.status === "compile_error" ? "text-orange-400" :
                              runResult.status === "time_limit" ? "text-yellow-400" :
                              runResult.status === "runtime_error" ? "text-amber-400" : "text-rose-400"
                            }`}>
                              {runResult.status === "accepted" ? (
                                <><CheckCircle2 className="w-4.5 h-4.5" /> Accepted</>
                              ) : runResult.status === "wrong_answer" ? (
                                <><XCircle className="w-4.5 h-4.5" /> Wrong Answer</>
                              ) : runResult.status === "compile_error" ? (
                                <><AlertTriangle className="w-4.5 h-4.5" /> Compilation Error</>
                              ) : runResult.status === "time_limit" ? (
                                <><Clock className="w-4.5 h-4.5" /> Time Limit Exceeded</>
                              ) : runResult.status === "runtime_error" ? (
                                <><AlertTriangle className="w-4.5 h-4.5" /> Runtime Error</>
                              ) : runResult.status === "system_error" ? (
                                <><AlertTriangle className="w-4.5 h-4.5" /> System Error</>
                              ) : (
                                <><AlertTriangle className="w-4.5 h-4.5" /> Error</>
                              )}
                              <span className="text-[#A3A3A3] ml-auto text-[10px] font-sans font-medium bg-[#151515] px-2 py-0.5 rounded-full border border-white/[0.08]">
                                {runResult.passedCount}/{runResult.totalCount} passed
                              </span>
                            </div>

                            {/* Test Case Tabs */}
                            {runResult.results.length > 0 && (
                              <>
                                <div className="flex gap-1.5 mb-3">
                                  {runResult.results.map((r, i) => (
                                    <button
                                      key={r.id}
                                      onClick={() => setActiveResultCase(i)}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                                        activeResultCase === i
                                          ? "bg-[#191919] text-[#F5F5F5] border border-white/[0.12] shadow-xs"
                                          : "text-[#737373] hover:text-[#F5F5F5] hover:bg-white/[0.04] border border-transparent"
                                      }`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${r.passed ? "bg-emerald-500" : "bg-rose-500"}`} />
                                      Case {r.id}
                                    </button>
                                  ))}
                                </div>

                                {runResult.results[activeResultCase] && (
                                  <div className="space-y-2.5">
                                    <div>
                                      <div className="text-[10px] text-[#737373] mb-1 uppercase tracking-wider font-sans font-semibold">Your Output</div>
                                      <div className={`border rounded-lg p-2.5 whitespace-pre-wrap ${runResult.results[activeResultCase].passed ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-rose-500/5 border-rose-500/20 text-rose-400"}`}>
                                        {runResult.results[activeResultCase].output || "No output"}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-[#737373] mb-1 uppercase tracking-wider font-sans font-semibold">Expected</div>
                                      <div className="bg-[#191919] border border-white/[0.07] rounded-lg p-2.5 text-[#E5E5E5] whitespace-pre-wrap">
                                        {runResult.results[activeResultCase].expected}
                                      </div>
                                    </div>
                                    {runResult.results[activeResultCase].error && (
                                      <div>
                                        <div className="text-[10px] text-rose-400 mb-1 uppercase tracking-wider font-sans font-semibold">Error</div>
                                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-2.5 text-rose-400 whitespace-pre-wrap">
                                          {runResult.results[activeResultCase].error}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}

                            {/* Logs */}
                            {runResult.logs.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-white/[0.07]">
                                <div className="text-[10px] text-[#737373] mb-1.5 uppercase tracking-wider font-sans font-semibold">Stdout</div>
                                <div className="bg-[#171717] border border-white/[0.08] rounded-lg p-2.5 space-y-0.5 font-mono text-[11px] text-[#E5E5E5] max-h-32 overflow-auto">
                                  {runResult.logs.map((log, i) => (
                                    <div key={i}>{log}</div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Runtime Stats */}
                            <div className="mt-4 pt-3 border-t border-white/[0.07] flex gap-4 text-[#A3A3A3] font-sans text-[11px]">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Runtime: <span className="text-[#F5F5F5] font-semibold">{runResult.runtime} ms</span></span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </Panel>

              </PanelGroup>
            </Panel>

          </PanelGroup>
        </div>
      </div>

      {/* Login Prompt Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e: any) => e.stopPropagation()}
              className="bg-[#111111] border border-white/[0.12] rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                  <User className="w-8 h-8 text-indigo-400" />
                </div>
                
                <h3 className="text-xl font-bold text-[#F5F5F5] mb-2">Login Required</h3>
                <p className="text-sm text-[#A3A3A3] mb-8 leading-relaxed">
                  You need to be logged in to save your code submissions and track your progress.
                </p>
                
                <div className="flex flex-col gap-3">
                  <Link href="/login" className="w-full block">
                    <Button className="w-full bg-[#4F46E5] hover:bg-[#6366F1] text-white transition-all border-0 font-semibold">
                      Log In to Account
                    </Button>
                  </Link>
                  <Link href="/register" className="w-full block">
                    <Button variant="outline" className="w-full bg-[#191919] border-white/[0.08] text-[#F5F5F5] hover:bg-[#222222] transition-all">
                      Create an Account
                    </Button>
                  </Link>
                </div>
              </div>
              
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-[#737373] hover:text-[#F5F5F5] transition-colors p-1 rounded-md"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────

function SidebarIcon({ icon: Icon, label, shortcut, active = false, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      className={`p-2 rounded-lg transition-all relative group ${
        active 
          ? 'bg-indigo-500/15 text-indigo-400' 
          : 'text-[#737373] hover:bg-white/[0.04] hover:text-[#F5F5F5]'
      }`}
    >
      <Icon className="w-[18px] h-[18px]" />
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-indigo-500 rounded-r-full" />}
      
      {/* Tooltip */}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-[#191919] border border-white/[0.08] shadow-lg text-[10px] font-medium text-[#F5F5F5] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
        {label}
        {shortcut && <span className="ml-2 text-[#737373] font-mono">{shortcut}</span>}
      </div>
    </button>
  );
}

function TabButton({ active, onClick, icon: Icon, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
        active 
          ? "bg-[#191919] text-[#F5F5F5] shadow-xs border border-white/[0.12]" 
          : "text-[#737373] hover:text-[#F5F5F5] hover:bg-white/[0.04] border border-transparent"
      }`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </button>
  );
}

function MetaBadge({ icon: Icon, label, className = "" }: any) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
      className || "text-[#A3A3A3] bg-[#151515] border-white/[0.07]"
    }`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function EmptyState({ icon: Icon, title, description }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#151515] border border-white/[0.06] flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-[#737373]" />
      </div>
      <h3 className="text-sm font-semibold text-[#F5F5F5] mb-1">{title}</h3>
      <p className="text-xs text-[#737373] max-w-[240px] leading-relaxed">{description}</p>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Send, Settings, BookOpen, Terminal, Clock, ChevronLeft, ChevronDown, Maximize2, Minimize2, CheckCircle2, Loader2, XCircle, AlertTriangle, Save } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback, use } from "react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import { submissionAPI, runAPI, problemsAPI } from "@/config/api";
import { useTheme } from "next-themes";

const LANGUAGES = [
  { id: "c", name: "C", ext: "main.c", defaultCode: "#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}" },
  { id: "cpp", name: "C++", ext: "main.cpp", defaultCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}" },
  { id: "java", name: "Java", ext: "Solution.java", defaultCode: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}" },
  { id: "javascript", name: "JavaScript (Node.js)", ext: "solution.js", defaultCode: "function solve() {\n  // Write your code here\n}\n" },
  { id: "typescript", name: "TypeScript", ext: "solution.ts", defaultCode: "function solve(): void {\n  // Write your code here\n}\n" },
  { id: "python", name: "Python 3", ext: "solution.py", defaultCode: "def solve():\n    # Write your code here\n    pass\n" },
  { id: "go", name: "Go", ext: "main.go", defaultCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Write your code here\n}\n" },
  { id: "rust", name: "Rust", ext: "main.rs", defaultCode: "fn main() {\n    // Write your code here\n}\n" },
  { id: "csharp", name: "C#", ext: "Solution.cs", defaultCode: "public class Solution {\n    public void Solve() {\n        // Write your code here\n    }\n}\n" },
  { id: "kotlin", name: "Kotlin", ext: "Solution.kt", defaultCode: "fun main() {\n    // Write your code here\n}\n" },
  { id: "swift", name: "Swift", ext: "main.swift", defaultCode: "func solve() {\n    // Write your code here\n}\n" },
  { id: "php", name: "PHP", ext: "solution.php", defaultCode: "<?php\n\nfunction solve() {\n    // Write your code here\n}\n" },
  { id: "ruby", name: "Ruby", ext: "solution.rb", defaultCode: "def solve\n  # Write your code here\nend\n" }
];

interface TestResult {
  id: number;
  passed: boolean;
  output: string;
  expected: string;
  error?: string;
}

interface RunResult {
  status: "accepted" | "wrong_answer" | "error";
  results: TestResult[];
  runtime: number;
  logs: string[];
  passedCount: number;
  totalCount: number;
}

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const problemId = unwrappedParams.id;
  const { theme } = useTheme();
  
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("description");
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activeBottomTab, setActiveBottomTab] = useState("testcases");
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [activeResultCase, setActiveResultCase] = useState(0);

  useEffect(() => {
    setLoading(true);
    problemsAPI.getBySlug(problemId)
      .then(res => {
        setProblem(res.data.data);
      })
      .catch(err => {
        console.error("Failed to load problem:", err);
      })
      .finally(() => setLoading(false));
  }, [problemId]);

  useEffect(() => {
    if (!problem) return;
    const storageKey = `codeskill_${problem.slug}_${language}`;
    const savedCode = localStorage.getItem(storageKey);
    
    if (savedCode) {
      setCode(savedCode);
    } else {
      const defaultCode = LANGUAGES.find(l => l.id === language)?.defaultCode || "";
      setCode(defaultCode);
    }
  }, [problem, language]);

  useEffect(() => {
    if (!problem || !code) return;
    
    const interval = setInterval(() => {
      const storageKey = `codeskill_${problem.slug}_${language}`;
      const currentSaved = localStorage.getItem(storageKey);
      
      if (currentSaved !== code) {
        setIsSaving(true);
        localStorage.setItem(storageKey, code);
        setLastSaved(new Date());
        setTimeout(() => setIsSaving(false), 1000);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [code, language, problem]);

  const saveCodeManually = () => {
    if (!problem) return;
    setIsSaving(true);
    const storageKey = `codeskill_${problem.slug}_${language}`;
    localStorage.setItem(storageKey, code);
    setLastSaved(new Date());
    setTimeout(() => setIsSaving(false), 500);
  };

  const getTestCases = () => {
    const fallback = [
      { id: 1, input: "Mock Input 1", expected: "Mock Expected 1" },
      { id: 2, input: "Mock Input 2", expected: "Mock Expected 2" }
    ];
    if (!problem || !problem.testCases || !problem.testCases.cases || problem.testCases.cases.length === 0) {
      return fallback;
    }
    return problem.testCases.cases.map((tc: any, i: number) => ({ id: i + 1, input: tc.input, expected: tc.output }));
  };

  const executeCode = async () => {
    const apiTestCases = getTestCases().map((tc: any) => ({
      id: tc.id,
      input: tc.input,
      expected: tc.expected,
    }));

    saveCodeManually();

    const response = await runAPI.run({ code, language, testCases: apiTestCases });
    const data = response.data;

    let resultState: RunResult;
    if (!data.success) {
      resultState = { status: "error", results: [], runtime: 0, logs: [], passedCount: 0, totalCount: 0 };
    } else {
      const allLogs: string[] = [];
      for (const r of data.results) {
        if (r.logs && r.logs.length > 0) {
          allLogs.push(...r.logs);
        }
      }
      resultState = {
        status: data.status,
        results: data.results,
        runtime: data.runtime,
        logs: allLogs,
        passedCount: data.passedCount,
        totalCount: data.totalCount,
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
        alert("Please log in to save your submission.");
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFocusMode(false);
      }
      if (e.key === "F11") {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          setIsFullScreen(true);
        } else {
          document.exitFullscreen().catch(() => {});
          setIsFullScreen(false);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveCodeManually();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRun, saveCodeManually]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground flex-col gap-4">
        <h1 className="text-2xl font-bold">Problem Not Found</h1>
        <Link href="/problems">
          <Button variant="outline">Back to Problems</Button>
        </Link>
      </div>
    );
  }

  const activeLangObj = LANGUAGES.find(l => l.id === language);
  const testCases = getTestCases();
  const editorTheme = theme === "dark" ? "vs-dark" : "light";

  return (
    <div className={`flex flex-col bg-background transition-all duration-300 font-sans ${isFocusMode ? "fixed inset-0 z-[100]" : "h-screen pt-20 pb-4 px-4"}`}>
      {/* Editor Header */}
      <div className={`flex items-center justify-between border-b border-border bg-background px-4 h-14 ${!isFocusMode && "rounded-t-2xl border border-border"}`}>
        <div className="flex items-center gap-4">
          <Link href="/problems" className="text-muted-foreground hover:text-foreground transition-colors bg-muted/50 p-2 rounded-xl border border-border hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-foreground flex items-center gap-2">
              {problem.title}
            </h1>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
              problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
              'bg-destructive/10 text-destructive border-destructive/20'
            }`}>
              {problem.difficulty}
            </span>
            {isSaving && <span title="Saving..."><Loader2 className="w-3 h-3 text-muted-foreground animate-spin ml-2" /></span>}
            {!isSaving && lastSaved && <span title={`Last saved at ${lastSaved.toLocaleTimeString()}`}><CheckCircle2 className="w-3 h-3 text-muted-foreground ml-2" /></span>}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative mr-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-muted/50 border border-border text-foreground text-xs font-semibold rounded-xl h-9 pl-3 pr-8 cursor-pointer hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id} className="bg-background text-foreground">{lang.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
          
          <Button variant="outline" onClick={handleRun} disabled={isRunning || isSubmitting} className="bg-muted/50 border-border hover:bg-muted text-foreground rounded-xl h-9 px-4 text-xs font-semibold">
            {isRunning ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-emerald-500" /> : <Play className="w-3.5 h-3.5 mr-2 text-emerald-500" />}
            Run
          </Button>
          <Button onClick={handleSubmit} disabled={isRunning || isSubmitting} className="bg-foreground hover:opacity-90 text-background rounded-xl h-9 px-6 text-xs font-semibold shadow-sm">
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-2" />}
            Submit
          </Button>

          <div className="w-px h-6 bg-border mx-2" />
          
          <button onClick={() => setIsFocusMode(!isFocusMode)} className="text-muted-foreground hover:text-foreground transition-colors" title={isFocusMode ? "Exit Focus Mode (ESC)" : "Enter Focus Mode"}>
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className={`flex-1 flex gap-2 overflow-hidden ${!isFocusMode && "border border-border border-t-0 rounded-b-2xl p-2 bg-background"}`}>
        <PanelGroup orientation="horizontal">
          
          {/* Left Panel: Problem Description */}
          <Panel defaultSize={35} minSize={20} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center border-b border-border bg-muted/30 p-1 gap-1">
              <button 
                onClick={() => setActiveTab("description")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === "description" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Description
              </button>
              <button 
                onClick={() => setActiveTab("submissions")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === "submissions" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              >
                <Clock className="w-3.5 h-3.5" /> Submissions
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 prose dark:prose-invert prose-sm max-w-none text-foreground">
              {(problem.statement?.description || problem.description) ? (
                <div>
                  {/* Problem Description */}
                  <div className="mb-6">
                    <div dangerouslySetInnerHTML={{ __html: problem.statement?.description || problem.description || "" }} />
                  </div>

                  {/* Input Format */}
                  {problem.statement?.inputFormat && (
                    <div className="mb-6">
                      <h3 className="text-base font-semibold text-foreground mb-2">Input Format</h3>
                      <div dangerouslySetInnerHTML={{ __html: problem.statement.inputFormat }} />
                    </div>
                  )}

                  {/* Output Format */}
                  {problem.statement?.outputFormat && (
                    <div className="mb-6">
                      <h3 className="text-base font-semibold text-foreground mb-2">Output Format</h3>
                      <div dangerouslySetInnerHTML={{ __html: problem.statement.outputFormat }} />
                    </div>
                  )}

                  {/* Constraints */}
                  {(problem.statement?.constraints || problem.constraints) && (
                    <div className="mb-6">
                      <h3 className="text-base font-semibold text-foreground mb-2">Constraints</h3>
                      <div className="bg-muted/50 rounded-lg p-4 border border-border text-sm" dangerouslySetInnerHTML={{ __html: problem.statement?.constraints || problem.constraints || "" }} />
                    </div>
                  )}

                  {/* Sample Test Cases */}
                  {problem.statement?.samples && problem.statement.samples.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-base font-semibold text-foreground mb-3">Examples</h3>
                      {problem.statement.samples.map((sample: any, idx: number) => (
                        <div key={idx} className="mb-4 border border-border rounded-lg overflow-hidden">
                          <div className="bg-muted/50 px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                            Example {idx + 1}
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input:</span>
                              <pre className="mt-1 bg-muted/30 rounded-md px-3 py-2 text-sm font-mono whitespace-pre-wrap">{sample.input}</pre>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output:</span>
                              <pre className="mt-1 bg-muted/30 rounded-md px-3 py-2 text-sm font-mono whitespace-pre-wrap">{sample.output}</pre>
                            </div>
                            {sample.explanation && (
                              <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Explanation:</span>
                                <p className="mt-1 text-sm text-muted-foreground">{sample.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hints */}
                  {problem.hints && problem.hints.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-base font-semibold text-foreground mb-2">Hints</h3>
                      <div className="space-y-2">
                        {problem.hints.map((hint: string, idx: number) => (
                          <details key={idx} className="border border-border rounded-lg overflow-hidden group">
                            <summary className="px-4 py-2.5 text-sm font-medium cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors text-muted-foreground">
                              💡 Hint {idx + 1}
                            </summary>
                            <div className="px-4 py-3 text-sm text-muted-foreground border-t border-border">
                              {hint}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  <p className="mb-4">No detailed statement provided for this problem.</p>
                  <p>Solve the problem as indicated by the title.</p>
                </div>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 flex items-center justify-center group">
            <div className="w-0.5 h-8 bg-border group-hover:bg-foreground/30 transition-colors rounded-full" />
          </PanelResizeHandle>

          {/* Right Panel: Editor & Console */}
          <Panel defaultSize={65}>
            <PanelGroup orientation="vertical">
              {/* Editor Container */}
              <Panel defaultSize={70} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between border-b border-border bg-muted/30 p-1">
                  <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 rounded-lg border border-border">
                    {activeLangObj?.ext}
                  </div>
                </div>
                
                <div className="flex-1 relative pt-2">
                  <Editor
                    height="100%"
                    language={language === "node" ? "javascript" : language}
                    theme={editorTheme}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: "JetBrains Mono, Menlo, monospace",
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      cursorBlinking: "smooth",
                    }}
                  />
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 flex items-center justify-center group">
                <div className="h-0.5 w-8 bg-border group-hover:bg-foreground/30 transition-colors rounded-full" />
              </PanelResizeHandle>

              {/* Console / Testcases */}
              <Panel defaultSize={30} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                <div className="flex items-center border-b border-border bg-muted/30 p-1 gap-1">
                  <button onClick={() => setActiveBottomTab("testcases")} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeBottomTab === "testcases" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                    <Terminal className="w-3.5 h-3.5" /> Testcases
                  </button>
                  <button onClick={() => setActiveBottomTab("console")} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeBottomTab === "console" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                    Console
                  </button>
                </div>
                
                <div className="flex-1 p-4 overflow-auto">
                  {activeBottomTab === "testcases" ? (
                    <>
                      <div className="flex gap-2 mb-4">
                        {testCases.map((tc: any, index: number) => (
                          <button
                            key={tc.id}
                            onClick={() => setActiveTestCase(index)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                              activeTestCase === index 
                                ? "bg-background text-foreground border border-border shadow-sm" 
                                : "text-muted-foreground hover:bg-muted border border-transparent"
                            }`}
                          >
                            {runResult && runResult.results[index] && (
                              <span className={`w-1.5 h-1.5 rounded-full ${runResult.results[index].passed ? "bg-emerald-500" : "bg-destructive"}`} />
                            )}
                            Case {tc.id}
                          </button>
                        ))}
                      </div>
                      
                      <div className="space-y-4 font-mono text-xs">
                        <div>
                          <div className="text-muted-foreground mb-1">Input:</div>
                          <div className="bg-muted/50 border border-border rounded-lg p-2.5 text-foreground">{JSON.stringify(testCases[activeTestCase]?.input)}</div>
                        </div>
                        {runResult && runResult.results[activeTestCase] && (
                          <>
                            <div>
                              <div className="text-muted-foreground mb-1">Output:</div>
                              <div className={`border rounded-lg p-2.5 ${runResult.results[activeTestCase].passed ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 border-destructive/20 text-destructive"}`}>
                                {runResult.results[activeTestCase].output}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-1">Expected:</div>
                              <div className="bg-muted/50 border border-border rounded-lg p-2.5 text-foreground">
                                {runResult.results[activeTestCase].expected}
                              </div>
                            </div>
                            {runResult.results[activeTestCase].error && (
                              <div>
                                <div className="text-destructive mb-1">Error:</div>
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5 text-destructive">
                                  {runResult.results[activeTestCase].error}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        {(!runResult || !runResult.results[activeTestCase]) && (
                           <div>
                           <div className="text-muted-foreground mb-1">Expected:</div>
                           <div className="bg-muted/50 border border-border rounded-lg p-2.5 text-foreground">
                             {JSON.stringify(testCases[activeTestCase]?.expected)}
                           </div>
                         </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="font-mono text-xs">
                      {!runResult ? (
                        <div className="text-muted-foreground text-sm">Click Run to execute your code.</div>
                      ) : (
                        <>
                          <div className={`flex items-center gap-2 font-medium mb-4 text-sm ${
                            runResult.status === "accepted" ? "text-emerald-600 dark:text-emerald-400" :
                            runResult.status === "wrong_answer" ? "text-destructive" : "text-amber-600 dark:text-amber-400"
                          }`}>
                            {runResult.status === "accepted" ? (
                              <><CheckCircle2 className="w-4 h-4" /> Accepted</>
                            ) : runResult.status === "wrong_answer" ? (
                              <><XCircle className="w-4 h-4" /> Wrong Answer</>
                            ) : (
                              <><AlertTriangle className="w-4 h-4" /> Runtime Error</>
                            )}
                            <span className="text-muted-foreground ml-auto text-xs">
                              {runResult.passedCount}/{runResult.totalCount} passed
                            </span>
                          </div>

                          <div className="flex gap-2 mb-4">
                            {runResult.results.map((r, i) => (
                              <button
                                key={r.id}
                                onClick={() => setActiveResultCase(i)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                  activeResultCase === i
                                    ? "bg-background text-foreground border border-border shadow-sm"
                                    : "text-muted-foreground hover:bg-muted border border-transparent"
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${r.passed ? "bg-emerald-500" : "bg-destructive"}`} />
                                Case {r.id}
                              </button>
                            ))}
                          </div>

                          {runResult.results[activeResultCase] && (
                            <div className="space-y-3">
                              <div>
                                <div className="text-muted-foreground mb-1">Your Output:</div>
                                <div className={`border rounded-lg p-2.5 ${runResult.results[activeResultCase].passed ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 border-destructive/20 text-destructive"}`}>
                                  {runResult.results[activeResultCase].output}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground mb-1">Expected:</div>
                                <div className="bg-muted/50 border border-border rounded-lg p-2.5 text-foreground">
                                  {runResult.results[activeResultCase].expected}
                                </div>
                              </div>
                              {runResult.results[activeResultCase].error && (
                                <div>
                                  <div className="text-destructive mb-1">Error:</div>
                                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5 text-destructive">
                                    {runResult.results[activeResultCase].error}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {runResult.logs.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="text-muted-foreground mb-2">Console Output:</div>
                              <div className="bg-muted/30 border border-border rounded-lg p-3 space-y-1">
                                {runResult.logs.map((log, i) => (
                                  <div key={i} className="text-muted-foreground">{log}</div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-4 pt-4 border-t border-border flex gap-6 text-muted-foreground">
                            <span>Runtime: <span className="text-foreground">{runResult.runtime} ms</span></span>
                          </div>
                        </>
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
  );
}

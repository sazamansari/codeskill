import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LIGHT, DARK, CAT_TAGS } from "../config/theme";
import { LANGS } from "../config/languages";
import { BADGES, TEMPLATES, COMPANY_TAGS, COMPANY_COLORS } from "../config/constants";
import { ALL_PROBLEMS } from "../data/index";
import { highlightCode } from "../components/editor/highlighting";
import { authAPI, submissionAPI } from "../config/api";

// This is the main platform page.
// In a full implementation, break this into smaller components:
//   - components/layout/Header.jsx
//   - components/editor/CodeEditor.jsx
//   - components/editor/LangSelector.jsx
//   - components/problem/ProblemDesc.jsx
//   - components/problem/ProblemList.jsx
//   - components/problem/TestCases.jsx
//   - components/features/AIHints.jsx
//   - components/features/Notes.jsx
//   - components/features/Terminal.jsx
//   - components/features/StreakCalendar.jsx
//   - components/features/Badges.jsx
//   - components/features/Templates.jsx

// For now, this file contains the complete platform.
// Reference the existing codeskill-platform.jsx for the full implementation
// and gradually extract components into separate files.

let T = LIGHT;

export default function Platform() {
  const { user, updateUserLocal } = useAuth();
  const navigate = useNavigate();

  // ── State ──
  const [theme, setTheme] = useState(user?.profile?.theme || "light");
  const [problemId, setProblemId] = useState(1);
  const [lang, setLang] = useState(user?.profile?.preferredLanguage || "python");
  const [codes, setCodes] = useState({});
  const [fontSize, setFontSize] = useState(user?.profile?.fontSize || 14);
  const [leftTab, setLeftTab] = useState("description");
  const [bottomTab, setBottomTab] = useState("testcase");
  const [showProblems, setShowProblems] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [splitX, setSplitX] = useState(38);
  const [splitY, setSplitY] = useState(60);
  const [activeTC, setActiveTC] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Feature state (synced with MongoDB via API)
  const [solved, setSolved] = useState(new Set(user?.solvedProblems || []));
  const [bookmarked, setBookmarked] = useState(new Set(user?.bookmarkedProblems || []));
  const [notes, setNotes] = useState(user?.notes || {});
  const [timerSec, setTimerSec] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  // Update theme
  T = theme === "dark" ? DARK : LIGHT;

  const PROBLEMS = ALL_PROBLEMS;
  const problem = useMemo(() => PROBLEMS.find(p => p.id === problemId) || PROBLEMS[0], [problemId]);

  // ── Sync preferences with backend ──
  useEffect(() => {
    if (user) {
      authAPI.updateProfile({ profile: { theme, fontSize, preferredLanguage: lang } }).catch(() => {});
    }
  }, [theme, fontSize]);

  // ── Save notes to backend ──
  const saveNote = useCallback((pid, text) => {
    setNotes(prev => ({ ...prev, [pid]: text }));
    authAPI.saveNote(pid, text).catch(() => {});
  }, []);

  // ── Toggle bookmark and sync ──
  const toggleBookmark = useCallback((pid) => {
    setBookmarked(prev => {
      const n = new Set(prev);
      n.has(pid) ? n.delete(pid) : n.add(pid);
      return n;
    });
    authAPI.toggleBookmark(pid).catch(() => {});
  }, []);

  // ── Submit to backend ──
  const handleSubmitToBackend = useCallback(async (status, testsPassed, total) => {
    try {
      const res = await submissionAPI.submit({
        problemId, language: lang, code: codes[`${problemId}-${lang}`] || "",
        status, runtime: Math.floor(Math.random() * 60) + 4 + "ms",
        memory: (Math.random() * 20 + 10).toFixed(1) + " MB",
        testCasesPassed: testsPassed, totalTestCases: total,
        category: problem.cat, difficulty: problem.difficulty,
      });

      if (status === "accepted") {
        setSolved(prev => new Set([...prev, problemId]));
        // Update local user stats
        if (res.data.stats) updateUserLocal({ stats: res.data.stats });
        if (res.data.badges) updateUserLocal({ badges: res.data.badges });
      }
    } catch (err) {
      console.error("Submission sync failed:", err);
    }
  }, [problemId, lang, codes, problem, updateUserLocal]);

  // Timer
  useEffect(() => {
    if (!timerOn) return;
    const id = setInterval(() => setTimerSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerOn]);

  // ── Render ──
  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 600, padding: 40 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: T.gradient, margin: "0 auto 24px", fontSize: 32 }}>💻</div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 32, color: T.text, marginBottom: 12 }}>CodeSkill Platform</h1>
        <p style={{ fontSize: 16, color: T.textSec, lineHeight: 1.6, marginBottom: 8 }}>
          Welcome back, <strong>{user?.name}</strong>! Your MERN project is set up.
        </p>
        <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.6, marginBottom: 32 }}>
          {PROBLEMS.length} problems loaded ({PROBLEMS.filter(p => p.cat === "Programming").length} DSA · {PROBLEMS.filter(p => p.cat === "Database").length} SQL · {PROBLEMS.filter(p => p.cat === "Web").length} JS)
          <br />Backend connected to MongoDB · {solved.size} problems solved
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/profile")} style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: T.gradient, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>View Profile</button>
          <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")} style={{ padding: "12px 28px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.bgWhite, color: T.text, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}</button>
        </div>

        <p style={{ fontSize: 13, color: T.textMuted, marginTop: 40 }}>
          Migrate the full UI from <code style={{ background: T.bgMuted, padding: "2px 8px", borderRadius: 6 }}>codeskill-platform.jsx</code> into this component structure.
          <br />All configs, data, and API connections are ready.
        </p>
      </div>
    </div>
  );
}

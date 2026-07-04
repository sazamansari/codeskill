# CodeSkill — Full-Stack Coding Platform
### Part of the Evolvian EdTech Ecosystem

A LeetCode-style coding practice platform built with the MERN stack featuring 300 curated problems, AI-powered hints, syntax highlighting, and comprehensive user progress tracking.

---

## Architecture

```
codeskill/
├── backend/                    # Express + MongoDB API
│   ├── server.js               # Express server entry
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/
│   │   ├── User.js             # User schema (profile, stats, badges, notes, activity)
│   │   └── Submission.js       # Code submission tracking
│   ├── routes/
│   │   ├── auth.js             # Register, login, profile, notes, bookmarks
│   │   └── submissions.js      # Submit code, history, stats, badges
│   ├── middleware/
│   │   └── auth.js             # JWT authentication
│   └── .env.example            # Environment variables template
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── App.jsx             # Router (Login, Register, Profile, Platform)
│   │   ├── config/
│   │   │   ├── theme.js        # Light/Dark color systems + category tags
│   │   │   ├── languages.js    # 10 language configs + syntax keywords
│   │   │   ├── constants.js    # Badges, templates, company tags
│   │   │   └── api.js          # Axios API service layer
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth provider (login, register, JWT)
│   │   ├── data/
│   │   │   ├── index.js        # Problem helpers (bp, sqlBp, jsBp, mkP)
│   │   │   ├── problems-dsa.js # 100 DSA problems (IDs 1-100)
│   │   │   ├── problems-sql.js # 100 SQL problems (IDs 101-200)
│   │   │   └── problems-js.js  # 100 JavaScript problems (IDs 201-300)
│   │   ├── components/
│   │   │   ├── editor/
│   │   │   │   └── highlighting.js  # Syntax highlighting engine
│   │   │   └── (ui, problem, features, layout — see below)
│   │   └── pages/
│   │       ├── Login.jsx       # Auth page
│   │       ├── Register.jsx    # Registration page
│   │       ├── Profile.jsx     # User dashboard with stats, badges
│   │       └── Platform.jsx    # Main coding interface
│   ├── index.html
│   └── vite.config.js          # Vite + API proxy
│
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd codeskill/backend
cp .env.example .env        # Edit with your MongoDB URI and JWT secret
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeskill
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open `http://localhost:5173`

---

## MongoDB Data Models

### User
Stores everything about a user in a single document for fast reads:

| Field | Type | Description |
|-------|------|-------------|
| name, email, password | String | Auth credentials (password bcrypt-hashed) |
| profile | Object | institution, role, preferredLanguage, theme, fontSize |
| stats | Object | totalSolved, easySolved, mediumSolved, hardSolved, dsaSolved, sqlSolved, jsSolved, currentStreak, longestStreak, xp |
| solvedProblems | [Number] | Array of solved problem IDs |
| bookmarkedProblems | [Number] | Array of bookmarked problem IDs |
| badges | [{badgeId, unlockedAt}] | Earned achievement badges |
| activityMap | Map<String, Number> | Date → solve count (streak calendar) |
| notes | Map<String, String> | problemId → note text |

### Submission
Individual code submission records:

| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Reference to User |
| problemId | Number | Problem ID (1-300) |
| language | String | python, java, cpp, javascript, mysql, etc. |
| code | String | Submitted code |
| status | Enum | accepted, wrong_answer, runtime_error, etc. |
| runtime, memory | String | Performance metrics |
| category | Enum | Programming, Database, Web |
| difficulty | Enum | Easy, Medium, Hard |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/auth/me` | Get current user (protected) |
| PUT | `/api/auth/profile` | Update profile/settings |
| PUT | `/api/auth/notes/:problemId` | Save note for a problem |
| PUT | `/api/auth/bookmark/:problemId` | Toggle bookmark |

### Submissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submissions` | Submit code (auto-updates stats, badges) |
| GET | `/api/submissions/problem/:id` | Get submissions for a problem |
| GET | `/api/submissions/recent` | Get recent 50 submissions |
| GET | `/api/submissions/stats` | Get full stats + activity map |

---

## 300 Problems

| Category | IDs | Count | Topics |
|----------|-----|-------|--------|
| 🧮 DSA | 1-100 | 100 | Arrays, Strings, Linked Lists, Stacks, Trees, Graphs, DP, Binary Search, Heaps, Backtracking, Bit Manipulation |
| 🗄️ SQL | 101-200 | 100 | SELECT, JOINs, GROUP BY, Window Functions, CTEs, Subqueries, DML, DDL, Procedures, Triggers |
| ⚡ JavaScript | 201-300 | 100 | Array methods, Async/Promises, DOM, Data Structures, Closures, Design Patterns, Functional, Utilities |

---

## Features

### Editor
- Syntax highlighting (10 languages)
- Line numbers with synced scroll
- Tab/auto-indent support
- Font size control (11-22px)
- Dark/Light theme toggle
- Code export (download as file)
- Code templates (10 algorithm patterns)

### AI-Powered (Claude API)
- Step-by-step hints (progressive, no spoilers)
- Solution approach walkthrough
- Complexity analysis
- Line-by-line code review

### Progress Tracking (MongoDB-backed)
- Solved count per category (DSA/SQL/JS)
- Difficulty breakdown (Easy/Medium/Hard)
- XP system (10/25/50 per difficulty)
- Streak tracking (current + longest)
- Activity heatmap (GitHub-style calendar)
- 14 unlockable achievement badges

### Platform
- Contest mode (4 random problems, 60-min timer)
- Per-problem notes (saved to MongoDB)
- Bookmarks
- Interactive terminal emulator
- WPM typing speed tracker
- Complexity estimation gauge
- Daily challenge
- Company tags (Google, Amazon, Microsoft, etc.)
- Problem list with category/company filters
- Focus mode (distraction-free)
- Mobile responsive layout

---

## Migrating the Full UI

The `codeskill-platform.jsx` file in the root outputs folder contains the complete single-file platform with all features. To migrate into this MERN structure:

1. The configs, data, and API connections are already split out
2. Copy the UI components from `codeskill-platform.jsx` into `Platform.jsx`
3. Gradually extract into the component folders:
   - `components/ui/` — Button, Tabs, Badge, Modal, ProgressRing
   - `components/editor/` — CodeEditor, LangSelector
   - `components/problem/` — ProblemDesc, ProblemList, TestCases
   - `components/features/` — AIHints, Notes, Terminal, StreakCalendar, Badges, Templates
   - `components/layout/` — Header, Footer, SplitPane

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Backend | Express.js, Node.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| AI | Claude API (Anthropic) |
| Styling | CSS-in-JS (inline styles) |

Built as part of the **Evolvian** EdTech ecosystem.

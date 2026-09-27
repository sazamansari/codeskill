const API_BASE = "http://localhost:5001/api";

async function run() {
  console.log("=== 1. ADMIN LOGIN ===");
  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@codeskill.com", password: "admin123" }),
  });
  const adminLogin = await adminLoginRes.json();
  if (!adminLogin.success) {
    throw new Error("Admin login failed: " + JSON.stringify(adminLogin));
  }
  const adminToken = adminLogin.token;
  console.log("Admin logged in successfully.");

  console.log("\n=== 2. CREATE MULTI-ATTEMPT ASSESSMENT ===");
  const testCode = `CU-BENCH-${Date.now().toString().slice(-5)}`;
  const questionIds = [
    "6ab7ede960c07c57cc311dc5", // MCQ (1 mark, correct ans = 1)
    "6ab7ede960c07c57cc311dc6", // MCQ (1 mark, correct ans = 2)
    "6ab8177cff122ae28fe6feb4", // Coding (5 marks)
  ];

  const createRes = await fetch(`${API_BASE}/admin/assessments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      title: "Chandigarh University Multi-Attempt Benchmark Test 2026",
      code: testCode,
      description: "Automated end-to-end benchmark testing 4 student candidates with multiple attempts and full score logging.",
      type: "hybrid",
      category: "exam",
      durationMinutes: 45,
      passingMarks: 3,
      negativeMarking: false,
      questionIds,
      allowedAttempts: 0, // Multiple / Unlimited Attempts
      status: "published",
      proctoring: {
        enforceFullscreen: true,
        detectTabSwitch: true,
        blockCopyPaste: true,
      },
      instructions: [
        "Welcome to the Benchmark Exam.",
        "Multiple re-attempts are allowed; your highest score will be permanently recorded.",
      ],
    }),
  });

  const createData = await createRes.json();
  if (!createRes.ok || !createData.success) {
    throw new Error("Failed to create assessment: " + JSON.stringify(createData));
  }
  const assessmentId = createData._id || createData._doc?._id || createData.assessment?._id || createData.data?._id;
  const assessment = createData._doc || createData.assessment || createData.data || createData;
  console.log(`Assessment created successfully! ID: ${assessmentId}, Code: ${testCode}, Allowed Attempts: ${assessment.allowedAttempts}`);

  console.log("\n=== 3. LOGIN 4 STUDENT CANDIDATES ===");
  const students = [
    { uid: "CU202600101", name: "Aarav Patel", password: "Mustakim@02" },
    { uid: "CU202600102", name: "Diya Sharma", password: "Mustakim@02" },
    { uid: "CU202600103", name: "Rohan Verma", password: "Mustakim@02" },
    { uid: "CU202600104", name: "Ananya Iyer", password: "Mustakim@02" },
  ];

  for (const s of students) {
    const res = await fetch(`${API_BASE}/auth/student-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: s.uid, password: s.password }),
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(`Failed to login student ${s.uid}: ${JSON.stringify(data)}`);
    }
    s.token = data.token;
    s.id = data.user.id || data.user._id;
    console.log(`Student ${s.name} (${s.uid}) authenticated.`);
  }

  // -------------------------------------------------------------
  // STUDENT 1: Aarav Patel (2 Attempts: Attempt 1 = 3.5, Attempt 2 = 7)
  // -------------------------------------------------------------
  console.log("\n--- Student 1 (Aarav Patel): Taking Attempt #1 ---");
  const s1 = students[0];
  let startRes = await fetch(`${API_BASE}/assessments/${assessmentId}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${s1.token}` },
  });
  let startData = await startRes.json();
  console.log(`S1 Attempt 1 started, Attempt ID: ${startData.attemptId}`);

  // S1 Attempt 1 Responses: Q1 correct (1), Q2 skipped (-1), Q3 partial (1/2 tests)
  let submitRes = await fetch(`${API_BASE}/assessments/${assessmentId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${s1.token}`,
    },
    body: JSON.stringify({
      timeSpentSeconds: 320,
      responses: [
        { questionId: questionIds[0], selectedAnswer: 1, timeSpentSeconds: 40 },
        { questionId: questionIds[1], selectedAnswer: -1, timeSpentSeconds: 20 },
        {
          questionId: questionIds[2],
          code: "def solve(nums): return sum(nums)",
          language: "python",
          testCasesPassed: 1,
          totalTestCases: 2,
          timeSpentSeconds: 260,
        },
      ],
      violations: [],
    }),
  });
  let submitData = await submitRes.json();
  console.log(`S1 Attempt 1 submitted -> Score: ${submitData.result?.score}/${submitData.result?.maxScore}, Highest: ${submitData.result?.highestScore}, Attempt#: ${submitData.result?.attemptNumber}`);

  console.log("\n--- Student 1 (Aarav Patel): Taking Attempt #2 (Retake) ---");
  let retakeRes = await fetch(`${API_BASE}/assessments/${assessmentId}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${s1.token}` },
  });
  let retakeData = await retakeRes.json();
  console.log(`S1 Attempt 2 started, Attempt ID: ${retakeData.attemptId}`);

  // S1 Attempt 2 Responses: Q1 correct (1), Q2 correct (2), Q3 full (2/2 tests)
  submitRes = await fetch(`${API_BASE}/assessments/${assessmentId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${s1.token}`,
    },
    body: JSON.stringify({
      timeSpentSeconds: 450,
      responses: [
        { questionId: questionIds[0], selectedAnswer: 1, timeSpentSeconds: 30 },
        { questionId: questionIds[1], selectedAnswer: 2, timeSpentSeconds: 35 },
        {
          questionId: questionIds[2],
          code: "def solve(nums):\n    total = 0\n    for n in nums:\n        total += n\n    return total",
          language: "python",
          testCasesPassed: 2,
          totalTestCases: 2,
          timeSpentSeconds: 385,
        },
      ],
      violations: [],
    }),
  });
  submitData = await submitRes.json();
  console.log(`S1 Attempt 2 submitted -> Score: ${submitData.result?.score}/${submitData.result?.maxScore}, Highest: ${submitData.result?.highestScore}, Attempt#: ${submitData.result?.attemptNumber}, Passed: ${submitData.result?.passed}`);

  // -------------------------------------------------------------
  // STUDENT 2: Diya Sharma (2 Attempts: Attempt 1 = 4.5, Attempt 2 = 1 [Highest remains 4.5])
  // -------------------------------------------------------------
  console.log("\n--- Student 2 (Diya Sharma): Taking Attempt #1 ---");
  const s2 = students[1];
  startRes = await fetch(`${API_BASE}/assessments/${assessmentId}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${s2.token}` },
  });
  startData = await startRes.json();
  console.log(`S2 Attempt 1 started, Attempt ID: ${startData.attemptId}`);

  // S2 Attempt 1: Q1 correct (1), Q2 correct (2), Q3 partial (1/2 tests) -> 1 + 1 + 2.5 = 4.5
  submitRes = await fetch(`${API_BASE}/assessments/${assessmentId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${s2.token}`,
    },
    body: JSON.stringify({
      timeSpentSeconds: 280,
      responses: [
        { questionId: questionIds[0], selectedAnswer: 1, timeSpentSeconds: 50 },
        { questionId: questionIds[1], selectedAnswer: 2, timeSpentSeconds: 40 },
        {
          questionId: questionIds[2],
          code: "def solve(nums): return max(nums)",
          language: "python",
          testCasesPassed: 1,
          totalTestCases: 2,
          timeSpentSeconds: 190,
        },
      ],
      violations: [],
    }),
  });
  submitData = await submitRes.json();
  console.log(`S2 Attempt 1 submitted -> Score: ${submitData.result?.score}/${submitData.result?.maxScore}, Highest: ${submitData.result?.highestScore}, Attempt#: ${submitData.result?.attemptNumber}`);

  console.log("\n--- Student 2 (Diya Sharma): Taking Attempt #2 (Retake with Lower Score) ---");
  retakeRes = await fetch(`${API_BASE}/assessments/${assessmentId}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${s2.token}` },
  });
  retakeData = await retakeRes.json();
  console.log(`S2 Attempt 2 started, Attempt ID: ${retakeData.attemptId}`);

  // S2 Attempt 2: Q1 wrong (0), Q2 correct (2), Q3 skipped -> Score: 1
  submitRes = await fetch(`${API_BASE}/assessments/${assessmentId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${s2.token}`,
    },
    body: JSON.stringify({
      timeSpentSeconds: 120,
      responses: [
        { questionId: questionIds[0], selectedAnswer: 0, timeSpentSeconds: 30 },
        { questionId: questionIds[1], selectedAnswer: 2, timeSpentSeconds: 40 },
        { questionId: questionIds[2], code: "", timeSpentSeconds: 50 },
      ],
      violations: [],
    }),
  });
  submitData = await submitRes.json();
  console.log(`S2 Attempt 2 submitted -> Score: ${submitData.result?.score}/${submitData.result?.maxScore}, Highest Kept: ${submitData.result?.highestScore} (Should be 4.5), Attempt#: ${submitData.result?.attemptNumber}`);

  // -------------------------------------------------------------
  // STUDENT 3: Rohan Verma (1 Attempt: Perfect 7/7)
  // -------------------------------------------------------------
  console.log("\n--- Student 3 (Rohan Verma): Taking Attempt #1 ---");
  const s3 = students[2];
  startRes = await fetch(`${API_BASE}/assessments/${assessmentId}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${s3.token}` },
  });
  startData = await startRes.json();
  console.log(`S3 Attempt 1 started, Attempt ID: ${startData.attemptId}`);

  submitRes = await fetch(`${API_BASE}/assessments/${assessmentId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${s3.token}`,
    },
    body: JSON.stringify({
      timeSpentSeconds: 500,
      responses: [
        { questionId: questionIds[0], selectedAnswer: 1, timeSpentSeconds: 25 },
        { questionId: questionIds[1], selectedAnswer: 2, timeSpentSeconds: 25 },
        {
          questionId: questionIds[2],
          code: "class Solution:\n    def solve(self, nums):\n        return sum(nums)",
          language: "python",
          testCasesPassed: 2,
          totalTestCases: 2,
          timeSpentSeconds: 450,
        },
      ],
      violations: [],
    }),
  });
  submitData = await submitRes.json();
  console.log(`S3 Attempt 1 submitted -> Score: ${submitData.result?.score}/${submitData.result?.maxScore}, Highest: ${submitData.result?.highestScore}, Passed: ${submitData.result?.passed}`);

  // -------------------------------------------------------------
  // STUDENT 4: Ananya Iyer (1 Attempt with Proctoring Violations)
  // -------------------------------------------------------------
  console.log("\n--- Student 4 (Ananya Iyer): Taking Attempt #1 with Telemetry ---");
  const s4 = students[3];
  startRes = await fetch(`${API_BASE}/assessments/${assessmentId}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${s4.token}` },
  });
  startData = await startRes.json();
  console.log(`S4 Attempt 1 started, Attempt ID: ${startData.attemptId}`);

  submitRes = await fetch(`${API_BASE}/assessments/${assessmentId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${s4.token}`,
    },
    body: JSON.stringify({
      timeSpentSeconds: 190,
      responses: [
        { questionId: questionIds[0], selectedAnswer: 1, timeSpentSeconds: 40 },
        { questionId: questionIds[1], selectedAnswer: 0, timeSpentSeconds: 30 }, // wrong
        { questionId: questionIds[2], code: "", timeSpentSeconds: 120 }, // skipped
      ],
      violations: [
        { type: "tab_switch", details: "Switched to external tab", timestamp: new Date().toISOString() },
        { type: "tab_switch", details: "Switched to external tab 2", timestamp: new Date().toISOString() },
        { type: "voice_detected", details: "Background human voice detected", timestamp: new Date().toISOString() },
      ],
    }),
  });
  submitData = await submitRes.json();
  console.log(`S4 Attempt 1 submitted -> Score: ${submitData.result?.score}/${submitData.result?.maxScore}, Tab Switches: ${submitData.result?.tabSwitchCount}, Violations: ${submitData.result?.violations?.length}`);

  // -------------------------------------------------------------
  // 4. VERIFY ADMIN ASSESSMENT RESULTS ENDPOINT
  // -------------------------------------------------------------
  console.log("\n=== 4. VERIFY ADMIN RESULTS API ===");
  const adminRes = await fetch(`${API_BASE}/admin/assessments/${assessmentId}/results`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminData = await adminRes.json();
  console.log("Admin API Status:", adminRes.status, "Success:", adminData.success);
  console.log("\n--- Assessment Stats ---");
  console.log(JSON.stringify(adminData.stats, null, 2));

  console.log("\n--- Candidates Summary (Grouped by Student with All Attempts) ---");
  for (const c of adminData.attempts || []) {
    console.log({
      studentUid: c.studentUid,
      studentName: c.studentName,
      bestScore: c.score,
      maxScore: c.maxScore,
      percentage: `${c.percentage}%`,
      passed: c.passed,
      totalAttempts: c.totalAttempts,
      allAttemptsBreakdown: (c.allAttempts || []).map((a) => ({
        attemptNumber: a.attemptNumber,
        score: a.score,
        percentage: `${a.percentage}%`,
        tabSwitchCount: a.tabSwitchCount,
        violationsCount: a.violationsCount,
      })),
    });
  }

  console.log("\n--- Raw Attempts Log (All Individual Submissions) ---");
  console.log(`Total raw attempts logged: ${adminData.rawAttempts?.length}`);
  for (const r of adminData.rawAttempts || []) {
    console.log(`Candidate: ${r.studentUid} | Attempt #${r.attemptNumber} | Score: ${r.score}/${r.maxScore} | Status: ${r.status} | SubmittedAt: ${r.submittedAt}`);
  }

  // -------------------------------------------------------------
  // 5. AUTOMATED ASSERTIONS
  // -------------------------------------------------------------
  console.log("\n=== 5. PERFORMING VALIDATION ASSERTIONS ===");
  if (adminData.stats.totalCandidates !== 4) {
    throw new Error(`Expected 4 candidates, got ${adminData.stats.totalCandidates}`);
  }
  if (adminData.stats.totalSubmissionsCount !== 6) {
    throw new Error(`Expected 6 submissions, got ${adminData.stats.totalSubmissionsCount}`);
  }
  if (adminData.rawAttempts.length !== 6) {
    throw new Error(`Expected 6 raw attempts, got ${adminData.rawAttempts.length}`);
  }

  const s1Record = adminData.attempts.find((a) => a.studentUid === "CU202600101");
  if (!s1Record || s1Record.score !== 7 || s1Record.totalAttempts !== 2) {
    throw new Error(`S1 validation failed: bestScore should be 7, attempts should be 2. Got: ${JSON.stringify(s1Record)}`);
  }

  const s2Record = adminData.attempts.find((a) => a.studentUid === "CU202600102");
  if (!s2Record || s2Record.score !== 4.5 || s2Record.totalAttempts !== 2) {
    throw new Error(`S2 validation failed: bestScore should remain 4.5, attempts should be 2. Got: ${JSON.stringify(s2Record)}`);
  }

  const s4Record = adminData.attempts.find((a) => a.studentUid === "CU202600104");
  if (!s4Record || s4Record.tabSwitchCount !== 2 || (s4Record.violations?.length !== 3 && s4Record.violationsCount !== 3)) {
    throw new Error(`S4 validation failed: tabSwitchCount should be 2, violations should be 3. Got: ${JSON.stringify(s4Record)}`);
  }

  console.log("\n ALL ASSERTIONS PASSED PERFECTLY!");
  console.log("Assessment ID:", assessmentId);
  console.log("Ready to review in Admin UI at: http://localhost:3000/admin/assessments/" + assessmentId + "/results");
}

run().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});

import re

with open('/Users/mdshadabazamansari/Downloads/Source Code/frontend-v2/src/app/problems/[id]/page.tsx', 'r') as f:
    content = f.read()

# Replace the import
content = content.replace(
    'import { submissionAPI } from "@/config/api";',
    'import { submissionAPI, runAPI } from "@/config/api";'
)

# Remove the executeJavaScript function block
content = re.sub(
    r'function executeJavaScript\(code: string, testCases: typeof TEST_CASES\): RunResult \{.*?\}\n\n',
    '',
    content,
    flags=re.DOTALL
)

# Replace handleRun and handleSubmit
handle_run_submit_block = """  const executeCode = async () => {
    const apiTestCases = TEST_CASES.map(tc => ({
      id: tc.id,
      input: { nums: tc.nums, target: tc.target },
      expected: tc.expected,
    }));

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
  }, [code, language]);

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
            problemId: "1",
            language,
            code,
            status: data.status,
            runtime: data.runtime || 0,
            memory: 0,
            testCasesPassed: data.passedCount,
            totalTestCases: data.totalCount,
            category: "Arrays",
            difficulty: "Easy"
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
  }, [code, language]);"""

content = re.sub(
    r'  const handleRun = useCallback\(async \(\) => \{.*\}, \[code, language\]\);\n\n  const handleSubmit = useCallback\(async \(\) => \{.*\}, \[code, language\]\);',
    handle_run_submit_block,
    content,
    flags=re.DOTALL
)

with open('/Users/mdshadabazamansari/Downloads/Source Code/frontend-v2/src/app/problems/[id]/page.tsx', 'w') as f:
    f.write(content)

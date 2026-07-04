const express = require("express");
const router = express.Router();
const { execFile, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { randomUUID } = require("crypto");

const TIMEOUT_MS = 5000; // 5 second timeout per test case

/**
 * @route POST /api/run
 * @body { code: string, language: "javascript"|"python"|"cpp"|"java", testCases: Array<{ id, input, expected }> }
 * @desc Execute user code against test cases and return results
 */
router.post("/", async (req, res) => {
  const { code, language, testCases } = req.body;

  if (!code || !language || !testCases || !Array.isArray(testCases)) {
    return res.status(400).json({ success: false, message: "Missing code, language, or testCases" });
  }

  if (!["javascript", "python", "cpp", "java"].includes(language)) {
    return res.status(400).json({ success: false, message: "Unsupported language" });
  }

  try {
    const startTime = Date.now();
    let results;

    switch (language) {
      case "javascript":
        results = await runJavaScript(code, testCases);
        break;
      case "python":
        results = await runPython(code, testCases);
        break;
      case "cpp":
        results = await runCpp(code, testCases);
        break;
      case "java":
        results = await runJava(code, testCases);
        break;
    }

    const runtime = Date.now() - startTime;
    const passedCount = results.filter(r => r.passed).length;
    const hasError = results.some(r => r.error);
    const allPassed = passedCount === results.length;

    res.json({
      success: true,
      status: hasError ? "error" : allPassed ? "accepted" : "wrong_answer",
      results,
      runtime,
      passedCount,
      totalCount: results.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── JavaScript Runner (Node.js child process) ──
async function runJavaScript(code, testCases) {
  const results = [];

  for (const tc of testCases) {
    const tmpDir = path.join(os.tmpdir(), `cs_js_${randomUUID()}`);
    fs.mkdirSync(tmpDir, { recursive: true });

    const script = `
const __logs = [];
const __print = process.stdout.write.bind(process.stdout);
const __origLog = console.log.bind(console);

// Override console methods to capture logs
const __mockConsole = {
  log: (...a) => __logs.push(a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ')),
  warn: (...a) => __logs.push('[warn] ' + a.map(x => String(x)).join(' ')),
  error: (...a) => __logs.push('[error] ' + a.map(x => String(x)).join(' ')),
};
console.log = __mockConsole.log;
console.warn = __mockConsole.warn;
console.error = __mockConsole.error;

${code}

const __input = ${JSON.stringify(tc.input)};
let __result;
try {
  __result = twoSum(__input.nums, __input.target);
} catch(e) {
  __origLog(JSON.stringify({ __error: e.message, __logs }));
  process.exit(0);
}
__origLog(JSON.stringify({ __result, __logs }));
`;

    const filePath = path.join(tmpDir, "solution.js");
    fs.writeFileSync(filePath, script);

    try {
      const output = await execInChild("node", [filePath], TIMEOUT_MS);
      const parsed = JSON.parse(output.stdout.trim());

      if (parsed.__error) {
        results.push({ id: tc.id, passed: false, output: "Error", expected: JSON.stringify(tc.expected), error: parsed.__error, logs: parsed.__logs || [] });
      } else {
        const passed = compareArrays(parsed.__result, tc.expected);
        results.push({
          id: tc.id,
          passed,
          output: JSON.stringify(parsed.__result),
          expected: JSON.stringify(tc.expected),
          logs: parsed.__logs || [],
        });
      }
    } catch (err) {
      results.push({ id: tc.id, passed: false, output: "Error", expected: JSON.stringify(tc.expected), error: err.message, logs: [] });
    } finally {
      cleanup(tmpDir);
    }
  }

  return results;
}

// ── Python Runner ──
async function runPython(code, testCases) {
  const results = [];

  for (const tc of testCases) {
    const tmpDir = path.join(os.tmpdir(), `cs_py_${randomUUID()}`);
    fs.mkdirSync(tmpDir, { recursive: true });

    const script = `
import json, sys, io

__logs = []
__orig_print = print

def print(*args, **kwargs):
    output = io.StringIO()
    __orig_print(*args, file=output, **kwargs)
    __logs.append(output.getvalue().rstrip('\\n'))

${code}

__input = json.loads('''${JSON.stringify(tc.input)}''')
try:
    __result = twoSum(__input["nums"], __input["target"])
    if __result is None:
        __result = None
    __orig_print(json.dumps({"__result": __result, "__logs": __logs}))
except Exception as e:
    __orig_print(json.dumps({"__error": str(e), "__logs": __logs}))
`;

    const filePath = path.join(tmpDir, "solution.py");
    fs.writeFileSync(filePath, script);

    try {
      const output = await execInChild("python3", [filePath], TIMEOUT_MS);
      const stdout = output.stdout.trim();
      const parsed = JSON.parse(stdout);

      if (parsed.__error) {
        results.push({ id: tc.id, passed: false, output: "Error", expected: JSON.stringify(tc.expected), error: parsed.__error, logs: parsed.__logs || [] });
      } else {
        const passed = compareArrays(parsed.__result, tc.expected);
        results.push({
          id: tc.id,
          passed,
          output: JSON.stringify(parsed.__result),
          expected: JSON.stringify(tc.expected),
          logs: parsed.__logs || [],
        });
      }
    } catch (err) {
      results.push({ id: tc.id, passed: false, output: "Error", expected: JSON.stringify(tc.expected), error: err.message, logs: [] });
    } finally {
      cleanup(tmpDir);
    }
  }

  return results;
}

// ── C++ Runner ──
async function runCpp(code, testCases) {
  const results = [];
  const tmpDir = path.join(os.tmpdir(), `cs_cpp_${randomUUID()}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  // For C++, we wrap the user's code with a main() that reads JSON input
  // and outputs JSON result. The user should define a twoSum method in a Solution class
  // or a standalone twoSum function.
  
  for (const tc of testCases) {
    const inputNums = JSON.stringify(tc.input.nums);
    const inputTarget = tc.input.target;

    const fullCode = `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;

${code}

int main() {
    vector<int> nums = {${tc.input.nums.join(",")}};
    int target = ${inputTarget};
    
    vector<int> result;
    
    // Try calling twoSum - support both standalone function and Solution class
    #ifdef __cpp_if_consteval
    result = twoSum(nums, target);
    #else
    result = twoSum(nums, target);
    #endif

    // Output as JSON array
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << ",";
        cout << result[i];
    }
    cout << "]" << endl;
    return 0;
}
`;

    const srcPath = path.join(tmpDir, `solution_${tc.id}.cpp`);
    const binPath = path.join(tmpDir, `solution_${tc.id}`);
    fs.writeFileSync(srcPath, fullCode);

    try {
      // Compile
      try {
        execSync(`g++ -std=c++17 -o "${binPath}" "${srcPath}" 2>&1`, { timeout: TIMEOUT_MS });
      } catch (compileErr) {
        const msg = compileErr.stdout ? compileErr.stdout.toString() : compileErr.message;
        results.push({ id: tc.id, passed: false, output: "Compilation Error", expected: JSON.stringify(tc.expected), error: msg.substring(0, 500), logs: [] });
        continue;
      }

      // Run
      const output = await execInChild(binPath, [], TIMEOUT_MS);
      const stdout = output.stdout.trim();

      let parsed;
      try {
        parsed = JSON.parse(stdout);
      } catch {
        results.push({ id: tc.id, passed: false, output: stdout || "No output", expected: JSON.stringify(tc.expected), error: "Could not parse output", logs: [] });
        continue;
      }

      const passed = compareArrays(parsed, tc.expected);
      results.push({
        id: tc.id,
        passed,
        output: JSON.stringify(parsed),
        expected: JSON.stringify(tc.expected),
        logs: [],
      });
    } catch (err) {
      results.push({ id: tc.id, passed: false, output: "Error", expected: JSON.stringify(tc.expected), error: err.message, logs: [] });
    }
  }

  cleanup(tmpDir);
  return results;
}

// ── Java Runner ──
const JAVAC_PATH = "javac";
const JAVA_PATH = "java";

async function runJava(code, testCases) {
  const results = [];

  for (const tc of testCases) {
    const tmpDir = path.join(os.tmpdir(), `cs_java_${randomUUID()}`);
    fs.mkdirSync(tmpDir, { recursive: true });

    const fullCode = `
import java.util.*;

public class Solution {
    ${code}

    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] nums = {${tc.input.nums.join(",")}};
        int target = ${tc.input.target};
        int[] result = sol.twoSum(nums, target);
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < result.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(result[i]);
        }
        sb.append("]");
        System.out.println(sb.toString());
    }
}
`;

    const srcPath = path.join(tmpDir, "Solution.java");
    fs.writeFileSync(srcPath, fullCode);

    try {
      // Compile
      try {
        execSync(`"${JAVAC_PATH}" "${srcPath}" 2>&1`, { timeout: TIMEOUT_MS });
      } catch (compileErr) {
        const msg = compileErr.stdout ? compileErr.stdout.toString() : compileErr.message;
        results.push({ id: tc.id, passed: false, output: "Compilation Error", expected: JSON.stringify(tc.expected), error: msg.substring(0, 500), logs: [] });
        continue;
      }

      // Run
      const output = await execInChild(JAVA_PATH, ["-cp", tmpDir, "Solution"], TIMEOUT_MS);
      const stdout = output.stdout.trim();

      let parsed;
      try {
        parsed = JSON.parse(stdout);
      } catch {
        results.push({ id: tc.id, passed: false, output: stdout || "No output", expected: JSON.stringify(tc.expected), error: "Could not parse output", logs: [] });
        continue;
      }

      const passed = compareArrays(parsed, tc.expected);
      results.push({
        id: tc.id,
        passed,
        output: JSON.stringify(parsed),
        expected: JSON.stringify(tc.expected),
        logs: [],
      });
    } catch (err) {
      results.push({ id: tc.id, passed: false, output: "Error", expected: JSON.stringify(tc.expected), error: err.message, logs: [] });
    } finally {
      cleanup(tmpDir);
    }
  }

  return results;
}

// ── Helpers ──

function execInChild(command, args, timeout) {
  return new Promise((resolve, reject) => {
    const child = execFile(command, args, { timeout, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed) {
          reject(new Error("Time Limit Exceeded (5s)"));
        } else {
          // Include stderr in error message for better debugging
          const errMsg = stderr ? stderr.substring(0, 500) : error.message;
          reject(new Error(errMsg));
        }
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

function compareArrays(actual, expected) {
  if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
  if (actual.length !== expected.length) return false;
  const sortedA = [...actual].sort((a, b) => a - b);
  const sortedE = [...expected].sort((a, b) => a - b);
  return JSON.stringify(sortedA) === JSON.stringify(sortedE);
}

function cleanup(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {}
}

module.exports = router;

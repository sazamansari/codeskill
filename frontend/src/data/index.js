// ── Boilerplate Helpers ──
export function bp(name, pySig, javaRet, javaSig, cppRet, cppSig, jsParams) {
  return {
    python: `class Solution:\n    def ${name}(self, ${pySig}):\n        # Write your solution here\n        pass`,
    java: `class Solution {\n    public ${javaRet} ${name}(${javaSig}) {\n        // Write your solution here\n        ${javaRet === "void" ? "" : javaRet === "boolean" ? "return false;" : javaRet === "int" ? "return 0;" : "return null;"}\n    }\n}`,
    cpp: `class Solution {\npublic:\n    ${cppRet} ${name}(${cppSig}) {\n        // Write your solution here\n        ${cppRet === "void" ? "" : cppRet === "bool" ? "return false;" : cppRet === "int" ? "return 0;" : "return {};"}\n    }\n};`,
    c: `// Write your C solution for ${name}\n#include <stdlib.h>\n`,
    javascript: `function ${name}(${jsParams.replace(/\{[^}]+\}\s*/g, "").trim()}) {\n    // Write your solution here\n};`,
  };
}

export function sqlBp(q) {
  return {
    mysql: `-- MySQL\n${q}`,
    postgresql: `-- PostgreSQL\n${q}`,
    mongodb: `// MongoDB\ndb.collection.find({});\n// Translate the SQL logic above`,
  };
}

export function jsBp(name, params) {
  return {
    javascript: `function ${name}(${params}) {\n    // Write your solution here\n}`,
    html: `<!DOCTYPE html>\n<html><head><title>Solution</title></head>\n<body>\n<script>\nfunction ${name}(${params}) {\n    // Write your solution here\n}\n</script>\n</body></html>`,
    css: `/* Add styles if needed */`,
  };
}

export function mkP(id, title, diff, cat, tags, desc, exIn, exOut, constraints, tcIn, tcOut, boilerplate) {
  return {
    id, title, difficulty: diff, cat, tags,
    acceptance: `${30 + ((id * 7) % 40)}.${(id * 3) % 10}%`,
    likes: 1000 + id * 47,
    description: desc,
    examples: [{ input: exIn, output: exOut, explanation: null }],
    constraints,
    testCases: [{ input: tcIn, expected: tcOut }],
    boilerplate,
  };
}

// ── Import problems from separate files ──
// In production, split into: problems-dsa.js, problems-sql.js, problems-js.js
// Each file exports an array using mkP() helper above

// For now, re-export from combined file
export { DSA_PROBLEMS } from "./problems-dsa";
export { SQL_PROBLEMS } from "./problems-sql";
export { JS_PROBLEMS } from "./problems-js";

// Combined export
import { DSA_PROBLEMS } from "./problems-dsa";
import { SQL_PROBLEMS } from "./problems-sql";
import { JS_PROBLEMS } from "./problems-js";

export const ALL_PROBLEMS = [...DSA_PROBLEMS, ...SQL_PROBLEMS, ...JS_PROBLEMS];

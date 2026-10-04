require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mdshadabazamansari:123123123123@cluster0.gwcfd5x.mongodb.net/codeskill?retryWrites=true&w=majority";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  questionType: { type: String, default: 'single_choice' },
  topic: { type: String, required: true },
  subtopic: { type: String },
  difficulty: { type: String, default: 'medium' },
  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 },
  options: [{ type: String }],
  correctAnswer: { type: Number },
  correctAnswers: [{ type: Number }],
  explanation: { type: String },
  tags: [{ type: String }],
  status: { type: String, default: 'approved' },

  // Code Output
  language: { type: String },
  codeSnippet: { type: String },
  expectedOutput: { type: String },

  // DSA
  problemStatement: { type: String },
  constraints: { type: String },
  inputFormat: { type: String },
  outputFormat: { type: String },
  examples: [{ type: Object }],
  testCases: [{ type: Object }],
  referenceSolutions: { type: Object },
  starterCode: { type: Object },
  timeLimit: { type: Number },
  memoryLimit: { type: Number },
  supportedLanguages: [{ type: String }]
}, { timestamps: true });

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

const mcqs = [
  {
    question: "Which of the following is true about React hooks?",
    questionType: "MULTIPLE_CHOICE",
    topic: "React",
    difficulty: "medium",
    options: ["They must be called at the top level.", "They can be called inside loops.", "They can only be called from React function components.", "They replace Redux entirely."],
    correctAnswers: [0, 2],
    explanation: "React hooks must be called at the top level and only from React function components or custom hooks.",
    tags: ["react", "hooks"]
  },
  {
    question: "What does AWS S3 stand for?",
    questionType: "MCQ",
    topic: "AWS",
    difficulty: "easy",
    options: ["Simple Storage Service", "Super Storage Server", "Scalable Storage Service", "System Storage Service"],
    correctAnswer: 0,
    explanation: "S3 stands for Simple Storage Service.",
    tags: ["aws", "s3"]
  },
  {
    question: "JavaScript is a statically typed language.",
    questionType: "TRUE_FALSE",
    topic: "JavaScript",
    difficulty: "easy",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "JavaScript is dynamically typed.",
    tags: ["javascript"]
  },
  {
    question: "Which CSS property is used to control the space between flex items?",
    questionType: "MCQ",
    topic: "CSS",
    difficulty: "easy",
    options: ["margin", "padding", "gap", "spacing"],
    correctAnswer: 2,
    explanation: "The `gap` property controls the space between flex and grid items.",
    tags: ["css", "flexbox"]
  },
  {
    question: "What will the following code output?",
    questionType: "CODE_OUTPUT",
    topic: "JavaScript",
    difficulty: "medium",
    language: "javascript",
    codeSnippet: "console.log(typeof null);",
    expectedOutput: "object",
    explanation: "In JavaScript, typeof null returns 'object' due to a legacy bug.",
    tags: ["javascript", "types"]
  },
  {
    question: "Which HTTP methods are idempotent?",
    questionType: "MULTIPLE_CHOICE",
    topic: "Web Technologies",
    difficulty: "medium",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswers: [0, 2, 3],
    explanation: "GET, PUT, and DELETE are idempotent. POST is not.",
    tags: ["http", "api"]
  },
  {
    question: "Docker containers share the host machine's OS kernel.",
    questionType: "TRUE_FALSE",
    topic: "Docker",
    difficulty: "medium",
    options: ["True", "False"],
    correctAnswer: 0,
    explanation: "Docker containers share the host's kernel, unlike virtual machines.",
    tags: ["docker", "devops"]
  },
  {
    question: "Which of the following is NOT a valid Kubernetes primitive?",
    questionType: "MCQ",
    topic: "Kubernetes",
    difficulty: "hard",
    options: ["Pod", "ReplicaSet", "Deployment", "Machine"],
    correctAnswer: 3,
    explanation: "Machine is not a standard Kubernetes resource (Node is used).",
    tags: ["kubernetes", "devops"]
  },
  {
    question: "What will the following Python code output?",
    questionType: "CODE_OUTPUT",
    topic: "Python",
    difficulty: "medium",
    language: "python3",
    codeSnippet: "x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)",
    expectedOutput: "[1, 2, 3, 4]",
    explanation: "Lists are mutable and y refers to the same object as x.",
    tags: ["python", "references"]
  },
  {
    question: "Which command creates a new Git branch and switches to it?",
    questionType: "MCQ",
    topic: "Git",
    difficulty: "easy",
    options: ["git checkout -b", "git branch -n", "git switch -c", "Both A and C"],
    correctAnswer: 3,
    explanation: "Both `git checkout -b` and the newer `git switch -c` create and switch to a new branch.",
    tags: ["git", "vcs"]
  }
];

const dsas = [
  {
    question: "Two Sum",
    questionType: "DSA",
    topic: "Arrays",
    difficulty: "easy",
    problemStatement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
    inputFormat: "First line contains N. Second line contains N integers. Third line contains the target.",
    outputFormat: "Two space-separated integers representing the indices.",
    examples: [{
      number: 1,
      input: "4\n2 7 11 15\n9",
      output: "0 1",
      explanation: "nums[0] + nums[1] == 9, so we return 0 and 1."
    }],
    testCases: [
      { input: "4\n2 7 11 15\n9", output: "0 1", isHidden: false },
      { input: "3\n3 2 4\n6", output: "1 2", isHidden: true },
      { input: "2\n3 3\n6", output: "0 1", isHidden: true }
    ],
    referenceSolutions: {
      javascript: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}"
    },
    supportedLanguages: ["javascript", "python3", "cpp", "java"],
    timeLimit: 2000,
    memoryLimit: 256,
    tags: ["array", "hashmap"]
  },
  {
    question: "Valid Parentheses",
    questionType: "DSA",
    topic: "Stack",
    difficulty: "easy",
    problemStatement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
    inputFormat: "A single string s.",
    outputFormat: "Print 'true' if valid, 'false' otherwise.",
    examples: [{
      number: 1,
      input: "()[]{}",
      output: "true",
      explanation: "All brackets are properly closed."
    }],
    testCases: [
      { input: "()", output: "true", isHidden: false },
      { input: "(]", output: "false", isHidden: true },
      { input: "([)]", output: "false", isHidden: true }
    ],
    referenceSolutions: {
      javascript: "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (c === '(' || c === '{' || c === '[') stack.push(c);\n    else if (stack.pop() !== map[c]) return false;\n  }\n  return stack.length === 0;\n}"
    },
    supportedLanguages: ["javascript", "python3", "cpp", "java"],
    timeLimit: 1000,
    memoryLimit: 256,
    tags: ["stack", "string"]
  },
  {
    question: "Merge Intervals",
    questionType: "DSA",
    topic: "Sorting",
    difficulty: "medium",
    problemStatement: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    constraints: "1 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= starti <= endi <= 10^4",
    inputFormat: "First line is N. Following N lines contain start and end separated by space.",
    outputFormat: "Merged intervals, one per line.",
    examples: [{
      number: 1,
      input: "4\n1 3\n2 6\n8 10\n15 18",
      output: "1 6\n8 10\n15 18",
      explanation: "Intervals [1,3] and [2,6] overlap."
    }],
    testCases: [
      { input: "4\n1 3\n2 6\n8 10\n15 18", output: "1 6\n8 10\n15 18", isHidden: false },
      { input: "2\n1 4\n4 5", output: "1 5", isHidden: true }
    ],
    referenceSolutions: {
      javascript: "function merge(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a,b) => a[0]-b[0]);\n  const res = [intervals[0]];\n  for (let i=1; i<intervals.length; i++) {\n    const last = res[res.length-1];\n    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);\n    else res.push(intervals[i]);\n  }\n  return res;\n}"
    },
    supportedLanguages: ["javascript", "python3", "cpp", "java"],
    timeLimit: 2000,
    memoryLimit: 256,
    tags: ["array", "sorting"]
  },
  {
    question: "Course Schedule",
    questionType: "DSA",
    topic: "Graph",
    difficulty: "medium",
    problemStatement: "There are a total of numCourses courses you have to take. Some courses have prerequisites. Return true if you can finish all courses.",
    constraints: "1 <= numCourses <= 2000\n0 <= prerequisites.length <= 5000",
    inputFormat: "First line N (courses) and M (edges). Next M lines contain u v meaning v depends on u.",
    outputFormat: "Print 'true' if possible, 'false' otherwise.",
    examples: [{
      number: 1,
      input: "2 1\n1 0",
      output: "true",
      explanation: "Take course 0 then 1."
    }],
    testCases: [
      { input: "2 1\n1 0", output: "true", isHidden: false },
      { input: "2 2\n1 0\n0 1", output: "false", isHidden: true }
    ],
    referenceSolutions: {
      javascript: "function canFinish(numCourses, prerequisites) {\n  const graph = Array.from({length: numCourses}, () => []);\n  const inDegree = Array(numCourses).fill(0);\n  for (const [v, u] of prerequisites) {\n    graph[u].push(v);\n    inDegree[v]++;\n  }\n  const queue = [];\n  for (let i=0; i<numCourses; i++) if (inDegree[i]===0) queue.push(i);\n  let count = 0;\n  while(queue.length) {\n    const node = queue.shift();\n    count++;\n    for (const neighbor of graph[node]) {\n      inDegree[neighbor]--;\n      if (inDegree[neighbor]===0) queue.push(neighbor);\n    }\n  }\n  return count === numCourses;\n}"
    },
    supportedLanguages: ["javascript", "python3", "cpp", "java"],
    timeLimit: 2500,
    memoryLimit: 256,
    tags: ["graph", "bfs", "topological-sort"]
  },
  {
    question: "Longest Increasing Subsequence",
    questionType: "DSA",
    topic: "Dynamic Programming",
    difficulty: "hard",
    problemStatement: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    constraints: "1 <= nums.length <= 2500\n-10^4 <= nums[i] <= 10^4",
    inputFormat: "First line N. Second line N integers.",
    outputFormat: "A single integer.",
    examples: [{
      number: 1,
      input: "8\n10 9 2 5 3 7 101 18",
      output: "4",
      explanation: "The LIS is [2,3,7,101], length is 4."
    }],
    testCases: [
      { input: "8\n10 9 2 5 3 7 101 18", output: "4", isHidden: false },
      { input: "6\n0 1 0 3 2 3", output: "4", isHidden: true },
      { input: "7\n7 7 7 7 7 7 7", output: "1", isHidden: true }
    ],
    referenceSolutions: {
      javascript: "function lengthOfLIS(nums) {\n  const dp = new Array(nums.length).fill(1);\n  let max = 1;\n  for(let i=1; i<nums.length; i++) {\n    for(let j=0; j<i; j++) {\n      if(nums[i] > nums[j]) dp[i] = Math.max(dp[i], dp[j]+1);\n    }\n    max = Math.max(max, dp[i]);\n  }\n  return max;\n}"
    },
    supportedLanguages: ["javascript", "python3", "cpp", "java"],
    timeLimit: 3000,
    memoryLimit: 256,
    tags: ["dp", "array"]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    await Question.deleteMany({ questionType: { $in: ['MCQ', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'CODE_OUTPUT', 'DSA'] } });
    console.log("Cleared old phase 1 questions.");

    await Question.insertMany([...mcqs, ...dsas]);
    console.log("Successfully seeded 10 MCQs and 5 DSA problems!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

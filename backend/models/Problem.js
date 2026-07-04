const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  explanation: { type: String },
});

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true }, // Markdown supported
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    constraints: { type: String },
    tags: [{ type: String }],
    
    // Execution constraints
    timeLimit: { type: Number, default: 2000 }, // ms
    memoryLimit: { type: Number, default: 256 }, // MB
    
    // Code Starter Templates
    starterCode: {
      type: Map,
      of: String, // Language -> Code
      default: {
        javascript: "function solve() {\n  // Write your code here\n}\n",
        python: "def solve():\n    # Write your code here\n    pass\n",
        java: "class Solution {\n    public void solve() {\n        // Write your code here\n    }\n}\n"
      }
    },
    
    // Test Cases
    testCases: [testCaseSchema],
    
    // Additional fields for enterprise phase 1
    hints: [{ type: String }],
    editorial: { type: String },
    
    // Stats
    stats: {
      totalSubmissions: { type: Number, default: 0 },
      acceptedSubmissions: { type: Number, default: 0 },
      acceptanceRate: { type: Number, default: 0 },
    },
    
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);

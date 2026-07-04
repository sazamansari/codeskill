const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: String, required: true, index: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: ["accepted", "wrong_answer", "runtime_error", "time_limit", "compile_error"],
      required: true,
    },
    runtime: { type: String },
    memory: { type: String },
    testCasesPassed: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    category: { type: String, enum: ["Programming", "Database", "Web"] },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, problemId: 1 });
submissionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);

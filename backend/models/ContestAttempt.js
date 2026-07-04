const mongoose = require("mongoose");

const contestAttemptSchema = new mongoose.Schema(
  {
    contestId: { type: mongoose.Schema.Types.ObjectId, ref: "Contest", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // Session tracking for multiple device protection
    sessionId: { type: String, required: true },
    deviceFingerprint: { type: String },
    
    // State
    status: { 
      type: String, 
      enum: ["InProgress", "Submitted", "AutoSubmitted", "Disqualified"], 
      default: "InProgress" 
    },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    
    // Anti-Cheat tracking
    warnings: { type: Number, default: 0 },
    violations: [{
      type: { type: String }, // e.g. "FullscreenExit", "TabSwitch", "Copy", "DevTools"
      timestamp: { type: Date, default: Date.now },
      metadata: { type: mongoose.Schema.Types.Mixed }
    }],
    
    // Saved progress (Auto Save)
    savedCode: [{
      problemId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemMetadata" },
      code: { type: String },
      language: { type: String },
      lastSaved: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

// Ensure one attempt per user per contest
contestAttemptSchema.index({ contestId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("ContestAttempt", contestAttemptSchema);

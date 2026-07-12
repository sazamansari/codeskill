const mongoose = require("mongoose");

const problemEnvironmentSchema = new mongoose.Schema(
  {
    versionId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemVersion" },
    
    // Problem Environment & Type
    problemType: { 
      type: String, 
      enum: ["Algorithmic", "Database", "Frontend", "DevOps", "Interactive"], 
      default: "Algorithmic" 
    },
    supportedLanguages: [{ type: String }],
    compilerVersions: { type: Map, of: String }, // e.g. "python": "3.10", "cpp": "c++17"
    customDockerImage: { type: String }, // For DevOps/Database environments
    
    // Base Execution constraints
    timeLimit: { type: Number, default: 2000 }, // ms
    memoryLimit: { type: Number, default: 256 }, // MB
    cpuLimit: { type: Number, default: 1 }, // cores
    stackSize: { type: Number, default: 8 }, // MB
    outputLimit: { type: Number, default: 10 }, // MB
    maxSourceCodeSize: { type: Number, default: 1024 * 1024 }, // Bytes
    
    // Execution Profiles (Language-specific overrides)
    executionProfiles: {
      type: Map,
      of: {
        timeLimitMultiplier: { type: Number, default: 1 },
        memoryLimitMultiplier: { type: Number, default: 1 }
      },
      default: {}
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProblemEnvironment", problemEnvironmentSchema);

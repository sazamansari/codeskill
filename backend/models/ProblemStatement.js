const mongoose = require("mongoose");

const problemStatementSchema = new mongoose.Schema(
  {
    versionId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemVersion" },
    
    description: { type: String, required: true }, // Main problem markdown
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: { type: String },
    
    // Sample test cases that are displayed in the problem description
    sampleExamples: [
      {
        input: { type: String },
        output: { type: String },
        explanation: { type: String }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProblemStatement", problemStatementSchema);

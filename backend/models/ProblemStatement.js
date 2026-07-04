const mongoose = require("mongoose");

const problemStatementSchema = new mongoose.Schema(
  {
    metadataId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemMetadata", required: true },
    description: { type: String, required: true }, // Main problem markdown
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: { type: String },
    
    // Sample test cases that are displayed in the problem description
    samples: [
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

const mongoose = require("mongoose");

const testCaseItemSchema = new mongoose.Schema({
  input: { type: String },
  output: { type: String },
  isHidden: { type: Boolean, default: false },
  explanation: { type: String }, 
  weight: { type: Number, default: 1 }, 
});

const problemTestCaseSchema = new mongoose.Schema(
  {
    versionId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemVersion" },
    
    smallTestCases: [testCaseItemSchema],
    
    // Massive testcases stored externally
    s3BucketUrl: { type: String },
    
    // Automated generation and validation
    generatorScript: { 
      language: { type: String, default: 'python' },
      code: { type: String }
    },
    
    validatorScript: { 
      language: { type: String, default: 'python' },
      code: { type: String }
    }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProblemTestCase", problemTestCaseSchema);

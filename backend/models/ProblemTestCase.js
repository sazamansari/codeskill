const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  explanation: { type: String }, // Mainly for public test cases
  weight: { type: Number, default: 1 }, // Score weight
});

const problemTestCaseSchema = new mongoose.Schema(
  {
    metadataId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemMetadata", required: true },
    cases: [testCaseSchema],
    
    // Future integration points for massive test cases
    s3BucketUrl: { type: String },
    testCaseGeneratorCode: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProblemTestCase", problemTestCaseSchema);

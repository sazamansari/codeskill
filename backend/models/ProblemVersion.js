const mongoose = require("mongoose");

const problemVersionSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    versionNumber: { type: Number, default: 1 },
    
    status: {
      type: String,
      enum: ["Draft", "In Review", "Approved", "Published", "Archived"],
      default: "Draft"
    },
    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Private"
    },
    
    // Foreign Keys to the constituent components of this specific version
    statementId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemStatement" },
    environmentId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemEnvironment" },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemTemplate" },
    solutionId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemSolution" },
    testCaseId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemTestCase" },
    editorialId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemEditorial" },
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// A problem can only have one Published version at a time. This should be handled in logic.
module.exports = mongoose.model("ProblemVersion", problemVersionSchema);

const mongoose = require("mongoose");

const problemSolutionSchema = new mongoose.Schema(
  {
    versionId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemVersion" },
    
    // Reference Solutions (Language -> Code) - Strictly hidden from users
    referenceSolutions: { type: Map, of: String },
    
    // Custom Checker (Special Judge)
    hasCustomChecker: { type: Boolean, default: false },
    customCheckerCode: { type: Map, of: String }, // Language -> Code
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProblemSolution", problemSolutionSchema);

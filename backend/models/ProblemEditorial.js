const mongoose = require("mongoose");

const problemEditorialSchema = new mongoose.Schema(
  {
    versionId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemVersion" },
    
    content: { type: String }, // Markdown explanation
    videoUrl: { type: String }, // e.g., YouTube link
    
    timeComplexity: { type: String },
    spaceComplexity: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProblemEditorial", problemEditorialSchema);

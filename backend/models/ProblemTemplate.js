const mongoose = require("mongoose");

const problemTemplateSchema = new mongoose.Schema(
  {
    versionId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemVersion" },
    
    // Code Starter Templates (Language -> Code)
    starterCode: { type: Map, of: String },
    
    // Multi-file Project Support
    isMultiFile: { type: Boolean, default: false },
    projectFiles: [{ 
      filename: String, 
      content: String, 
      isHidden: { type: Boolean, default: false } 
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProblemTemplate", problemTemplateSchema);

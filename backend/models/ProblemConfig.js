const mongoose = require("mongoose");

const problemConfigSchema = new mongoose.Schema(
  {
    metadataId: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemMetadata", required: true },
    
    // Execution Environment
    supportedLanguages: [{ type: String }],
    
    // Execution constraints
    timeLimit: { type: Number, default: 2000 }, // ms
    memoryLimit: { type: Number, default: 256 }, // MB
    cpuLimit: { type: Number, default: 1 }, // cores
    stackSize: { type: Number, default: 8 }, // MB
    outputLimit: { type: Number, default: 10 }, // MB
    maxSourceCodeSize: { type: Number, default: 1024 * 1024 }, // Bytes
    
    // Feature Flags
    enableCustomInput: { type: Boolean, default: true },
    allowMultipleFiles: { type: Boolean, default: false },
    enableFileUpload: { type: Boolean, default: false },
    
    // Code Starter Templates (Language -> Code)
    starterCode: { type: Map, of: String },
    
    // Reference Solutions (Language -> Code) - Strictly hidden from users
    referenceSolution: { type: Map, of: String },
    
    // Custom Checker
    hasCustomChecker: { type: Boolean, default: false },
    customCheckerCode: { type: Map, of: String }, // Language -> Code
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProblemConfig", problemConfigSchema);

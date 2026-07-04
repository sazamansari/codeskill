const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    
    // Array of problem references
    problems: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProblemMetadata" }],
    
    // Access Control
    isPrivate: { type: Boolean, default: false },
    password: { type: String }, // Hashed if provided
    
    // Anti-Cheat Configuration
    antiCheatConfig: {
      enableFullscreen: { type: Boolean, default: true },
      enableCopyProtect: { type: Boolean, default: true },
      enablePasteProtect: { type: Boolean, default: true },
      enableDevToolsDetect: { type: Boolean, default: true },
      enableTabSwitchDetect: { type: Boolean, default: true },
      enableMultipleDeviceProtect: { type: Boolean, default: true },
      enableWatermark: { type: Boolean, default: true },
      warningLimit: { type: Number, default: 5 },
      autoSubmitOnViolation: { type: Boolean, default: true }
    },
    
    // Status
    isPublished: { type: Boolean, default: false },
    
    // Participants
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contest", contestSchema);

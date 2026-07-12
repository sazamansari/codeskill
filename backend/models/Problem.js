const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    tags: [{ type: String }],
    
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
    // Stats & Analytics
    dynamicDifficulty: { type: Number, default: 0 },
    stats: {
      totalSubmissions: { type: Number, default: 0 },
      acceptedSubmissions: { type: Number, default: 0 },
      acceptanceRate: { type: Number, default: 0 },
    },
    
    // Mapping Metadata
    companyTags: [{
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      frequency: { type: Number, default: 1 }
    }],
    universityTags: [{
      universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
      frequency: { type: Number, default: 1 }
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);

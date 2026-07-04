const mongoose = require("mongoose");

const problemMetadataSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    categories: [{ type: String }],
    tags: [{ type: String }],
    
    // Auth & Status
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    visibility: {
      type: String,
      enum: ["Draft", "Published", "Private"],
      default: "Draft"
    },
    
    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],

    // Stats
    stats: {
      totalSubmissions: { type: Number, default: 0 },
      acceptedSubmissions: { type: Number, default: 0 },
      acceptanceRate: { type: Number, default: 0 },
    },
    
    // Relations to other split collections
    statement: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemStatement" },
    config: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemConfig" },
    testCases: { type: mongoose.Schema.Types.ObjectId, ref: "ProblemTestCase" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProblemMetadata", problemMetadataSchema);

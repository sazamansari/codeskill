const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    skills: [{ type: String }],
    experienceLevel: {
      type: String,
      enum: ["Internship", "Entry Level", "Mid Level", "Senior Level", "Executive"],
      default: "Entry Level",
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "USD" },
    },
    location: {
      type: String,
    },
    workplaceType: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote"],
      default: "Remote",
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Closed"],
      default: "Published",
    },
    applicationDeadline: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);

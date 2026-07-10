const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Can be null if applying without an account (if allowed), but we require User here
      required: true,
    },
    stage: {
      type: String,
      enum: ["Applied", "Assessment", "Interview", "Technical Round", "HR Round", "Offer", "Hired", "Rejected"],
      default: "Applied",
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    coverLetter: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "", // Recruiter notes
    },
    assessmentScore: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// A user can only apply to a specific job once
applicationSchema.index({ job: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);

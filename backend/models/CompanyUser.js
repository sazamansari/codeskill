const mongoose = require("mongoose");

const companyUserSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Owner", "Admin", "Recruiter", "Interviewer", "HR"],
      default: "Recruiter",
    },
    designation: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Prevent a user from having multiple roles in the SAME company
companyUserSchema.index({ company: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("CompanyUser", companyUserSchema);

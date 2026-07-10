const mongoose = require("mongoose");

const studentEnrollmentSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rollNumber: {
      type: String,
      default: "", // Optional, but useful for universities
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

// A student can only be enrolled in a specific batch once
studentEnrollmentSchema.index({ batch: 1, student: 1 }, { unique: true });

// Optional: You could allow a student to only belong to ONE batch per university
studentEnrollmentSchema.index({ university: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("StudentEnrollment", studentEnrollmentSchema);

const mongoose = require("mongoose");

const universityUserSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Professor", "TPO"], // Training & Placement Officer
      default: "Professor",
    },
    department: {
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

// Prevent a user from having multiple roles in the SAME university
universityUserSchema.index({ university: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("UniversityUser", universityUserSchema);

const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Company username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9_-]+$/, "Username can only contain alphanumeric characters, underscores, and dashes"],
    },
    logo: {
      type: String,
      default: "", // URL to logo
    },
    coverImage: {
      type: String,
      default: "", // URL to cover image
    },
    industry: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    headquarters: {
      type: String,
      default: "",
    },
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+", ""],
      default: "",
    },
    foundedYear: {
      type: Number,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please add a valid email"],
    },
    phone: {
      type: String,
    },
    socialLinks: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    techStack: [{ type: String }],
    benefits: [{ type: String }],
    hiringStatus: {
      type: String,
      enum: ["Actively Hiring", "Hiring Paused", "Not Hiring"],
      default: "Actively Hiring",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);

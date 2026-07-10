const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "University name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "University username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9_-]+$/, "Username can only contain alphanumeric characters, underscores, and dashes"],
    },
    domain: {
      type: String,
      required: [true, "University domain (e.g. mit.edu) is required"],
      trim: true,
      lowercase: true,
    },
    logo: {
      type: String,
      default: "", // URL to logo
    },
    coverImage: {
      type: String,
      default: "", // URL to cover image
    },
    location: {
      type: String,
      default: "", // City, Country
    },
    website: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    tier: {
      type: String,
      enum: ["Tier 1", "Tier 2", "Tier 3", "Unranked", ""],
      default: "",
    },
    establishedYear: {
      type: Number,
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

module.exports = mongoose.model("University", universitySchema);

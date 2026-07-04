const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 50 },
    email: {
      type: String, required: [true, "Email is required"], unique: true,
      lowercase: true, match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: { type: String, minlength: 6, select: false },
    authProvider: { type: String, enum: ["local", "google", "github", "linkedin", "otp"], default: "local" },
    googleId: { type: String },
    githubId: { type: String },
    linkedinId: { type: String },
    avatar: { type: String, default: "" },
    bio: { type: String, maxlength: 200, default: "" },
    isAdmin: { type: Boolean, default: false },

    // Profile
    profile: {
      institution: { type: String, default: "" },
      role: { type: String, enum: ["student", "professional", "educator", "other"], default: "student" },
      preferredLanguage: { type: String, default: "python" },
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      fontSize: { type: Number, default: 14, min: 11, max: 22 },
    },

    // Stats
    stats: {
      totalSolved: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
      dsaSolved: { type: Number, default: 0 },
      sqlSolved: { type: Number, default: 0 },
      jsSolved: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      totalSubmissions: { type: Number, default: 0 },
      acceptedSubmissions: { type: Number, default: 0 },
      xp: { type: Number, default: 0 },
    },

    // Solved problems
    solvedProblems: [{ type: String }],
    bookmarkedProblems: [{ type: String }],

    // Badges unlocked
    badges: [
      {
        badgeId: String,
        unlockedAt: { type: Date, default: Date.now },
      },
    ],

    // Activity heatmap (last 365 days)
    activityMap: {
      type: Map,
      of: Number, // date string -> solve count
      default: {},
    },

    // Notes per problem
    notes: {
      type: Map,
      of: String, // problemId -> note text
      default: {},
    },

    // Last active
    lastActive: { type: Date, default: Date.now },
    lastSolveDate: { type: Date },
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

// Generate JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Update streak
userSchema.methods.updateStreak = function () {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (this.lastSolveDate) {
    const lastDate = this.lastSolveDate.toISOString().split("T")[0];
    if (lastDate === today) return; // Already solved today
    if (lastDate === yesterday) {
      this.stats.currentStreak += 1;
    } else {
      this.stats.currentStreak = 1;
    }
  } else {
    this.stats.currentStreak = 1;
  }

  if (this.stats.currentStreak > this.stats.longestStreak) {
    this.stats.longestStreak = this.stats.currentStreak;
  }

  this.lastSolveDate = new Date();
  this.activityMap.set(today, (this.activityMap.get(today) || 0) + 1);
};

module.exports = mongoose.model("User", userSchema);

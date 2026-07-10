const mongoose = require("mongoose");
const crypto = require("crypto");

const batchSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Batch name is required"],
      trim: true,
    },
    department: {
      type: String,
      default: "",
    },
    graduationYear: {
      type: Number,
      required: true,
    },
    inviteCode: {
      type: String,
      unique: true,
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

// Pre-save hook to generate a unique invite code if not provided
batchSchema.pre("save", async function (next) {
  if (!this.inviteCode) {
    // Generate an 8-character alphanumeric code
    const uniqueString = crypto.randomBytes(4).toString("hex").toUpperCase();
    
    // Attempt to make it slightly readable (e.g. YEAR-XXXX)
    this.inviteCode = `${this.graduationYear}-${uniqueString}`;
  }
  next();
});

// A university cannot have two batches with the exact same name
batchSchema.index({ university: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Batch", batchSchema);

const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    action: { 
      type: String, 
      required: true,
      enum: [
        "CREATED_DRAFT", 
        "UPDATED_METADATA",
        "UPDATED_STATEMENT",
        "UPDATED_ENVIRONMENT",
        "UPDATED_TEMPLATE",
        "UPDATED_SOLUTION",
        "UPDATED_TEST_CASES",
        "UPDATED_EDITORIAL",
        "SUBMITTED_FOR_REVIEW",
        "APPROVED_VERSION",
        "PUBLISHED_VERSION",
        "ARCHIVED_VERSION"
      ]
    },
    
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Problem ID or Version ID
    
    details: { type: String }, // Additional context, e.g., "Updated Python time limits"
  },
  { timestamps: true }
);

// Index for fast retrieval of logs for a specific problem or user
auditLogSchema.index({ targetId: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);

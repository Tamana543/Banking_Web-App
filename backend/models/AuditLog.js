import mongoose from "mongoose";
const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "loan_approved",
        "loan_rejected",
        "user_suspended",
        "user_reactivated",
        "user_unlocked",
      ],
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);
const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the user performing the action
      required: true,
    },
    action: {
      type: String,
      enum: ["CREATE", "READ", "UPDATE", "DELETE"],
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientRecord", // The affected patient record
      required: true,
    },
    details: {
      type: String, // Additional details like field changes
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);

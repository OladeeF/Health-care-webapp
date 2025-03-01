const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Links to User model

    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },

    emergencyContact: {
      name: { type: String, required: false },
      phone: { type: String, required: false },
      relationship: { type: String, required: false },
    },

    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      required: true,
    },

    medicalHistory: [{ type: String }], // List of past conditions, surgeries, allergies

    insurance: {
      provider: { type: String, required: false },
      policyNumber: { type: String, required: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);

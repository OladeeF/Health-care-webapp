const mongoose = require("mongoose");

const PatientRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  diagnosis: { type: String, required: true },
  prescriptions: [{ type: String }],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PatientRecord", PatientRecordSchema);

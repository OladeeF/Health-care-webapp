const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  role: { type: String, enum: ["doctor", "patient", "admin"], required: true },
  specialization: { type: String }, // Only for doctors
});

// Create a text index for fast searching across fields
UserSchema.index({ name: "text", email: "text", specialization: "text" });

module.exports = mongoose.model("User", UserSchema);

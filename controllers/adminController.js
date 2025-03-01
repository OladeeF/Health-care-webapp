const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const fs = require("fs");
const path = require("path");
const { body, param, validationResult } = require("express-validator");

// Log admin actions
const logAdminAction = (action, user, req) => {
  const logFilePath = path.join(__dirname, "../logs/adminLogs.log");
  const logMessage = `${new Date().toISOString()} - ${action} - Admin ID: ${
    user.id
  } (${user.role}) - IP: ${req.ip}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Logging error:", err);
  });
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().select("-password").skip(skip).limit(limit);
    const total = await User.countDocuments();

    res.status(200).json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      logAdminAction(
        `Attempted to delete non-existent user with ID ${req.params.userId}`,
        req.user,
        req
      );
      return res.status(404).json({ message: "User not found" });
    }

    logAdminAction(`Deleted user with ID ${req.params.userId}`, req.user, req);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Validate update doctor status input
exports.validateUpdateDoctorStatus = [
  param("doctorId").isMongoId().withMessage("Invalid doctor ID"),
  body("status").isIn(["approved", "rejected"]).withMessage("Invalid status"),
];

// Approve or reject a doctor (Admin only)
exports.updateDoctorStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { status } = req.body;
    const doctor = await Doctor.findById(req.params.doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.status = status;
    await doctor.save();

    logAdminAction(
      `Updated doctor status to ${status} for doctor ID ${req.params.doctorId}`,
      req.user,
      req
    );

    res
      .status(200)
      .json({ message: `Doctor status updated to ${status}`, doctor });
  } catch (error) {
    console.error("Error updating doctor status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all appointments (Admin only)
exports.getAllAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find()
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization")
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments();

    res.status(200).json({
      appointments,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an appointment (Admin only)
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(
      req.params.appointmentId
    );
    if (!appointment) {
      logAdminAction(
        `Attempted to delete non-existent appointment with ID ${req.params.appointmentId}`,
        req.user,
        req
      );
      return res.status(404).json({ message: "Appointment not found" });
    }

    logAdminAction(
      `Deleted appointment with ID ${req.params.appointmentId}`,
      req.user,
      req
    );

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all patients (Admin only)
exports.getAllPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const patients = await Patient.find()
      .select("-password")
      .skip(skip)
      .limit(limit);
    const total = await Patient.countDocuments();

    res.status(200).json({
      patients,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a patient (Admin only)
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.patientId);
    if (!patient) {
      logAdminAction(
        `Attempted to delete non-existent patient with ID ${req.params.patientId}`,
        req.user,
        req
      );
      return res.status(404).json({ message: "Patient not found" });
    }

    logAdminAction(
      `Deleted patient with ID ${req.params.patientId}`,
      req.user,
      req
    );

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a patient's details (Admin only)
exports.updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      { $set: req.body }, // Allow partial updates
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    logAdminAction(
      `Updated patient with ID ${req.params.patientId}`,
      req.user,
      req
    );

    res
      .status(200)
      .json({ message: "Patient updated successfully", updatedPatient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

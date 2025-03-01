const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const fs = require("fs");
const path = require("path");

const logAdminAction = (action, user) => {
  const logFilePath = path.join(__dirname, "../logs/adminLogs.log");
  const logMessage = `${new Date().toISOString()} - ${action} - Admin ID: ${
    user.id
  } (${user.role})\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Logging error:", err);
  });
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    logAdminAction(`Deleted user with ID ${req.params.userId}`, req.user);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Approve or reject a doctor
exports.updateDoctorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const doctor = await Doctor.findById(req.params.doctorId);

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.status = status;
    await doctor.save();

    logAdminAction(`Updated doctor status to ${status}`, req.user);

    res
      .status(200)
      .json({ message: `Doctor status updated to ${status}`, doctor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all appointments (Admin only)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete an appointment (Admin only)
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(
      req.params.appointmentId
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    logAdminAction(
      `Deleted appointment with ID ${req.params.appointmentId}`,
      req.user
    );
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all patients (Admin only)
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password");
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a patient (Admin only)
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    logAdminAction(`Deleted patient with ID ${req.params.patientId}`, req.user);

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a patient's details (Admin only)
exports.updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPatient)
      return res.status(404).json({ message: "Patient not found" });


    logAdminAction(`Updated patient with ID ${req.params.patientId}`, req.user);

    res
      .status(200)
      .json({ message: "Patient updated successfully", updatedPatient });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

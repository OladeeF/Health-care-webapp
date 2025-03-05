const Appointment = require("../models/Appointment");
const fs = require("fs");
const path = require("path");

const logAppointmentAction = (action, appointment, user) => {
  const logFilePath = path.join(__dirname, "../logs/appointmentLogs.log");
  const logMessage = `${new Date().toISOString()} - ${action} - Appointment ID: ${
    appointment._id
  }, Patient: ${appointment.patientId}, Doctor: ${
    appointment.doctorId
  }, User: ${user.id} (${user.role})\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Logging error:", err);
  });
};

// Patient requests an appointment
exports.requestAppointment = async (req, res) => {
  const { doctorId, date, time } = req.body;

  try {
    const newAppointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      status: "Pending",
    });

    await newAppointment.save();
    res
      .status(201)
      .json({ message: "Appointment request sent", newAppointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Doctor approves an appointment
exports.approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.doctorId.toString() !== req.user.id)
      return res
        .status(403)
        .json({
          message: "Access Denied: You can only approve your own appointments",
        });

    appointment.status = "Approved";
    await appointment.save();

    logAppointmentAction("Approved", appointment, req.user);
    res.status(200).json({ message: "Appointment approved", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Doctor rejects an appointment
exports.rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.doctorId.toString() !== req.user.id)
      return res
        .status(403)
        .json({
          message: "Access Denied: You can only reject your own appointments",
        });

    appointment.status = "Rejected";
    await appointment.save();

    logAppointmentAction("Rejected", appointment, req.user);

    res.status(200).json({ message: "Appointment rejected", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all appointments for a doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user.id,
    }).populate("patientId", "name email");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all appointments for a patient
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id,
    }).populate("doctorId", "specialization");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

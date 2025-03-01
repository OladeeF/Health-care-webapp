const express = require("express");
const {
  requestAppointment,
  approveAppointment,
  rejectAppointment,
  getDoctorAppointments,
  getPatientAppointments,
} = require("../controllers/appointmentController");

const {
  authMiddleware,
  doctorMiddleware,
  patientMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Patient requests an appointment
router.post("/request", authMiddleware, patientMiddleware, requestAppointment);

// Doctor actions on appointment
router.put(
  "/:appointmentId/approve",
  authMiddleware,
  doctorMiddleware,
  approveAppointment
);
router.put(
  "/:appointmentId/reject",
  authMiddleware,
  doctorMiddleware,
  rejectAppointment
);

// Fetch appointments
router.get("/doctor", authMiddleware, doctorMiddleware, getDoctorAppointments);
router.get(
  "/patient",
  authMiddleware,
  patientMiddleware,
  getPatientAppointments
);

module.exports = router;

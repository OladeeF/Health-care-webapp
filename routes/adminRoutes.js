const express = require("express");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const {
  getAllUsers,
  deleteUser,
  updateDoctorStatus,
  getAllAppointments,
  deleteAppointment,
  getAllPatients,
  deletePatient,
  updatePatient,
} = require("../controllers/adminController");

const router = express.Router();

// User management
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/user/:userId", authMiddleware, adminMiddleware, deleteUser);

// Doctor management
router.put(
  "/doctor/:doctorId/status",
  authMiddleware,
  adminMiddleware,
  updateDoctorStatus
);

// Appointment management
router.get(
  "/appointments",
  authMiddleware,
  adminMiddleware,
  getAllAppointments
);
router.delete(
  "/appointment/:appointmentId",
  authMiddleware,
  adminMiddleware,
  deleteAppointment
);

// Patient management
router.get("/patients", authMiddleware, adminMiddleware, getAllPatients);
router.delete(
  "/patient/:patientId",
  authMiddleware,
  adminMiddleware,
  deletePatient
);
router.put(
  "/patient/:patientId",
  authMiddleware,
  adminMiddleware,
  updatePatient
);

module.exports = router;

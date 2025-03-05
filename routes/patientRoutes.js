const express = require("express");
const {
  getPatients,
  getPatientById,
  updatePatientProfile,
  deletePatient,
} = require("../controllers/patientController");
const {
  authMiddleware,
  adminMiddleware,
  patientMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Only Admins can view all patients
router.get("/", authMiddleware, adminMiddleware, getPatients);

// 🔹 Patients can view their own profile, and Admins can access any patient's profile
router.get("/:patientId", authMiddleware, patientMiddleware, getPatientById);

// 🔹 Patients can update their own profile
router.put("/update", authMiddleware, patientMiddleware, updatePatientProfile);

// 🔹 Only Admins can delete a patient account
router.delete(
  "/delete/:patientId",
  authMiddleware,
  adminMiddleware,
  deletePatient
);

module.exports = router;

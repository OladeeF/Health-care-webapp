const express = require("express");
const {
  registerDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
  deleteDoctor,
  searchDoctors,
} = require("../controllers/doctorController");
const {
  authMiddleware,
  doctorMiddleware,
  adminMiddleware,
  patientMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Doctor management routes
router.post("/register", authMiddleware, adminMiddleware, registerDoctor); // Admin only
router.get("/", authMiddleware, getAllDoctors);
router.get("/search", authMiddleware, patientMiddleware, searchDoctors);
router.get("/:doctorId", authMiddleware, getDoctorById);
router.put("/:doctorId", authMiddleware, doctorMiddleware, updateDoctorProfile); // Doctor only
router.delete("/:doctorId", authMiddleware, adminMiddleware, deleteDoctor); // Admin only

module.exports = router;

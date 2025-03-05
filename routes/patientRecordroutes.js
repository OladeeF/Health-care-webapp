const express = require("express");
const {
  createRecord,
  getPatientRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/patientRecordController");
const {
  authMiddleware,
  doctorMiddleware,
  patientMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for managing patient records
router.post("/create", authMiddleware, doctorMiddleware, createRecord); // Only doctors can create records
router.get("/:patientId", authMiddleware, patientMiddleware, getPatientRecords); // Patients can only view their own records, doctors can view any
router.put("/update/:recordId", authMiddleware, doctorMiddleware, updateRecord); // Only doctors can update records
router.delete(
  "/delete/:recordId",
  authMiddleware,
  doctorMiddleware,
  deleteRecord
); // Only doctors can delete records

module.exports = router;

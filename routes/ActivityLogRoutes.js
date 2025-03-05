const express = require("express");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const { getActivityLogs } = require("../controllers/activityLogController");

const router = express.Router();

// ✅ Only admins can view all logs
router.get("/", authMiddleware, adminMiddleware, getActivityLogs);

module.exports = router;

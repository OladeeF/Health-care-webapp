const ActivityLog = require("../models/ActivityLog");

exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("user", "name role") // Show user details
      .populate("target", "diagnosis treatment") // Show affected record details
      .sort({ timestamp: -1 }); // Sort by latest first

    res.json({ success: true, logs });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

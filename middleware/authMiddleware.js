const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Log unauthorized access attempts
const logUnauthorizedAttempt = (message, req) => {
  const logFilePath = path.join(__dirname, "../logs/unauthorizedAccess.log");
  const logMessage = `${new Date().toISOString()} - ${req.method} ${
    req.originalUrl
  } - ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Logging error:", err);
  });
};

// Middleware to check if a user is authenticated
exports.authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    logUnauthorizedAttempt("No token provided", req);
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    logUnauthorizedAttempt("Invalid token", req);
    res.status(401).json({ message: "Invalid Token" });
  }
};

// Middleware to restrict access to doctors only
exports.doctorMiddleware = (req, res, next) => {
  if (req.user.role !== "doctor") {
    logUnauthorizedAttempt("Unauthorized doctor access attempt", req);
    return res.status(403).json({ message: "Access Denied: Doctors Only" });
  }
  next();
};

// Middleware to allow only patients to view their own records
exports.patientMiddleware = (req, res, next) => {
  const { patientId } = req.params;

  if (req.user.role === "doctor") {
    return next(); // Doctors can access any patient's records
  }

  if (req.user.role === "patient" && req.user.id !== patientId) {
    logUnauthorizedAttempt("Unauthorized patient record access attempt", req);
    return res
      .status(403)
      .json({ message: "Access Denied: You can only view your own records" });
  }

  next();
};

// Middleware to restrict admin-only actions
exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    logUnauthorizedAttempt("Unauthorized admin access attempt", req);
    return res.status(403).json({ message: "Access Denied: Admins Only" });
  }
  next();
};

exports.patientRecordMiddleware = (req, res, next) => {
  if (req.user.role === "doctor") {
    return next(); // Doctors can access any patient record
  }

  if (req.user.role === "admin") {
    return res
      .status(403)
      .json({ message: "Admins cannot access patient records directly." });
  }

  if (req.user.role === "patient" && req.user.id !== req.params.patientId) {
    return res
      .status(403)
      .json({ message: "You can only view your own records." });
  }

  next();
};

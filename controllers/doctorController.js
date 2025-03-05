const Doctor = require("../models/Doctor");
const User = require("../models/User");

exports.searchDoctors = async (req, res) => {
  try {
    const { specialty, name } = req.query;
    let query = {};

    if (specialty) {
      query.specialty = { $regex: specialty, $options: "i" }; // Case-insensitive search
    }

    if (name) {
      query.name = { $regex: name, $options: "i" }; // Allow name-based search
    }

    const doctors = await Doctor.find(query).select("-password");

    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error searching for doctors:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// Register Doctor (Admin Only)
exports.registerDoctor = async (req, res) => {
  const { userId, specialization, experience, availability } = req.body;

  try {
    const doctorExists = await Doctor.findOne({ userId });
    if (doctorExists)
      return res.status(400).json({ message: "Doctor already registered" });

    const newDoctor = new Doctor({
      userId,
      specialization,
      experience,
      availability,
    });
    await newDoctor.save();

    res
      .status(201)
      .json({ message: "Doctor registered successfully", newDoctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId).populate(
      "userId",
      "name email"
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Doctor Profile (Doctor Only)
exports.updateDoctorProfile = async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.doctorId,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Doctor profile updated", updatedDoctor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Doctor Profile (Admin Only)
exports.deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.doctorId);
    res.status(200).json({ message: "Doctor profile deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

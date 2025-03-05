const Patient = require("../models/Patient");
const ActivityLog = require("../models/ActivityLog");

// 🟢 Get All Patients (Admins Only)
exports.getPatients = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const totalPatients = await Patient.countDocuments();
    const patients = await Patient.find()
      .select("-password")
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      totalPages: Math.ceil(totalPatients / limit),
      currentPage: page,
      totalPatients,
      patients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔵 Get Patient By ID (Patients can see only their own data)
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId).select(
      "-password"
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ success: true, patient });

    // ✅ Log the action
    await ActivityLog.create({
      user: req.user.id,
      action: "READ",
      target: req.params.patientId,
      details: `Viewed patient profile ${req.params.patientId}`,
    });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🟡 Update Patient Profile (Patients Only)
exports.updatePatientProfile = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, patient: updatedPatient });

    // ✅ Log the action
    await ActivityLog.create({
      user: req.user.id,
      action: "UPDATE",
      target: req.user.id,
      details: `Updated profile details`,
    });
  } catch (error) {
    console.error("Error updating patient profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔴 Delete Patient (Admins Only)
exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.patientId);

    res.json({ success: true, message: "Patient account deleted" });

    // ✅ Log the action
    await ActivityLog.create({
      user: req.user.id,
      action: "DELETE",
      target: req.params.patientId,
      details: `Deleted patient ${req.params.patientId}`,
    });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

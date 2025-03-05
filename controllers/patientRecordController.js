const ActivityLog = require("../models/ActivityLog");
const PatientRecord = require("../models/PatientRecord");

// 🟢 Create Patient Record (Doctors Only)
exports.createRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, treatment } = req.body;
    const newRecord = await PatientRecord.create({
      patientId,
      diagnosis,
      treatment,
    });

    // ✅ Log the action
    await ActivityLog.create({
      user: req.user.id,
      action: "CREATE",
      target: newRecord._id,
      details: `Created a new record for patient ${patientId}`,
    });

    res.status(201).json({ success: true, record: newRecord });
  } catch (error) {
    console.error("Error creating patient record:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔵 Get Patient Records (Doctors & Patients)
exports.getPatientRecords = async (req, res) => {
  try {
    const records = await PatientRecord.find({
      patientId: req.params.patientId,
    });

    // ✅ Log the action
    await ActivityLog.create({
      user: req.user.id,
      action: "READ",
      target: req.params.patientId,
      details: `Viewed records of patient ${req.params.patientId}`,
    });

    res.json({ success: true, records });
  } catch (error) {
    console.error("Error fetching patient records:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🟡 Update Patient Record (Doctors Only)
exports.updateRecord = async (req, res) => {
  try {
    const updatedRecord = await PatientRecord.findByIdAndUpdate(
      req.params.recordId,
      req.body,
      { new: true }
    );

    // ✅ Log the action
    await ActivityLog.create({
      user: req.user.id,
      action: "UPDATE",
      target: updatedRecord._id,
      details: `Updated record ${req.params.recordId}`,
    });

    res.json({ success: true, record: updatedRecord });
  } catch (error) {
    console.error("Error updating patient record:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔴 Delete Patient Record (Doctors Only)
exports.deleteRecord = async (req, res) => {
  try {
    await PatientRecord.findByIdAndDelete(req.params.recordId);

    // ✅ Log the action
    await ActivityLog.create({
      user: req.user.id,
      action: "DELETE",
      target: req.params.recordId,
      details: `Deleted record ${req.params.recordId}`,
    });

    res.json({ success: true, message: "Record deleted" });
  } catch (error) {
    console.error("Error deleting patient record:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

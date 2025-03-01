const User = require("../models/User");

exports.searchUsers = async (req, res) => {
  try {
    const {
      role,
      query,
      page = 1,
      limit = 10,
      sortBy = "relevance",
      order = "asc",
    } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    if (!query) {
      return res.status(400).json({ message: "Please enter a search query" });
    }

    let filter = {};
    let sortOption = {};
    const userRole = req.user.role; // Get the role of the logged-in user

    // 🔒 Restrict searches based on role
    if (userRole === "admin") {
      // Admin can search for both doctors and patients
      if (role === "doctor") {
        filter = {
          role: "doctor",
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { specialization: { $regex: query, $options: "i" } },
          ],
        };
      } else if (role === "patient") {
        filter = {
          role: "patient",
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        };
      } else {
        return res.status(400).json({
          message: "Invalid role. Admin can search for 'doctor' or 'patient'.",
        });
      }
    } else if (userRole === "doctor") {
      // Doctors can only search for patients
      if (role === "patient") {
        filter = {
          role: "patient",
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        };
      } else {
        return res.status(403).json({
          message: "Access Denied: Doctors can only search for patients.",
        });
      }
    } else if (userRole === "patient") {
      // Patients can only search for doctors
      if (role === "doctor") {
        filter = {
          role: "doctor",
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { specialization: { $regex: query, $options: "i" } },
          ],
        };
      } else {
        return res.status(403).json({
          message: "Access Denied: Patients can only search for doctors.",
        });
      }
    } else {
      return res
        .status(403)
        .json({ message: "Access Denied: Invalid user role." });
    }

    // Sorting logic
    if (sortBy === "name") {
      sortOption = { name: sortOrder };
    } else if (sortBy === "specialization" && role === "doctor") {
      sortOption = { specialization: sortOrder };
    } else {
      sortOption = { score: { $meta: "textScore" } }; // Sort by relevance
    }

    // Count total matching results
    const totalResults = await User.countDocuments(filter);

    // Fetch paginated & sorted results
    const results = await User.find(filter)
      .select("-password")
      .sort(sortOption)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    if (results.length === 0) {
      return res.status(404).json({ message: "No matches found" });
    }

    res.status(200).json({
      totalResults,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalResults / limitNumber),
      results,
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

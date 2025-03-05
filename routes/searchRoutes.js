const express = require("express");
const { searchUsers } = require("../controllers/searchController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Secure search route
router.get("/", authMiddleware, searchUsers);

module.exports = router;

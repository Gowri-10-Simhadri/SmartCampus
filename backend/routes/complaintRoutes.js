const express = require("express");

const Complaint = require("../models/Complaint");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new complaint
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Check required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and category are required",
      });
    }

    // Create complaint for logged-in student
    const complaint = await Complaint.create({
      student: req.user.userId,
      title,
      description,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while creating complaint",
    });
  }
});

// Get complaints submitted by logged-in student
router.get("/my", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      student: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Get complaints error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching complaints",
    });
  }
});

module.exports = router;
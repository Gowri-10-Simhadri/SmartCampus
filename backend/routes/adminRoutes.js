const express = require("express");
const Complaint = require("../models/Complaint");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// ADMIN CHECK MIDDLEWARE
// ==========================================
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};

// ==========================================
// GET ALL COMPLAINTS
// GET /api/admin/complaints
// ==========================================
router.get("/complaints", protect, adminOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Get admin complaints error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching complaints",
    });
  }
});

// ==========================================
// UPDATE COMPLAINT STATUS
// PUT /api/admin/complaints/:id/status
// ==========================================
router.put(
  "/complaints/:id/status",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;

      // Validate status
      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint status",
        });
      }

      // Find complaint
      const complaint = await Complaint.findById(id);

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      // Update status
      complaint.status = status;

      await complaint.save();

      res.status(200).json({
        success: true,
        message: "Complaint status updated successfully",
        complaint,
      });
    } catch (error) {
      console.error("Update complaint status error:", error);

      res.status(500).json({
        success: false,
        message: "Server error while updating complaint status",
      });
    }
  }
);

module.exports = router;
const express = require("express");
const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");
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
// 1. GET ALL COMPLAINTS (WITH FILTERS & SEARCH)
// GET /api/admin/complaints
// ==========================================
router.get("/complaints", protect, adminOnly, async (req, res) => {
  try {
    const { search, status, category, priority, sort } = req.query;

    const query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (priority && priority !== "All") {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { assignedTo: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "priority") sortOption = { priority: -1, createdAt: -1 };

    const complaints = await Complaint.find(query)
      .populate("student", "name email")
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: complaints.length,
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
// 2. GET REAL DASHBOARD METRICS & ANALYTICS
// GET /api/admin/stats
// ==========================================
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "Pending" });
    const underReview = await Complaint.countDocuments({ status: "Under Review" });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });
    const rejected = await Complaint.countDocuments({ status: "Rejected" });

    const resolutionRate =
      total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Category aggregation
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Priority aggregation
    const priorityStats = await Complaint.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    // Recent 5 complaints for live pulse
    const recentActivity = await Complaint.find()
      .populate("student", "name email")
      .sort({ updatedAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        total,
        pending,
        underReview,
        inProgress,
        resolved,
        rejected,
        resolutionRate,
        categoryStats,
        priorityStats,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while calculating statistics",
    });
  }
});

// ==========================================
// 3. GET SINGLE COMPLAINT
// GET /api/admin/complaints/:id
// ==========================================
router.get("/complaints/:id", protect, adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "student",
      "name email"
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching complaint",
    });
  }
});

// ==========================================
// 4. UPDATE COMPLAINT STATUS
// PUT /api/admin/complaints/:id/status
// ==========================================
router.put("/complaints/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status, comment, resolutionNotes } = req.body;
    const { id } = req.params;

    const allowedStatuses = [
      "Pending",
      "Under Review",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const previousStatus = complaint.status;
    complaint.status = status;

    if (resolutionNotes) {
      complaint.resolutionNotes = resolutionNotes;
    }

    if (status === "Resolved") {
      complaint.resolvedAt = new Date();
    }

    // Append to timeline
    complaint.timeline.push({
      status,
      comment: comment || `Status updated from ${previousStatus} to ${status}`,
      updatedBy: "Admin",
      timestamp: new Date(),
    });

    await complaint.save();

    // Notify the student about the status update
    await Notification.create({
      user: complaint.student,
      title: `Complaint Status: ${status}`,
      message: `Your complaint "${complaint.title}" has been updated to "${status}". ${comment || ""}`.trim(),
      type: status === "Resolved" ? "resolution" : "status_change",
      complaintId: complaint._id,
    });

    res.status(200).json({
      success: true,
      message: `Complaint status updated to ${status}`,
      complaint,
    });
  } catch (error) {
    console.error("Update complaint status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating complaint status",
    });
  }
});

// ==========================================
// 5. ASSIGN COMPLAINT TO STAFF / DEPARTMENT
// PUT /api/admin/complaints/:id/assign
// ==========================================
router.put("/complaints/:id/assign", protect, adminOnly, async (req, res) => {
  try {
    const { assignedTo, comment } = req.body;
    const { id } = req.params;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Assigned staff or department is required",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.assignedTo = assignedTo;
    if (complaint.status === "Pending") {
      complaint.status = "Under Review";
    }

    complaint.timeline.push({
      status: complaint.status,
      comment: comment || `Assigned to ${assignedTo}`,
      updatedBy: "Admin",
      timestamp: new Date(),
    });

    await complaint.save();

    // Notify student
    await Notification.create({
      user: complaint.student,
      title: "Complaint Assigned",
      message: `Your complaint "${complaint.title}" was assigned to ${assignedTo}.`,
      type: "assignment",
      complaintId: complaint._id,
    });

    res.json({
      success: true,
      message: `Complaint assigned to ${assignedTo}`,
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while assigning complaint",
    });
  }
});

module.exports = router;
const express = require("express");
const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// 1. CREATE A NEW COMPLAINT
// POST /api/complaints
// ==========================================
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category, location, priority, imageUrl } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and category are required",
      });
    }

    const complaint = await Complaint.create({
      student: req.user.userId,
      title: title.trim(),
      description: description.trim(),
      category,
      location: location?.trim() || "Main Campus",
      priority: priority || "Medium",
      imageUrl: imageUrl?.trim() || "",
      status: "Pending",
      timeline: [
        {
          status: "Pending",
          comment: "Complaint submitted by student",
          updatedBy: "Student",
          timestamp: new Date(),
        },
      ],
    });

    // Create confirmation notification for the student
    await Notification.create({
      user: req.user.userId,
      title: "Complaint Submitted",
      message: `Your complaint "${complaint.title}" has been registered (Ticket #${complaint._id.toString().slice(-6)}).`,
      type: "submission",
      complaintId: complaint._id,
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
      message: error.message || "Server error while creating complaint",
    });
  }
});

// ==========================================
// 2. GET COMPLAINTS SUBMITTED BY LOGGED-IN STUDENT
// GET /api/complaints/my
// ==========================================
router.get("/my", protect, async (req, res) => {
  try {
    const { search, status, category, priority, sort } = req.query;

    const query = { student: req.user.userId };

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
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "priority") sortOption = { priority: -1, createdAt: -1 };

    const complaints = await Complaint.find(query).sort(sortOption);

    res.json({
      success: true,
      count: complaints.length,
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

// ==========================================
// 3. GET NOTIFICATIONS FOR LOGGED-IN USER
// GET /api/complaints/notifications
// ==========================================
router.get("/notifications", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      user: req.user.userId,
      isRead: false,
    });

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching notifications",
    });
  }
});

// ==========================================
// 4. MARK SINGLE NOTIFICATION AS READ
// PATCH /api/complaints/notifications/:id/read
// ==========================================
router.patch("/notifications/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating notification",
    });
  }
});

// ==========================================
// 5. MARK ALL NOTIFICATIONS AS READ
// PATCH /api/complaints/notifications/read-all
// ==========================================
router.patch("/notifications/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.userId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error marking notifications as read",
    });
  }
});

// ==========================================
// 6. GET SINGLE COMPLAINT DETAILS
// GET /api/complaints/:id
// ==========================================
router.get("/:id", protect, async (req, res) => {
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

    // Ensure only the student owner or an admin can view it
    if (
      req.user.role !== "admin" &&
      complaint.student._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own complaints.",
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get complaint by ID error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching complaint details",
    });
  }
});

module.exports = router;
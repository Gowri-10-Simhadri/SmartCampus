const mongoose = require("mongoose");

const timelineEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
    updatedBy: {
      type: String,
      default: "System",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Electrical",
        "Water",
        "Cleanliness",
        "Internet",
        "Infrastructure",
        "Classroom",
        "Hostel",
        "Security",
        "Other",
      ],
      required: true,
      default: "Other",
    },

    location: {
      type: String,
      trim: true,
      default: "Campus Grounds",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    assignedTo: {
      type: String,
      trim: true,
      default: "Unassigned",
    },

    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Under Review", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },

    resolutionNotes: {
      type: String,
      default: "",
    },

    resolvedAt: {
      type: Date,
    },

    timeline: [timelineEventSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance querying on Atlas
complaintSchema.index({ student: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
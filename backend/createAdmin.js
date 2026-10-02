const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");
const Complaint = require("./models/Complaint");
const Notification = require("./models/Notification");

dotenv.config();

const createAdminAndSeed = async () => {
  try {
    await connectDB();

    // 1. Ensure Admin Account
    const adminEmail = "admin@smartcampus.com";
    const adminPassword = "Admin@12345";

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = await User.create({
        name: "SmartCampus Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("✓ Admin account created successfully.");
      console.log(`  Email: ${admin.email}`);
      console.log(`  Password: ${adminPassword}`);
    } else {
      console.log(`✓ Admin account exists: ${admin.email}`);
    }

    // 2. Ensure Demo Student Account
    const studentEmail = "student@smartcampus.com";
    const studentPassword = "Student@12345";

    let student = await User.findOne({ email: studentEmail });

    if (!student) {
      const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);
      student = await User.create({
        name: "Alex Johnson",
        email: studentEmail,
        password: hashedStudentPassword,
        role: "student",
      });
      console.log("✓ Demo Student account created successfully.");
      console.log(`  Email: ${student.email}`);
      console.log(`  Password: ${studentPassword}`);
    } else {
      console.log(`✓ Demo Student account exists: ${student.email}`);
    }

    // 3. Seed initial complaints if none exist for student
    const existingComplaintsCount = await Complaint.countDocuments({
      student: student._id,
    });

    if (existingComplaintsCount === 0) {
      console.log("Seeding sample complaints for student...");

      const c1 = await Complaint.create({
        student: student._id,
        title: "Broken Air Conditioning in Computer Lab 3",
        description:
          "The main AC unit in Computer Lab 3 has been leaking water and is not cooling properly during afternoon lectures.",
        category: "Electrical",
        location: "Engineering Block B, Room 302",
        priority: "High",
        assignedTo: "Campus HVAC & Electrical Dept",
        status: "In Progress",
        timeline: [
          {
            status: "Pending",
            comment: "Complaint submitted by student",
            updatedBy: "Student",
            timestamp: new Date(Date.now() - 48 * 3600 * 1000),
          },
          {
            status: "Under Review",
            comment: "Reviewed by facilities administrator",
            updatedBy: "Admin",
            timestamp: new Date(Date.now() - 36 * 3600 * 1000),
          },
          {
            status: "In Progress",
            comment: "Technician assigned; replacement valve ordered",
            updatedBy: "Admin",
            timestamp: new Date(Date.now() - 12 * 3600 * 1000),
          },
        ],
      });

      const c2 = await Complaint.create({
        student: student._id,
        title: "Water Filter Leakage near Central Library",
        description:
          "Water dispenser on the 2nd floor of the central library has a clogged drain causing water to pool on the floor.",
        category: "Water",
        location: "Central Library, 2nd Floor East Wing",
        priority: "Medium",
        assignedTo: "Plumbing Services",
        status: "Resolved",
        resolutionNotes: "Replaced filter cartridge and cleared drainage pipe. Tested OK.",
        resolvedAt: new Date(Date.now() - 6 * 3600 * 1000),
        timeline: [
          {
            status: "Pending",
            comment: "Complaint submitted by student",
            updatedBy: "Student",
            timestamp: new Date(Date.now() - 72 * 3600 * 1000),
          },
          {
            status: "In Progress",
            comment: "Plumbing team dispatched",
            updatedBy: "Admin",
            timestamp: new Date(Date.now() - 24 * 3600 * 1000),
          },
          {
            status: "Resolved",
            comment: "Filter cleared and sanitized",
            updatedBy: "Admin",
            timestamp: new Date(Date.now() - 6 * 3600 * 1000),
          },
        ],
      });

      const c3 = await Complaint.create({
        student: student._id,
        title: "Wi-Fi Router Dead Spot in Study Hall",
        description:
          "Wi-Fi signal drops completely in the quiet study corner of Block C. Multiple students unable to access academic portals.",
        category: "Internet",
        location: "Academic Block C, Study Hall 1",
        priority: "High",
        assignedTo: "Campus IT Services",
        status: "Pending",
        timeline: [
          {
            status: "Pending",
            comment: "Complaint submitted by student",
            updatedBy: "Student",
            timestamp: new Date(Date.now() - 4 * 3600 * 1000),
          },
        ],
      });

      // Create initial notifications
      await Notification.create([
        {
          user: student._id,
          title: "Complaint Resolved",
          message:
            'Your complaint "Water Filter Leakage near Central Library" has been resolved.',
          type: "resolution",
          complaintId: c2._id,
          isRead: false,
        },
        {
          user: student._id,
          title: "Technician Dispatched",
          message:
            'Your complaint "Broken Air Conditioning in Computer Lab 3" is now In Progress with Campus HVAC.',
          type: "status_change",
          complaintId: c1._id,
          isRead: false,
        },
        {
          user: student._id,
          title: "Complaint Received",
          message:
            'Your complaint "Wi-Fi Router Dead Spot in Study Hall" has been received and queued for review.',
          type: "submission",
          complaintId: c3._id,
          isRead: true,
        },
      ]);

      console.log("✓ Sample complaints and notifications seeded successfully.");
    }

    console.log("\nSetup and seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error setting up data:", error.message);
    process.exit(1);
  }
};

createAdminAndSeed();
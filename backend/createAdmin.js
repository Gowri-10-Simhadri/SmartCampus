const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@smartcampus.com";
    const adminPassword = "Admin@12345";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await User.create({
      name: "SmartCampus Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully.");
    console.log(`Email: ${admin.email}`);
    console.log("Role: admin");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
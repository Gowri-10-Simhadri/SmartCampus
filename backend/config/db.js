const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
    throw error;
  }
};

module.exports = connectDB;
const mongoose = require("mongoose");
const dns = require("dns");

// Ensure robust SRV lookup across varied DNS environments (especially Windows / restricted ISPs)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // Ignore if custom dns servers cannot be set in some environments
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI environment variable is missing. Please define it in your .env file."
    );
  }

  try {
    console.log("Connecting to MongoDB Atlas...");

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      autoIndex: true,
    });

    isConnected = true;
    console.log(`✓ MongoDB Atlas connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("✗ MongoDB Atlas connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
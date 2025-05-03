import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("⚠️ MongoDB URI is missing! Check your .env file.");
}

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ MongoDB already connected.");
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🚀 MongoDB Connected:", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default dbConnect; // ✅ Ensure it's a default export

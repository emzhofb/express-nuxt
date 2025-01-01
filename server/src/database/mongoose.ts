import mongoose from "mongoose";

// Konfigurasi MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';

export const connectToMongoDB = async () => {
  try {
    // Koneksi ke database target
    await mongoose.connect(mongoURI, {
      dbName: process.env.MONGO_DATABASE,
    });

    console.log(`Database "${mongoURI}" connected successfully.`);
  } catch (error) {
    console.error("Error connecting database:", error);
  }
};

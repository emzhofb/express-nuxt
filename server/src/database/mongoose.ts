import mongoose from "mongoose";

// Konfigurasi MongoDB
const mongoURI = `${process.env.MONGO_URI}/${process.env.MONGO_DATABASE}`;

export const connectToMongoDB = async () => {
  try {
    // Koneksi ke database target
    await mongoose.connect(mongoURI);

    console.log(`Database "${mongoURI}" connected successfully.`);
  } catch (error) {
    console.error("Error connecting database:", error);
  }
};

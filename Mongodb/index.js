import mongoose from "mongoose";

export const connectDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  mongoose.connect(process.env.MONGO_URI);
};

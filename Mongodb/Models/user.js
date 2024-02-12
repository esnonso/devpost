import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      min: [3, "Name is too short"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [7, "Password must have up to 7 characters"],
    },
    gender: { type: String, required: [true, "What gender are you?"] },
    dob: { type: String, required: true },
    role: { type: String, default: "User" },
    resetPassword: String,
    confirmationCode: String,
    confirmedEmail: { type: Boolean, default: false },
    did: String,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

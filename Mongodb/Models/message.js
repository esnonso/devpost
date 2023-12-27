import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      min: [3, "Title is too short"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
      min: [20, "Message is too short"],
    },
    did: {
      type: String,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    ageRange: {
      type: String,
      required: [true, "Age is required"],
    },
    status: { type: String, required: true },

    attendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);

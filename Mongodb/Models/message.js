import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    complaint: {
      type: String,
      required: [true, "Complaint is required"],
      min: [5, "Complaint title is too short"],
    },
    message: {
      type: String,
      required: [true, "Complaint message is required"],
      min: [20, "Message is too short"],
    },

    status: { type: String, default: "Unattended" },

    attendedBy: mongoose.Schema.Types.ObjectId,

    prescription: mongoose.Schema.Types.ObjectId,

    user: mongoose.Schema.Types.ObjectId,
    replies: [],
    notes: String,
    conclusion: String,
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);

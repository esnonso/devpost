import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      min: [3, "Title is too short"],
    },
    message: {
      type: String,
      required: true,
      min: [20, "Message is too short"],
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    ageRange: {
      type: String,
      required: [true, "Age is required"],
    },
    status: String,

    attendedBy: mongoose.Schema.Types.ObjectId,

    prescription: mongoose.Schema.Types.ObjectId,

    did: String,

    doctorDid: String,

    user: mongoose.Schema.Types.ObjectId,
    replies: [],
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);

import mongoose, { Schema } from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
    },
    apptType: {
      type: String,
      required: [true, "Why are you booking appointment?"],
    },
    gender: {
      type: String,
      required: [true, "We need to know your gender"],
    },
    proposedDate: {
      type: Date,
      required: [true, "When is your preferred date"],
    },
    status: {
      type: String,
      default: "awaiting",
    },
    approvedDate: String,

    scheduledWith: String,

    user: Schema.Types.ObjectId,

    did: String,

    testType: String,
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

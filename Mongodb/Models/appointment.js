import mongoose, { Schema } from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    apptType: {
      type: String,
      required: [true, "Why are you booking appointment?"],
    },

    proposedDate: {
      type: Date,
      required: [true, "When is your preferred date"],
    },
    status: {
      type: String,
      default: "Awaiting",
    },
    approvedDate: String,

    scheduledWith: Schema.Types.ObjectId,

    user: Schema.Types.ObjectId,

    testType: String,

    notes: String,

    conclusion: String,
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

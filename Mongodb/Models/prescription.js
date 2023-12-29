import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    pills: [],
  },
  { timestamps: true }
);

export default mongoose.models.Prescription ||
  mongoose.model("Prescription", prescriptionSchema);

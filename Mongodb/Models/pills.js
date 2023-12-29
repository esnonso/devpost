import mongoose from "mongoose";

const pillSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    status: { type: String, required: [true, "Status is required"] },
  },
  { timestamps: true }
);

export default mongoose.models.Pill || mongoose.model("Pill", pillSchema);

import { getServerSession } from "next-auth";
import { options } from "./auth/[...nextauth]";
import { connectDatabase } from "@/Mongodb";
import message from "@/Mongodb/Models/message";
import User from "@/Mongodb/Models/user";
import { throwError } from "@/Components/Error/errorFunction";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    const session = await getServerSession(req, res, options);
    if (!session) throwError("User not authenticated", 403);
    const foundDoctor = await User.findOne({ email: session.user.email });
    if (foundDoctor.role !== "Doctor") throwError("Unauthorized user", 403);
    const { messageId } = req.body;
    const foundMessage = await message.findById(messageId);
    if (foundMessage.status !== "awaiting")
      throwError("Cannot change message status", 422);
    foundMessage.status = "With a doctor";
    foundMessage.attendedBy = foundDoctor._id;
    const data = await foundMessage.save();
    return res.status(201).json({ message: "Complaint status updated" });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

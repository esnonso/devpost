import { connectDatabase } from "@/Mongodb";
import Prescription from "@/Mongodb/Models/prescription";
import User from "@/Mongodb/Models/user";
import Message from "@/Mongodb/Models/message";
import { throwError } from "@/Components/Error/errorFunction";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    const session = await getServerSession(req, res, options);
    if (!session) throwError("Unauthorized Accesses", 403);
    const user = await User.findOne({ email: session.user.email });
    if (user.role !== "Doctor") throwError("Unauthorized Access", 403);
    const { messageId, pills } = req.body;
    const foundMessage = await Message.findById(messageId);
    if (!foundMessage) throwError("An error occured", 500);
    const prescription = await new Prescription({ pills }).save();
    foundMessage.prescription = prescription._id;
    foundMessage.status = "Completed";
    await foundMessage.save();
    res.status(201).json("Prescription added for user");
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

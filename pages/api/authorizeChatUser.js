import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import { throwError } from "@/Components/Error/errorFunction";
import User from "@/Mongodb/Models/user";

export default async function handler(req, res) {
  try {
    const { chatId } = req.body;

    const session = await getServerSession(req, res, options);
    await connectDatabase();
    if (!session) throw new Error("Please login to continue");

    const user = await User.findOne({ email: session.user.email });

    const complaint = await Message.findById(chatId)
      .populate({
        path: "attendedBy",
        select: ["name", "role"],
        model: User,
      })
      .populate({ path: "user", select: "name", model: User });

    if (complaint.user._id.toString() !== user._id.toString()) {
      throwError("Unauthorized Access", 403);
    }

    return res.status(200).json(complaint);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

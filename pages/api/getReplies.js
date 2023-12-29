import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import { throwError } from "@/Components/Error/errorFunction";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, options);
    if (!session) {
      throwError("Unauthorized", 403);
    }
    const { messageId } = req.body;
    await connectDatabase();
    const data = await Message.findById(messageId);
    return res.status(200).json({
      replies: data.replies || [],
    });
  } catch (error) {
    return res.status(500).json("An error occured");
  }
}

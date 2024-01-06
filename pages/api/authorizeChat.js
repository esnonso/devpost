import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import { throwError } from "@/Components/Error/errorFunction";
import User from "@/Mongodb/Models/user";

export default async function AuthorizeChat(req, res) {
  try {
    const { did, chatId } = req.body;
    let userId;
    let role;
    const session = await getServerSession(req, res, options);
    await connectDatabase();
    if (session) {
      const user = await User.findOne({ email: session.user.email });
      userId = user._id;
      role = user.role;
    }
    const data = await Message.findById(chatId).populate({
      path: "attendedBy",
      select: "name",
      model: User,
    });
    if (data.did !== did && !session) throwError("Unauthorized Access", 403);
    if (session && data.identifier === "UserId") {
      if (role !== "Doctor") {
        if (data.user.toString() !== userId.toString())
          throwError("Unauthorized Access", 403);
      }
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

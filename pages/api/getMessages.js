import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import User from "@/Mongodb/Models/user";

export default async function GetMessages(req, res) {
  try {
    await connectDatabase();
    let userId;
    const session = await getServerSession(req, res, options);
    if (session) {
      const user = await User.findOne({ email: session.user.email });
      userId = user._id;
    }
    const { did } = req.body;
    let data;
    if (!session) {
      data = await Message.find({ did: did });
    }
    if (session) {
      data = await Message.find({ user: userId });
    }
    return res.status(200).json({
      messages: data,
    });
  } catch (error) {
    return res.status(500).json("An error occured");
  }
}

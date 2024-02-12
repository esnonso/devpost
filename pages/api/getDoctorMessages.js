import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import User from "@/Mongodb/Models/user";

export default async function GetMessages(req, res) {
  try {
    await connectDatabase();
    const session = await getServerSession(req, res, options);
    if (!session) throw new Error("An error occured");

    const user = await User.findOne({ email: session.user.email });
    if (user.role !== "Doctor") throw new Error("An error occured");

    const data = await Message.find({ status: "Unattended" }).populate({
      path: "user",
      select: "gender",
      model: User,
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("An error occured");
  }
}

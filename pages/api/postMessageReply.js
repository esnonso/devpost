import { getServerSession } from "next-auth";
import { options } from "./auth/[...nextauth]";
import { connectDatabase } from "@/Mongodb";
import message from "@/Mongodb/Models/message";
import User from "@/Mongodb/Models/user";
import { throwError } from "@/Components/Error/errorFunction";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    let data;
    const { messageId, reply } = req.body;
    const session = await getServerSession(req, res, options);
    if (!session) throwError("User not authenticated", 403);
    const foundUser = await User.findOne({ email: session.user.email });
    const foundMessage = await message.findById(messageId);
    if (
      foundUser._id.toString() !== foundMessage.attendedBy.toString() &&
      foundMessage.user.toString() !== foundUser._id.toString()
    )
      throwError("An error occured", 500);

    foundMessage.replies.push(reply);
    data = await foundMessage.save();
    return res.status(201).json(data);
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { throwError } from "@/Components/Error/errorFunction";
import { connectDatabase } from "@/Mongodb";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import Message from "@/Mongodb/Models/message";
import User from "@/Mongodb/Models/user";

export default async function handler(req, res) {
  try {
    await connectDatabase();

    const session = await getServerSession(req, res, options);
    if (!session) throw new Error("User not authenticated");

    const user = await User.findOne({ email: session.user.email });

    const { complaint, message } = req.body;
    if (!complaint || !message) throwError("Fill all inputs", 422);

    const openComplaint = await Message.findOne({
      user: user._Id,
      status: { $in: ["Unattended", "With a Doctor"] },
    });

    if (openComplaint) {
      throw new Error("You have a pending complaint");
    }

    await new Message({
      complaint,
      message,
      user: user._id,
    }).save();

    return res
      .status(200)
      .json("Message sent! A doctor will attend to your message soon.");
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

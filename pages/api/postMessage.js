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
    let userId;
    const session = await getServerSession(req, res, options);
    if (session) {
      const user = await User.findOne({ email: session.user.email });
      userId = user._id;
    }
    const data = req.body;
    if (!data.title || !data.message || !data.ageRange || !data.gender)
      throwError("Fill all inputs", 422);

    let openComplaint;
    if (!session) {
      openComplaint = await Message.findOne({
        did: data.did,
        status: "awaiting" || "with a doctor",
      });
    } else {
      openComplaint = await Message.findOne({
        user: userId,
        status: "awaiting" || "with a doctor",
      });
    }

    if (openComplaint) {
      throwError("You have an open request", 403);
    }

    await new Message({
      identifier: session ? "UserId" : "Web5",
      title: data.title,
      message: data.message,
      ageRange: data.ageRange,
      gender: data.gender,
      did: data.did,
      status: data.status,
      user: userId,
    }).save();

    return res.status(200).json({
      message:
        "Message sent! A doctor will reply you within 2 minutes. Check your messages",
    });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

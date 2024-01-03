import { connectDatabase } from "@/Mongodb";
import Appointment from "@/Mongodb/Models/appointment";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import User from "@/Mongodb/Models/user";

export default async function handler(req, res) {
  try {
    const { did } = req.body;
    await connectDatabase();
    let userId;
    const session = await getServerSession(req, res, options);
    if (session) {
      const user = await User.findOne({ email: session.user.email });
      userId = user._id;
    }
    let data;
    if (!session) {
      data = await Appointment.find({ userDid: did });
    }
    if (session) {
      data = await Appointment.find({ user: userId });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("An error occured");
  }
}

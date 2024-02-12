// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { throwError } from "@/Components/Error/errorFunction";
import { connectDatabase } from "@/Mongodb";
import Appointment from "@/Mongodb/Models/appointment";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import User from "@/Mongodb/Models/user";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    const session = await getServerSession(req, res, options);

    if (!session) throw new Error("You need to login");

    const user = await User.findOne({ email: session.user.email });
    const userId = user._id;

    const { proposedDate, apptType, testType } = req.body;

    if (!apptType) throwError("Fill all inputs", 422);
    if (apptType === "Lab test" && !testType) throwError("Select a test", 422);

    const openAppointments = await Appointment.find({
      user: userId,
      status: "Awaiting",
      apptType: apptType,
    });

    if (openAppointments.length) {
      throwError("You have an open appointment", 403);
    }
    await new Appointment({
      proposedDate,
      apptType,
      testType,
      user: userId,
    }).save();
    return res.status(200).json({
      message: "Appointment request sent!",
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json(error.message);
    }
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { throwError } from "@/Components/Error/errorFunction";
import { connectDatabase } from "@/Mongodb";
import Appointment from "@/Mongodb/Models/appointment";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import User from "@/Mongodb/Models/user";

export default async function handler(req, res) {
  try {
    let userId;
    await connectDatabase();
    const session = await getServerSession(req, res, options);
    if (session) {
      const user = await User.findOne({ email: session.user.email });
      userId = user._id;
    }
    const { proposedDate, reason, gender, apptType, testType, did } = req.body;
    if (!gender || !apptType) throwError("Fill all inputs", 422);
    if (apptType === "Lab test" && !testType) throwError("Select a test", 422);

    let openAppointments;
    if (!session) {
      openAppointments = await Appointment.find({
        did: did,
        status: "awaiting",
        apptType: apptType,
      });
    }
    if (session) {
      openAppointments = await Appointment.find({
        user: userId,
        status: "awaiting",
        apptType: apptType,
      });
    }
    if (openAppointments.length > 0) {
      throwError("You have an open appointment", 403);
    }
    await new Appointment({
      identifier: session ? "UserId" : "Web5",
      proposedDate,
      reason,
      gender,
      apptType,
      testType,
      did,
      user: userId,
      approvedDate: "",
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

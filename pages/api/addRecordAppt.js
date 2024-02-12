import { getServerSession } from "next-auth";
import { options } from "./auth/[...nextauth]";
import { connectDatabase } from "@/Mongodb";
import Appointment from "@/Mongodb/Models/appointment";
import User from "@/Mongodb/Models/user";
import { throwError } from "@/Components/Error/errorFunction";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    let data;
    const { conclusion, notes, appointmentId } = req.body;
    const session = await getServerSession(req, res, options);
    if (!session) throwError("User not authenticated", 403);
    const foundUser = await User.findOne({ email: session.user.email });
    if (foundUser.role !== "Doctor") throwError("An error occured", 500);
    const foundAppointment = await Appointment.findById(appointmentId);
    foundAppointment.notes = notes;
    foundAppointment.conclusion = conclusion;
    data = await foundAppointment.save();
    return res.status(201).json(data);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

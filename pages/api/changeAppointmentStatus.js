import { getServerSession } from "next-auth";
import { options } from "./auth/[...nextauth]";
import { connectDatabase } from "@/Mongodb";
import Appointment from "@/Mongodb/Models/appointment";
import User from "@/Mongodb/Models/user";
import { throwError } from "@/Components/Error/errorFunction";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    const { apptId, date, apptType, status } = req.body;
    // if (!date) throwError("Select a valid Date", 403);
    const session = await getServerSession(req, res, options);
    if (!session) throwError("User not authenticated", 403);

    const foundDoctor = await User.findOne({ email: session.user.email });
    if (foundDoctor.role !== "Doctor" && foundDoctor.role !== "Lab Guy")
      throwError("Unauthorized access", 403);

    if (foundDoctor.role === "Doctor" && apptType == "Lab test")
      throwError("You can only approve to see a doctor", 403);

    if (foundDoctor.role === "Lab Guy" && apptType == "See a doctor")
      throwError("You can only approve tests", 403);

    const foundAppt = await Appointment.findById(apptId);
    foundAppt.status = status;
    foundAppt.approvedDate = date || "";
    foundAppt.scheduledWith = foundDoctor._id;
    await foundAppt.save();
    return res.status(201).json(foundAppt);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

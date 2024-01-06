import { connectDatabase } from "@/Mongodb";
import Appointment from "@/Mongodb/Models/appointment";
import User from "@/Mongodb/Models/user";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import { throwError } from "@/Components/Error/errorFunction";

export default async function handler(req, res) {
  try {
    let userId;
    let role = "";
    const session = await getServerSession(req, res, options);
    await connectDatabase();
    if (session) {
      const user = await User.findOne({ email: session.user.email });
      userId = user._id;
      role = user.role;
    }

    const { id, did } = req.body;
    const foundAppointment = await Appointment.findById(id).populate({
      path: "scheduledWith",
      select: "name",
      model: User,
    });

    if (foundAppointment.identifier === "Web5") {
      if (
        foundAppointment.userDid !== did &&
        role !== "Doctor" &&
        role !== "Lab Guy"
      )
        throwError("Unauthorized Access", 403);

      console.log("no error");
    }

    if (foundAppointment.identifier === "UserId") {
      if (role !== "Doctor" && role !== "Lab Guy") {
        if (foundAppointment.user.toString() !== userId.toString()) {
          throwError("Unauthorized Accessing", 403);
        }
      }
    }

    return res.status(200).json({ appts: foundAppointment, role: role });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
}

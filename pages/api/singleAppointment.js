import { connectDatabase } from "@/Mongodb";
import Appointment from "@/Mongodb/Models/appointment";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    const { id } = req.body;
    const foundAppointment = await Appointment.findById(id);
    return res.status(200).json(foundAppointment);
  } catch (error) {
    return res.status(500).json("An error occured");
  }
}

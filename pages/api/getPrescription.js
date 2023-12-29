import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";
import Prescription from "@/Mongodb/Models/prescription";

export default async function Handler(req, res) {
  try {
    const { messageId } = req.body;
    await connectDatabase();
    const message = await Message.findById(messageId);
    const prescription = await Prescription.findById(message.prescription);
    return res.status(200).json(prescription);
  } catch (error) {
    console.log(error);
    return res.status(500).json("An error occured");
  }
}

import { connectDatabase } from "@/Mongodb";
import message from "@/Mongodb/Models/message";
import { throwError } from "@/Components/Error/errorFunction";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    const { messageId } = req.body;
    const foundMessage = await message.findById(messageId);
    if (foundMessage.status !== "Completed")
      throwError("Cannot change message status", 422);
    foundMessage.status = "Re opened";
    await foundMessage.save();
    return res.status(201).json({ message: "Complaint status updated" });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

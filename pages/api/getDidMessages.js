import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";

export default async function GetDidMessages(req, res) {
  try {
    const { did } = req.body;
    await connectDatabase();
    const data = await Message.find({ did: did });
    return res.status(200).json({
      messages: data,
    });
  } catch (error) {
    return res.status(500).json("An error occured");
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { throwError } from "@/Components/Error/errorFunction";
import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    const data = req.body;
    if (!data.title || !data.message || !data.ageRange || !data.gender)
      throwError("Fill all inputs", 422);

    const openComplaint = await Message.findOne({
      did: data.did,
      status: "awaiting" || "attending",
    });

    if (openComplaint) {
      throwError("You have an open request", 403);
    }

    await new Message({
      title: data.title,
      message: data.message,
      ageRange: data.ageRange,
      gender: data.gender,
      did: data.did,
      status: data.status,
    }).save();

    return res.status(200).json({
      message:
        "Message sent! A doctor will reply you within 2 minutes. Check your messages",
    });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

import { connectDatabase } from "@/Mongodb";
import user from "@/Mongodb/Models/user";

export default async function handler(req, res) {
  try {
    //get user session and authorize admin
    await connectDatabase();
    const { id } = req.body;
    await user.findByIdAndDelete(id);
    return res.status(200).json("Success!");
  } catch (error) {
    return res.status(500).json("An error occured!");
  }
}

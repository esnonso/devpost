import { connectDatabase } from "@/Mongodb";
import user from "@/Mongodb/Models/user";

export default async function handler(req, res) {
  try {
    //get user session and authorize admin
    await connectDatabase();
    const query = {
      role: { $in: ["Doctor", "Lab Guy", "Phamarcist", "Administrator"] },
    };
    const allStaff = await user.find(query);
    return res.status(200).json(allStaff);
  } catch (error) {
    return res.status(500).json(error);
  }
}

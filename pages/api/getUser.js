import { connectDatabase } from "@/Mongodb";
import User from "@/Mongodb/Models/user";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import { throwError } from "@/Components/Error/errorFunction";

export default async function GetUserStatus(req, res) {
  try {
    await connectDatabase();
    const session = await getServerSession(req, res, options);
    if (!session) throwError("User not authenticated", 403);
    const data = await User.findOne({ email: session.user.email });
    return res.status(200).json({
      user: data,
    });
  } catch (error) {
    return res.status(500).json("An error occured");
  }
}

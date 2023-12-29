import { connectDatabase } from "@/Mongodb";
import User from "@/Mongodb/Models/user";
import Pill from "@/Mongodb/Models/pills";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";
import { throwError } from "@/Components/Error/errorFunction";

export default async function GetUserStatus(req, res) {
  try {
    await connectDatabase();
    const session = await getServerSession(req, res, options);
    if (!session) throwError("Unauthorized Accesses", 403);
    const user = await User.findOne({ email: session.user.email });
    if (user.role !== "Doctor" && user.role !== "Admininstrator")
      throwError("Unauthorized Access", 403);
    const pills = await Pill.find({});
    return res.status(200).json({
      pills: pills,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectDatabase } from "@/Mongodb";
import User from "@/Mongodb/Models/user";
import bcrypt from "bcrypt";
import { throwError } from "@/Components/Error/errorFunction";

export default async function POST(req, res) {
  try {
    await connectDatabase();
    let data = req.body.data;
    if (
      data.firstname === "" ||
      data.lastname === "" ||
      data.email === "" ||
      data.password === "" ||
      data.role === "" ||
      data.dob === "" ||
      data.gender === ""
    ) {
      throwError("Fill all inputs", 422);
    }

    const user = await User.findOne({ email: data.email });
    if (user) throwError("User Exists", 409);

    await new User({
      name: `${data.firstname} ${data.lastname}`,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      role: data.role || "user",
      dob: data.dob,
      gender: data.gender,
    }).save();

    return res.status(201).json({ message: "User creation success!" });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

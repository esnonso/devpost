import { connectDatabase } from "@/Mongodb";
import User from "@/Mongodb/Models/user";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    const { name, email, password, gender, dob, did } = req.body;
    if (!name || !email || !password || !dob || !gender)
      throw new Error("Fill all inputs");
    const userExists = await User.findOne({ email: email });
    if (userExists)
      throw new Error("This email is already taken by another user");
    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({
      name,
      email,
      password: hashedPassword,
      gender,
      dob,
      did,
    }).save();
    return res.status(200).json("User creation success! Proceed to login");
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

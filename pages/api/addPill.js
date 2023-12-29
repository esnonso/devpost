import { connectDatabase } from "@/Mongodb";
import Pill from "@/Mongodb/Models/pills";
import { throwError } from "@/Components/Error/errorFunction";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    const { brand, name, price, status } = req.body;
    const exists = await Pill.findOne({
      brand: brand,
      name: name,
      price: price,
    });
    if (exists) throwError("Pill exists", 409);
    await new Pill({ brand, name, price, status }).save();
    res.status(201).json("Pill added to store");
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

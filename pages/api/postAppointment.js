// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { throwError } from "@/Components/Error/errorFunction";
import { connectDatabase } from "@/Mongodb";

export default async function handler(req, res) {
  try {
    const data = req.body;
    if (!data.reason || !data.gender) throwError("Fill all inputs", 422);
    if (data.reason === "Lab test" && !data.test)
      throwError("Select a test", 422);
    const client = await connectDatabase();
    const db = client.db("Devpost-Hospital");
    const collection = db.collection("appointments");
    const openAppointments = await collection
      .find({ did: data.did, status: "awaiting" })
      .toArray();
    if (openAppointments.length > 0) {
      console.log(openAppointments);
      throwError("You have an open appointment", 403);
    }
    await collection.insertOne(data);
    await client.close();
    return res.status(200).json({
      message:
        "Appointment scheduled. Check your appointments for approval and date",
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(error.message);
    } else {
      return res.status(500).json("An error occured");
    }
  }
}

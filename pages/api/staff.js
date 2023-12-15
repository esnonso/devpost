// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient } from "mongodb";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

export default async function handler(req, res) {
  try {
    const { firstname, lastname, email, password, status } = req.body;
    await client.connect();
    const db = client.db("Devpost-Hospital");
    const collection = db.collection("staff");
    await collection.insertOne({
      firstname: firstname,
      lastname: lastname,
      email: email,
      status: status,
      password: password,
    });
    await client.close();
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return error;
  }
}

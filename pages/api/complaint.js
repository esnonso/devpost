// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient } from "mongodb";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

export default async function handler(req, res) {
  switch (req.method) {
    case "POST": {
      try {
        const { did, username, title, message, age, weight } = req.body;
        console.log(did, username);
        await client.connect();
        const db = client.db("Devpost-Hospital");
        const collection = db.collection("complaints");
        await collection.insertOne({
          did: did,
          message: message,
          username: username,
          title: title,
          age: age,
          weigth: weight,
          replies: [],
        });
        await client.close();
        return res.status(200).json({
          message:
            "Message sent! A doctor will reply you within 2 minutes. Check your messages",
        });
      } catch (error) {
        return error;
      }
    }
    case "GET": {
      try {
        await client.connect();
        const db = client.db("Devpost-Hospital");
        const collection = db.collection("complaint");
        const data = await collection.find().toArray();
        await client.close();
        return res.status(200).json({
          complaints: data.map((d) => ({
            name: "",
          })),
        });
      } catch (error) {
        return error;
      }
    }
  }
}

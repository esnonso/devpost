import AdministaratorDashboard from "@/Components/Admin";
import { MongoClient } from "mongodb";
export default function Dashboard(props) {
  return <AdministaratorDashboard staff={props.staff} />;
}

export async function getStaticProps() {
  const client = await MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("Devpost-Hospital");
  const collection = db.collection("staff");
  const data = await collection.find().toArray();
  client.close();
  return {
    props: {
      staff: data.map((s) => ({
        firstname: s.firstname,
        lastname: s.lastname,
        email: s.email,
        status: s.status,
        id: s._id.toString(),
      })),
    },
    revalidate: 60,
  };
}

import { Web5 } from "@web5/api";
import { connectDatabase } from "@/Mongodb";
import Appointments from "@/Components/Appointments/appointment";

export default function DidUserAppointments({ appointments }) {
  return <Appointments appointments={appointments} />;
}

export async function getStaticProps() {
  //const { web5, did } = await Web5.connect();
  const did = 26548;
  const client = await connectDatabase();
  const db = client.db("Devpost-Hospital");
  const collection = db.collection("appointments");
  const data = await collection.find({ did: did }).toArray();
  client.close();

  return {
    props: {
      appointments: data.map((c) => ({
        reason: c.reason,
        id: c._id.toString(),
        status: c.status,
        test: c.test,
      })),
    },
  };
}

import PatientsComplaints from "@/Components/Doctor/allComplaints";
import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";

export default function AllPatientsComplaints(props) {
  return <PatientsComplaints messages={props.messages} />;
}

export async function getStaticProps() {
  await connectDatabase();
  const data = await Message.find({ status: "awaiting" });
  return {
    props: {
      messages: data.map((m) => ({
        title: m.title,
        gender: m.gender,
        ageRange: m.ageRange,
        id: m._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

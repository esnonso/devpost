import SingleComplaintsForUnregisteredPatient from "@/Components/Chat/singleComplaint";
import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";

export default function SingleComplaintsUnregisteredPatient(props) {
  return <SingleComplaintsForUnregisteredPatient complaint={props.complaint} />;
}

export async function getStaticPaths() {
  await connectDatabase();
  const complaints = await Message.find({}, { _id: 1 });

  return {
    fallback: true,
    paths: complaints.map((c) => ({
      params: { chatId: c._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const chatId = context.params.chatId;
  await connectDatabase();
  const complaint = await Message.findById(chatId);
  return {
    props: {
      complaint: {
        title: complaint.title,
        message: complaint.message,
        gender: complaint.gender,
        ageRange: complaint.ageRange,
        status: complaint.status,
        did: complaint.did,
        id: chatId,
        identifier: complaint.identifier,
      },
      revalidate: 10,
    },
  };
}

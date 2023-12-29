import { getServerSession } from "next-auth";
import { options } from "@/pages/api/auth/[...nextauth]";
import PatientsComplaints from "@/Components/Doctor/allComplaints";
import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";
import User from "@/Mongodb/Models/user";

export default function DoctorPendingComplaints(props) {
  return <PatientsComplaints messages={props.messages} />;
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, options);
  if (!session) throwError("User not authenticated", 403);
  await connectDatabase();
  const foundDoctor = await User.findOne({ email: session.user.email });
  if (foundDoctor.role !== "Doctor") throwError("Unauthorized user", 403);
  const data = await Message.find({
    attendedBy: foundDoctor._id,
    status: "With a doctor",
  });

  return {
    props: {
      messages: data.map((m) => ({
        title: m.title,
        gender: m.gender,
        ageRange: m.ageRange,
        id: m._id.toString(),
      })),
    },
  };
}

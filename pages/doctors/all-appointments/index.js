import { connectDatabase } from "@/Mongodb";
import Appointment from "@/Mongodb/Models/appointment";
import AppointmentRequests from "@/Components/Doctor/allAppointments";

export default function AllAppointmentRequests(props) {
  return <AppointmentRequests appointments={props.appointments} />;
}

export async function getStaticProps() {
  await connectDatabase();
  const data = await Appointment.find({
    status: "awaiting",
  });

  return {
    props: {
      appointments: data.map((a) => ({
        apptType: a.apptType + " " + a.testType,
        gender: a.gender,
        status: a.status,
        created: a.createdAt.toUTCString(),
        id: a._id.toString(),
        identifier: a.identifier,
      })),
    },
    revalidate: 10,
  };
}

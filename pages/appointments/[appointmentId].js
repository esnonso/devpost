import SingleAppointment from "@/Components/Appointments/singleAppointment";
import { connectDatabase } from "@/Mongodb";
import Appointment from "@/Mongodb/Models/appointment";

export default function UserSingleAppts(props) {
  return <SingleAppointment appts={props.appt} />;
}

export async function getStaticPaths() {
  await connectDatabase();
  const appts = await Appointment.find({}, { _id: 1 });

  return {
    fallback: true,
    paths: appts.map((a) => ({
      params: { appointmentId: a._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const apptId = context.params.appointmentId;
  await connectDatabase();
  const a = await Appointment.findById(apptId);
  return {
    props: {
      appt: {
        identifier: a.identifier,
        apptType: a.apptType,
        gender: a.gender,
        status: a.status,
        created: a.createdAt.toUTCString(),
        proposedDate: a.proposedDate.toUTCString(),
        approvedDate: a.approvedDate,
        id: apptId,
      },
      revalidate: 10,
    },
  };
}

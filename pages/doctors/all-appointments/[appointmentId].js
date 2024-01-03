import Head from "next/head";
import { Fragment } from "react";
import SingleAppointment from "@/Components/Appointments/singleAppointment";
import { connectDatabase } from "@/Mongodb";
import Appointment from "@/Mongodb/Models/appointment";

export default function SingleAppts(props) {
  return (
    <Fragment>
      <Head>
        <title>Devpost web5 Book Appointment</title>
        <meta name="description" content="Doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SingleAppointment id={props.id} />;
    </Fragment>
  );
}

export async function getStaticPaths() {
  await connectDatabase();
  const appts = await Appointment.find({}, { _id: 1 });

  return {
    fallback: "blocking",
    paths: appts.map((a) => ({
      params: { appointmentId: a._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const apptId = context.params.appointmentId;
  return {
    props: {
      id: apptId,
      revalidate: 1,
    },
  };
}

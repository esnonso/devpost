import Head from "next/head";
import { Fragment } from "react";
import { connectDatabase } from "@/Mongodb";
import Appointment from "@/Mongodb/Models/appointment";
import AppointmentRequests from "@/Components/Doctor/allAppointments";

export default function AllAppointmentRequests(props) {
  return (
    <Fragment>
      <Head>
        <title>Devpost web5 Book Appointment</title>
        <meta name="description" content="Doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppointmentRequests appointments={props.appointments} />;
    </Fragment>
  );
}

export async function getStaticProps() {
  await connectDatabase();
  const data = await Appointment.find({
    status: "Approved",
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
    revalidate: 1,
  };
}

import Head from "next/head";
import { Fragment } from "react";
import AppointmentForm from "@/Components/Appointments/newAppointment";

export default function BookAppointment() {
  return (
    <Fragment>
      <Head>
        <title>Devpost web5 Book Appointment</title>
        <meta name="description" content="Book doctor appointment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppointmentForm />;
    </Fragment>
  );
}

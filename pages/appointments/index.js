import Head from "next/head";
import { Fragment } from "react";
import Appointments from "@/Components/Appointments/appointment";

export default function UserAppointments() {
  return (
    <Fragment>
      <Head>
        <title>Devpost web5 Appointments</title>
        <meta name="description" content="Doctor appointments" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Appointments />;
    </Fragment>
  );
}

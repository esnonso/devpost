import Head from "next/head";
import { Fragment } from "react";
import AdministaratorDashboard from "@/Components/Admin";

export default function Dashboard(props) {
  return (
    <Fragment>
      <Head>
        <title>Devpost Web5 Admin Dashboard</title>
        <meta
          name="description"
          content="Hospital solution Get health serveices, speak to a doctor, subscribe to healthcare"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AdministaratorDashboard staff={props.staff} />;
    </Fragment>
  );
}

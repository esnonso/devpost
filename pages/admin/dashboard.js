import Head from "next/head";
import { Fragment } from "react";
import AdministaratorDashboard from "@/Components/Admin";
import { connectDatabase } from "@/Mongodb";
import User from "@/Mongodb/Models/user";

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

export async function getStaticProps() {
  await connectDatabase();
  const data = await User.find({});
  return {
    props: {
      staff: data.map((s) => ({
        name: s.name,
        email: s.email,
        role: s.role,
        id: s._id.toString(),
      })),
    },
    revalidate: 1000,
  };
}

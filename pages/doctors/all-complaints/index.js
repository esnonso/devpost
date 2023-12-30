import Head from "next/head";
import { Fragment } from "react";
import PatientsComplaints from "@/Components/Doctor/allComplaints";
import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";

export default function AllPatientsComplaints(props) {
  return (
    <Fragment>
      <Head>
        <title>Devpost web5 Book Appointment</title>
        <meta name="description" content="Doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PatientsComplaints messages={props.messages} />
    </Fragment>
  );
}

export async function getStaticProps() {
  await connectDatabase();
  const data = await Message.find({ status: "awaiting" });
  return {
    props: {
      messages: data.map((m) => ({
        title: m.title,
        gender: m.gender,
        ageRange: m.ageRange,
        created: m.createdAt.toUTCString(),
        id: m._id.toString(),
        identifier: m.identifier,
      })),
    },
    revalidate: 10,
  };
}

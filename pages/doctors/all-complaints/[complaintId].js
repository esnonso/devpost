import Head from "next/head";
import { Fragment } from "react";
import Complaints from "@/Components/Doctor/complaint";
import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";

export default function SingleComplaints(props) {
  return (
    <Fragment>
      <Head>
        <title>Devpost web5 Book Appointment</title>
        <meta name="description" content="Doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Complaints complaint={props.complaint} />;
    </Fragment>
  );
}

export async function getStaticPaths() {
  await connectDatabase();
  const complaints = await Message.find({}, { _id: 1 });

  return {
    fallback: "blocking",
    paths: complaints.map((c) => ({
      params: { complaintId: c._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const complaintId = context.params.complaintId;
  await connectDatabase();
  const complaint = await Message.findById(complaintId);
  return {
    props: {
      complaint: {
        title: complaint.title || "",
        message: complaint.message || "",
        gender: complaint.gender || "",
        ageRange: complaint.ageRange || "",
        status: complaint.status || "",
        did: complaint.did || "",
        id: complaintId || "",
        identifier: complaint.identifier || "",
      },
      revalidate: 1,
    },
  };
}

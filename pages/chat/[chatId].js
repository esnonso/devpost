import Head from "next/head";
import { Fragment } from "react";
import SingleComplaintsForUnregisteredPatient from "@/Components/Chat/singleComplaint";
import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";

export default function SingleComplaintsUnregisteredPatient(props) {
  return (
    <Fragment>
      <Head>
        <title>Devpost web5 Chat</title>
        <meta name="description" content="Chat with doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SingleComplaintsForUnregisteredPatient complaint={props.complaint} />
    </Fragment>
  );
}

export async function getStaticPaths() {
  await connectDatabase();
  const complaints = await Message.find({}, { _id: 1 });

  return {
    fallback: true,
    paths: complaints.map((c) => ({
      params: { chatId: c._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const chatId = context.params.chatId;
  await connectDatabase();
  const complaint = await Message.findById(chatId);
  return {
    props: {
      complaint: {
        title: complaint.title,
        message: complaint.message,
        gender: complaint.gender,
        ageRange: complaint.ageRange,
        status: complaint.status,
        did: complaint.did,
        id: chatId,
        identifier: complaint.identifier,
      },
      revalidate: 10,
    },
  };
}

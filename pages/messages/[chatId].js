import Head from "next/head";
import { Fragment } from "react";
import SingleComplaintsForUnregisteredPatient from "@/Components/Chat/singleComplaint";
import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";

export default function SingleComplaintsUnregisteredPatient(props) {
  return (
    <Fragment>
      <Head>
        <title>Messages</title>
        <meta name="description" content="Chat with doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SingleComplaintsForUnregisteredPatient id={props.id} />
    </Fragment>
  );
}

export async function getStaticPaths() {
  await connectDatabase();
  const complaints = await Message.find({}, { _id: 1 });

  return {
    fallback: "blocking",
    paths: complaints.map((c) => ({
      params: { chatId: c._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const chatId = context.params.chatId;
  return {
    props: {
      id: chatId || "",
      revalidate: 1,
    },
  };
}

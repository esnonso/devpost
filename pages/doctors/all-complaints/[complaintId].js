import Head from "next/head";
import { Fragment } from "react";
import Complaints from "@/Components/Doctor/complaint";
import { connectDatabase } from "@/Mongodb";
import Message from "@/Mongodb/Models/message";

export default function SingleComplaints(props) {
  return (
    <Fragment>
      <Head>
        <title>Chat</title>
        <meta name="description" content="Doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Complaints id={props.id} />;
    </Fragment>
  );
}

export const dynamic = "force-dynamic";

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
  const chatId = context.params.complaintId;
  return {
    props: {
      id: chatId || "",
      revalidate: 1,
    },
  };
}

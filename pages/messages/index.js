import Head from "next/head";
import { Fragment } from "react";
import ComplaintsPage from "@/Components/Chat/complaints";

export default function Complaints() {
  return (
    <Fragment>
      <Head>
        <title>Messages</title>
        <meta name="description" content="Chat with doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ComplaintsPage />;
    </Fragment>
  );
}

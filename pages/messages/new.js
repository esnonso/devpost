import Head from "next/head";
import { Fragment } from "react";
import ComplaintsForm from "@/Components/Chat/complaintsForm";
export default function Complaints() {
  return (
    <Fragment>
      <Head>
        <title>New Message</title>
        <meta name="description" content="Chat with doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ComplaintsForm />;
    </Fragment>
  );
}

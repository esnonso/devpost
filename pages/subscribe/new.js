import Head from "next/head";
import { Fragment } from "react";
import SubscriptionForm from "@/Components/Subscription/subscriptionForm";

export default function Subscribe() {
  return (
    <Fragment>
      <Head>
        <title>Devpost web5 Chat</title>
        <meta name="description" content="Chat with doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SubscriptionForm />;
    </Fragment>
  );
}

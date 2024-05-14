import Head from "next/head";
import { Fragment } from "react";
import Homepage from "@/Components/Homepage";

export default function Home(props) {
  return (
    <Fragment>
      <Head>
        <title>Hospital</title>
        <meta
          name="description"
          content="Hospital solution Get health serveices, speak to a doctor, subscribe to healthcare"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Homepage />
    </Fragment>
  );
}

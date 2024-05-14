import Head from "next/head";
import { Fragment } from "react";
import UserProfile from "@/Components/Profile";

export default function Profile() {
  return (
    <Fragment>
      <Head>
        <title>Hospital</title>
        <meta name="description" content="Login page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <UserProfile />;
    </Fragment>
  );
}

// export async function getStaticProps() {}

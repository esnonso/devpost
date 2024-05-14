import Head from "next/head";
import { Fragment } from "react";
import LoginComponent from "@/Components/Auth/login";

export default function Login() {
  return (
    <Fragment>
      <Head>
        <title>Hospital</title>
        <meta name="description" content="Login page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <LoginComponent />;
    </Fragment>
  );
}

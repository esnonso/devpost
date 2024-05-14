import Head from "next/head";
import RegistrationForm from "@/Components/Auth/register";
import { Fragment } from "react";

export default function Register() {
  return (
    <Fragment>
      <Head>
        <title>Hospital</title>
        <meta name="description" content="Register for hospital" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RegistrationForm />
    </Fragment>
  );
}

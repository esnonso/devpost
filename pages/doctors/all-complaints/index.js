import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import PatientsComplaints from "@/Components/Doctor/allComplaints";
import Loader from "@/Components/Loader";
import axios from "axios";

export default function AllPatientsComplaints(props) {
  const [messages, setMessages] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMessagesHandler = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/getDoctorMessages");
      setMessages(response.data);
    } catch (error) {
      setError("An error occured Loading this page");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessagesHandler();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Doctor panel</title>
        <meta name="description" content="Doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PatientsComplaints messages={messages} error={error} />
      {isLoading && <Loader message="Loading messages" />}
    </Fragment>
  );
}

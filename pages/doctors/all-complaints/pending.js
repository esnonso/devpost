import Head from "next/head";
import { Fragment, useState, useEffect } from "react";
import PatientsComplaints from "@/Components/Doctor/allComplaints";
import Loader from "@/Components/Loader";
import axios from "axios";

export default function DoctorPendingComplaints(props) {
  const [messages, setMessages] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessagesHandler = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/getDoctorAcceptedMessages");
      setMessages(response.data);
    } catch (error) {
      console.log(error);
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
        <title>Devpost web5 Book Appointment</title>
        <meta name="description" content="Doctor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PatientsComplaints messages={messages} />;{isLoading && <Loader />}
    </Fragment>
  );
}

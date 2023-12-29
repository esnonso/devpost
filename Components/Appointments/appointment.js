import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Web5 } from "@web5/api";
import Container from "../Containers/container";
import { PTags } from "../Text";
import Button from "../Button";
import axios from "axios";
import Loader from "../Loader";

export default function Appointments() {
  const { status } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const getAppointments = async () => {
    try {
      setIsLoading(true);
      let response;
      if (status === "unauthenticated") {
        const { web5, did } = await Web5.connect();
        response = await axios.post("/api/getAppointments", {
          did: did,
        });
      } else {
        response = await axios.post("/api/getAppointments");
      }
      setAppointments(response.data);
    } catch (error) {
      if (error.response) setError(error.response.data);
      else setError("An error occured!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <Container margin="5rem 1rem" flex="column" minHeight="50vh">
      <Container width="100%" justify="flex-end">
        <Button
          text="+New Appointment"
          back="#139D69"
          padding="0.2rem 1rem"
          margin="0 0.3rem 0.2rem 0"
          click={() => router.push("/appointments/new")}
        />
      </Container>
      {error && (
        <Container
          width="100%"
          margin="0 auto"
          padding="0.5rem"
          color="#F8D7DA"
          radius="5px"
        >
          <small>{error}</small>
        </Container>
      )}
      <PTags fontSize="25px" borderBottom="1px gray solid" margin="0.5rem">
        All appointments for this user
      </PTags>

      {appointments.map((c) => {
        return (
          <Container
            key={c._id}
            width="100%"
            borderBottom="1px gray solid"
            align="center"
          >
            <PTags width="40%" margin="0.5rem">
              {c.apptType} {c.testType && <span>for {c.testType}</span>}
            </PTags>

            <PTags width="40%" margin="0.5rem">
              Status: {c.status}
            </PTags>
            <PTags width="40%" margin="0.5rem">
              Created: {c.createdAt}
            </PTags>
            <Button
              text="View"
              back="#139D69"
              padding="0.2rem 1rem"
              margin="0 0.3rem 0 0"
              click={() => router.push("/appointments/" + c._id)}
            />
          </Container>
        );
      })}
      {loading && <Loader />}
    </Container>
  );
}

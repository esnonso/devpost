import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../Button";
import Container from "../Containers/container";
import { PTags } from "../Text";
import axios from "axios";
import Loader from "../Loader";

export default function ComplaintsPage(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const getMessages = async () => {
    try {
      const response = await axios.post("/api/getMessages");
      setMessages(response.data.messages);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <Container margin="5rem 1rem" flex="column" minHeight="50vh">
      <Container width="100%" justify="flex-end">
        <Button
          text="+New Message"
          back="#139D69"
          padding="0.2rem 1rem"
          margin="0 0.3rem 0.3rem 0"
          click={() => router.push("/messages/new")}
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
        Complaints
      </PTags>
      {messages.length < 1 && (
        <small style={{ textAlign: "center" }}>You have no complaints</small>
      )}
      {messages.map((c) => {
        return (
          <Container
            key={c._id}
            width="100%"
            borderBottom="1px gray solid"
            align="center"
            justify="space-between"
          >
            <PTags margin="0.5rem" width="30%">
              {c.complaint}
            </PTags>
            <PTags width="22%" margin="0.5rem">
              <span
                style={{
                  color:
                    c.status === "Unattended"
                      ? "red"
                      : c.status === "With A Doctor"
                      ? "Yellow"
                      : "green",
                }}
              >
                {c.status}
              </span>
            </PTags>
            <PTags margin="0.5rem" width="35%">
              {new Date(c.createdAt).toUTCString()}
            </PTags>
            <Button
              text="View"
              back="#139D69"
              padding="0.2rem 1rem"
              click={() => router.push(`/messages/${c._id}`)}
            />
          </Container>
        );
      })}
      {isLoading && <Loader />}
    </Container>
  );
}

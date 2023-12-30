import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Web5 } from "@web5/api";
import Button from "../Button";
import Container from "../Containers/container";
import { PTags } from "../Text";
import axios from "axios";
import Loader from "../Loader";

export default function ComplaintsPage(props) {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const getMessages = async () => {
    try {
      let response;
      if (status === "unauthenticated") {
        const { web5, did } = await Web5.connect();
        response = await axios.post("/api/getMessages", { did: did });
        setMessages(response.data.messages);
      } else {
        response = await axios.post("/api/getMessages");
        setMessages(response.data.messages);
      }
    } catch (error) {
      if (error.response) setError(error.response.data);
      else setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, [status]);

  return (
    <Container margin="5rem 1rem" flex="column" minHeight="50vh">
      <Container width="100%" justify="flex-end">
        <Button
          text="+New Message"
          back="#139D69"
          padding="0.2rem 1rem"
          margin="0 0.3rem 0.3rem 0"
          click={() => router.push("/chat/new")}
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
        Your Messages
      </PTags>
      {messages.map((c) => {
        return (
          <Container
            key={c._id}
            width="100%"
            borderBottom="1px gray solid"
            align="center"
          >
            <PTags width="20%" margin="0.5rem">
              {c.title}
            </PTags>

            <PTags width="30%" margin="0.5rem">
              Status: {c.status}
            </PTags>

            <PTags width="40%" margin="0.5rem">
              Created: {new Date(c.createdAt).toUTCString()}
            </PTags>

            <Button
              text="View"
              back="#139D69"
              padding="0.2rem 1rem"
              click={() => router.push(`/chat/${c._id}`)}
            />
          </Container>
        );
      })}
      {isLoading && <Loader />}
    </Container>
  );
}

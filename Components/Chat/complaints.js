import { useState, useEffect } from "react";
import { Web5 } from "@web5/api";
import Button from "../Button";
import Container from "../Containers/container";
import { PTags } from "../Text";
import axios from "axios";
import Loader from "../Loader";

export default function ComplaintsPage(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    try {
      const { web5, did } = await Web5.connect();
      const response = await axios.post("/api/getDidMessages", { did: did });
      setMessages(response.data.messages);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <Container margin="5rem 1rem" flex="column" minHeight="50vh">
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
            <PTags width="40%" margin="0.5rem">
              {c.title}
            </PTags>

            <PTags width="40%" margin="0.5rem">
              Status: {c.status}
            </PTags>

            <Button text="View replies" back="#139D69" padding="0.2rem 1rem" />
          </Container>
        );
      })}
      {isLoading && <Loader />}
    </Container>
  );
}

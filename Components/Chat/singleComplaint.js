import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Web5 } from "@web5/api";
import axios from "axios";
import Container from "../Containers/container";
import { PTags } from "../Text";
import Button from "../Button";
import Loader from "../Loader";
import classes from "./index.module.css";
import UserPrescription from "./prescription";

export default function SingleComplaintsForUnregisteredPatient({ complaint }) {
  const { status } = useSession();
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [prescription, showPrescription] = useState(false);
  const [error, setError] = useState("");

  const showPrescriptionHandler = () => showPrescription(true);
  const hidePrescriptionHandler = () => showPrescription(false);

  const authorizeMessageOwner = async () => {
    try {
      if (status === "unathenticated") {
        const { web5, did } = await Web5.connect();
        await axios.post(`/api/authorizeChat`, {
          did: did,
          chatId: complaint.id,
        });
      }
      if (status === "authenticated") {
        const res = await axios.post(`/api/authorizeChat`, {
          chatId: complaint.id,
        });
      }
    } catch (error) {
      return error;
    }
  };

  const createChatProtocolHandler = async () => {
    try {
      const { web5, did } = await Web5.connect();
      const { protocols: existingProtocol, status: existingProtocolStatus } =
        await web5.dwn.protocols.query({
          message: {
            filter: {
              protocol: "https://esnonso.com/chat-with-doctor-potocol",
            },
          },
        });
      if (
        existingProtocolStatus.code !== 200 ||
        existingProtocol.length === 0
      ) {
        const { protocol, status } = await web5.dwn.protocols.configure({
          message: {
            definition: userProtocolDefinition,
          },
        });
        await protocol.send(did);
      } else {
        return;
      }
    } catch (error) {
      return error;
    }
  };

  const fetchSentReplies = async () => {
    try {
      setIsLoading(true);
      const { web5, did } = await Web5.connect();
      const response = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: "https://esnonso.com/chat-with-doctor-protocol",
          },
        },
      });

      if (response.status.code === 200) {
        const sentChats = await Promise.all(
          response.records.map(async (record) => {
            const data = await record.data.json();
            return data;
          })
        );
        return sentChats;
      } else {
        throw new Error("An error occured loading this page");
      }
    } catch (error) {
      return error;
    }
  };

  const fetchReceivedReplies = async () => {
    try {
      const { web5, did } = await Web5.connect();
      const response = await web5.dwn.records.query({
        from: did,
        message: {
          filter: {
            protocol: "https://esnonso.com/chat-with-doctor-protocol",
            schema: "http://esnonso.com/user/user-chat-schema",
          },
        },
      });

      if (response.status.code === 200) {
        const receivedMessages = await Promise.all(
          response.records.map(async (record) => {
            const data = await record.data.json();
            return data;
          })
        );
        return receivedMessages;
      } else {
        throw new Error("An error occured loading this page");
      }
    } catch (error) {
      return error;
    }
  };

  const setUpPageHandler = async () => {
    try {
      setIsLoading(true);
      await authorizeMessageOwner();
      await createChatProtocolHandler();
      const allSent = await fetchSentReplies();
      const sent = allSent.filter((r) => r.complaintId === complaint.id);
      const allReceived = await fetchReceivedReplies();
      const received = allReceived.filter(
        (r) => r.complaintId === complaint.id
      );
      const replies = sent.concat(received);
      setReplies(replies);
    } catch (error) {
      if (error.response) setError(error.response.data);
      else setError("An error occured!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuthUserReplies = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/getReplies", {
        messageId: complaint.id,
      });
      setReplies(response.data.replies);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      setUpPageHandler();
    } else {
      fetchAuthUserReplies();
    }
  }, [status]);

  const sendReplyHandler = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      var currentdate = new Date();
      if (status === "unauthenticated") {
        const recipientDid = complaint.did;
        const { web5, did } = await Web5.connect();
        const chat = {
          complaintId: complaint.id,
          message: reply,
          time: currentdate,
          author: "You",
        };
        const { record } = await web5.dwn.records.write({
          data: chat,
          message: {
            protocol: "https://esnonso.com/chat-with-doctor-protocol",
            protocolPath: "chat",
            schema: "http://esnonso.com/user/user-chat-schema",
            recipient: recipientDid,
          },
        });
        await record.send(recipientDid);
        setUpPageHandler();
      }
      if (status === "authenticated") {
        await axios.post("/api/changeMessageStatus", {
          messageId: complaint.id,
          reply: { message: reply, author: "You", time: new Date() },
        });
        setReply("");
        fetchAuthUserReplies();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const reopenChatHandler = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/reopenChat", {
        messageId: complaint.id,
      });
      rou;
    } catch (error) {
      setError("An error occured! Try again");
      setIsLoading(false);
    }
  };

  return (
    <Container width="100%" margin="5rem 0 0 0" flex="column" padding="1rem">
      {complaint.status === "Completed" && (
        <Container width="100%" justify="flex-end">
          <Button
            text="View Prescription"
            width="fit-content"
            back={"#139d69"}
            padding={"0.3rem 2rem"}
            color="white"
            border={"none"}
            margin="0.2rem"
            click={showPrescriptionHandler}
          />
          <Button
            text="Re Open"
            width="fit-content"
            back={"#139d69"}
            padding={"0.3rem 2rem"}
            color="white"
            border={"none"}
            margin="0.2rem"
            click={reopenChatHandler}
          />
        </Container>
      )}
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
      <PTags fontWeight="600" margin="0 0 0.5rem 0">
        Title: {complaint.title}
      </PTags>
      <PTags fontWeight="600" margin="0 0 0.5rem 0">
        Status:{" "}
        <span
          style={{ color: complaint.status === "awaiting" ? "red" : "green" }}
        >
          {complaint.status.toUpperCase()}
        </span>
      </PTags>

      <PTags fontWeight="600">Message:</PTags>
      <PTags margin="0 0 2rem 0">{complaint.message}</PTags>

      {/* REPLIES CODE */}
      <Container borderBottom="1px gray solid" padding="0.5rem">
        <PTags fontWeight="600">Replies:</PTags>
      </Container>
      <Container flex="column" margin="0 0 2rem 0">
        {replies.map((r, i) => (
          <Container
            flex={"column"}
            key={i}
            borderBottom="1px gray solid"
            padding="0.5rem"
          >
            <PTags margin="0 0 0.7rem 0">
              {r.author}: {r.message}
            </PTags>
            <Container>
              <small>
                <b>Time:</b> {new Date(r.time).toUTCString()}
              </small>
            </Container>
          </Container>
        ))}
      </Container>

      <textarea
        placeholder="send a message"
        className={classes.input}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      ></textarea>
      <button
        className={classes.button}
        disabled={
          complaint.status === "awaiting" || complaint.status === "Completed"
        }
        onClick={sendReplyHandler}
      >
        Send
      </button>
      {prescription && (
        <UserPrescription
          messageId={complaint.id}
          onHide={hidePrescriptionHandler}
        />
      )}
      {loading && <Loader />}
    </Container>
  );
}

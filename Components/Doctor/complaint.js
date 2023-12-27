import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Web5 } from "@web5/api";
import Container from "../Containers/container";
import { PTags } from "../Text";
import Button from "../Button";
import classes from "./index.module.css";
import { userProtocolDefinition } from "@/Web5/protocol";
import axios, { all } from "axios";
import Loader from "../Loader";

export default function Complaints({ complaint }) {
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [role, setRole] = useState("");

  const fetchSentReplies = async () => {
    try {
      setIsLoading(true);
      const userData = await axios.post("/api/getUser");
      if (userData.data.user.role !== "Doctor") router.push("/");
      setRole(userData.data.user.role);
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
        console.log("error", response.status);
      }
    } catch (error) {}
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
        console.log("error", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllRepliesHandler = async () => {
    setIsLoading(true);
    const allSent = await fetchSentReplies();
    const sent = allSent.filter((r) => r.complaintId === complaint.id);
    const allReceived = await fetchReceivedReplies();
    const received = allReceived.filter((r) => r.complaintId === complaint.id);
    const replies = sent.concat(received);
    setReplies(replies);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllRepliesHandler();
  }, []);

  const attendToComplain = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/changeMessageStatus", {
        messageId: complaint.id,
      });
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
      setError(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const sendReplyHandler = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      var currentdate = new Date();
      const recipientDid = complaint.did;
      const { web5, did } = await Web5.connect();
      const chat = {
        complaintId: complaint.id,
        message: reply,
        time: currentdate,
        author: "Doctor",
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
      setReply("");
      fetchReplies();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container
      margin="5rem 0 0 0"
      minHeight="70vh"
      width="100%"
      flex="column"
      padding="1rem"
    >
      {role === "Doctor" && (
        <Container margin="0 0 2rem 0">
          {complaint.status === "awaiting" && (
            <Button
              text="Attend"
              width="fit-content"
              back={"#139d69"}
              padding={"0.3rem 2rem"}
              margin="0.2rem"
              color="white"
              border={"none"}
              click={attendToComplain}
            />
          )}
          <Button
            text="Give Prescription"
            width="fit-content"
            back={"#139d69"}
            padding={"0.3rem 2rem"}
            color="white"
            border={"none"}
            margin="0.2rem"
            click={() => router.push(`/`)}
          />
          <Button
            text="View Patient history"
            width="fit-content"
            back={"#139d69"}
            padding={"0.3rem 2rem"}
            color="white"
            border={"none"}
            margin="0.2rem"
            click={() => router.push(`/`)}
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
          <small>Error: {error}</small>
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
              {r.author === "Doctor" ? r.author : "You"}: {r.message}
            </PTags>
            <Container>
              <small>
                <b>Time:</b> {r.time}
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
        disabled={complaint.status === "awaiting"}
        onClick={sendReplyHandler}
      >
        Send
      </button>

      {loading && <Loader />}
    </Container>
  );
}

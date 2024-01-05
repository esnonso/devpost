import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Web5 } from "@web5/api";
import axios from "axios";
import Container from "../Containers/container";
import { PTags } from "../Text";
import Button from "../Button";
import Loader from "../Loader";
import classes from "./index.module.css";
import UserPrescription from "./prescription";
import { userProtocolDefinition } from "@/Web5/protocol";

export default function SinglemessagesForUnregisteredPatient({ id }) {
  const { status } = useSession();
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [prescription, showPrescription] = useState(false);
  const [error, setError] = useState("");
  const [doctorDid, setDoctorDid] = useState("");
  const [webFive, setWebFive] = useState(null);
  const params = useParams();

  const showPrescriptionHandler = () => showPrescription(true);
  const hidePrescriptionHandler = () => showPrescription(false);

  const authorizeMessageOwner = async () => {
    try {
      const did = localStorage.getItem("did");
      const response = await axios.post(`/api/authorizeChat`, {
        did: did,
        chatId: params.chatId,
      });
      setMessage(response.data);
      if (status === "authenticated") {
        setReplies(response.data.replies);
        return { data: response.data };
      } else {
        if (response.data.status !== "Awaiting") {
          setDoctorDid(response.data.doctorDid);
        }
        const { web5, did } = await Web5.connect();
        setWebFive(web5);
        return {
          data: response.data,
          webFive: web5,
          did: did,
          docD: response.data.doctorDid,
        };
      }
    } catch (error) {
      setError("An error occured");
    }
  };

  const createChatProtocolHandler = async (web5, did) => {
    try {
      const { protocols: existingProtocol, status: existingProtocolStatus } =
        await web5.dwn.protocols.query({
          message: {
            filter: {
              protocol: "http://esnonso.com/chat-with-doc-protocol",
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
        console.log("done");
      } else {
        return;
      }
    } catch (error) {
      setError("An error occured");
    }
  };

  const fetchPatientMessagesHandler = async (web5) => {
    try {
      const response = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: "http://esnonso.com/chat-with-doc-protocol",
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
      setError("An error occured");
    }
  };

  const fetchDoctorsMessagesHandler = async (web5, did) => {
    try {
      const response = await web5.dwn.records.query({
        from: did,
        message: {
          filter: {
            protocol: "http://esnonso.com/chat-with-doc-protocol",
            schema: "http://esnonso.com/chat-with-doctor-schema",
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
      setError("An error occured");
    }
  };

  function compare(a, b) {
    if (a.time < b.time) {
      return -1;
    }
    if (a.time > b.time) {
      return 1;
    }
    return 0;
  }

  const setUpPageHandler = async () => {
    try {
      setIsLoading(true);
      const m = await authorizeMessageOwner();
      if (m.data.identifier === "Web5" && m.data.status !== "Awaiting") {
        await createChatProtocolHandler(m.webFive, m.did);
        const allSent = await fetchPatientMessagesHandler(m.webFive);
        const sent = allSent.filter((r) => r.complaintId === id);
        const allReceived = await fetchDoctorsMessagesHandler(
          m.webFive,
          m.docD
        );
        const received = allReceived.filter((r) => r.complaintId === id);
        const replies = sent.concat(received);
        const removeDuplicates = replies.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (c) => c.message === value.message && c.time === value.time
            )
        );
        const allReplies = await removeDuplicates.sort(compare);
        setReplies(allReplies);
      }
    } catch (error) {
      if (error.response) setError(error.response.data);
      else setError("An error occured!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError();
    if (status === "unauthenticated") {
      setUpPageHandler();
    }
    if (status === "authenticated") {
      authorizeMessageOwner();
    }
  }, [status]);

  const sendReplyHandler = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      var currentdate = new Date();
      if (status === "unauthenticated") {
        const chat = {
          complaintId: id,
          message: reply,
          time: currentdate,
          author: "User",
        };
        const { record } = await webFive.dwn.records.write({
          data: chat,
          message: {
            protocol: "http://esnonso.com/chat-with-doc-protocol",
            protocolPath: "chat",
            schema: "http://esnonso.com/chat-with-doctor-schema",
            recipient: doctorDid,
          },
        });
        await record.send(doctorDid);
        setReply("");
        setUpPageHandler();
      }
      if (status === "authenticated") {
        const res = await axios.post("/api/postMessageReply", {
          messageId: id,
          reply: { message: reply, author: "You", time: new Date() },
        });
        setReply("");
        setReplies(res.data.replies);
      }
    } catch (error) {
      setError(error.message || "An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  const reopenChatHandler = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/reopenChat", {
        messageId: message.id,
      });
      rou;
    } catch (error) {
      setError("An error occured! Try again");
      setIsLoading(false);
    }
  };

  return (
    <Container width="100%" margin="5rem 0 0 0" flex="column" padding="1rem">
      {message.status === "Completed" && (
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
        Title: {message.title}
      </PTags>
      <PTags fontWeight="600" margin="0 0 0.5rem 0">
        Status:{" "}
        {message.status && (
          <span
            style={{
              color:
                message.status === "Awaiting"
                  ? "red"
                  : message.status === "With a doctor"
                  ? "Yellow"
                  : "green",
            }}
          >
            {message.status}
          </span>
        )}
      </PTags>

      <PTags fontWeight="600">Message:</PTags>
      <PTags margin="0 0 2rem 0">{message.message}</PTags>

      {/* REPLIES CODE */}
      <Container borderBottom="1px gray solid" padding="0.5rem" flex="column">
        <PTags fontWeight="600">Replies:</PTags>

        <small>
          Note: You will be able to chat when a doctor joins this conversation
        </small>
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
          message.status === "Awaiting" || message.status === "Completed"
        }
        onClick={sendReplyHandler}
      >
        Send
      </button>
      {prescription && (
        <UserPrescription messageId={id} onHide={hidePrescriptionHandler} />
      )}
      {loading && <Loader message="Loading..." />}
    </Container>
  );
}

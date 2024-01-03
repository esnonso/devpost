import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Web5 } from "@web5/api";
import Container from "../Containers/container";
import { PTags } from "../Text";
import Button from "../Button";
import classes from "./index.module.css";
import { userProtocolDefinition } from "@/Web5/protocol";
import axios from "axios";
import Loader from "../Loader";
import Prescription from "./prescription";

export default function Complaints({ id }) {
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [prescription, showPrescription] = useState(false);
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [role, setRole] = useState("");
  const [patientDid, setPatientDid] = useState("");
  const [webFive, setWebFive] = useState(null);
  const [doctorDid, setDoctorDid] = useState("");
  const [complaint, setComplaint] = useState("");

  const showPrescriptionHandler = () => showPrescription(true);
  const hidePrescriptionHandler = () => showPrescription(false);

  const getMessageDetails = async () => {
    try {
      const userData = await axios.post("/api/getUser");
      if (userData.data.user.role !== "Doctor") router.push("/");
      setRole(userData.data.user.role);
      const response = await axios.post(`/api/authorizeChat`, {
        chatId: id,
      });
      setComplaint(response.data);
      if (response.data.identifier === "Web5") {
        const { web5, did } = await Web5.connect();
        setWebFive(web5);
        setDoctorDid(did);
        setPatientDid(response.data.did);
        return {
          data: response.data,
          webFive: web5,
          patDid: response.data.did,
        };
      }
      if (response.data.identifier === "UserId") {
        setReplies(response.data.replies);
        return { data: response.data };
      }
    } catch (error) {
      setError("An error occured");
    }
  };

  const fetchDoctorsMessagesHandler = async (web5) => {
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
        return "error", response.status;
      }
    } catch (error) {
      setError("An error occured");
    }
  };

  const fetchPatientMessagesHandler = async (web5, did) => {
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
        console.log("error", response.status);
      }
    } catch (error) {
      setError("An error occured");
    }
  };

  const arrangeRepliesForThisComplaintHandler = async () => {
    try {
      setIsLoading(true);
      const m = await getMessageDetails();
      if (m.data.identifier === "Web5" && m.data.status !== "Awaiting") {
        const allSent = await fetchDoctorsMessagesHandler(m.webFive);
        const sent = allSent.filter((r) => r.complaintId === id);
        const allReceived = await fetchPatientMessagesHandler(
          m.webFive,
          m.patDid
        );
        const received = allReceived.filter((r) => r.complaintId === id);
        const replies = sent.concat(received);
        setReplies(replies);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    arrangeRepliesForThisComplaintHandler();
  }, []);

  const createChatProtocolHandler = async () => {
    try {
      const { protocols: existingProtocol, status: existingProtocolStatus } =
        await webFive.dwn.protocols.query({
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
        const { protocol, status } = await webFive.dwn.protocols.configure({
          message: {
            definition: userProtocolDefinition,
          },
        });
        await protocol.send(doctorDid);
      } else {
        return;
      }
    } catch (error) {
      setError("An error occured");
    }
  };

  const attendToComplainHandler = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/changeMessageStatus", {
        messageId: id,
        did: doctorDid,
        status: "With a Doctor",
      });
      setComplaint(response.data);
      if (complaint.identifier === "Web5") {
        createChatProtocolHandler();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendReplyHandler = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();

      if (complaint.identifier === "Web5") {
        var currentdate = new Date();
        const chat = {
          complaintId: id,
          message: reply,
          time: currentdate,
          author: "Doctor",
        };
        const { record } = await webFive.dwn.records.write({
          data: chat,
          message: {
            protocol: "http://esnonso.com/chat-with-doc-protocol",
            protocolPath: "chat",
            schema: "http://esnonso.com/chat-with-doctor-schema",
            recipient: patientDid,
          },
        });
        await record.send(patientDid);
        console.log(patientDid);
        setReply("");
        arrangeRepliesForThisComplaintHandler();
      }
      if (complaint.identifier === "UserId") {
        await axios.post("/api/postMessageReply", {
          messageId: id,
          reply: { message: reply, author: "Doctor", time: new Date() },
        });
        setReply("");
        getMessageDetails();
      }
    } catch (error) {
      console.log(error);
      setError("An error occured");
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
          {complaint.status === "Awaiting" && (
            <Button
              text="Attend"
              width="fit-content"
              back={"#139d69"}
              padding={"0.3rem 2rem"}
              margin="0.2rem"
              color="white"
              border={"none"}
              click={attendToComplainHandler}
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
            click={showPrescriptionHandler}
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
      {prescription && (
        <Prescription onHide={hidePrescriptionHandler} messageId={id} />
      )}
      <PTags fontWeight="600" margin="0 0 0.5rem 0">
        Title: {complaint.title}
      </PTags>
      <PTags fontWeight="600" margin="0 0 0.5rem 0">
        Status:{" "}
        <span
          style={{
            color:
              complaint.status === "Awaiting"
                ? "red"
                : complaint.status === "With a doctor"
                ? "Yellow"
                : "green",
          }}
        >
          {complaint.status}
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
        disabled={complaint.status === "Awaiting"}
        onClick={sendReplyHandler}
      >
        Send
      </button>

      {loading && <Loader message={"Loading conversation"} />}
    </Container>
  );
}

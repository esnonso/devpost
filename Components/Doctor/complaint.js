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
import {
  fetchSentMessages,
  fetchReceivedMessages,
  sortWeb5Messages,
  createChatProtocol,
} from "@/Web5/functions";

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
  const [submitting, setIsSubmitting] = useState(false);

  const showPrescriptionHandler = () => showPrescription(true);
  const hidePrescriptionHandler = () => showPrescription(false);

  const getUserRepliesHandler = async () => {
    try {
      const response = await axios.post(`/api/getReplies`, {
        messageId: id,
      });
      setReplies(response.data.replies);
    } catch (err) {
      setError("An error occured fetching replies");
    }
  };

  const authorizeDoctorHandler = async () => {
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
      }

      if (response.data.identifier === "UserId") {
        getUserRepliesHandler();
      }
    } catch (error) {
      setError("An error occured");
    }
  };

  const getWeb5RepliesHandler = async (webF, uDid) => {
    try {
      setError("");
      const sent = await fetchSentMessages(
        webFive,
        "http://esnonso.com/chat-with-doc-protocol"
      );
      const received = await fetchReceivedMessages(
        webFive,
        patientDid,
        "http://esnonso.com/chat-with-doc-protocol",
        "http://esnonso.com/chat-with-doctor-schema"
      );
      const replies = await sortWeb5Messages(sent, received, id);
      setReplies(replies);
    } catch (error) {
      setError("An error occured fetching Web5 replies");
    }
  };

  useEffect(() => {
    authorizeDoctorHandler();
  }, []);

  useEffect(() => {
    if (!webFive) return;
    setIsLoading(true);
    getWeb5RepliesHandler().then(() => setIsLoading(false));
  }, [webFive]);

  const createChatProtocolHandler = async () => {
    try {
      await createChatProtocol(
        webFive,
        doctorDid,
        "http://esnonso.com/chat-with-doc-protocol",
        userProtocolDefinition
      );
    } catch (error) {
      setError("An error occured creating chat protocol");
    }
  };

  const attendToComplainHandler = async () => {
    try {
      setIsLoading(true);

      if (complaint.identifier === "Web5") {
        if (!doctorDid)
          throw new Error("An error occured, reload page and try again");
        const response = await axios.post("/api/changeMessageStatus", {
          messageId: id,
          did: doctorDid,
          status: "With a Doctor",
        });
        setComplaint(response.data);
        await createChatProtocolHandler();
      }

      if (complaint.identifier === "UserId") {
        const response = await axios.post("/api/changeMessageStatus", {
          messageId: id,
          status: "With a Doctor",
        });
        setComplaint(response.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendReplyHandler = async (e) => {
    try {
      setIsSubmitting(true);
      e.preventDefault();
      if (reply === "") return;
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
        setReply("");
      }
      if (complaint.identifier === "UserId") {
        const res = await axios.post("/api/postMessageReply", {
          messageId: id,
          reply: { message: reply, author: "Doctor", time: new Date() },
        });
        setReply("");
        setReplies(res.data.replies);
      }
    } catch (error) {
      setError("An error occured");
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshChatsHandler = async () => {
    if (
      complaint.identifier === "UserId" &&
      complaint.status === "With a Doctor"
    ) {
      await getUserRepliesHandler();
    }
    if (
      complaint.identifier === "Web5" &&
      complaint.status === "With a Doctor"
    ) {
      await getWeb5RepliesHandler();
    }
  };

  useEffect(() => {
    if (!complaint && !webFive) return;
    const intervalId = setInterval(async () => {
      refreshChatsHandler();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [complaint, webFive]);

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

      <PTags margin="0 0 0.5rem 0">
        {complaint.identifier === "UserId" && (
          <span style={{ color: "#139d69", fontSize: "20px" }}>★ </span>
        )}
        <b>Title: </b> {complaint.title}
      </PTags>
      <PTags margin="0 0 0.5rem 0">
        <b>Status: </b>
        <span
          style={{
            backgroundColor:
              complaint.status === "Awaiting"
                ? "red"
                : complaint.status === "With a Doctor"
                ? "#FFEC19"
                : "#139D69",
            padding: "0.3rem 0.5rem",
          }}
        >
          {complaint.status}
        </span>
      </PTags>

      <PTags margin="0 0 2rem 0">
        <b>Message: </b>
        {complaint.message}
      </PTags>

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
              <small>{new Date(r.time).toUTCString()}</small>
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
          complaint.status === "Awaiting" ||
          complaint.status === "Completed" ||
          submitting
        }
        onClick={sendReplyHandler}
      >
        {submitting ? "Sending" : "Send"}
      </button>

      {loading && <Loader message={"Loading..."} />}
    </Container>
  );
}

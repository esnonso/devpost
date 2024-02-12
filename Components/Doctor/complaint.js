import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Container from "../Containers/container";
import { PTags } from "../Text";
import Button from "../Button";
import classes from "./index.module.css";
import axios from "axios";
import Loader from "../Loader";
import Prescription from "./prescription";
import Record from "./record";

export default function Complaints({ id }) {
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [prescription, showPrescription] = useState(false);
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [complaint, setComplaint] = useState("");
  const [submitting, setIsSubmitting] = useState(false);
  const [record, showRecord] = useState(false);

  const showPrescriptionHandler = () => showPrescription(true);
  const hidePrescriptionHandler = () => showPrescription(false);

  const showRecordHandler = () => showRecord(true);
  const hideRecordHandler = () => showRecord(false);

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
      const response = await axios.post(`/api/authorizeChat`, {
        chatId: id,
      });

      if (response.data.role !== "Doctor") router.push("/");

      setComplaint(response.data.complaint);
      setRole(response.data.role);
      if (response.data.complaint.attendedBy) {
        setName(response.data.complaint.attendedBy.name.split(" ")[0]);
      }
      getUserRepliesHandler();
    } catch (error) {
      setError("An error occured");
    }
  };

  useEffect(() => {
    authorizeDoctorHandler();
  }, []);

  const attendToComplainHandler = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/changeMessageStatus", {
        messageId: id,
        status: "With a Doctor",
      });
      setComplaint(response.data);
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
      const res = await axios.post("/api/postMessageReply", {
        messageId: id,
        reply: { message: reply, author: name, time: new Date() },
      });
      setReply("");
      setReplies(res.data.replies);
    } catch (error) {
      setError("An error occured");
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshChatsHandler = async () => {
    if (complaint.status === "With a Doctor") {
      await getUserRepliesHandler();
    }
  };

  useEffect(() => {
    if (!complaint) return;
    const intervalId = setInterval(async () => {
      refreshChatsHandler();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [complaint]);

  const closeComplaintHandler = async () => {
    try {
      await axios.post("/api/closeComplaint", { messageId: id });
      window.location.reload();
    } catch (error) {
      console.log(error);
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
        <Container margin="0 0 2rem 0" width="100%" wrap="wrap">
          {complaint.status === "Unattended" && (
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
            text="Prescribe"
            width="fit-content"
            back={"#139d69"}
            padding={"0.3rem 2rem"}
            color="white"
            border={"none"}
            margin="0.2rem"
            click={showPrescriptionHandler}
          />
          <Button
            text="Record"
            width="fit-content"
            back={"#139d69"}
            padding={"0.3rem 2rem"}
            color="white"
            border={"none"}
            margin="0.2rem"
            click={showRecordHandler}
          />

          <Button
            text="Close"
            width="fit-content"
            back={"#139d69"}
            padding={"0.3rem 2rem"}
            color="white"
            border={"none"}
            margin="0.2rem"
            click={closeComplaintHandler}
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
        <b>Title: </b> {complaint.complaint}
      </PTags>
      <PTags margin="0 0 0.5rem 0">
        <b>Status: </b>
        <span
          style={{
            backgroundColor:
              complaint.status === "Unattended"
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

      <PTags margin="0 0 0.5rem 0">
        <b>Message: </b>
        {complaint.message}
      </PTags>

      {complaint.notes && (
        <PTags margin="0 0 0.5rem 0">
          <b>Notes: </b>
          {complaint.notes}
        </PTags>
      )}

      {complaint.conclusion && (
        <PTags margin="0 0 2rem 0">
          <b>Conclusion: </b>
          {complaint.conclusion}
        </PTags>
      )}

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
              <b>{r.author}:</b> {r.message}
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
          complaint.status === "Unattended" ||
          complaint.status === "Closed" ||
          submitting
        }
        onClick={sendReplyHandler}
      >
        {submitting ? "Sending" : "Send"}
      </button>

      {loading && <Loader message={"Loading..."} />}

      {record && <Record id={id} onHide={hideRecordHandler} />}
    </Container>
  );
}

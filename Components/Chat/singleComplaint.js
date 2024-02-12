import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Container from "../Containers/container";
import { PTags } from "../Text";
import Button from "../Button";
import Loader from "../Loader";
import classes from "./index.module.css";
import UserPrescription from "./prescription";

export default function SinglemessagesForUnregisteredPatient({ id }) {
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [prescription, showPrescription] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [submitting, setIsSubmitting] = useState(false);
  const params = useParams();

  const showPrescriptionHandler = () => showPrescription(true);
  const hidePrescriptionHandler = () => showPrescription(false);

  const authorizeMessageOwner = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/authorizeChatUser`, {
        chatId: params.chatId,
      });
      setMessage(response.data);
      setName(response.data.user.name.split(" ")[0]);
      setReplies(response.data.replies);
    } catch (error) {
      console.log(error);
      setError("An error occured Loding message");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRepliesHandler = async () => {
    try {
      const response = await axios.post(`/api/getReplies`, {
        messageId: params.chatId,
      });
      setReplies(response.data.replies);
    } catch (err) {
      setError("An error occured fetching User replies");
    }
  };

  useEffect(() => {
    setError();
    authorizeMessageOwner();
  }, []);

  const refreshChatsHandler = async () => {
    await getUserRepliesHandler();
  };

  const refreshMessageStatusHandler = async () => {
    try {
      const response = await axios.post(`/api/authorizeChatUser`, {
        chatId: params.chatId,
      });
      setMessage(response.data);
    } catch (error) {
      setError("An error occured Loading this page");
    }
  };

  useEffect(() => {
    if (!message) return;
    const intervalId = setInterval(async () => {
      refreshMessageStatusHandler().then(() => refreshChatsHandler());
    }, 2000);

    return () => clearInterval(intervalId);
  }, [message]);

  const sendReplyHandler = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      if (reply === "") return;
      const res = await axios.post("/api/postMessageReply", {
        messageId: id,
        reply: { message: reply, author: name, time: new Date() },
      });
      setReply("");
      setReplies(res.data.replies);
    } catch (error) {
      setError(error.message || "An error occured");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container width="100%" margin="5rem 0 0 0" flex="column" padding="1rem">
      {message.prescription && (
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
      <PTags margin="0 0 0.5rem 0">
        <b>Complaint: </b> {message.complaint}
      </PTags>
      <PTags margin="0 0 0.5rem 0">
        <b> Status: </b>
        {message.status && (
          <span
            style={{
              backgroundColor:
                message.status === "Unattended"
                  ? "red"
                  : message.status === "With a Doctor"
                  ? "#FFEC19"
                  : "#139D69",
              padding: "0.3rem 0.5rem",
            }}
          >
            {message.status}
          </span>
        )}
      </PTags>

      <PTags margin="0 0 0.5rem 0">
        <b>Attended By: </b> {message.attendedBy && message.attendedBy.name}
      </PTags>
      <PTags margin="0 0 0.5rem 0">
        <b>Message: </b>
        {message.message}
      </PTags>

      {message.notes && (
        <PTags margin="0 0 0.5rem 0">
          <b>Notes: </b>
          {message.notes}
        </PTags>
      )}

      {message.conclusion && (
        <PTags margin="0 0 2rem 0">
          <b>Conclusion: </b>
          {message.conclusion}
        </PTags>
      )}

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
              <b>{r.author}:</b> {r.message}
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
          message.status === "Awaiting" ||
          message.status === "Completed" ||
          submitting
        }
        onClick={sendReplyHandler}
      >
        {submitting ? "Sending" : "Send"}
      </button>
      {prescription && (
        <UserPrescription messageId={id} onHide={hidePrescriptionHandler} />
      )}
      {loading && <Loader message="Loading..." />}
    </Container>
  );
}

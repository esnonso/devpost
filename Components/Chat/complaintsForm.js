import { useState } from "react";
import { useRouter } from "next/router";
import Container from "../Containers/container";
import { PTags } from "../Text";
import classes from "./index.module.css";
import axios from "axios";
import Modal from "../Modal";

export default function ComplaintsForm() {
  const router = useRouter();
  const [complaint, setComplaint] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const closeSuccessMessageHandler = () => {
    router.push("/messages");
  };

  const submitHandler = async (e) => {
    setError("");
    setIsSubmitting(true);
    e.preventDefault();

    try {
      if (complaint === "" || message === "")
        throw new Error("Fill all inputs");
      const response = await axios.post("/api/postMessage", {
        complaint,
        message,
      });
      setSuccessMessage(response.data);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <Container margin="5rem 1rem 0 1rem" flex="column">
      <form className={classes["chat-container"]} onSubmit={submitHandler}>
        <PTags fontSize="25px" textAlign="center" margin="0 0 1rem 0">
          Message a doctor
        </PTags>
        <Container width="100%" flex="column">
          {error && (
            <Container
              width="100%"
              margin="0 auto"
              padding="0.5rem"
              color="#F8D7DA"
              radius="5px"
            >
              <small>Error 403: {error}</small>
            </Container>
          )}
          <label className={classes.label} htmlFor="title">
            Complaint <span style={{ color: "red" }}>*</span>
          </label>
          <input
            placeholder="ex: chronic headace, severe waistpain"
            type="text"
            className={classes.input}
            value={complaint}
            onChange={inputChangeHandler(setComplaint)}
            required
          />
        </Container>

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="message">
            Message <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            className={classes.input}
            required
            rows="10"
            value={message}
            onChange={inputChangeHandler(setMessage)}
          ></textarea>
        </Container>
        <Container width="100%" justify="flex-end">
          <button type="submit" disabled={isSubmitting} className="btn">
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </Container>
      </form>

      {successMessage && (
        <Modal click={closeSuccessMessageHandler}>{successMessage}</Modal>
      )}
    </Container>
  );
}

import { useEffect, useState } from "react";
import { Web5 } from "@web5/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Container from "../Containers/container";
import { PTags } from "../Text";
import classes from "./index.module.css";
import axios from "axios";

export default function ComplaintsForm() {
  const router = useRouter();
  const { status } = useSession();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const submitHandler = async (e) => {
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    e.preventDefault();

    try {
      if (status === "unauthenticated") {
        const { web5, did } = await Web5.connect();
        await axios.post("/api/postMessage", {
          title: title,
          message: message,
          gender: gender,
          ageRange: age,
          did: did,
          status: "awaiting",
        });
      } else {
        await axios.post("/api/postMessage", {
          title: title,
          message: message,
          gender: gender,
          ageRange: age,
          status: "awaiting",
        });
      }
      router.push("/chat");
    } catch (error) {
      if (error.response) setError(error.response.data);
      else setError("An error occured!");
    } finally {
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
            Title:
          </label>
          <input
            placeholder="ex: chronic headace, severe waistpain"
            type="text"
            className={classes.input}
            value={title}
            onChange={inputChangeHandler(setTitle)}
            required
          />
        </Container>
        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="title">
            Age range:
          </label>

          <select
            className={classes.input}
            value={age}
            onChange={inputChangeHandler(setAge)}
            required
          >
            <option>Select </option>
            <option>0 to 2 years</option>
            <option>3 to 10 years</option>
            <option>10 to 20 years </option>
            <option>20 to 40 years </option>
            <option>Above 40 </option>
          </select>
        </Container>

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="title">
            Gender:
          </label>
          <select
            className={classes.input}
            value={gender}
            onChange={inputChangeHandler(setGender)}
            required
          >
            <option>Select </option>
            <option>Female </option>
            <option>Male </option>
          </select>
        </Container>
        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="message">
            Message:
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
    </Container>
  );
}

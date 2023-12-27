import { useState } from "react";
import { useRouter } from "next/router";
import Container from "../Containers/container";
import { PTags } from "../Text";
import classes from "./index.module.css";
import axios from "axios";
import Loader from "../Loader";
import Modal from "../Modal";
import Backdrop from "../Backdrop";

export default function SubscriptionForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccesMessage] = useState("");
  const [dob, setDob] = useState("");

  const hideSuccessMessageHandler = () => {
    // router.push("/");
  };

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const submitHandler = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    try {
      const response = await axios.post("/api/subscribe", {
        reason: reason,
        gender: gender,
        test: test,
        did: Math.floor(Math.random() * 10000 * 10),
        status: "awaiting",
      });
      setSuccesMessage(response.data.message);
      setIsSubmitting(false);
    } catch (error) {
      return error;
    }
  };

  return (
    <Container margin="5rem 1rem 0 1rem" flex="column">
      <form className={classes["chat-container"]} onSubmit={submitHandler}>
        <PTags fontSize="25px" textAlign="center" margin="0 0 1rem 0">
          Subscribe To Health Package
        </PTags>

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Reason">
            Email
          </label>

          <input
            type="text"
            className={classes.input}
            value={email}
            onChange={inputChangeHandler(setEmail)}
          />
        </Container>

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Reason">
            Full name
          </label>
          <input
            type="text"
            className={classes.input}
            value={name}
            onChange={inputChangeHandler(setName)}
          />
        </Container>

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Reason">
            Date of Birth
          </label>
          <input
            type="text"
            className={classes.input}
            value={dob}
            onChange={inputChangeHandler(setDob)}
          />
        </Container>

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Gender">
            Gender:
          </label>
          <select
            className={classes.input}
            value={gender}
            onChange={inputChangeHandler(setGender)}
          >
            <option>Select </option>
            <option>Female </option>
            <option>Male </option>
          </select>
        </Container>

        <Container width="100%" justify="flex-end">
          <button type="submit" disabled={isSubmitting} className="btn">
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </Container>
      </form>
      {isLoading && <Loader />}
      {successMessage && (
        <>
          <Backdrop />
          <Modal click={hideSuccessMessageHandler}>
            <p>{successMessage}</p>
          </Modal>
        </>
      )}
    </Container>
  );
}

const labTests = ["Genotype", "XRAY", "Malaria"];

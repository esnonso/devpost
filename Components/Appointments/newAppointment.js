import { useState } from "react";
import { useRouter } from "next/router";
import Container from "../Containers/container";
import { PTags } from "../Text";
import classes from "./index.module.css";
import axios from "axios";
import Loader from "../Loader";
import Modal from "../Modal";
import Backdrop from "../Backdrop";

export default function AppointmentForm() {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [test, setTest] = useState("");
  const [gender, setGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccesMessage] = useState("");
  const [error, setError] = useState("");

  const hideSuccessMessageHandler = () => {
    router.push("/appointments");
  };

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const submitHandler = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    try {
      const response = await axios.post("/api/appointment", {
        reason: reason,
        gender: gender,
        test: test,
        did: 26549,
        status: "awaiting",
      });
      setSuccesMessage(response.data.message);
      setIsSubmitting(false);
    } catch (error) {
      setError(error.response.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container margin="5rem 1rem 0 1rem" flex="column">
      <form className={classes["chat-container"]} onSubmit={submitHandler}>
        <PTags fontSize="25px" textAlign="center" margin="0 0 1rem 0">
          Book Appointment
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
          <label className={classes.label} htmlFor="Reason">
            Reason
          </label>

          <select
            className={classes.input}
            value={reason}
            onChange={inputChangeHandler(setReason)}
          >
            <option>Select </option>
            <option>Lab test</option>
            <option>See a doctor</option>
          </select>
        </Container>

        {reason === "Lab test" && (
          <Container width="100%" flex="column">
            <label className={classes.label} htmlFor="Test">
              Select test
            </label>
            <select
              className={classes.input}
              value={test}
              onChange={inputChangeHandler(setTest)}
            >
              <option>Select </option>
              {labTests.map((l, i) => (
                <option key={i}>{l} </option>
              ))}
            </select>
          </Container>
        )}

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

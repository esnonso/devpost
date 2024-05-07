import { useState } from "react";
import { useRouter } from "next/router";
import Container from "../Containers/container";
import { PTags } from "../Text";
import classes from "./index.module.css";
import axios from "axios";

export default function AppointmentForm() {
  const router = useRouter();
  const [apptType, setApptType] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [testType, setTestType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const submitHandler = async (e) => {
    try {
      setIsSubmitting(true);
      e.preventDefault();
      await axios.post("/api/postAppointment", {
        apptType: apptType,
        testType: testType,
        status: "Awaiting",
        proposedDate,
      });
      router.push("/appointments");
    } catch (error) {
      if (error.response) setError(error.response.data);
      else setError("An error occured!");
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
              <small> {error}</small>
            </Container>
          )}
          <label className={classes.label} htmlFor="apptType">
            Appointment Type
          </label>

          <select
            className={classes.input}
            value={apptType}
            onChange={inputChangeHandler(setApptType)}
          >
            <option>Select </option>
            <option>Lab test</option>
            <option>See a doctor</option>
          </select>
        </Container>

        {apptType === "Lab test" && (
          <Container width="100%" flex="column">
            <label className={classes.label} htmlFor="TestType">
              Select test
            </label>
            <select
              className={classes.input}
              value={testType}
              onChange={inputChangeHandler(setTestType)}
            >
              <option>Select </option>
              {labTestTypes.map((l, i) => (
                <option key={i}>{l} </option>
              ))}
            </select>
          </Container>
        )}

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Gender">
            Proposed Date and Time:
          </label>
          <input
            type="datetime-local"
            className={classes.input}
            value={proposedDate}
            onChange={inputChangeHandler(setProposedDate)}
          />
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

const labTestTypes = ["Genotype", "XRAY", "Malaria"];

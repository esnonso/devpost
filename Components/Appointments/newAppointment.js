import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Web5 } from "@web5/api";
import Container from "../Containers/container";
import { PTags } from "../Text";
import classes from "./index.module.css";
import { appointmentProtocolDefinition } from "@/Web5/protocol";
import axios from "axios";
import Loader from "../Loader";

export default function AppointmentForm() {
  const router = useRouter();
  const { status } = useSession();
  const [apptType, setApptType] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [testType, setTestType] = useState("");
  const [gender, setGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userDid, setDid] = useState("");
  const [loading, setIsLoading] = useState(false);

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const createChatProtocolHandler = async () => {
    try {
      setIsLoading(true);
      const { web5, did } = await Web5.connect();
      if (typeof window !== "undefined") localStorage.setItem("did", did);
      setDid(did);
      const { protocols: existingProtocol, status: existingProtocolStatus } =
        await web5.dwn.protocols.query({
          message: {
            filter: {
              protocol: "http://esnonso.com/book-appointment-protocol",
            },
          },
        });
      if (
        existingProtocolStatus.code !== 200 ||
        existingProtocol.length === 0
      ) {
        const { protocol, status } = await web5.dwn.protocols.configure({
          message: {
            definition: appointmentProtocolDefinition,
          },
        });
        await protocol.send(did);
      } else {
        return;
      }
    } catch (error) {
      setError("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      createChatProtocolHandler();
    }
  }, [status]);

  const submitHandler = async (e) => {
    try {
      setIsSubmitting(true);
      e.preventDefault();
      if (status === "unauthenticated") {
        await axios.post("/api/postAppointment", {
          userDid,
          apptType: apptType,
          gender: gender,
          testType: testType,
          status: "Awaiting",
          proposedDate,
        });
      } else {
        await axios.post("/api/postAppointment", {
          apptType: apptType,
          gender: gender,
          testType: testType,
          status: "Awaiting",
          proposedDate,
        });
      }
      router.push("/appointments");
    } catch (error) {
      if (error.response) setError(error.response.data);
      else setError("An error occured!");
      setIsSubmitting(false);
    }
  };

  return (
    <Container margin="5rem 1rem 0 1rem" flex="column">
      {loading && <Loader />}
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

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Gender">
            Proposed Date:
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

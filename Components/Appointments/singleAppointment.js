import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Container from "../Containers/container";
import { PTags } from "../Text";
import Button from "../Button";
import classes from "./index.module.css";
import axios, { all } from "axios";
import Loader from "../Loader";

export default function SingleAppointment({ appts }) {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [datePicker, showDatePicker] = useState(true);

  const getUserRoleHandler = async () => {
    try {
      const userData = await axios.post("/api/getUser");
      setRole(userData.data.user.role);
    } catch (error) {
      console.log(error);
    }
  };

  const setUpPageHandler = async () => {
    try {
      setIsLoading(true);
      if (status === "authenticated") {
        await getUserRoleHandler();
      }
    } catch (error) {
      setError("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  const approveAppointmentRequests = async (e) => {
    try {
      setIsLoading(true);
      await axios.post("/api/approveAppointment", {
        apptId: appts.id,
        date: new Date(date).toUTCString(),
        apptType: appts.apptType,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUpPageHandler();
  }, [status]);

  return (
    <Container
      margin="5rem auto 0 auto"
      minHeight="50vh"
      width="fit-content"
      flex="column"
      padding="1rem"
      align="flex-start"
      border="3px #f5f5f5 solid"
    >
      {role === "Doctor" && (
        <Container margin="0 0 2rem 0">
          <Button
            text="View Appointment history"
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
      {appts.identifier === "UserId" && (
        <span style={{ color: "#139d69", fontSize: "25px" }}>★</span>
      )}
      <PTags margin="0 0 2rem 0">
        <b>Type:</b> {appts.apptType}
      </PTags>
      <PTags fontWeight="600" margin="0 0 2rem 0">
        Status:{" "}
        <span style={{ color: appts.status === "awaiting" ? "red" : "green" }}>
          {appts.status.toUpperCase()}
        </span>
      </PTags>

      <PTags margin="0 0 2rem 0">
        <b>Created: </b>
        {appts.created}
      </PTags>

      <PTags margin="0 0 2rem 0">
        <b>Proposed Date: </b>
        {appts.proposedDate}
      </PTags>
      <PTags margin="0 0 2rem 0">
        <b>Approved Date: </b>
        {appts.approvedDate}
      </PTags>
      {role === "Doctor" || role === "Lab Guy" ? (
        <>
          <Container margin="0 0 0.5rem 0">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  showDatePicker(false);
                  setDate(appts.proposedDate);
                } else {
                  showDatePicker(true);
                  setDate("");
                }
              }}
            />{" "}
            Use proposed Date?
          </Container>
          {datePicker && (
            <Container>
              <input
                type="datetime-local"
                style={{ font: "inherit" }}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </Container>
          )}

          <button
            className={classes["btn"]}
            onClick={approveAppointmentRequests}
          >
            {appts.status === "awaiting" ? "Approve" : "Re-schedule"}
          </button>
        </>
      ) : (
        ""
      )}

      {loading && <Loader />}
    </Container>
  );
}

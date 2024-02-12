import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Container from "../Containers/container";
import { PTags } from "../Text";
import classes from "./index.module.css";
import axios from "axios";
import Loader from "../Loader";
import Record from "./record";

export default function SingleAppointment({ id }) {
  const { status } = useSession();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [role, setRole] = useState("");
  const [staffName, setStaffName] = useState("");
  const [date, setDate] = useState("");
  const [appts, setAppts] = useState("");
  const [datePicker, showDatePicker] = useState(true);
  const [record, showRecord] = useState(false);

  const showRecordHandler = () => showRecord(true);
  const hideRecordHandler = () => showRecord(false);

  const authorizeAppointmentHandler = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/singleAppointment", { id });
      setRole(response.data.role);
      setAppts(response.data.appts);
    } catch (error) {
      setError("An error occured loading this page");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    authorizeAppointmentHandler();
  }, []);

  const approveAppointmentRequests = async (e) => {
    try {
      setIsLoading(true);
      if (date === "") throw new Error("Date is required");

      const data = await axios.post("/api/changeAppointmentStatus", {
        apptId: id,
        date: new Date(date).toUTCString(),
        status: "Approved",
      });

      setAppts(data.data);
    } catch (error) {
      setError("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  const markAppointmentAsCompletedHandler = async () => {
    try {
      setIsLoading(true);
      const data = await axios.post("/api/changeAppointmentStatus", {
        apptId: id,
        apptType: appts.apptType,
        status: "Completed",
        attendantDid,
      });
      setAppts(data.data);
    } catch {
      setError("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

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
      <Container margin="0 0 1rem 0">
        <PTags fontSize="20px">
          {appts.identifier === "UserId" && (
            <span style={{ color: "#139d69", fontSize: "25px" }}>★ </span>
          )}
          Appointment Tag
        </PTags>
      </Container>

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

      <PTags margin="0 0 2rem 0">
        <b>Type:</b> {appts.apptType + " " + appts.testType}
      </PTags>
      <PTags fontWeight="600" margin="0 0 2rem 0">
        Status:{" "}
        <span style={{ color: appts.status === "Awaiting" ? "red" : "green" }}>
          {appts.status}
        </span>
      </PTags>

      <PTags margin="0 0 2rem 0">
        <b>Created: </b>
        {new Date(appts.createdAt).toUTCString()}
      </PTags>
      <PTags margin="0 0 2rem 0">
        <b>Approved By: </b>
        {appts.scheduledWith && appts.scheduledWith.name}
      </PTags>
      <PTags margin="0 0 2rem 0">
        <b>Proposed Date: </b>
        {new Date(appts.proposedDate).toUTCString()}
      </PTags>
      <PTags margin="0 0 2rem 0">
        <b>Approved Date: </b>
        {appts &&
          appts.status === "Approved" &&
          new Date(appts.approvedDate).toUTCString()}
      </PTags>
      {appts.notes && (
        <PTags margin="0 0 2rem 0">
          <b>Notes </b>
          {appts.notes}
        </PTags>
      )}

      {appts.conclusion && (
        <PTags margin="0 0 2rem 0">
          <b>Conclusuion </b>
          {appts.conclusion}
        </PTags>
      )}
      {role === "Doctor" || role === "Lab Guy" ? (
        <>
          <Container margin="0 0 0.5rem 0">
            {appts.status === "Awaiting" && (
              <>
                {" "}
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
              </>
            )}
          </Container>
          {appts.status === "Awaiting" && datePicker && (
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

          {appts.status === "Awaiting" && (
            <button
              className={classes["btn"]}
              onClick={approveAppointmentRequests}
            >
              Approve
            </button>
          )}

          {appts.status === "Approved" && (
            <button
              className={classes["btn"]}
              onClick={markAppointmentAsCompletedHandler}
            >
              Mark as completed
            </button>
          )}

          {appts.status === "Approved" && (
            <button className={classes["btn"]} onClick={showRecordHandler}>
              Add Notes
            </button>
          )}
        </>
      ) : (
        ""
      )}

      {loading && <Loader />}

      {record && <Record id={id} onHide={hideRecordHandler} />}
    </Container>
  );
}

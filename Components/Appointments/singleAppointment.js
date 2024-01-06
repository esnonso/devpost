import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Container from "../Containers/container";
import { Web5 } from "@web5/api";
import { PTags } from "../Text";
import Button from "../Button";
import classes from "./index.module.css";
import axios from "axios";
import Loader from "../Loader";
import { appointmentProtocolDefinition } from "@/Web5/protocol";
import {
  fetchSentMessages,
  fetchReceivedMessages,
  sortWeb5Messages,
  createChatProtocol,
} from "@/Web5/functions";

export default function SingleAppointment({ id }) {
  const { status } = useSession();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [role, setRole] = useState("");
  const [staffName, setStaffName] = useState("");
  const [date, setDate] = useState("");
  const [appts, setAppts] = useState("");
  const [webFive, setWebFive] = useState(null);
  const [attendantDid, setAttendantDid] = useState("");
  const [datePicker, showDatePicker] = useState(true);
  const [web5approvedDate, setWeb5approvedDate] = useState("");

  const authorizeAppointmentHandler = async () => {
    try {
      setIsLoading(true);
      let did = null;
      if (typeof window !== "undefined") {
        did = localStorage.getItem("did");
      }
      const response = await axios.post("/api/singleAppointment", { id, did });
      setRole(response.data.role);

      if (response.data.appts.identifier === "Web5") {
        const { web5 } = await Web5.connect();
        setWebFive(web5);
        setAttendantDid(response.data.appts.attendantDid);
        if (response.data.appts.status !== "Awaiting")
          setStaffName(response.data.appts.scheduledWith.name);
        setAppts(response.data.appts);
      }

      if (response.data.appts.identifier === "UserId") {
        setAppts(response.data.appts);
      }
    } catch (error) {
      setError("An error occured loading this page");
    } finally {
      setIsLoading(false);
    }
  };

  const getApprovedDateForWeb5UsersHandler = async () => {
    try {
      setIsLoading(true);
      if (
        (role === "Doctor" || role === "Lab Guy") &&
        appts.identifier === "Web5"
      ) {
        const approvedDate = await fetchSentMessages(
          webFive,
          "http://esnonso.com/book-appointment-protocol"
        );
        if (approvedDate) setWeb5approvedDate(approvedDate[0].approvedDate);
      }
      if (role === "" && appts.identifier === "Web5") {
        const approvedDate = await fetchReceivedMessages(
          webFive,
          attendantDid,
          "http://esnonso.com/book-appointment-protocol",
          "http://esnonso.com/book-appointment-schema"
        );
        if (approvedDate) setWeb5approvedDate(approvedDate[0].approvedDate);
      }
    } catch (error) {
      console.log(error);
      setError("An error occured loading approved Date");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    authorizeAppointmentHandler();
  }, []);

  useEffect(() => {
    if (!webFive && appts.identifier !== "Web5") return;
    getApprovedDateForWeb5UsersHandler();
  }, [webFive, appts]);

  const createChatProtocolHandler = async () => {
    try {
      await createChatProtocol(
        webFive,
        attendantDid,
        "http://esnonso.com/book-appointment-protocol",
        appointmentProtocolDefinition
      );
    } catch (error) {
      return error;
    }
  };

  const approveAppointmentRequests = async (e) => {
    try {
      setIsLoading(true);
      if (date === "") throw new Error("Date is required");
      let data;
      if (appts.identifier === "UserId") {
        data = await axios.post("/api/changeAppointmentStatus", {
          apptId: id,
          date: new Date(date).toUTCString(),
          apptType: appts.apptType,
          status: "Approved",
        });
      }
      //APPROVAL FOR FOR WEB5 USERS
      if (appts.identifier === "Web5") {
        data = await axios.post("/api/changeAppointmentStatus", {
          apptId: id,
          apptType: appts.apptType,
          attendantDid,
          status: "Approved",
        });
        await createChatProtocolHandler();
        const recipientDid = appts.userDid;

        const appointment = {
          apptId: id,
          approvedDate: date,
          author: `Dr ${staffName}`,
        };
        const { record } = await webFive.dwn.records.write({
          data: appointment,
          message: {
            protocol: "http://esnonso.com/book-appointment-protocol",
            protocolPath: "appointment",
            schema: "http://esnonso.com/book-appointment-schema",
            recipient: recipientDid,
          },
        });
        await record.send(recipientDid);
      }
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
        <b>Type:</b> {appts.apptType}
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
          appts.identifier === "UserId" &&
          appts.status === "Approved" &&
          new Date(appts.approvedDate).toUTCString()}
        {appts &&
          appts.identifier === "Web5" &&
          appts.status === "Approved" &&
          new Date(web5approvedDate).toUTCString()}
      </PTags>
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
        </>
      ) : (
        ""
      )}

      {loading && <Loader />}
    </Container>
  );
}

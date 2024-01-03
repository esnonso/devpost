import { useRouter } from "next/router";
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

export default function SingleAppointment({ id }) {
  const router = useRouter();
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

  const fetchApprovedDateWeb5Doctor = async () => {
    try {
      const { web5 } = await Web5.connect();
      const response = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: "http://esnonso.com/book-appointment-protocol",
          },
        },
      });
      if (response.status.code === 200) {
        const approvedDate = await Promise.all(
          response.records.map(async (record) => {
            const data = await record.data.json();
            return data;
          })
        );
        setWeb5approvedDate(approvedDate[0].approvedDate);
      } else {
        throw new Error("An error occured loading this page");
      }
    } catch (error) {
      return error;
    }
  };

  const fetchApprovedDateWeb5Patient = async (attendantDid) => {
    try {
      const { web5 } = await Web5.connect();
      const response = await web5.dwn.records.query({
        from: attendantDid,
        message: {
          filter: {
            protocol: "http://esnonso.com/book-appointment-protocol",
            schema: "http://esnonso.com/book-appointment-schema",
          },
        },
      });
      if (response.status.code === 200) {
        const approvedDate = await Promise.all(
          response.records.map(async (record) => {
            const data = await record.data.json();
            return data;
          })
        );
        setWeb5approvedDate(approvedDate[0].approvedDate);
      } else {
        throw new Error("An error occured loading this page");
      }
    } catch (error) {
      return error;
    }
  };

  const loadAppointmentHandler = async () => {
    try {
      setIsLoading(true);
      if (status === "authenticated") {
        const userData = await axios.post("/api/getUser");
        setRole(userData.data.user.role);
        if (
          userData.data.user.role === "Doctor" ||
          userData.data.user.role === "Lab Guy"
        ) {
          const { web5, did } = await Web5.connect();
          setAttendantDid(did);
          setWebFive(web5);
          setStaffName(userData.data.user.name);
        }
      }
      const response = await axios.post("/api/singleAppointment", { id });
      setAppts(response.data);
      if (
        response.data.status !== "Awaiting" &&
        response.data.identifier === "Web5"
      ) {
        setAttendantDid(response.data.attendantDid);
        if (role === "Doctor") fetchApprovedDateWeb5Doctor();
        else fetchApprovedDateWeb5Patient(response.data.attendantDid);
      }
    } catch (error) {
      setError("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointmentHandler();
  }, [status]);

  const createChatProtocolHandler = async () => {
    try {
      const { protocols: existingProtocol, status: existingProtocolStatus } =
        await webFive.dwn.protocols.query({
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
        const { protocol, status } = await webFive.dwn.protocols.configure({
          message: {
            definition: appointmentProtocolDefinition,
          },
        });
        await protocol.send(did);
      } else {
        return;
      }
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
        data = await axios.post("/api/approveAppointment", {
          apptId: id,
          date: new Date(date).toUTCString(),
          apptType: appts.apptType,
        });
      }
      //APPROVAL FOR FOR WEB5 USERS
      if (appts.identifier === "Web5") {
        data = await axios.post("/api/approveAppointment", {
          apptId: id,
          apptType: appts.apptType,
          attendantDid,
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
      window.location.reload();
    } catch (error) {
      console.log(error);
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
        <span style={{ color: appts.status === "Awaiting" ? "red" : "green" }}>
          {appts.status}
        </span>
      </PTags>

      <PTags margin="0 0 2rem 0">
        <b>Created: </b>
        {new Date(appts.createdAt).toUTCString()}
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

          {appts.status === "Awaiting" && (
            <button
              className={classes["btn"]}
              onClick={approveAppointmentRequests}
            >
              Approve
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

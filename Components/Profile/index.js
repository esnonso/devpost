import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "../Containers/container";
import axios from "axios";
import classes from "./index.module.css";
import Image from "next/image";
import Pic from "../Images/default-profile.png";
import { PTags } from "../Text";

export default function UserProfile(props) {
  const router = useRouter();
  const [user, setUser] = useState("");

  const getUserStatus = async () => {
    try {
      const response = await axios.post("/api/getUser");
      setUser(response.data.user);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getUserStatus();
  }, []);

  return (
    <Container
      margin="5rem 0 0 0"
      width="100%"
      padding="1rem"
      flex="column"
      minHeight="60vh"
    >
      <Container width="100%" wrap="wrap">
        {user.role === "Administrator" && (
          <Link href={"/admin/dashboard"} className={classes["action"]}>
            Administrator Dashboard
          </Link>
        )}
        {user.role === "Doctor" && (
          <>
            <Link
              href={"/doctors/all-complaints"}
              className={classes["action"]}
            >
              Complaints
            </Link>
            <Link
              href={"/doctors/all-complaints/pending"}
              className={classes["actions"]}
            >
              Patients
            </Link>
          </>
        )}
        {user.role === "Doctor" || user.role === "Lab Guy" ? (
          <>
            <Link
              href={"/doctors/all-appointments"}
              className={classes["action"]}
            >
              Appointment requests
            </Link>
            <Link
              href={"/doctors/all-appointments/scheduled"}
              className={classes["action"]}
            >
              Scheduled Appts
            </Link>
          </>
        ) : (
          ""
        )}
        {user.role === "User" && (
          <>
            <Link href={"messages/new"} className={classes["action"]}>
              +New Complaint
            </Link>
            <Link href={"/messages"} className={classes["actions"]}>
              Complaints
            </Link>
            <Link href={"/appointments/new"} className={classes["action"]}>
              +New Appointments
            </Link>
            <Link href={"/appointments"} className={classes["actions"]}>
              Appointments
            </Link>
          </>
        )}
      </Container>

      <Container margin="3rem 0 0 0">
        <Image src={Pic} alt="default-profile-image" height={100} width={150} />
        <Container flex="column">
          <PTags>Name: {user.name}</PTags>
          <PTags>Email: {user.email}</PTags>
          <PTags>Joined: {user.createdAt}</PTags>
          {user.role === "Administrator" || user.role === "Doctor" ? (
            <PTags>Role: {user.role}</PTags>
          ) : (
            ""
          )}
        </Container>
      </Container>
    </Container>
  );
}

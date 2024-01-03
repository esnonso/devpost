import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "../Containers/container";
import Button from "../Button";
import axios from "axios";
import classes from "./index.module.css";
import Image from "next/image";
import Pic from "../Images/default-profile.png";
import ContainerFlexColumn from "../Containers/container-flex-column";
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
            Administarator Dashboard
          </Link>
        )}
        {user.role === "Doctor" && (
          <>
            <Link
              href={"/doctors/all-complaints"}
              className={classes["action"]}
            >
              All Complaints
            </Link>
            <Link
              href={"/doctors/all-complaints/pending"}
              className={classes["actions"]}
            >
              Pending complaints
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
            <Link href={"chat/new"} className={classes["action"]}>
              +New Message
            </Link>
            <Link href={"/chat"} className={classes["actions"]}>
              My Messages
            </Link>
            <Link href={"/appointments/new"} className={classes["action"]}>
              +New Appointments
            </Link>
            <Link href={"/appointments"} className={classes["actions"]}>
              My Appointments
            </Link>
          </>
        )}
        <Link href="/" onClick={() => signOut()} className={classes["logout"]}>
          Logout
        </Link>
      </Container>

      <Container margin="3rem 0 0 0">
        <Image src={Pic} alt="default-profile-image" height={100} width={150} />
        <Container flex="column">
          <PTags>Name: {user.name}</PTags>
          <PTags>Email: {user.email}</PTags>
          <PTags>Joined: {user.createdAt}</PTags>
          {user.role === "Administrator" ||
            (user.role === "Doctor" && <PTags>Status: {user.role}</PTags>)}
        </Container>
      </Container>
    </Container>
  );
}

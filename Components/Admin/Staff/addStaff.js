import { useState } from "react";
import { PTags } from "@/Components/Text";
import classes from "./staff.module.css";
import Container from "@/Components/Containers/container";
import Button from "@/Components/Button";
import axios from "axios";
import Modal from "@/Components/Modal";

export default function AddStaff(props) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/staff", {
        data: { firstname, lastname, email, status, password },
      });
      alert("User added!");
      props.onHide();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal click={props.onHide}>
      <form className={classes["staff-form"]} onSubmit={SubmitHandler}>
        <PTags textAlign="center" fontSize="25px">
          Add new Staff
        </PTags>

        <Container flex="column" width="100%">
          <label>First Name</label>
          <input
            type="text"
            className={classes.input}
            value={firstname}
            onChange={inputChangeHandler(setFirstname)}
          />
        </Container>
        <Container flex="column" width="100%">
          <label>Last Name</label>
          <input
            type="text"
            className={classes.input}
            value={lastname}
            onChange={inputChangeHandler(setLastname)}
          />
        </Container>
        <Container flex="column" width="100%">
          <label>Email</label>
          <input
            type="text"
            className={classes.input}
            value={email}
            onChange={inputChangeHandler(setEmail)}
          />
        </Container>

        <Container flex="column" width="100%">
          <label>Password</label>
          <input
            type="password"
            className={classes.input}
            value={password}
            onChange={inputChangeHandler(setPassword)}
          />
        </Container>

        <Container flex="column" width="100%">
          <label>Status</label>
          <select
            className={classes.input}
            value={status}
            onChange={inputChangeHandler(setStatus)}
          >
            <option>--Select--</option>
            <option>Administrator</option>
            <option>Doctor</option>
            <option>Pharmacist</option>
          </select>
        </Container>
        <Button
          text={"Submit"}
          back={"#139D69"}
          color="white"
          width="5rem"
          height="2.5rem"
          margin={"1rem 1rem 0 0"}
          borderRadius={"5px"}
        />
      </form>
    </Modal>
  );
}

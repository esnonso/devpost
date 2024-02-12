import { useState } from "react";
import { PTags } from "@/Components/Text";
import { Web5 } from "@web5/api";
import classes from "../index.module.css";
import Container from "@/Components/Containers/container";
import axios from "axios";
import Modal from "@/Components/Modal";

export default function AddStaff(props) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const SubmitHandler = async (e) => {
    setError("");
    setMessage("");
    setIsLoading(true);
    e.preventDefault();

    try {
      await axios.post("/api/addStaff", {
        data: { firstname, lastname, email, role, password, dob, gender },
      });
      setMessage("Staff Added!");
      setLastname("");
      setFirstname("");
      setEmail("");
      setPassword("");
      setRole("");
      setDob("");
    } catch (error) {
      if (error.response) setError(error.response.data);
      else setError("An error occured!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal click={props.onHide}>
      <form
        className={classes["form"]}
        onSubmit={SubmitHandler}
        id="staff-form"
      >
        <PTags textAlign="center" fontSize="25px">
          Add new Staff
        </PTags>

        <Container flex="column" width="100%">
          {error && (
            <Container
              width="100%"
              margin="0 auto"
              padding="0.5rem"
              color="#F8D7DA"
              radius="5px"
            >
              <small>{error}</small>
            </Container>
          )}
          {message && (
            <Container
              width="100%"
              margin="0 auto"
              padding="0.5rem"
              color="#D4EDDA"
              radius="5px"
            >
              <small>{message}</small>
            </Container>
          )}
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

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Date of Birth">
            Date of Birth <span className={classes.required}>*</span>
          </label>
          <input
            type="date"
            name="date of birth"
            className={classes.input}
            value={dob}
            onChange={inputChangeHandler(setDob)}
          />
        </Container>

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Gender">
            Gender: <span className={classes.required}>*</span>
          </label>
          <select
            className={classes.input}
            value={gender}
            name="gender"
            onChange={inputChangeHandler(setGender)}
          >
            <option></option>
            <option>Female </option>
            <option>Male </option>
          </select>
        </Container>

        <Container flex="column" width="100%">
          <label>Role</label>
          <select
            className={classes.input}
            value={role}
            onChange={inputChangeHandler(setRole)}
          >
            <option>--Select--</option>
            <option>Administrator</option>
            <option>Doctor</option>
            <option>Lab Guy</option>
          </select>
        </Container>
        <button type="submit" disabled={isLoading} className="btn-form">
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </Modal>
  );
}

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Container from "../Containers/container";
import { PTags } from "../Text";
import classes from "./index.module.css";
import axios from "axios";
import Modal from "../Modal";
import Backdrop from "../Backdrop";
import { Web5 } from "@web5/api";

export default function RegistrationForm() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccesMessage] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status]);

  const hideSuccessMessageHandler = () => {
    router.push("/login");
  };

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      //CHECK IF ANY FORM INPUTS IS EMPTY
      const formInputs =
        document.forms["registration-form"].getElementsByTagName("input");
      for (let input of formInputs) {
        if (input.value === "") {
          throw new Error(`${input.name} cannot be blank!`);
        }
      }
      if (gender === "") {
        throw new Error("Select a gender");
      }

      //CONFIRM PASWORD
      if (password !== confirmPassword)
        throw new Error("Passwords do not match");

      // const { web5, did } = await Web5.connect();
      const response = await axios.post("/api/register", {
        name,
        email,
        password,
        gender,
        dob,
      });
      setSuccesMessage(response.data);
      setIsSubmitting(false);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <Container margin="5rem 1rem 0 1rem" flex="column" width="100%">
      <form
        className={classes["chat-container"]}
        onSubmit={submitHandler}
        name="registration-form"
      >
        <PTags fontSize="25px" textAlign="center" margin="0 0 0.5rem 0">
          Register
        </PTags>

        {error && (
          <small
            style={{
              color: "red",
            }}
          >
            Error: {error}
          </small>
        )}

        {successMessage && (
          <Modal click={hideSuccessMessageHandler}>{successMessage}</Modal>
        )}

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Full name">
            Full name <span className={classes.required}>*</span>
          </label>
          <input
            type="text"
            name="full name"
            className={classes.input}
            value={name}
            onChange={inputChangeHandler(setName)}
          />
        </Container>

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Email">
            Email <span className={classes.required}>*</span>
          </label>

          <input
            type="text"
            name="email"
            className={classes.input}
            value={email}
            onChange={inputChangeHandler(setEmail)}
          />
        </Container>

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Password">
            Password <span className={classes.required}>*</span>
          </label>
          <input
            type="password"
            name="password"
            className={classes.input}
            value={password}
            onChange={inputChangeHandler(setPassword)}
          />
        </Container>

        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="Password">
            Confirm Password <span className={classes.required}>*</span>
          </label>
          <input
            type="password"
            name="confirm password"
            className={classes.input}
            value={confirmPassword}
            onChange={inputChangeHandler(setConfirmPassword)}
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

        <Container width="100%" justify="flex-end">
          <button type="submit" disabled={isSubmitting} className="btn">
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </Container>
      </form>

      {successMessage && (
        <>
          <Backdrop />
          <Modal click={hideSuccessMessageHandler}>
            <p>{successMessage}</p>
          </Modal>
        </>
      )}
    </Container>
  );
}

const labTests = ["Genotype", "XRAY", "Malaria"];

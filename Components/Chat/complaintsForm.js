import Button from "../Button";
import Container from "../Containers/container";
import { PTags } from "../Text";
import classes from "./index.module.css";
import { useEffect, useState } from "react";
import { Web5 } from "@web5/api";
import axios from "axios";
import Loader from "../Loader";
import Modal from "../Modal";
import Backdrop from "../Backdrop";

export default function ComplaintsForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccesMessage] = useState("");
  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const getUniqueId = async () => {
    const { web5, did: userDid } = await Web5.connect();
    console.log(userDid);
  };

  const hideSuccessMessageHandler = () => {
    //navigate out;
    //window.location.reload();
  };

  useEffect(() => {
    //getUniqueId();
    //check if user has data in dwn (username, age and weigth) attached
  }, []);
  const submitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const response = await axios.post("/api/complaint", {
      data: {
        title: title,
        message: message,
        did: senderDetails2.did,
        age: senderDetails2.age,
        weight: senderDetails2.weight,
        username: senderDetails2.username,
      },
    });
    setSuccesMessage(response.data.message);
    setIsLoading(false);
    try {
    } catch (error) {
      return error;
    }
  };

  return (
    <Container margin="5rem 1rem 0 1rem" flex="column">
      <form className={classes["chat-container"]} onSubmit={submitHandler}>
        <PTags fontSize="25px" textAlign="center" margin="0 0 1rem 0">
          Send a Message
        </PTags>
        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="title">
            Title:
          </label>
          <input
            placeholder="ex: chronic headace, severe waistpain"
            type="text"
            className={classes.input}
            value={title}
            onChange={inputChangeHandler(setTitle)}
          />
        </Container>
        <Container width="100%" flex="column">
          <label className={classes.label} htmlFor="message">
            Message:
          </label>
          <textarea
            className={classes.input}
            required
            rows="10"
            value={message}
            onChange={inputChangeHandler(setMessage)}
          ></textarea>
        </Container>
        <Container width="100%" justify="flex-end">
          <Button
            text="Send"
            color="white"
            back="#139d69"
            font="inherit"
            padding={"0.3rem 1rem"}
            borderRadius={"5px"}
          />
        </Container>
      </form>
      {isLoading && <Loader />}
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

const senderDetails1 = {
  did: "rebintq52782922020smmsms%&*newfucking=ekekekelelabush",
  username: "Paul",
  age: 24,
  weight: 200,
};

const senderDetails2 = {
  did: "rebintq5278723873932kjekndnmduywdtw-wpajagtewfucking=ekekekelelabush",
  username: "Bassey",
  age: 37,
  weight: 280,
};

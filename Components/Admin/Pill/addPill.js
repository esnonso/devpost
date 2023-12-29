import { useState } from "react";
import { PTags } from "@/Components/Text";
import classes from "../index.module.css";
import Container from "@/Components/Containers/container";
import axios from "axios";
import Modal from "@/Components/Modal";

export default function PillForm(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const SubmitHandler = async (e) => {
    setError("");
    setMessage("");
    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post("/api/addPill", {
        brand,
        name,
        price,
        status,
      });
      setMessage(res.data);
    } catch (error) {
      if (error.response) setError(error.response.data);
      else setError("An error occured!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal click={props.onHide}>
      <form className={classes["staff-form"]} onSubmit={SubmitHandler}>
        <PTags textAlign="center" fontSize="25px">
          Add new Pill
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
          <label>Brand Name</label>
          <input
            type="text"
            className={classes.input}
            value={brand}
            onChange={inputChangeHandler(setBrand)}
          />
        </Container>

        <Container flex="column" width="100%">
          <label>Name</label>
          <input
            type="text"
            className={classes.input}
            value={name}
            onChange={inputChangeHandler(setName)}
          />
        </Container>

        <Container flex="column" width="100%">
          <label>Price</label>
          <input
            type="number"
            className={classes.input}
            value={price}
            onChange={inputChangeHandler(setPrice)}
          />
        </Container>

        <Container flex="column" width="100%">
          <label>Status</label>
          <select
            value={status}
            onChange={inputChangeHandler(setStatus)}
            className={classes.input}
          >
            <option>Select</option>
            <option>In stock</option>
            <option>Out of stock</option>
          </select>
        </Container>
        <button type="submit" disabled={isLoading} className="btn-form">
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </Modal>
  );
}

import { Fragment, useState } from "react";
import Backdrop from "../Backdrop";
import classes from "./index.module.css";
import Container from "../Containers/container";
import { PTags } from "../Text";
import axios from "axios";

export default function Record(props) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [conclusion, setConclusion] = useState();
  const [error, setError] = useState("");

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setMessage("");
      setError("");
      setIsSubmitting(true);
      const response = await axios.post("/api/addRecordAppt", {
        notes,
        conclusion,
        appointmentId: props.id,
      });
      setMessage("Record added!");
    } catch (error) {
      setError("An error occured");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      <Backdrop />
      <div className={classes["pres-container"]}>
        <div style={{ textAlign: "right" }}>
          <button className={classes.btn} onClick={props.onHide}>
            x
          </button>
        </div>

        <Container width="100%" flex="column">
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

          {error && (
            <small
              style={{
                color: "red",
              }}
            >
              Error: {error}
            </small>
          )}
        </Container>

        <Container width="100%" padding="1rem" flex="column">
          <PTags fontSize="20px" margin="0 0 1rem 0">
            Consultation Summary
          </PTags>

          <form className={classes["record-form"]} onSubmit={submitHandler}>
            <Container width="100%" flex="column">
              <label className={classes.label} htmlFor="Notes">
                Notes <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                className={classes.input}
                required
                rows="10"
                value={notes}
                onChange={inputChangeHandler(setNotes)}
              ></textarea>
            </Container>

            <Container width="100%" flex="column">
              <label className={classes.label} htmlFor="conclusion">
                Conclusion <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                className={classes.input}
                required
                rows="10"
                value={conclusion}
                onChange={inputChangeHandler(setConclusion)}
              ></textarea>
            </Container>

            <Container width="100%" justify="flex-end" margin="1rem 0">
              <button type="submit" disabled={isSubmitting} className="btn">
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Container>
          </form>
        </Container>
      </div>
    </Fragment>
  );
}

import { useState, useEffect } from "react";
import Backdrop from "../Backdrop";
import classes from "../Doctor/index.module.css";
import Container from "../Containers/container";
import { PTags } from "../Text";
import axios from "axios";
import Loader from "../Loader";
import Button from "../Button";

export default function UserPrescription(props) {
  const [pills, setPills] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setIsLoading] = useState(false);

  const getPrescriptionHandler = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/getPrescription", {
        messageId: props.messageId,
      });
      setPills(res.data.pills);
      setDate(res.data.createdAt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPrescriptionHandler();
  }, []);
  return (
    <>
      <Backdrop />
      <div className={classes["pres-container"]}>
        <div style={{ textAlign: "right" }}>
          <button className={classes.btn} onClick={props.onHide}>
            x
          </button>
        </div>

        <Container width="100%" flex="column" padding="0.5rem">
          <PTags fontSize="20px" margin="0 0 1rem 0">
            Prescription
          </PTags>
          <Container borderBottom="1px gray solid">
            <PTags margin="0 0 0.5rem 0">Created: {date}</PTags>
          </Container>
          {pills.map((p) => (
            <Container
              key={p.id}
              justify="space-between"
              align="center"
              borderBottom="1px gray solid"
            >
              <PTags padding="0.5rem">
                {p.brand} {p.name}
              </PTags>
              <PTags padding="0.5rem">{p.quantityPill}</PTags>
              <PTags padding="0.5rem">{p.dose} Daily for</PTags>
              <PTags padding="0.5rem">{p.noOfDays} Days</PTags>
            </Container>
          ))}
        </Container>
        {loading && <Loader />}
        <Button
          text="Checkout"
          width="fit-content"
          back={"#139d69"}
          padding={"0.3rem 2rem"}
          color="white"
          border={"none"}
          margin="0.2rem"
        />
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import AddStaff from "./Staff/addStaff";
import Button from "../Button";
import Container from "../Containers/container";
import { PTags } from "../Text";
import PillForm from "./Pill/addPill";
import Backdrop from "../Backdrop";
import axios from "axios";
import Modal from "../Modal";
import classes from "./index.module.css";
import Loader from "../Loader";

export default function AdministaratorDashboard(props) {
  const [addStaff, showAddStaff] = useState(false);
  const [addPill, showAddPill] = useState(false);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState("");
  const [delError, setDelError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchStaffHandler = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/getStaff");
      setStaff(response.data);
    } catch (error) {
      setError("An error occured loading this page");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStaffHandler = async (id) => {
    setDelError("");
    try {
      setIsDeleting(true);
      await axios.post("/api/deleteStaff", { id });
      window.location.reload();
    } catch (error) {
      setDelError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchStaffHandler();
  }, []);

  const showStaffFormHandler = () => showAddStaff(true);
  const hideStaffFormHandler = () => showAddStaff(false);
  const showPillFormHandler = () => showAddPill(true);
  const hidePillFormHandler = () => showAddPill(false);
  const hideViewFormHandler = () => {
    setDelError("");
    setSelectedStaff("");
  };

  return (
    <Container
      margin="5rem 0 0 0"
      width="100%"
      padding="0 1rem"
      flex="column"
      minHeight="60vh"
    >
      <PTags fontSize="20px" textAlign="center" margin="0 0 1rem 0">
        Administrator Dashboard
      </PTags>
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
      <Container justify="flex-end">
        <Button
          text="+user"
          color="white"
          back="#139D69"
          width="7rem"
          // padding={"0.2rem 0.5rem"}
          margin={"0 0.5rem"}
          font="inherit"
          click={showStaffFormHandler}
        />
        <Button
          text="+pill"
          color="white"
          back="#139D69"
          width="7rem"
          // padding={"0.5rem"}
          margin={"0 0.5rem"}
          font="inherit"
          click={showPillFormHandler}
        />
      </Container>
      {addStaff && (
        <>
          <Backdrop />
          <AddStaff onHide={hideStaffFormHandler} />
        </>
      )}

      {addPill && (
        <>
          <Backdrop />
          <PillForm onHide={hidePillFormHandler} />
        </>
      )}

      {selectedStaff && (
        <>
          <Backdrop />
          <Modal click={hideViewFormHandler}>
            {delError && (
              <Container
                width="100%"
                margin="0.5rem auto"
                padding="0.5rem"
                color="#F8D7DA"
                radius="5px"
              >
                <small>{delError}</small>
              </Container>
            )}
            <Container flex="column" margin="1rem 0">
              <PTags>Name: {selectedStaff.name}</PTags>
              <PTags>Email: {selectedStaff.email}</PTags>
              <PTags>Role: {selectedStaff.role}</PTags>
            </Container>
            <Container>
              <button
                className={classes.delete}
                disabled={isDeleting}
                onClick={() => deleteStaffHandler(selectedStaff._id)}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </Container>
          </Modal>
        </>
      )}

      <Container flex="column">
        <PTags fontSize="18px" margin="0.5rem" borderBottom="1px gray solid">
          Staff List
        </PTags>

        {staff.map((s) => {
          return (
            <Container
              key={s._id}
              width="100%"
              borderBottom="1px gray solid"
              align="center"
            >
              <PTags width="45%" padding="0.5rem">
                {s.name}
              </PTags>

              <PTags width="45%" padding="0.5rem">
                {s.role}
              </PTags>
              <Button
                text="View"
                back="white"
                color="#139D69"
                font="inherit"
                click={() => setSelectedStaff(s)}
              />
            </Container>
          );
        })}
      </Container>
      {isLoading && <Loader />}
    </Container>
  );
}

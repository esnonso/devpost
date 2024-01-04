import { useState } from "react";
import AddStaff from "./Staff/addStaff";
import Button from "../Button";
import Container from "../Containers/container";
import { PTags } from "../Text";
import PillForm from "./Pill/addPill";
import Backdrop from "../Backdrop";

export default function AdministaratorDashboard(props) {
  const [addStaff, showAddStaff] = useState(false);
  const [addPill, showAddPill] = useState(false);

  const showStaffFormHandler = () => showAddStaff(true);
  const hideStaffFormHandler = () => showAddStaff(false);
  const showPillFormHandler = () => showAddPill(true);
  const hidePillFormHandler = () => showAddPill(false);

  return (
    <Container
      margin="5rem 0 0 0"
      width="100%"
      padding="0 2rem"
      flex="column"
      minHeight="60vh"
    >
      <PTags fontSize="25px" textAlign="center">
        Administrator Dashboard
      </PTags>
      <Container justify="flex-end">
        <Button
          text="+new user"
          color="white"
          back="#139D69"
          width="7rem"
          height={"2.5rem"}
          margin={"0 0.5rem"}
          click={showStaffFormHandler}
          borderRadius={"5px"}
        />
        <Button
          text="+new pill"
          color="white"
          back="#139D69"
          width="7rem"
          height={"2.5rem"}
          borderRadius={"5px"}
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

      <Container flex="column">
        <PTags fontSize="25px" margin="0.5rem" borderBottom="1px gray solid">
          Staff List
        </PTags>

        {props.staff &&
          props.staff.map((s) => {
            return (
              <Container
                key={s.id}
                width="100%"
                borderBottom="1px gray solid"
                align="center"
              >
                <PTags width="25%" padding="0.5rem">
                  {s.name}
                </PTags>
                <PTags width="25%" padding="0.5rem">
                  {s.email}
                </PTags>
                <PTags width="25%" padding="0.5rem">
                  {s.role}
                </PTags>
                <Button text="Edit" back="white" color="blue" font="inherit" />
                <Button text="Delete" back="white" color="red" font="inherit" />
              </Container>
            );
          })}
      </Container>
    </Container>
  );
}

import Button from "../Button";
import { useRouter } from "next/router";
import Container from "../Containers/container";
import { PTags } from "../Text";

export default function PatientsComplaints(props) {
  const router = useRouter();

  return (
    <Container margin="5rem 1rem" flex="column" minHeight="50vh">
      {props.error && (
        <small
          style={{
            color: "red",
          }}
        >
          {props.error}
        </small>
      )}
      <PTags fontSize="20px" borderBottom="1px gray solid" padding="0.5rem">
        {router.pathname === "/doctors/all-complaints/pending"
          ? "Accepted Complaints"
          : "Complaints"}
      </PTags>
      {props.messages && props.messages.length < 1 && (
        <small style={{ textAlign: "center" }}>No new complaints</small>
      )}
      {props.messages &&
        props.messages.map((c) => {
          return (
            <Container
              key={c._id}
              width="100%"
              borderBottom="1px gray solid"
              align="center"
              justify="space-between"
            >
              <PTags width="30%" margin="0.5rem">
                <span style={{ color: "#139d69", fontSize: "25px" }}>★ </span>
                {c.complaint}
              </PTags>

              <PTags width="22%" margin="0.5rem" textAlign="center">
                <b>{c.status}</b>
              </PTags>

              <PTags width="22%" margin="0.5rem" textAlign="center">
                {new Date(c.createdAt).toUTCString()}
              </PTags>

              <Button
                text="View"
                width="fit-content"
                back={"#139d69"}
                padding={"0.3rem 1rem"}
                color="white"
                border={"none"}
                click={() => router.push(`/doctors/all-complaints/${c._id}`)}
              />
            </Container>
          );
        })}
    </Container>
  );
}

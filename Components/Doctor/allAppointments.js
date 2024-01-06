import Button from "../Button";
import { useRouter } from "next/router";
import Container from "../Containers/container";
import { PTags } from "../Text";

export default function AppointmentRequests(props) {
  const router = useRouter();
  return (
    <Container margin="5rem 1rem" flex="column" minHeight="50vh">
      <PTags fontSize="20px" borderBottom="1px gray solid" margin="0.5rem">
        Appointment requests
      </PTags>
      {props.appointments && props.appointments.length < 1 && (
        <small style={{ textAlign: "center" }}>No new requests</small>
      )}
      {props.appointments.map((a) => {
        return (
          <Container
            key={a.id}
            width="100%"
            borderBottom="1px gray solid"
            align="center"
          >
            <PTags width="40%" margin="0.5rem">
              {a.identifier === "UserId" && (
                <span style={{ color: "#139d69", fontSize: "20px" }}>★</span>
              )}
              {a.apptType}
            </PTags>

            <PTags width="5%" margin="0.5rem" textAlign="center">
              <b> {a.gender[0]}</b>
            </PTags>

            <PTags width="40%" margin="0.5rem">
              {a.created}
            </PTags>

            <Button
              text="View"
              width="fit-content"
              back={"#139d69"}
              padding={"0.3rem 2rem"}
              color="white"
              border={"none"}
              click={() => router.push(`/doctors/all-appointments/${a.id}`)}
            />
          </Container>
        );
      })}
    </Container>
  );
}

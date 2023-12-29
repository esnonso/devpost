import Button from "../Button";
import { useRouter } from "next/router";
import Container from "../Containers/container";
import { PTags } from "../Text";

export default function AppointmentRequests(props) {
  const router = useRouter();
  return (
    <Container margin="5rem 1rem" flex="column" minHeight="50vh">
      <PTags fontSize="25px" borderBottom="1px gray solid" margin="0.5rem">
        Appointment requests
      </PTags>
      {props.appointments.map((a) => {
        return (
          <Container
            key={a.id}
            width="100%"
            borderBottom="1px gray solid"
            align="center"
          >
            {a.identifier === "UserId" && (
              <span style={{ color: "#139d69", fontSize: "25px" }}>★</span>
            )}
            <PTags width="40%" margin="0.5rem">
              {a.apptType}
            </PTags>

            <PTags width="40%" margin="0.5rem">
              <b> Gender:</b> {a.gender[0]}
            </PTags>

            <PTags width="40%" margin="0.5rem">
              <b> created: </b>
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

import Container from "../Containers/container";
import { PTags } from "../Text";
import Button from "../Button";

export default function Appointments({ appointments }) {
  return (
    <Container margin="5rem 1rem" flex="column" minHeight="50vh">
      <PTags fontSize="25px" borderBottom="1px gray solid" margin="0.5rem">
        All appointments for this user
      </PTags>

      {appointments &&
        appointments.map((c) => {
          return (
            <Container
              key={c.id}
              width="100%"
              borderBottom="1px gray solid"
              align="center"
            >
              <PTags width="40%" margin="0.5rem">
                {c.reason} for {c.test}
              </PTags>

              <PTags width="40%" margin="0.5rem">
                Status: {c.status}
              </PTags>
              <Button text="Cancel" back="#139D69" padding="0.2rem 1rem" />
            </Container>
          );
        })}
    </Container>
  );
}

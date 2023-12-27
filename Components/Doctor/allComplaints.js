import Button from "../Button";
import { useRouter } from "next/router";
import Container from "../Containers/container";
import { PTags } from "../Text";

export default function PatientsComplaints(props) {
  const router = useRouter();
  return (
    <Container margin="5rem 1rem" flex="column" minHeight="50vh">
      <PTags fontSize="25px" borderBottom="1px gray solid" margin="0.5rem">
        All complaints
      </PTags>
      {props.messages.map((c) => {
        return (
          <Container
            key={c.id}
            width="100%"
            borderBottom="1px gray solid"
            align="center"
          >
            <PTags width="40%" margin="0.5rem">
              {c.title}
            </PTags>

            <PTags width="40%" margin="0.5rem">
              Gender: <b>{c.gender[0]}</b>
            </PTags>

            <PTags width="40%" margin="0.5rem">
              Age: <b>{c.ageRange}</b>
            </PTags>

            <Button
              text="View"
              width="fit-content"
              back={"#139d69"}
              padding={"0.3rem 2rem"}
              color="white"
              border={"none"}
              click={() => router.push(`/doctors/all-complaints/${c.id}`)}
            />
          </Container>
        );
      })}
    </Container>
  );
}

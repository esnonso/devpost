import Button from "../Button";
import { useRouter } from "next/router";
import Container from "../Containers/container";
import { PTags } from "../Text";
import { useParams } from "next/navigation";

export default function PatientsComplaints(props) {
  const params = useParams();

  const router = useRouter();

  return (
    <Container margin="5rem 1rem" flex="column" minHeight="50vh">
      <PTags fontSize="25px" borderBottom="1px gray solid" margin="0.5rem">
        {router.pathname === "/doctors/all-complaints/pending"
          ? "Your Pending Requests"
          : "All Message Requests"}
      </PTags>
      {props.messages.map((c) => {
        return (
          <Container
            key={c.id}
            width="100%"
            borderBottom="1px gray solid"
            align="center"
          >
            {c.identifier === "UserId" && (
              <span style={{ color: "#139d69", fontSize: "25px" }}>★</span>
            )}
            <PTags width="30%" margin="0.5rem">
              {c.title}
            </PTags>

            <PTags width="20%" margin="0.5rem">
              <b>Gender:</b> {c.gender[0]}
            </PTags>

            <PTags width="40%" margin="0.5rem">
              <b>Age: </b>
              {c.ageRange}
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

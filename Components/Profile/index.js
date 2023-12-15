import Link from "next/link";
import Container from "../Containers/container";

export default function UserProfile() {
  return (
    <Container margin="5rem 0 0 0" width="100%" flex="column">
      <h1>My profile</h1>
      <Link href={"/dashboard"}>Administarator Dashboard</Link>
      <Link href={"/chat"}>All Complaints</Link>
    </Container>
  );
}

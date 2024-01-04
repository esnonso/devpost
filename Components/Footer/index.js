import Link from "next/link";
import Container from "../Containers/container";
import ContainerFlexColumn from "../Containers/container-flex-column";
import Button from "../Button";
import Twitter from "../Images/twitter.png";
import In from "../Images/linked.png";
import Insta from "../Images/insta.png";
import { PTags } from "../Text";
import classes from "./footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <Container
      flex="column"
      width="100%"
      margin="6rem 0 0 0"
      color="#139D69"
      textColor="white"
      padding="0 1rem"
    >
      <ContainerFlexColumn>
        <div className={classes["support"]}>
          <PTags textAlign="left" margin="0 0 1rem 0" fontWeight="600">
            SUPPORT
          </PTags>
          <PTags textAlign="left" margin="0 0 0.3rem 0">
            FAQS
          </PTags>
          <PTags textAlign="left" margin="0 0 0.3rem 0">
            Call now
          </PTags>
        </div>

        <div className={classes["devpost"]}>
          <PTags textAlign="left" margin="0 0 1rem 0" fontWeight="600">
            Devpost
          </PTags>
          <PTags textAlign="left" margin="0 0 0.3rem 0">
            <Link href="/chat/new" className={classes["link"]}>
              Speak to a doctor
            </Link>
          </PTags>
          <PTags textAlign="left" margin="0 0 0.3rem 0">
            <Link href="/appointments/new" className={classes["link"]}>
              Book an appointment
            </Link>
          </PTags>
          <PTags textAlign="left" margin="0 0 0.3rem 0">
            <Link href="/subscribe/new" className={classes["link"]}>
              Subscribe to health care
            </Link>
          </PTags>
        </div>

        <div className={classes["newsletter"]}>
          <PTags textAlign="left" margin="0 0 1rem 0" fontWeight="600">
            Subscribe to our news letter
          </PTags>
          <form>
            <input type="text" />
            <Button
              text="Subscribe"
              width="fit-content"
              back={"inherit"}
              height={"2.5rem"}
              padding={"0 2rem"}
              border={"1px white solid"}
              color={"white"}
            />
          </form>
        </div>
      </ContainerFlexColumn>
      <div className={classes["social"]}>
        <Image src={Twitter} alt="" width={20} height={20} />
        <Image src={In} alt="" width={20} height={20} />
        <Image src={Insta} alt="" width={20} height={20} />
      </div>
      <Container margin="0.2rem 0 1rem 0" justify="center">
        <small>ESNONSO Devpost all rights reserved. 2023</small>
      </Container>
    </Container>
  );
};

export default Footer;

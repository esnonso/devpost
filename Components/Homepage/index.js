import { useRouter } from "next/router";
import Container from "../Containers/container";
import { H1Tags, PTags } from "../Text";
import Button from "../Button";
import classes from "./home.module.css";

export default function Homepage() {
  const router = useRouter();

  return (
    <Container width="100%" flex="column">
      <div className={classes.banner}>
        <Container flex={"column"} padding="2rem 0.5rem">
          <H1Tags margin="0.3rem" fontSize="25px" color="white">
            DEVELOPERS LIFE SAVING HOSPITAL
          </H1Tags>
          <PTags margin="0.3rem" color="white" fontSize="20px">
            21 PKAID WAY, FADEYI MUSHIN
          </PTags>

          <Button
            text="Chat with a doctor"
            width="15rem"
            font="18px"
            padding={"0.2rem 0.5rem"}
            height={"3rem"}
            margin={"0.9rem 0.3rem"}
            back="#139D69"
            color="white"
            click={() => router.push("/messages/new")}
          />
        </Container>
      </div>
      {/* CHAT WITH A DOCTOR */}
      <PTags
        margin="10rem 0.5rem 1rem 0.5rem"
        fontSize="22px"
        textAlign="center"
        fontWeight="600"
      >
        Chat with Doctor
      </PTags>
      <div className={classes["call-a-doc"]}>
        <div className={classes["call-a-doc-img"]}>
          <Container
            height="100%"
            width="100%"
            textColor="white"
            flex="column"
            align="flex-start"
            justify="center"
            padding="0 0 0 1rem"
          >
            <PTags textAlign="left" margin="0 0 1rem 0">
              Chat with a doctor to avoid the risk of facing a higher illness.
            </PTags>
            <Button
              text="Chat now"
              width="15rem"
              font="18px"
              back={"#139d69"}
              height={"2.5rem"}
              padding={"0 2rem"}
              color="white"
              border={"none"}
              click={() => router.push("/messages/new")}
            />
          </Container>
        </div>
        <div className={classes.text}>
          <Container textAlign="left" margin="1rem 0 0 0" flex="column">
            <Container align="center" margin="0 0 0.7rem 0">
              <span className={classes["star"]}>★</span> Sickness can have
              severe and mild symptoms and they make us unable to live our
              lives.
            </Container>
            <Container align="center" margin="0 0 0.7rem 0">
              <span className={classes["star"]}>★</span> Chat with a doctor and
              get the best treatment, advice or solution to whatever symptoms
              you are experiencing for free.
            </Container>

            <Container align="center" margin="0 0 0.7rem 0">
              <span className={classes["star"]}>★</span> Get your medication
              delivered to your desired location or book an appointment for a
              test if necessary.
            </Container>

            <Container align="center">
              <span className={classes["star"]}>★</span>Become well again.
            </Container>
          </Container>
        </div>
      </div>
      {/* BOOK AN APPOINTMENT */}
      <PTags
        margin="7rem 0.5rem 1rem 0.5rem"
        fontSize="22px"
        textAlign="center"
        fontWeight="600"
      >
        Book appointment
      </PTags>
      <div className={classes["subscribe-health"]}>
        <div className={classes["appointment-img"]}>
          <Container
            height="100%"
            width="100%"
            textColor="white"
            flex="column"
            align="flex-start"
            justify="center"
            padding="0 1rem"
          >
            <PTags textAlign="left" margin="0 0 1rem 0">
              Schedule an appointment and let us get everything ready for you
            </PTags>
            <Button
              text="Book  now"
              width="15rem"
              font="18px"
              back={"#139d69"}
              height={"2.5rem"}
              padding={"0 2rem"}
              color="white"
              border={"none"}
              click={() => router.push("/appointments/new")}
            />
          </Container>
        </div>
        <div className={classes.text}>
          <Container textAlign="left" margin="1rem 0 0 0" flex="column">
            <Container align="center" margin="0 0 0.7rem 0">
              <span className={classes["star"]}>★</span> Schedule an appointment
              for a test or to see a doctor.
            </Container>
            <Container align="center" margin="0 0 0.7rem 0">
              <span className={classes["star"]}>★</span> We get everything ready
              in advance for you.
            </Container>
            <Container align="center">
              <span className={classes["star"]}>★</span> Skip the queue and get
              your appointment done as quick as possible.
            </Container>
          </Container>
        </div>
      </div>
      {/* SUBSCRIBE TO HEALTH CARE */}
      <PTags
        margin="7rem 0.5rem 1rem 0.5rem"
        fontSize="22px"
        textAlign="center"
        fontWeight="600"
      >
        Subscribe to health package
      </PTags>

      <div className={classes["call-a-doc"]}>
        <div className={classes["subscribe-img-rev"]}>
          <Container
            height="100%"
            width="100%"
            textColor="white"
            flex="column"
            align="flex-start"
            justify="center"
            padding="0 1rem 0 1rem"
          >
            <PTags textAlign="left" margin="0 0 1rem 0">
              Subscribe to our health package for as low as #10,000 monthly and
              let us monitor your health
            </PTags>
            <Button
              font="18px"
              text="Subscribe now"
              width="15rem"
              back={"#139d69"}
              height={"2.5rem"}
              padding={"0 2rem"}
              border={"none"}
              color="white"
              click={() => router.push("/subscription/new")}
            />
          </Container>
        </div>
        <div className={classes.text}>
          <Container textAlign="left" margin="1rem 0 0 0" flex="column">
            <Container align="center" margin="0 0 0.7rem 0">
              <span className={classes["star"]}>★</span> Get our emergency
              service to your location with the click of a button
            </Container>
            <Container align="center" margin="0 0 0.7rem 0">
              <span className={classes["star"]}>★</span> Get regular health
              updates and recommendations based on your health history.
            </Container>
            <Container align="center" margin="0 0 0.7rem 0">
              <span className={classes["star"]}>★</span>Book appointments and
              get a doctor sent to your location.
            </Container>
            <Container align="center" margin="0 0 0.7rem 0">
              <span className={classes["star"]}>★</span>Get discounts on pills
              and tests.
            </Container>
          </Container>
        </div>
      </div>
    </Container>
  );
}

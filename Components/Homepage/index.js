import Container from "../Containers/container";
import { H1Tags, PTags } from "../Text";
import Button from "../Button";
import classes from "./home.module.css";

export default function Homepage() {
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
            text="Subscribe to health package"
            width="60%"
            font="18px"
            padding={"0.2rem 0.5rem"}
            borderRadius={"5px"}
            height={"3rem"}
            margin={"0.9rem 0.3rem"}
            back="#139D69"
            color="white"
          />
        </Container>
      </div>

      {/* CHAT WITH A DOCTOR */}
      <PTags
        margin="10rem 0.5rem 0 0.5rem"
        fontSize="22px"
        textAlign="center"
        fontWeight="600"
      >
        Need your medication devlivered to you?
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
            <PTags textAlign="left" margin="0.5rem 0">
              Chat with a doctor to avoid the risk of facing a higher illness.
              Health is wealth
            </PTags>
            <Button
              text="Speak to a doctor now"
              width="fit-content"
              back={"#139d69"}
              height={"2.5rem"}
              padding={"0 2rem"}
              color="white"
              border={"none"}
              borderRadius={"5px"}
              font="20px"
            />
          </Container>
        </div>
        <div className={classes.text}>
          <PTags textAlign="left" margin="2rem 0">
            <span className={classes["star"]}>★</span> Sickness can have severe
            and mild symptoms and they make us unable to live our lives.
            <br />
            <span className={classes["star"]}>★</span> Chat with a doctor and
            get the best treatment, advice or solution to whatever symptoms you
            are experiencing for free.
            <br />
            <span className={classes["star"]}>★</span> Get your medication
            delivered to your desired location or book an appointment for a test
            if necessary.
            <br />
            <span className={classes["star"]}>★</span>Become well again.
          </PTags>
        </div>
      </div>

      {/* SUBSCRIBE TO HEALTH CARE */}
      <PTags
        margin="10rem 0.5rem 0 0.5rem"
        fontSize="22px"
        textAlign="center"
        fontWeight="600"
      >
        Subscribe to health package
      </PTags>

      <div className={classes["subscribe-health"]}>
        <div className={classes["subscribe-img-rev"]}>
          <Container
            height="100%"
            width="100%"
            textColor="white"
            flex="column"
            align="flex-end"
            justify="center"
            padding="0 1rem 0 1rem"
          >
            <PTags textAlign="left" margin="0.5rem 0">
              Subscribe to our health package for as low as #10,000 monthly and
              let us monitor your health
            </PTags>
            <Button
              text="Subscribe now"
              width="fit-content"
              back={"#139d69"}
              height={"2.5rem"}
              padding={"0 2rem"}
              border={"none"}
              borderRadius={"5px"}
              color="white"
              font="20px"
            />
          </Container>
        </div>
        <div className={classes.text}>
          <PTags textAlign="left" margin="2rem 0">
            <span className={classes["star"]}>★</span> Get our emergency service
            to your location with the click of a button
            <br />
            <span className={classes["star"]}>★</span> Get regular health
            updates and recommendations based on your health history.
            <br />
            <span className={classes["star"]}>★</span>Book appointments and get
            a doctor sent to your location.
            <br />
            <span className={classes["star"]}>★</span>Get discounts on pills and
            tests.
          </PTags>
        </div>
      </div>

      {/* BOOK AN APPOINTMENT */}
      <PTags
        margin="10rem 0.5rem 0 0.5rem"
        fontSize="22px"
        textAlign="center"
        fontWeight="600"
      >
        Do Medical tests/ Book appointment
      </PTags>

      <div className={classes["call-a-doc"]}>
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
            <PTags textAlign="left" margin="0.5rem 0">
              Schedule an appointment and let us get everything ready for you
            </PTags>
            <Button
              text="Book appointment now"
              width="fit-content"
              back={"#139d69"}
              height={"2.5rem"}
              padding={"0 2rem"}
              color="white"
              border={"none"}
              borderRadius={"5px"}
              font="20px"
            />
          </Container>
        </div>
        <div className={classes.text}>
          <PTags textAlign="left" margin="2rem 0">
            <span className={classes["star"]}>★</span>We do wide range of tests.
            <br />
            <span className={classes["star"]}>★</span>Schedule an appointment
            for a test or to see a doctor.
            <br />
            <span className={classes["star"]}>★</span> We get everything ready
            in advance for you.
            <br />
            <span className={classes["star"]}>★</span>Skip the queue and get
            your appointment done as quick as possible.
          </PTags>
        </div>
      </div>
    </Container>
  );
}

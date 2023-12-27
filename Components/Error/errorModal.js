import Container from "../Containers/container";
import classes from "./index.module.css";
import { PTags } from "../Text";

export default function ErroModal(props) {
  return (
    <div className={classes["error-modal"]}>
      <Container width="100%" justify="right">
        <button className="close-btn-err" onClick={props.click}>
          x
        </button>
      </Container>
      <PTags color="#721C24" fontSize="larger">
        {props.children}
      </PTags>
    </div>
  );
}

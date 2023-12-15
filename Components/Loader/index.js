import { Fragment } from "react";
import Backdrop from "../Backdrop";
import Modal from "../Modal";
import classes from "./index.module.css";
import Container from "../Containers/container";

export default function Loader() {
  return (
    <Fragment>
      <Backdrop />
      <div className={classes["container"]}>
        <small style={{ margin: "-0.5rem 0 1rem 0" }}>Please wait</small>
        <div className={classes.loader}></div>
      </div>
    </Fragment>
  );
}

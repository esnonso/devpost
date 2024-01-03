import { Fragment } from "react";
import Backdrop from "../Backdrop";
import classes from "./index.module.css";

export default function Loader({ message }) {
  return (
    <Fragment>
      <Backdrop />
      <div className={classes["container"]}>
        {!message ? (
          <small style={{ margin: "-0.5rem 0 1rem 0" }}>Please wait</small>
        ) : (
          <small style={{ margin: "-0.5rem 0 1rem 0" }}>{message}</small>
        )}
        <div className={classes.loader}></div>
      </div>
    </Fragment>
  );
}

import classes from "./index.module.css";
import Backdrop from "../Backdrop";
import { Fragment } from "react";
import CloseBtn from "../Images/close-btn.png";
import Image from "next/image";

export default function Modal(props) {
  return (
    <Fragment>
      <Backdrop />
      <div className={classes.modal}>
        <div className={classes["btn-container"]}>
          <button className={classes["btn-close"]} onClick={props.click}>
            <Image
              src={CloseBtn}
              alt="home icon by icons 8"
              width={25}
              height={25}
            />
          </button>
        </div>
        {props.children}
      </div>
    </Fragment>
  );
}

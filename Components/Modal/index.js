import classes from "./index.module.css";

export default function Modal(props) {
  return (
    <div className={classes.modal}>
      <div style={{ textAlign: "right" }}>
        <button className={classes.btn} onClick={props.click}>
          x
        </button>
      </div>
      {props.children}
    </div>
  );
}

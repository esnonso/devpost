import classes from "./index.module.css";

const ContainerFlexRow = (props) => {
  const styles = {
    width: props.width || "100%",
    backgroundColor: props.color,
    display: "flex",
    flexWrap: props.wrap,
    justifyContent: props.justifyContent,
    alignItems: props.align,
    alignContent: props.alignContent,
    margin: props.margin,
    padding: props.padding,
    boxSizing: "border-box",
  };

  return (
    <div className={classes["container-flex"]} style={styles}>
      {props.children}
    </div>
  );
};

export default ContainerFlexRow;

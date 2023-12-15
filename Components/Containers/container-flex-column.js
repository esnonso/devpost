import classes from "./index.module.css";

const ContainerFlexColumn = (props) => {
  const styles = {
    width: props.width || "100%",
    backgroundColor: props.color,
    justifyContent: props.justifyContent,
    alignItems: props.alignItems,
    alignContent: props.alignContent,
    margin: props.margin,
    padding: props.padding,
    height: "fit-content",
    flexWrap: props.wrap,
    position: props.position,
    top: props.top,
    zIndex: props.index,
  };

  return (
    <div className={classes["container-column"]} style={styles}>
      {props.children}
    </div>
  );
};

export default ContainerFlexColumn;

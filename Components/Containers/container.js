import classes from "./index.module.css";

const Container = (props) => {
  const styles = {
    backgroundColor: props.color,
    display: "flex",
    flexDirection: props.flex,
    justifyContent: props.justify,
    alignItems: props.align,
    margin: props.margin,
    padding: props.padding,
    height: props.height,
    color: props.textColor,
    width: props.width,
    position: props.position,
    top: props.top,
    left: props.left,
    zIndex: props.zindex,
    opacity: props.opacity,
    borderRadius: props.radius,
  };

  return (
    <div className={classes.container} style={styles}>
      {props.children}
    </div>
  );
};

export default Container;

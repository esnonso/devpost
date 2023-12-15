const Button = ({
  text,
  click,
  border,
  width,
  height,
  borderRadius,
  padding,
  font,
  margin,
  back,
  color,
  opacity,
  type,
}) => {
  const buttonStyles = {
    backgroundColor: back,
    color: color || "white",
    border: border || "none",
    width: width,
    height: height,
    borderRadius: borderRadius,
    padding: padding,
    fontSize: font,
    margin: margin,
    fontFamily: "inherit",
    opacity: opacity,
  };
  return (
    <button style={buttonStyles} onClick={click} type={type}>
      {text}
    </button>
  );
};

export default Button;

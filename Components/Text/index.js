export const H1Tags = (props) => {
  const h1Styles = {
    margin: props.margin || 0,
    fontStyle: props.font,
    color: props.color,
    fontSize: props.fontSize,
    padding: props.padding,
    boxSing: "border-box",
    fontWeight: props.fontWeight,
    textAlign: props.textAlign,
    backgroundColor: props.back,
  };
  return (
    <h1 style={h1Styles} className="mobile">
      {props.children}
    </h1>
  );
};

export const PTags = (props) => {
  const pStyles = {
    margin: props.margin || 0,
    fontStyle: props.font,
    color: props.color,
    fontSize: props.fontSize,
    padding: props.padding,
    fontWeight: props.fontWeight,
    textAlign: props.textAlign,
    width: props.width,
    backgroundColor: props.back,
    borderRadius: props.radius,
  };
  return (
    <p style={pStyles} className="mobile">
      {props.children}
    </p>
  );
};

export const ImageTags = (props) => {
  const styles = {
    height: props.height,
    width: props.width,
  };
  return <img style={styles} src={props.source} alt="" />;
};

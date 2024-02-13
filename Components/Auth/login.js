import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import classes from "./login.module.css";
import Container from "../Containers/container";
import { PTags } from "../Text";

const LoginComponent = (props) => {
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [logginIn, setLogginIn] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/profile");
  }, [status]);

  const inputChangeHandler = (setState) => (e) => {
    setState(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLogginIn(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res.error) throw new Error(res.error);
    } catch (err) {
      setError(err);
      setLogginIn(false);
    }
  };
  return (
    <Container width="100%" flex="column">
      <Container flex="column" width="100%" height="70vh">
        <form className={classes.form} onSubmit={submitHandler}>
          <PTags fontSize="25px" textAlign="center" margin="0 0 1rem 0">
            Login
          </PTags>

          <div className={classes["form-control-login"]}>
            {error && <small style={{ color: "red" }}> {error.message}</small>}
            {"a" === "b" && <small style={{ color: "green" }}>Sucess</small>}
            <label>Email</label>
            <input
              type="text"
              name="email"
              className={classes.input}
              value={email}
              onChange={inputChangeHandler(setEmail)}
            />
          </div>
          <div className={classes["form-control-login"]}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              className={classes.input}
              value={password}
              onChange={inputChangeHandler(setPassword)}
            />
          </div>

          <div className={classes["form-control-login"]}>
            <small style={{ marginBottom: "1rem" }}>
              Not Registered? <Link href="/register">click to register</Link>
            </small>
          </div>
          <div className={classes["form-control-login"]}>
            <button
              type="submit"
              disabled={logginIn}
              className={classes["submit-btn"]}
            >
              {logginIn ? "Please wait" : "Login"}
            </button>
          </div>
        </form>
      </Container>
    </Container>
  );
};

export default LoginComponent;

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Container from "../Containers/container";
import Logo from "../Images/logo2.jpeg";
import ProfileImg from "../Images/profile.png";
import Button from "../Button";
import classes from "./header.module.css";
import Link from "next/link";
import Footer from "../Footer";
import Backdrop from "../Backdrop";

const links = [
  { caption: "Homepage", url: "/" },
  { caption: "Chat with a doctor", url: "/messages/new" },
  { caption: "Book appointment", url: "/appointments/new" },
  { caption: "Subscribe to health care", url: "/subscribe/new" },
  { caption: "Dashboard", url: "/admin/dashboard" },
];

export default function Header(props) {
  const router = useRouter();
  const { status } = useSession();
  const [dropdown, showDropdown] = useState(false);
  const [sidebar, showSidebar] = useState(false);

  const showDropDownHandler = () => showDropdown(true);
  const hideDropDownHandler = () => showDropdown(false);
  const showSidebarHandler = () => showSidebar(true);
  const hideSidebarHandler = () => showSidebar(false);

  return (
    <Container width="100%" flex="column" height="100%">
      <div className={classes.header}>
        <Container align="center">
          <Link href="/" className={classes.logo}>
            HOSPITAL
          </Link>

          <Image src={Logo} alt="logo-cross" width={35} height={35} />
        </Container>
        <Container align="center">
          <Image
            src={ProfileImg}
            alt="logo-cross"
            width={25}
            height={25}
            onMouseOver={showDropDownHandler}
            onMouseLeave={hideDropDownHandler}
          />
          {dropdown && (
            <div
              className={classes["drop-down"]}
              onMouseOver={showDropDownHandler}
              onMouseLeave={hideDropDownHandler}
            >
              {status === "authenticated" && (
                <>
                  <Button
                    text="Profile"
                    color={"black"}
                    font="inherit"
                    click={() => router.push("/profile")}
                  />
                  <Button
                    text="Logout"
                    color={"black"}
                    font="inherit"
                    click={async () => signOut()}
                  />
                </>
              )}

              {status === "unauthenticated" && (
                <>
                  <Button
                    text="Login"
                    color={"black"}
                    font="inherit"
                    click={() => router.push("/login")}
                  />
                  <Button
                    text="Register"
                    color={"black"}
                    font="inherit"
                    click={() => router.push("/register")}
                  />
                </>
              )}
            </div>
          )}
          <button className={classes["hamburger"]} onClick={showSidebarHandler}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </Container>
      </div>
      {/* <div className={classes.motto}>DEVELOPERS LIFE SAVING HOSPITAL</div> */}
      {sidebar && (
        <>
          <Backdrop />
          <div className={classes.sidebar}>
            <Container align="center" width="100%">
              <Container width="80%">
                <h3 style={{ margin: 0 }}>HOSPITAL</h3>
                <Image src={Logo} alt="logo-cross" width={25} height={25} />
              </Container>
              <Container width="20%" justify="flex-end">
                <Button
                  text="X"
                  width="2rem"
                  back={"white"}
                  height={"2rem"}
                  color="black"
                  font="larger"
                  type="button"
                  fontWeight="600"
                  click={hideSidebarHandler}
                />
              </Container>
            </Container>

            <ul>
              {links.map((l, i) => (
                <li key={l.url}>
                  <Link href={l.url} onClick={hideSidebarHandler}>
                    {" "}
                    {l.caption.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <main>{props.children}</main>
      <Footer />
    </Container>
  );
}

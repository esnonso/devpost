import "@/styles/globals.css";
import Header from "@/Components/Header";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Header>
        <Component {...pageProps} />
      </Header>
    </SessionProvider>
  );
}

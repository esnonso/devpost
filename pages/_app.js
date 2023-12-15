import "@/styles/globals.css";
import Header from "@/Components/Header";

export default function App({ Component, pageProps }) {
  return (
    <Header>
      <Component {...pageProps} />
    </Header>
  );
}

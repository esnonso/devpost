import ComplaintsPage from "@/Components/Chat/complaints";
import axios from "axios";

export default function Complaints(props) {
  console.log(props.complaints);
  return <ComplaintsPage />;
}

// export async function getStaticProps() {
//   try {
//     const res = await axios.get("api/complaints");
//     console.log(res);
//   } catch (err) {
//     return err;
//   }

//   return {
//     props: {
//       complaints: { name: "chick" },
//     },
//   };
// }

import AdministaratorDashboard from "@/Components/Admin";
import { connectDatabase } from "@/Mongodb";
import User from "@/Mongodb/Models/user";

export default function Dashboard(props) {
  return <AdministaratorDashboard staff={props.staff} />;
}

export async function getStaticProps() {
  await connectDatabase();
  const data = await User.find({});
  return {
    props: {
      staff: data.map((s) => ({
        name: s.name,
        email: s.email,
        role: s.role,
        id: s._id.toString(),
      })),
    },
    revalidate: 1000,
  };
}

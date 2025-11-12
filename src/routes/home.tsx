import { PATHS } from "@/lib/constants";
// import { Link } from "react-router";
import { Navigate } from "react-router";

export default function Home() {
  return <Navigate to={PATHS.SIGN_IN} />
  // return (
  //   <div className="p-10 text-lg font-semibold">
  //     Home Page | <Link to={PATHS.SIGN_IN}>Sign In</Link>
  //   </div>
  // );
}

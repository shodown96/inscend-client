import { PATHS } from "@/lib/constants";
import { Navigate } from "react-router";

export default function Home() {
  return <Navigate to={PATHS.SIGN_IN} />
  // const { user } = useAuthStore()
  // if (user) {
  //   return <Navigate to={PATHS.SIGN_IN} />
  // } else {
  //   return <Navigate to={PATHS.ACTION_BOARD} />
  // }
}

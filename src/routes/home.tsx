import { PATHS } from "@/lib/constants";
import { useAuthStore } from "@/lib/stores/auth";
import { Navigate } from "react-router";

export default function Home() {
  const { user } = useAuthStore()
  if (user) {
    return <Navigate to={PATHS.SIGN_IN} />
  } else {
    return <Navigate to={PATHS.ACTION_BOARD} />
  }
}

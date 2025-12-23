import Logo from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { APP_NAME, PATHS } from "@/lib/constants";
import { Link } from "react-router";

export default function Home() {
  return (
    <div className="">
      <title>{`Home | ${APP_NAME}`}</title>
      <div className="bg-primary py-5 p-3 flex justify-center">
        <Logo colored />
      </div>
      <div className="h-[90vh] w-full flex gap-2 flex-col items-center justify-center">
        <p className="font-karma font-semibold text-2xl">Home</p>
        <Link to={PATHS.SIGN_IN}>
          <Button>Sign in</Button>
        </Link>
      </div>
    </div>
  )
}

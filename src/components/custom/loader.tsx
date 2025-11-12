import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const Loader = ({
  loading = false,
  text = "Loading...",
  children,
  className
}: {
  loading?: boolean;
  text?: string;
  className?:string
  children?: ReactNode;
}) => {
  if (!loading) return children;

  return (
    <div className={cn(
      "h-screen w-screen flex justify-center items-center p-4",
      className
    )}>
      <div className="flex flex-col items-center loader-container">
        <div className="flex items-center flex-row md:flex-col loader-inner">
          <svg
            className="loader-svg"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              stroke="#002928"
              strokeWidth="10"
              r="35"
              strokeDasharray="164.93361431346415 56.97787143782138"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
              />
            </circle>
          </svg>
          <span className="ml-4 text-[1.2rem] font-medium text-gray-800 md:ml-0 md:mt-4">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;

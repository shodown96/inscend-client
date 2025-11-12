import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

export interface InputProps
  extends React.ComponentProps<"input"> {
  label?: string;
  labelStyle?: string;
  supportingText?: string;
  supportingTextStyle?: string;
  touched?: boolean;
  error?: any;
  containerClass?: string,
  leftIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  rightIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  description?: string
}

function Input({
  className = "",
  containerClass = "",
  label,
  labelStyle = "",
  type,
  error,
  touched,
  value,
  description,
  leftIcon: LetfIcon,
  rightIcon: RightIcon,
  ...props
}: InputProps) {
  const [securedText, setSecureText] = React.useState(true);
  return (
    <div className={cn(containerClass, 'h-18')}>
      {label && (
        <p className={cn("text-xs font-medium w-full text-left mb-1 uppercase", labelStyle)}>
          {label}
        </p>
      )}
      <div className={cn(
        "flex gap-2 items-center border border-input shadow-xs transition-all rounded-md px-4 py-2.5 group",
        "focus-within:outline-none focus-within:ring-0 focus-within:ring-primary focus-within:border-primary",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        touched && error ? "outline-error! ring-[0.5px] ring-error border-error!" : "",
      )}>
        {LetfIcon ? <LetfIcon className={cn(
          "text-muted-foreground transition-all",
          touched && error ? "text-error!" : "",
          value?.toString().length ? "group-focus-within: text-primary" : "",
        )} /> : null}
        <input
          type={type === "password" ? (securedText ? "password" : "text") : type}
          data-slot="input"
          value={value}
          className={cn(
            "w-full text-base md:text-sm outline-none",
            "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ",
            className
          )}
          {...props}
        />

        {RightIcon ? <RightIcon className={cn(
          "text-muted-foreground transition-all",
          touched && error ? "text-error!" : "",
          value?.toString().length ? "group-focus-within: text-primary" : "",
        )} /> : null}
        {description ? (
          <div className="text-xs">{description}</div>
        ) : null}
        {type === 'password' ? (
          <div onClick={() => setSecureText(!securedText)}>
            {securedText ? (
              <EyeOff className="cursor-pointer h-5 w-5 text-muted-foreground" />
            ) : (
              <Eye className="cursor-pointer h-5 w-5 text-muted-foreground" />
            )}
          </div>
        ) : null}
      </div>
      {touched && error && (
        <label className={"text-xs text-error"}>
          {error?.message || typeof error === "string" ? error : null}
        </label>
      )}
    </div>
  )
}

export { Input };


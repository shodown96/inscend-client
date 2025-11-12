import * as React from "react";
import EyeFilled from "@/assets/icons/eye-filled.svg?react";
import EyeSlashed from "@/assets/icons/eye-slashed.svg?react";
import { cn } from "@/lib/utils";

interface ICustomChangeEvent {
  target: {
    id?: string;
    value: string;
  };
}

type CustomChangeEvent =
  | ICustomChangeEvent
  | React.ChangeEvent<HTMLInputElement>;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClass?: string;
  error?: any;
  label?: string;
  labelStyle?: string;
  onChange?: (e: CustomChangeEvent) => void;
  supportingText?: string;
  supportingTextStyle?: string;
  touched?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClass,
      disabled,
      label,
      labelStyle,
      onChange,
      supportingText,
      supportingTextStyle,
      value,
      touched,
      error,
      ...props
    },
    ref,
  ) => {
    const [securedText, setSecureText] = React.useState(true);
    return (
      <div className={cn(containerClass,'h-18')}>
        {/* {label && (
          <p className={cn("text-sm font-medium w-full text-left mb-1", labelStyle)}>
            {label}
          </p>
        )} */}
        <div className="flex rounded-md border border-input focus-within:outline-none focus-within:ring-1 focus-within:ring-ring">
          <input
            className={cn(
              "flex w-full bg-transparent px-4 py-2.5 text-sm transition-colors outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            type={securedText ? "password" : "text"}
            value={value}
            disabled={disabled}
            onChange={onChange}
            ref={ref}
            {...props}
          />

          <div className="flex items-center gap-2 pr-3">
            <div onClick={() => setSecureText(!securedText)}>
              {securedText ? (
                <EyeSlashed className="cursor-pointer" />
              ) : (
                <EyeFilled className="cursor-pointer" />
              )}
            </div>
          </div>
        </div>
        {touched && error && (
          <label className={"text-xs text-red-500"}>
            {error?.message || typeof error === "string" ? error : null}
          </label>
        )}
        {supportingText && (
          <label className={cn("mt-2 text-sm", supportingTextStyle)}>
            {supportingText}
          </label>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };

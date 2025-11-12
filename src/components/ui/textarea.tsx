import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelStyle?: string;
  supportingText?: string;
  supportingTextStyle?: string;
  touched?: boolean;
  error?: any;
  containerClass?: string
  description?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", containerClass = "", label, labelStyle = "", description, error, touched, ...props }, ref) => {
    return (
      <div className={containerClass}>
        {label && (
          <p className={cn("text-sm font-medium w-full text-left mb-1", labelStyle)}>
            {label}
          </p>
        )}
        {description && (
          <label className={"text-sm"}>
            {description}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          rows={5}
          ref={ref}
          {...props}
        />
        {touched && error && (
          <label className={"text-sm text-red-500 "}>
            {error?.message || typeof error === "string" ? error : null}
          </label>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

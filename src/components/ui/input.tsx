import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-charcoal placeholder:text-slate transition-all duration-200",
          "focus:outline-none focus:border-nordic-blue focus:ring-2 focus:ring-nordic-blue/10",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-frost",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

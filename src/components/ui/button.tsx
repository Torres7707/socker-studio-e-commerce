import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nordic-blue/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-nordic-blue text-white hover:bg-nordic-blue-light shadow-sm hover:shadow-md",
        secondary:
          "bg-frost text-charcoal hover:bg-mist border border-stone-200",
        outline:
          "border border-stone-200 bg-transparent hover:bg-frost text-charcoal",
        ghost: "hover:bg-frost text-charcoal",
        link: "text-nordic-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-lg",
        sm: "h-9 px-4 rounded-md text-xs",
        lg: "h-12 px-8 rounded-lg text-base",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

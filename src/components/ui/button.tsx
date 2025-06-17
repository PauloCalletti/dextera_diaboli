import { forwardRef } from "react"
import type { ButtonHTMLAttributes } from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variant === "default" &&
            "bg-primary text-primary-foreground shadow hover:bg-primary/90",
          variant === "destructive" &&
            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button } 
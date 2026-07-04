import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonInteract } from "@/lib/animations"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-white/10 bg-transparent hover:bg-white/5 text-white hover:text-white",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-white/5 text-muted-foreground hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "size" | "children">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        variants={buttonInteract}
        whileHover="whileHover"
        whileTap="whileTap"
        className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden")}
        disabled={isLoading || props.disabled}
        {...props}
      >
        <span className={cn("flex items-center gap-2 transition-opacity", isLoading && "opacity-0")}>
          {children}
        </span>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </span>
        )}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

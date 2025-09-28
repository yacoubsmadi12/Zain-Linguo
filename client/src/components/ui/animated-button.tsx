import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AnimatedButtonProps extends ButtonProps {
  animation?: "hover-lift" | "hover-glow" | "hover-scale" | "pulse-badge" | "celebration";
  children: React.ReactNode;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, animation = "hover-lift", children, ...props }, ref) => {
    const [isAnimating, setIsAnimating] = React.useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (animation === "celebration") {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 800);
      }
      props.onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-out",
          animation === "hover-lift" && "hover-lift",
          animation === "hover-glow" && "hover-glow",
          animation === "hover-scale" && "hover-scale",
          animation === "pulse-badge" && "animate-pulse-badge",
          isAnimating && animation === "celebration" && "animate-celebration",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
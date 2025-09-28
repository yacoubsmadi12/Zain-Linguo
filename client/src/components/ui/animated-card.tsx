import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "fade-in-up" | "fade-in-left" | "slide-in-right" | "hover-lift" | "stagger";
  delay?: number;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, animation = "fade-in-up", delay = 0, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => observer.disconnect();
    }, [delay]);

    return (
      <Card
        ref={cardRef}
        className={cn(
          "transition-all duration-500 ease-out",
          !isVisible && "opacity-0",
          isVisible && animation === "fade-in-up" && "animate-fade-in-up",
          isVisible && animation === "fade-in-left" && "animate-fade-in-left", 
          isVisible && animation === "slide-in-right" && "animate-slide-in-right",
          animation === "hover-lift" && "hover-lift cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard };
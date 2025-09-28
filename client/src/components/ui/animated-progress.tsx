import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  showGlow?: boolean;
  color?: "primary" | "success" | "warning" | "education-green" | "streak-flame";
  animated?: boolean;
  label?: string;
}

const AnimatedProgress = React.forwardRef<HTMLDivElement, AnimatedProgressProps>(
  ({ 
    value, 
    max = 100, 
    className, 
    showGlow = false, 
    color = "primary", 
    animated = true, 
    label,
    ...props 
  }, ref) => {
    const [animatedValue, setAnimatedValue] = React.useState(0);
    const progressRef = React.useRef<HTMLDivElement>(null);
    
    const percentage = Math.min((value / max) * 100, 100);
    
    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && animated) {
            setTimeout(() => setAnimatedValue(percentage), 200);
            observer.disconnect();
          } else if (!animated) {
            setAnimatedValue(percentage);
          }
        },
        { threshold: 0.1 }
      );

      if (progressRef.current) {
        observer.observe(progressRef.current);
      }

      return () => observer.disconnect();
    }, [percentage, animated]);

    const colorClasses = {
      primary: "bg-primary",
      success: "bg-success",
      warning: "bg-warning", 
      "education-green": "bg-[hsl(var(--education-green))]",
      "streak-flame": "bg-[hsl(var(--streak-flame))]"
    };

    const glowClasses = {
      primary: "shadow-lg shadow-primary/50",
      success: "shadow-lg shadow-success/50",
      warning: "shadow-lg shadow-warning/50",
      "education-green": "shadow-lg shadow-[hsl(var(--education-green)/0.5)]",
      "streak-flame": "shadow-lg shadow-[hsl(var(--streak-flame)/0.5)]"
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {label && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">{label}</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div 
          ref={progressRef}
          className="w-full bg-secondary rounded-full h-3 overflow-hidden relative"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out relative",
              colorClasses[color],
              showGlow && glowClasses[color],
              "after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0",
              "after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
              animated && "after:animate-pulse"
            )}
            style={{
              width: `${animatedValue}%`,
              boxShadow: showGlow ? `0 0 20px hsl(var(--${color === 'education-green' ? 'education-green' : color === 'streak-flame' ? 'streak-flame' : color}) / 0.6)` : undefined
            }}
          />
        </div>
      </div>
    );
  }
);

AnimatedProgress.displayName = "AnimatedProgress";

export { AnimatedProgress };
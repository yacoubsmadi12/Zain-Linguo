import * as React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StreakFlameProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  showCount?: boolean;
  className?: string;
}

const StreakFlame = React.forwardRef<HTMLDivElement, StreakFlameProps>(
  ({ streak, size = "md", animated = true, showCount = true, className }, ref) => {
    const [isGlowing, setIsGlowing] = React.useState(false);

    const sizeClasses = {
      sm: "w-6 h-6",
      md: "w-8 h-8", 
      lg: "w-12 h-12"
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-8 h-8"
    };

    const textSizes = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg"
    };

    // Animate glow based on streak milestones
    React.useEffect(() => {
      if (streak > 0 && streak % 7 === 0) {
        setIsGlowing(true);
        const timeout = setTimeout(() => setIsGlowing(false), 3000);
        return () => clearTimeout(timeout);
      }
    }, [streak]);

    const getFlameColor = () => {
      if (streak === 0) return "text-muted-foreground";
      if (streak < 7) return "text-[hsl(var(--warning))]";
      if (streak < 30) return "text-[hsl(var(--streak-flame))]";
      if (streak < 100) return "text-orange-500";
      return "text-red-500";
    };

    const getBackgroundColor = () => {
      if (streak === 0) return "bg-muted";
      if (streak < 7) return "bg-[hsl(var(--warning)/0.1)]";
      if (streak < 30) return "bg-[hsl(var(--streak-flame)/0.1)]";
      if (streak < 100) return "bg-orange-50 dark:bg-orange-950";
      return "bg-red-50 dark:bg-red-950";
    };

    return (
      <div 
        ref={ref}
        className={cn(
          "flex items-center space-x-2 transition-all duration-300",
          className
        )}
      >
        <div 
          className={cn(
            "rounded-full flex items-center justify-center transition-all duration-300",
            sizeClasses[size],
            getBackgroundColor(),
            animated && streak > 0 && "animate-flame-glow",
            isGlowing && "animate-pulse-badge",
            "hover:scale-110 cursor-pointer"
          )}
        >
          <Flame 
            className={cn(
              iconSizes[size],
              getFlameColor(),
              "transition-colors duration-300",
              streak > 0 && "drop-shadow-sm"
            )}
          />
        </div>
        
        {showCount && (
          <div className="flex flex-col items-start">
            <span className={cn(
              "font-bold transition-colors duration-300",
              textSizes[size],
              streak === 0 ? "text-muted-foreground" : "text-[hsl(var(--streak-flame))]"
            )}>
              {streak}
            </span>
            <span className="text-xs text-muted-foreground">
              {streak === 1 ? "day" : "days"}
            </span>
          </div>
        )}
        
        {/* Celebration particles for milestones */}
        {isGlowing && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75" />
            <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-75" 
                 style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-75" 
                 style={{ animationDelay: "1s" }} />
          </div>
        )}
      </div>
    );
  }
);

StreakFlame.displayName = "StreakFlame";

export { StreakFlame };
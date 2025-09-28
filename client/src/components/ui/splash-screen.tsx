import * as React from "react";
import { ZainLogo } from "@/components/ui/zain-logo";
import { cn } from "@/lib/utils";

export interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
  className?: string;
}

const SplashScreen = React.forwardRef<HTMLDivElement, SplashScreenProps>(
  ({ onComplete, duration = 2500, className }, ref) => {
    const [phase, setPhase] = React.useState<"loading" | "logo" | "fade">("loading");
    
    React.useEffect(() => {
      const timeline = [
        { delay: 200, phase: "logo" as const },
        { delay: duration - 500, phase: "fade" as const },
        { delay: duration, action: onComplete }
      ];

      const timeouts = timeline.map(({ delay, phase, action }) => 
        setTimeout(() => {
          if (phase) setPhase(phase);
          if (action) action();
        }, delay)
      );

      return () => timeouts.forEach(clearTimeout);
    }, [duration, onComplete]);

    return (
      <div 
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          "bg-gradient-to-br from-background to-secondary/50",
          "backdrop-blur-sm transition-all duration-500",
          phase === "fade" && "opacity-0 pointer-events-none",
          className
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--education-purple))] via-transparent to-[hsl(var(--education-blue))]" />
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[hsl(var(--education-yellow)/0.1)] rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[hsl(var(--education-green)/0.1)] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* Logo Animation */}
          <div 
            className={cn(
              "transform transition-all duration-1000 ease-out",
              phase === "loading" && "scale-50 opacity-0",
              phase === "logo" && "scale-100 opacity-100 animate-bounce-subtle",
              phase === "fade" && "scale-110 opacity-0"
            )}
          >
            <ZainLogo 
              size="xl" 
              animated={phase === "logo"} 
              showText={true}
            />
          </div>

          {/* Loading Animation */}
          <div 
            className={cn(
              "flex items-center justify-center space-x-2 transition-all duration-500",
              phase === "loading" && "opacity-0",
              phase === "logo" && "opacity-100",
              phase === "fade" && "opacity-0"
            )}
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full animate-bounce",
                    "bg-gradient-to-r from-[hsl(var(--education-purple))] to-[hsl(var(--primary))]"
                  )}
                  style={{ 
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "0.8s"
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-3 animate-fade-in-up">
              Loading your learning experience...
            </span>
          </div>

          {/* Educational Quote */}
          <div 
            className={cn(
              "max-w-md mx-auto transition-all duration-700 delay-300",
              phase === "loading" && "opacity-0 translate-y-4",
              phase === "logo" && "opacity-100 translate-y-0",
              phase === "fade" && "opacity-0 translate-y-2"
            )}
          >
            <p className="text-sm text-muted-foreground italic">
              "Empower your team's communication skills with AI-driven learning"
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-8 left-8 w-8 h-8 border-2 border-[hsl(var(--education-purple)/0.3)] rounded-full animate-spin" 
             style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-2 border-[hsl(var(--education-green)/0.3)] rounded-full animate-spin" 
             style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
        <div className="absolute top-1/2 right-16 w-4 h-4 bg-[hsl(var(--education-yellow)/0.4)] rounded-full animate-pulse" />
        <div className="absolute top-16 left-1/2 w-3 h-3 bg-[hsl(var(--education-blue)/0.4)] rounded-full animate-pulse" 
             style={{ animationDelay: '1.5s' }} />
      </div>
    );
  }
);

SplashScreen.displayName = "SplashScreen";

export { SplashScreen };
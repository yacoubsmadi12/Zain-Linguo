import * as React from "react";
import { cn } from "@/lib/utils";

export interface ZainLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

const ZainLogo = React.forwardRef<HTMLDivElement, ZainLogoProps>(
  ({ size = "md", animated = false, showText = true, className }, ref) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12", 
      lg: "w-16 h-16",
      xl: "w-24 h-24"
    };

    const textSizes = {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-4xl"
    };

    return (
      <div 
        ref={ref}
        className={cn(
          "flex items-center space-x-3",
          className
        )}
      >
        {/* Zain Linguo Text - Main Branding */}
        <div className="flex flex-col">
          <span 
            className={cn(
              "font-bold bg-gradient-to-r from-[hsl(var(--education-purple))] to-[hsl(var(--primary))] bg-clip-text text-transparent",
              textSizes[size],
              animated && "animate-fade-in-left"
            )}
          >
            Zain Linguo
          </span>
          {showText && (
            <span className="text-xs text-muted-foreground font-medium tracking-wide">
              Corporate Learning Platform
            </span>
          )}
        </div>
      </div>
    );
  }
);

ZainLogo.displayName = "ZainLogo";

export { ZainLogo };
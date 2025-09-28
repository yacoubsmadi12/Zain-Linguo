import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useUserProgress } from "@/hooks/use-user-progress";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ZainLogo } from "@/components/ui/zain-logo";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Menu, X, User, LogOut, LogIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const [location, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const { progress } = useUserProgress();
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: "home", label: "Home", path: "/" },
    { id: "quiz", label: "Quiz", path: "/quiz" },
    { id: "archive", label: "Archive", path: "/archive" },
    { id: "progress", label: "Progress", path: "/progress" },
    { id: "about", label: "About", path: "/about" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="hover-scale">
          <ZainLogo size="sm" animated={false} showText={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={`transition-colors ${
                isActive(item.path)
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`nav-${item.id}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Actions & Theme Toggle */}
        <div className="flex items-center space-x-2">
          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <AnimatedButton 
                  variant="ghost" 
                  size="sm" 
                  animation="hover-glow"
                  className="hidden md:flex items-center space-x-2"
                  data-testid="user-menu-trigger"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.username}</span>
                </AnimatedButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link 
                    href="/profile" 
                    className="flex items-center w-full"
                    data-testid="link-profile"
                  >
                    <User className="h-4 w-4 mr-2" />
                    الملف الشخصي
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center text-destructive focus:text-destructive"
                  data-testid="button-logout-header"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="hidden md:flex"
              data-testid="button-login-header"
            >
              <Link href="/auth">
                <LogIn className="h-4 w-4 mr-2" />
                تسجيل الدخول
              </Link>
            </Button>
          )}

          <AnimatedButton
            variant="ghost"
            size="icon"
            animation="hover-glow"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            data-testid="theme-toggle"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </AnimatedButton>

          {isMobile && (
            <AnimatedButton
              variant="ghost"
              size="icon"
              animation="hover-scale"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </AnimatedButton>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && mobileMenuOpen && (
        <div className="border-t border-border bg-card">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "text-primary bg-accent font-medium"
                    : "hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`nav-mobile-${item.id}`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile User Actions */}
            <div className="border-t border-border pt-2 mt-2 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center w-full py-2 px-3 rounded-lg hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-profile-mobile"
                  >
                    <User className="h-4 w-4 mr-2" />
                    الملف الشخصي ({user.username})
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full py-2 px-3 rounded-lg hover:bg-accent text-destructive"
                    data-testid="button-logout-mobile"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="flex items-center w-full py-2 px-3 rounded-lg hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="link-login-mobile"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

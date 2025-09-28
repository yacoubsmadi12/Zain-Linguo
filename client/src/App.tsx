import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth"; // Authentication - based on javascript_auth_all_persistance blueprint
import { ProtectedRoute } from "@/lib/protected-route";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import Archive from "@/pages/archive";
import Progress from "@/pages/progress";
import About from "@/pages/about";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/quiz" component={Quiz} />
      <ProtectedRoute path="/archive" component={Archive} />
      <ProtectedRoute path="/progress" component={Progress} />
      <ProtectedRoute path="/about" component={About} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
          <div className="min-h-screen bg-background text-foreground font-sans antialiased transition-colors duration-300">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <Router />
                </div>
                <div className="lg:col-span-1">
                  <Sidebar />
                </div>
              </div>
            </main>
            
            {/* Footer */}
            <footer className="bg-muted/30 border-t border-border mt-16">
              <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">Z</span>
                    </div>
                    <span className="font-semibold">Zain Linguo</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    Powered by AI • Corporate Language Learning Platform
                  </p>
                  <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-foreground transition-colors">Support</a>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    © 2024 Zain Linguo - Zain Jordan. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

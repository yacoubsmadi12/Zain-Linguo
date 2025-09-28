import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  LogOut, 
  Building, 
  Mail, 
  Calendar, 
  Shield,
  Settings
} from "lucide-react";
import { User as UserType } from "@shared/schema";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading, error } = useQuery<UserType>({
    queryKey: ["/api/user"],
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/logout"),
    onSuccess: () => {
      queryClient.clear(); // Clear all cache
      toast({
        title: "Successfully logged out",
        description: "See you soon in your learning journey!",
      });
      setLocation("/auth");
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  // Redirect to auth if not authenticated
  if (error?.message === "Not authenticated") {
    setLocation("/auth");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Redirecting to login...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-card rounded-lg border border-border p-6 h-32" />
        <div className="bg-card rounded-lg border border-border p-6 h-48" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Shield className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Access Denied</h2>
              <p className="text-sm text-muted-foreground text-center">
                Please log in to access your profile
              </p>
              <Button onClick={() => setLocation("/auth")} data-testid="button-login">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--education-purple))] to-[hsl(var(--primary))] flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold" data-testid="text-username">
                  {user.username}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground" data-testid="text-email">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className="bg-[hsl(var(--education-purple)/0.1)] text-[hsl(var(--education-purple))] border-[hsl(var(--education-purple)/0.2)]"
              data-testid="badge-department"
            >
              <Building className="h-3 w-3 mr-1" />
              {user.department}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Username:</span>
                  <span className="font-medium" data-testid="info-username">{user.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="font-medium" data-testid="info-email">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <span className="font-medium" data-testid="info-department">{user.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Join Date:</span>
                  <span className="font-medium" data-testid="info-created-at">
                    {formatDate(user.createdAt.toString())}
                  </span>
                </div>
              </div>
            </div>

            {/* Department Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Department Information
              </h3>
              <div className="p-4 bg-gradient-to-br from-[hsl(var(--education-purple)/0.05)] to-[hsl(var(--primary)/0.05)] rounded-lg border border-[hsl(var(--education-purple)/0.1)]">
                <div className="text-center">
                  <h4 className="font-medium text-lg mb-2">{user.department}</h4>
                  <p className="text-sm text-muted-foreground">
                    You have access to content specific to your department
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="destructive"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="flex-1 sm:flex-initial"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? "Logging out..." : "Sign Out"}
            </Button>
          </div>
          
          <Separator />
          
          <div className="text-sm text-muted-foreground">
            <p>💡 <strong>Tip:</strong> You can access all learning platform features through the top navigation menu.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
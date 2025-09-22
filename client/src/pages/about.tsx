import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Lightbulb, Target, Users, CheckCircle } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function About() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => 
      apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message! We will get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* About Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">About Daily English Word</h2>
        <p className="text-muted-foreground">Powered by advanced AI to enhance your vocabulary</p>
      </div>

      {/* About Content */}
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Mission Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Our Mission</h3>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                Daily English Word is designed to help you master the English language one word at a time. 
                Each day, we present you with a carefully selected powerful word that can enhance your vocabulary 
                and improve your communication skills. Our goal is to make English learning accessible, engaging, 
                and effective for learners worldwide.
              </p>
            </div>

            {/* How It Works */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">How It Works</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Receive a new powerful English word every day</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Learn pronunciation with IPA phonetics</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Study real-world examples with translations</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Test your knowledge with interactive quizzes</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Track your progress and build learning streaks</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Access archive of previously learned words</span>
                </div>
              </div>
            </div>

            {/* AI Technology */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Powered by AI</h3>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                Our content is generated using Google's advanced Gemini AI technology to ensure fresh, 
                relevant, and educationally valuable words are delivered to you every day. The AI 
                selects words based on their usefulness, frequency in modern English, and learning value.
                Each word comes with comprehensive examples, accurate translations, and carefully crafted 
                quiz questions to maximize your learning experience.
              </p>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Key Features</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-2">Gamification</h4>
                  <p className="text-sm text-muted-foreground">
                    Earn achievements, maintain streaks, and track your progress with our engaging gamification system.
                  </p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-2">CEFR Levels</h4>
                  <p className="text-sm text-muted-foreground">
                    Words are categorized by CEFR levels from A1 to C2, helping you learn at your appropriate level.
                  </p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-2">Dark/Light Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Switch between dark and light themes for comfortable learning in any environment.
                  </p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-2">Mobile Friendly</h4>
                  <p className="text-sm text-muted-foreground">
                    Fully responsive design that works perfectly on all devices, from phones to desktops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <p className="text-muted-foreground">
            Have a suggestion, feedback, or question? We'd love to hear from you!
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name *</Label>
                <Input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  data-testid="contact-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  data-testid="contact-email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-subject">Subject *</Label>
              <Select value={formData.subject} onValueChange={(value) => handleChange("subject", value)}>
                <SelectTrigger data-testid="contact-subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggestion">Word Suggestion</SelectItem>
                  <SelectItem value="feedback">General Feedback</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message *</Label>
              <Textarea
                id="contact-message"
                rows={4}
                placeholder="Tell us your thoughts, suggestions, or report any issues..."
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                required
                data-testid="contact-message"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={contactMutation.isPending}
              data-testid="contact-submit"
            >
              {contactMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useUserProgress } from "@/hooks/use-user-progress";
import { WordCard } from "@/components/word-card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { StreakFlame } from "@/components/ui/streak-flame";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Trophy, Target } from "lucide-react";
import { Word } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { progress, checkDailyStreak } = useUserProgress();

  const { data: todayWord, isLoading, error } = useQuery<Word>({
    queryKey: ["/api/word/today"],
    refetchOnMount: true,
  });

  // Check daily streak when component mounts
  React.useEffect(() => {
    checkDailyStreak();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="bg-card rounded-lg border border-border p-4 h-24" />
        <div className="bg-card rounded-lg border border-border p-8 h-96" />
      </div>
    );
  }

  if (error || !todayWord) {
    return (
      <div className="text-center py-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-destructive mb-2">Unable to Load Today's Word</h2>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Please check your internet connection and try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Dashboard Stats */}
      <AnimatedCard animation="fade-in-up" className="bg-gradient-to-br from-card via-card to-[hsl(var(--education-purple)/0.05)] border-2 border-[hsl(var(--education-purple)/0.2)] shadow-xl hover-glow">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Streak Display */}
            <div className="flex items-center justify-center md:justify-start space-x-4 bg-gradient-to-r from-[hsl(var(--streak-flame)/0.1)] to-[hsl(var(--warning)/0.1)] p-4 rounded-xl">
              <div className="text-center">
                <div className="text-sm font-medium text-[hsl(var(--education-purple))] mb-1">🔥 Learning Streak</div>
                <StreakFlame 
                  streak={progress.streak} 
                  size="lg" 
                  animated={true} 
                  showCount={true} 
                  data-testid="home-streak"
                />
              </div>
            </div>
            
            {/* Words Learned */}
            <div className="text-center bg-gradient-to-r from-[hsl(var(--education-green)/0.1)] to-[hsl(var(--success)/0.1)] p-4 rounded-xl hover-lift">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-[hsl(var(--education-green))]" />
                <span className="text-sm font-medium text-[hsl(var(--education-green))]">Words Mastered</span>
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-[hsl(var(--education-green))] to-[hsl(var(--success))] bg-clip-text text-transparent animate-word-highlight" data-testid="home-total-words">
                {progress.totalWords}
              </div>
            </div>

            {/* Quiz Performance */}
            <div className="text-center bg-gradient-to-r from-[hsl(var(--education-blue)/0.1)] to-[hsl(var(--primary)/0.1)] p-4 rounded-xl hover-lift">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-[hsl(var(--education-blue))]" />
                <span className="text-sm font-medium text-[hsl(var(--education-blue))]">Quiz Average</span>
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-[hsl(var(--education-blue))] to-[hsl(var(--primary))] bg-clip-text text-transparent">
                {progress.averageScore}%
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-[hsl(var(--education-yellow)/0.1)] to-[hsl(var(--warning)/0.1)] border border-[hsl(var(--education-yellow)/0.3)] rounded-lg p-3">
              <p className="text-[hsl(var(--education-purple))] font-medium text-lg">
                {progress.streak === 0 && "🌱 Start your learning journey today!"}
                {progress.streak > 0 && progress.streak < 7 && "🚀 Great start! Keep building your streak!"}
                {progress.streak >= 7 && progress.streak < 30 && "⭐ Fantastic progress! You're on fire!"}
                {progress.streak >= 30 && "🏆 Outstanding dedication! You're a language champion!"}
              </p>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Today's Word */}
      <div className="animate-fade-in-up">
        <WordCard
          word={todayWord}
          onTakeQuiz={() => setLocation("/quiz")}
          onViewArchive={() => setLocation("/archive")}
        />
      </div>
    </div>
  );
}

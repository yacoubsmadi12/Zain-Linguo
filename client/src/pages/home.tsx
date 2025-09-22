import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useUserProgress } from "@/hooks/use-user-progress";
import { WordCard } from "@/components/word-card";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
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
      {/* Daily Streak Counter */}
      <Card className="animate-fade-in-up">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Daily Streak</div>
                <div className="text-2xl font-bold text-warning" data-testid="home-streak">
                  {progress.streak} Day{progress.streak !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Words Learned</div>
              <div className="text-xl font-semibold" data-testid="home-total-words">
                {progress.totalWords}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

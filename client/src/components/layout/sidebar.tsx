import { useUserProgress } from "@/hooks/use-user-progress";
import { AnimatedCard } from "@/components/ui/animated-card";
import { StreakFlame } from "@/components/ui/streak-flame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, BookOpen, Target, Trophy } from "lucide-react";

export function Sidebar() {
  const { progress } = useUserProgress();

  const achievementIcons = {
    "7-day-streak": <Flame className="w-4 h-4" />,
    "30-day-streak": <Flame className="w-4 h-4" />,
    "100-day-streak": <Flame className="w-4 h-4" />,
    "century-club": <BookOpen className="w-4 h-4" />,
    "word-master": <BookOpen className="w-4 h-4" />,
    "quiz-master": <Target className="w-4 h-4" />,
  };

  const achievementNames = {
    "7-day-streak": "7-Day Streak",
    "30-day-streak": "30-Day Streak", 
    "100-day-streak": "100-Day Streak",
    "century-club": "Century Club",
    "word-master": "Word Master",
    "quiz-master": "Quiz Master",
  };

  return (
    <div className="space-y-6 stagger-children">

      {/* Quick Stats */}
      <AnimatedCard animation="fade-in-up" delay={100}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[hsl(var(--education-yellow))]" />
            <span>Quick Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Animated Streak Display */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[hsl(var(--streak-flame)/0.1)] to-[hsl(var(--warning)/0.1)] rounded-lg">
            <span className="text-muted-foreground font-medium">Current Streak</span>
            <StreakFlame 
              streak={progress.streak} 
              size="sm" 
              animated={true} 
              showCount={true} 
              data-testid="stat-streak"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[hsl(var(--education-green))]" />
              <span className="text-muted-foreground">Words Learned</span>
            </div>
            <span className="font-bold text-[hsl(var(--education-green))] animate-word-highlight" data-testid="stat-words">
              {progress.totalWords}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-[hsl(var(--education-purple))]" />
              <span className="text-muted-foreground">Quiz Average</span>
            </div>
            <span className="font-bold text-[hsl(var(--education-purple))]" data-testid="stat-average">
              {progress.averageScore}%
            </span>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Recent Achievements */}
      <AnimatedCard animation="fade-in-up" delay={200}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[hsl(var(--education-yellow))]" />
            <span>Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {progress.achievements.length === 0 ? (
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-sm">
                No achievements yet. Keep learning to earn badges!
              </p>
            </div>
          ) : (
            progress.achievements.slice(-3).reverse().map((achievement, index) => (
              <div key={achievement} className="flex items-center space-x-3 hover-lift p-2 rounded-lg cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--education-yellow))] to-[hsl(var(--warning))] rounded-full flex items-center justify-center text-white animate-pulse-badge">
                  {achievementIcons[achievement as keyof typeof achievementIcons] || <Trophy className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-sm font-medium" data-testid={`achievement-${achievement}`}>
                    {achievementNames[achievement as keyof typeof achievementNames] || achievement}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {index === 0 ? "🎉 Latest" : `${index + 1} achievement${index > 0 ? 's' : ''} ago`}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </AnimatedCard>

      {/* Learning Tips */}
      <AnimatedCard animation="fade-in-up" delay={300}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--education-yellow))] to-[hsl(var(--warning))] rounded-full flex items-center justify-center animate-bounce-subtle">
              💡
            </div>
            <span>Learning Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="p-3 bg-gradient-to-r from-[hsl(var(--education-green)/0.1)] to-[hsl(var(--success)/0.1)] rounded-lg border-l-4 border-[hsl(var(--education-green))] hover-lift">
            <p className="leading-relaxed text-foreground font-medium">
              Try using today's word in three different sentences to reinforce your memory.
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-[hsl(var(--education-blue)/0.1)] to-[hsl(var(--primary)/0.1)] rounded-lg border-l-4 border-[hsl(var(--education-blue))] hover-lift">
            <p className="leading-relaxed text-foreground font-medium">
              Practice pronunciation by repeating the word multiple times throughout the day.
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-[hsl(var(--education-purple)/0.1)] to-[hsl(var(--primary)/0.1)] rounded-lg border-l-4 border-[hsl(var(--education-purple))] hover-lift">
            <p className="leading-relaxed text-foreground font-medium">
              Create word associations or mental images to help remember new vocabulary.
            </p>
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  );
}

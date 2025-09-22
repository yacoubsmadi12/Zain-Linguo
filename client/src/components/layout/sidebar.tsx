import { useUserProgress } from "@/hooks/use-user-progress";
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
    <div className="space-y-6">
      {/* AdSense Sidebar Ad */}
      <div className="ad-placeholder h-96 rounded-lg sticky top-24 flex items-center justify-center text-sm">
        AdSense Sidebar - ca-pub-XXXXXXXX slot="XXXXXXXX"
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Streak</span>
            <span className="font-medium text-warning" data-testid="stat-streak">
              {progress.streak} days
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Words Learned</span>
            <span className="font-medium text-success" data-testid="stat-words">
              {progress.totalWords}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quiz Average</span>
            <span className="font-medium text-primary" data-testid="stat-average">
              {progress.averageScore}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {progress.achievements.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No achievements yet. Keep learning to earn badges!
            </p>
          ) : (
            progress.achievements.slice(-3).reverse().map((achievement, index) => (
              <div key={achievement} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white">
                  {achievementIcons[achievement as keyof typeof achievementIcons] || <Trophy className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-sm font-medium" data-testid={`achievement-${achievement}`}>
                    {achievementNames[achievement as keyof typeof achievementNames] || achievement}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {index === 0 ? "Latest" : `${index + 1} achievement${index > 0 ? 's' : ''} ago`}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Learning Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Learning Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="leading-relaxed">
            Try using today's word in three different sentences to reinforce your memory.
          </p>
          <p className="leading-relaxed">
            Practice pronunciation by repeating the word multiple times throughout the day.
          </p>
          <p className="leading-relaxed">
            Create word associations or mental images to help remember new vocabulary.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

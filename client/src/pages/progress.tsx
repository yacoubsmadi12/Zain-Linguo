import { useUserProgress } from "@/hooks/use-user-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Flame, BookOpen, Target, Trophy, Star, Award } from "lucide-react";

const achievementData = {
  "7-day-streak": {
    name: "7-Day Streak",
    icon: Flame,
    description: "Learn for 7 consecutive days",
    color: "text-orange-500",
    bgColor: "bg-orange-500",
  },
  "30-day-streak": {
    name: "30-Day Streak", 
    icon: Flame,
    description: "Learn for 30 consecutive days",
    color: "text-orange-600",
    bgColor: "bg-orange-600",
  },
  "100-day-streak": {
    name: "100-Day Streak",
    icon: Flame, 
    description: "Learn for 100 consecutive days",
    color: "text-red-500",
    bgColor: "bg-red-500",
  },
  "century-club": {
    name: "Century Club",
    icon: BookOpen,
    description: "Learn 100 words",
    color: "text-green-500", 
    bgColor: "bg-green-500",
  },
  "word-master": {
    name: "Word Master",
    icon: BookOpen,
    description: "Learn 500 words",
    color: "text-green-600",
    bgColor: "bg-green-600", 
  },
  "quiz-master": {
    name: "Quiz Master",
    icon: Target,
    description: "Achieve 90% average quiz score",
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
};

const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const cefrColors = {
  A1: "bg-green-500",
  A2: "bg-green-600", 
  B1: "bg-blue-500",
  B2: "bg-blue-600",
  C1: "bg-purple-500",
  C2: "bg-purple-600",
};

export default function Progress() {
  const { progress } = useUserProgress();

  const getAchievementProgress = (achievementId: string) => {
    switch (achievementId) {
      case "30-day-streak":
        return Math.min(100, (progress.streak / 30) * 100);
      case "100-day-streak":
        return Math.min(100, (progress.streak / 100) * 100);
      case "word-master":
        return Math.min(100, (progress.totalWords / 500) * 100);
      case "quiz-master":
        return Math.min(100, (progress.averageScore / 90) * 100);
      default:
        return 100;
    }
  };

  // Mock CEFR level data - in a real app, this would come from analyzing learned words
  const cefrStats = {
    A1: 5, A2: 12, B1: 25, B2: 45, C1: 38, C2: 2
  };

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Your Progress</h2>
        <p className="text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-warning mb-2" data-testid="progress-streak">
              {progress.streak}
            </div>
            <div className="text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-success mb-2" data-testid="progress-words">
              {progress.totalWords}
            </div>
            <div className="text-muted-foreground">Words Learned</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2" data-testid="progress-average">
              {progress.averageScore}%
            </div>
            <div className="text-muted-foreground">Quiz Average</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievement Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(achievementData).map(([key, achievement]) => {
              const isEarned = progress.achievements.includes(key);
              const progressPercent = isEarned ? 100 : getAchievementProgress(key);
              const Icon = achievement.icon;

              return (
                <div
                  key={key}
                  className={`text-center p-4 rounded-lg border-2 transition-all ${
                    isEarned
                      ? "bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/10 border-yellow-300 dark:border-yellow-700"
                      : "bg-muted/20 border-border"
                  }`}
                  data-testid={`achievement-${key}`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      isEarned ? achievement.bgColor : "bg-muted"
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${isEarned ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <div className={`font-semibold text-sm mb-1 ${isEarned ? achievement.color : "text-muted-foreground"}`}>
                    {achievement.name}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {achievement.description}
                  </div>
                  {!isEarned && progressPercent < 100 && (
                    <div className="w-full">
                      <ProgressBar value={progressPercent} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round(progressPercent)}% complete
                      </div>
                    </div>
                  )}
                  {isEarned && (
                    <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-700">
                      Earned
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Learning Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-4">Words by CEFR Level</h4>
              <div className="space-y-3">
                {cefrLevels.map((level) => {
                  const count = cefrStats[level as keyof typeof cefrStats] || 0;
                  const percentage = progress.totalWords > 0 ? (count / progress.totalWords) * 100 : 0;
                  
                  return (
                    <div key={level} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {level}
                          </Badge>
                          <span className="text-sm font-medium">
                            {level === "A1" && "Beginner"}
                            {level === "A2" && "Elementary"}
                            {level === "B1" && "Intermediate"}
                            {level === "B2" && "Upper Intermediate"}
                            {level === "C1" && "Advanced"}
                            {level === "C2" && "Proficiency"}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground" data-testid={`cefr-${level}-count`}>
                          {count} words
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${cefrColors[level as keyof typeof cefrColors]}`}
                          style={{ width: `${percentage}%` }}
                          data-testid={`cefr-${level}-progress`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quiz Performance */}
            <div>
              <h4 className="font-semibold mb-4">Quiz Performance</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Object.keys(progress.quizScores).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Quizzes Taken</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-success mb-1">
                    {Object.values(progress.quizScores).filter(score => score >= 80).length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Scores (80%+)</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

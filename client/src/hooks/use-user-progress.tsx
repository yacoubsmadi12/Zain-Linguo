import { useState, useEffect } from "react";
import { UserProgress } from "@shared/schema";

const defaultProgress: UserProgress = {
  streak: 1, // Start with 1 for first visit
  totalWords: 0,
  averageScore: 0,
  lastVisit: new Date().toDateString(),
  achievements: [],
  quizScores: {},
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem("userProgress");
    return stored ? JSON.parse(stored) : defaultProgress;
  });

  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("userProgress", JSON.stringify(updated));
      return updated;
    });
  };

  const checkDailyStreak = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (progress.lastVisit === today) {
      // Already visited today, no change
      return;
    }
    
    if (progress.lastVisit === yesterday) {
      // Consecutive day, increment streak
      updateProgress({
        streak: progress.streak + 1,
        lastVisit: today,
      });
    } else if (progress.lastVisit !== today) {
      // Streak broken, reset to 1
      updateProgress({
        streak: 1,
        lastVisit: today,
      });
    }
  };

  const addQuizScore = (wordId: string, score: number) => {
    const newScores = { ...progress.quizScores, [wordId]: score };
    const scores = Object.values(newScores);
    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    // Also increment total words learned when completing a quiz
    updateProgress({
      quizScores: newScores,
      averageScore,
      totalWords: Math.max(progress.totalWords, scores.length),
    });
  };

  const updateTotalWords = (count: number) => {
    updateProgress({ totalWords: count });
  };

  const addAchievement = (achievement: string) => {
    if (!progress.achievements.includes(achievement)) {
      updateProgress({
        achievements: [...progress.achievements, achievement],
      });
    }
  };

  const checkAchievements = () => {
    // Check streak achievements
    if (progress.streak >= 7 && !progress.achievements.includes("7-day-streak")) {
      addAchievement("7-day-streak");
    }
    if (progress.streak >= 30 && !progress.achievements.includes("30-day-streak")) {
      addAchievement("30-day-streak");
    }
    if (progress.streak >= 100 && !progress.achievements.includes("100-day-streak")) {
      addAchievement("100-day-streak");
    }

    // Check word count achievements
    if (progress.totalWords >= 100 && !progress.achievements.includes("century-club")) {
      addAchievement("century-club");
    }
    if (progress.totalWords >= 500 && !progress.achievements.includes("word-master")) {
      addAchievement("word-master");
    }

    // Check quiz achievements
    if (progress.averageScore >= 90 && !progress.achievements.includes("quiz-master")) {
      addAchievement("quiz-master");
    }
  };

  useEffect(() => {
    checkDailyStreak();
    checkAchievements();
  }, [progress.streak, progress.totalWords, progress.averageScore]);

  return {
    progress,
    updateProgress,
    addQuizScore,
    updateTotalWords,
    addAchievement,
    checkDailyStreak,
  };
}

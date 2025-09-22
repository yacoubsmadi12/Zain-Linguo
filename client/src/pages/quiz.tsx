import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useUserProgress } from "@/hooks/use-user-progress";
import { QuizQuestionComponent } from "@/components/quiz-question";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Home } from "lucide-react";
import { WordWithQuestions } from "@shared/schema";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const { progress, addQuizScore } = useUserProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const { data: todayWord } = useQuery<any>({
    queryKey: ["/api/word/today"],
  });

  const { data: wordWithQuestions, isLoading, error } = useQuery<WordWithQuestions>({
    queryKey: ["/api/word", todayWord?.id, "quiz"],
    enabled: !!todayWord?.id,
  });

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (wordWithQuestions && currentQuestionIndex < wordWithQuestions.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowResult(false);
    } else {
      // Quiz complete
      setIsComplete(true);
      if (wordWithQuestions) {
        const finalScore = Math.round((score / wordWithQuestions.questions.length) * 100);
        addQuizScore(wordWithQuestions.id, finalScore);
      }
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsComplete(false);
    setShowResult(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="bg-card rounded-lg border border-border p-6 h-24" />
        <div className="bg-card rounded-lg border border-border p-8 h-96" />
      </div>
    );
  }

  if (error || !wordWithQuestions || wordWithQuestions.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-destructive mb-2">Quiz Not Available</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : "Unable to load quiz questions for today's word."}
          </p>
          <Button onClick={() => setLocation("/")} data-testid="back-to-home">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const finalScore = Math.round((score / wordWithQuestions.questions.length) * 100);
    
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center shadow-lg">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
            <p className="text-muted-foreground mb-6">
              You scored{" "}
              <span className="font-bold text-primary" data-testid="final-score">
                {score}
              </span>{" "}
              out of {wordWithQuestions.questions.length} ({finalScore}%)
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={handleRetake} variant="outline" data-testid="retake-quiz">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              <Button onClick={() => setLocation("/")} data-testid="back-to-word">
                <Home className="w-4 h-4 mr-2" />
                Back to Word
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = wordWithQuestions.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Quiz Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Daily Quiz</h2>
        <p className="text-muted-foreground">
          Test your knowledge of "{wordWithQuestions.word}" and vocabulary
        </p>
      </div>

      {/* Quiz Question */}
      <QuizQuestionComponent
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={wordWithQuestions.questions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
        showResult={showResult}
      />
    </div>
  );
}

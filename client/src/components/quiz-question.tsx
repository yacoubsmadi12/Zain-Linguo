import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { QuizQuestion } from "@shared/schema";

interface QuizQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  showResult: boolean;
}

export function QuizQuestionComponent({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  onNext,
  showResult 
}: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleOptionClick = (optionIndex: number) => {
    if (hasAnswered) return;

    setSelectedOption(optionIndex);
    setHasAnswered(true);
    
    const isCorrect = optionIndex === question.correctAnswer;
    onAnswer(isCorrect);
  };

  const getOptionStatus = (optionIndex: number) => {
    if (!hasAnswered) return "default";
    if (optionIndex === question.correctAnswer) return "correct";
    if (optionIndex === selectedOption && optionIndex !== question.correctAnswer) return "incorrect";
    return "default";
  };

  const getOptionStyles = (status: string) => {
    switch (status) {
      case "correct":
        return "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "incorrect":
        return "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
      default:
        return selectedOption !== null ? "opacity-50" : "hover:bg-accent border-border";
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            Question <span data-testid="current-question">{questionNumber}</span> of {totalQuestions}
          </div>
          <Badge variant="outline" data-testid="question-progress">
            {Math.round((questionNumber / totalQuestions) * 100)}% Complete
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary rounded-full h-2 mb-8">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            data-testid="progress-bar"
          />
        </div>

        {/* Question */}
        <h3 className="text-xl font-semibold mb-6" data-testid="question-text">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`w-full text-left p-4 border rounded-lg transition-colors ${getOptionStyles(getOptionStatus(index))}`}
              onClick={() => handleOptionClick(index)}
              disabled={hasAnswered}
              data-testid={`option-${index}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 border-2 rounded-full flex items-center justify-center font-semibold text-sm ${
                  getOptionStatus(index) === "correct" ? "border-green-500 bg-green-500 text-white" :
                  getOptionStatus(index) === "incorrect" ? "border-red-500 bg-red-500 text-white" :
                  "border-border"
                }`}>
                  {getOptionStatus(index) === "correct" ? <Check className="w-4 h-4" /> :
                   getOptionStatus(index) === "incorrect" ? <X className="w-4 h-4" /> :
                   String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {hasAnswered && (
          <div className={`p-4 rounded-lg mb-6 ${
            selectedOption === question.correctAnswer 
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          }`} data-testid="quiz-feedback">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedOption === question.correctAnswer ? "bg-green-500" : "bg-red-500"
              }`}>
                {selectedOption === question.correctAnswer ? 
                  <Check className="w-5 h-5 text-white" /> : 
                  <X className="w-5 h-5 text-white" />
                }
              </div>
              <div>
                <div className={`font-semibold mb-1 ${
                  selectedOption === question.correctAnswer 
                    ? "text-green-700 dark:text-green-400" 
                    : "text-red-700 dark:text-red-400"
                }`}>
                  {selectedOption === question.correctAnswer ? "Correct!" : "Incorrect"}
                </div>
                <div className={`text-sm ${
                  selectedOption === question.correctAnswer 
                    ? "text-green-700 dark:text-green-300" 
                    : "text-red-700 dark:text-red-300"
                }`} data-testid="feedback-explanation">
                  {question.explanation}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Button */}
        {hasAnswered && (
          <div className="flex justify-end">
            <Button onClick={onNext} data-testid="next-question-button">
              {questionNumber === totalQuestions ? "Finish Quiz" : "Next Question"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

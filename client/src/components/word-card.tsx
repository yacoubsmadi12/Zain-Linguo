import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Play } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { Word } from "@shared/schema";

interface WordCardProps {
  word: Word;
  showDate?: boolean;
  onTakeQuiz?: () => void;
  onViewArchive?: () => void;
}

export function WordCard({ word, showDate = true, onTakeQuiz, onViewArchive }: WordCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playPronunciation = () => {
    setIsPlaying(true);
    // Simulate audio playing
    setTimeout(() => setIsPlaying(false), 1000);
    
    // TODO: Implement actual text-to-speech or audio file playback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          {showDate && (
            <div className="text-sm text-muted-foreground mb-2" data-testid="word-date">
              {formatDate(word.date)}
            </div>
          )}
          <h2 className="text-4xl font-bold text-primary mb-4" data-testid="word-text">
            {word.word}
          </h2>
          
          {/* Phonetics and Part of Speech */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                size="icon"
                className="rounded-full"
                onClick={playPronunciation}
                disabled={isPlaying}
                data-testid="pronunciation-button"
              >
                {isPlaying ? <Play className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <span className="text-muted-foreground font-mono" data-testid="word-phonetic">
                {word.phonetic}
              </span>
            </div>
            <Badge variant="secondary" data-testid="word-pos">
              {word.partOfSpeech}
            </Badge>
            <Badge variant="outline" data-testid="word-cefr">
              {word.cefr}
            </Badge>
          </div>
        </div>

        {/* Definition */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">Definition</h3>
          <p className="text-muted-foreground leading-relaxed" data-testid="word-definition">
            {word.definition}
          </p>
        </div>

        {/* Synonyms and Antonyms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold mb-3 text-success">Synonyms</h4>
            <div className="flex flex-wrap gap-2" data-testid="word-synonyms">
              {word.synonyms.map((synonym, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                >
                  {synonym}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-destructive">Antonyms</h4>
            <div className="flex flex-wrap gap-2" data-testid="word-antonyms">
              {word.antonyms.map((antonym, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                >
                  {antonym}
                </Badge>
              ))}
            </div>
          </div>
        </div>


        {/* Usage Examples */}
        <div className="mb-6">
          <h4 className="font-semibold mb-4 text-lg">Usage Examples</h4>
          <div className="space-y-4" data-testid="word-examples">
            {word.examples.map((example, index) => (
              <div key={index} className="border-l-4 border-primary pl-4 py-2">
                <p className="mb-2 font-medium">
                  "{example.english}"
                </p>
                <p className="text-muted-foreground text-sm">
                  {example.arabic}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Tip */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary">Daily Tip</h4>
              <p className="text-sm text-primary/80 leading-relaxed" data-testid="daily-tip">
                {word.dailyTip}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {onTakeQuiz && (
            <Button 
              className="flex-1" 
              onClick={onTakeQuiz}
              data-testid="take-quiz-button"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              Take Today's Quiz
            </Button>
          )}
          {onViewArchive && (
            <Button 
              variant="secondary" 
              className="flex-1" 
              onClick={onViewArchive}
              data-testid="browse-archive-button"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Browse Archive
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

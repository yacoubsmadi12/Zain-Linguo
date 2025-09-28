import { useState } from "react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Play, BookOpen, Lightbulb } from "lucide-react";
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
    <AnimatedCard animation="fade-in-up" className="shadow-xl hover-lift bg-gradient-to-br from-card via-card to-secondary/20 border-2 border-[hsl(var(--education-purple)/0.2)]">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          {showDate && (
            <div className="text-sm text-[hsl(var(--education-purple))] mb-4 font-medium animate-fade-in-up" data-testid="word-date">
              📅 {formatDate(word.date)}
            </div>
          )}
          
          {/* Large bold word with animated underline */}
          <div className="relative mb-6">
            <h2 className="text-5xl font-black bg-gradient-to-r from-[hsl(var(--education-purple))] via-[hsl(var(--primary))] to-[hsl(var(--education-blue))] bg-clip-text text-transparent mb-2 animate-word-highlight" data-testid="word-text">
              {word.word}
            </h2>
            <div className="h-1 bg-gradient-to-r from-[hsl(var(--education-purple))] to-[hsl(var(--education-blue))] mx-auto rounded-full animate-progress-fill" style={{ width: '60%' }}></div>
          </div>
          
          {/* Phonetics and Part of Speech */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center space-x-3 bg-gradient-to-r from-[hsl(var(--education-purple)/0.1)] to-[hsl(var(--primary)/0.1)] px-4 py-2 rounded-full">
              <AnimatedButton
                variant="default"
                size="icon"
                animation="hover-glow"
                className="rounded-full bg-gradient-to-r from-[hsl(var(--education-purple))] to-[hsl(var(--primary))] animate-pulse-badge"
                onClick={playPronunciation}
                disabled={isPlaying}
                data-testid="pronunciation-button"
              >
                {isPlaying ? <Play className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
              </AnimatedButton>
              <span className="text-[hsl(var(--education-purple))] font-mono font-bold text-lg" data-testid="word-phonetic">
                {word.phonetic}
              </span>
            </div>
            <Badge variant="secondary" className="bg-[hsl(var(--education-blue)/0.2)] text-[hsl(var(--education-blue))] border-[hsl(var(--education-blue))] hover-scale" data-testid="word-pos">
              {word.partOfSpeech}
            </Badge>
            <Badge variant="outline" className="bg-[hsl(var(--education-yellow)/0.2)] text-[hsl(var(--warning))] border-[hsl(var(--warning))] hover-scale" data-testid="word-cefr">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="animate-fade-in-left">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-[hsl(var(--education-green))] to-[hsl(var(--success))] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">+</span>
              </div>
              <h4 className="font-bold text-[hsl(var(--education-green))] text-lg">Synonyms</h4>
            </div>
            <div className="flex flex-wrap gap-3" data-testid="word-synonyms">
              {word.synonyms.map((synonym, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-gradient-to-r from-[hsl(var(--education-green)/0.1)] to-[hsl(var(--success)/0.1)] text-[hsl(var(--education-green))] border-[hsl(var(--education-green))] hover:animate-pulse hover:bg-[hsl(var(--education-green)/0.2)] hover:scale-105 transition-all duration-300 cursor-pointer font-medium px-3 py-1 hover:shadow-lg hover:shadow-[hsl(var(--education-green)/0.3)]"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {synonym}
                </Badge>
              ))}
            </div>
          </div>
          <div className="animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-[hsl(var(--quiz-incorrect))] to-[hsl(var(--destructive))] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">−</span>
              </div>
              <h4 className="font-bold text-[hsl(var(--quiz-incorrect))] text-lg">Antonyms</h4>
            </div>
            <div className="flex flex-wrap gap-3" data-testid="word-antonyms">
              {word.antonyms.map((antonym, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-gradient-to-r from-[hsl(var(--quiz-incorrect)/0.1)] to-[hsl(var(--destructive)/0.1)] text-[hsl(var(--quiz-incorrect))] border-[hsl(var(--quiz-incorrect))] hover:animate-shake hover:bg-[hsl(var(--quiz-incorrect)/0.2)] hover:scale-105 transition-all duration-300 cursor-pointer font-medium px-3 py-1 hover:shadow-lg hover:shadow-[hsl(var(--quiz-incorrect)/0.3)]"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {antonym}
                </Badge>
              ))}
            </div>
          </div>
        </div>


        {/* Usage Examples */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className="w-6 h-6 text-[hsl(var(--education-blue))]" />
            <h4 className="font-bold text-[hsl(var(--education-blue))] text-xl">Usage Examples</h4>
          </div>
          <div className="space-y-5" data-testid="word-examples">
            {word.examples.map((example, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-r from-[hsl(var(--education-blue)/0.05)] to-[hsl(var(--primary)/0.05)] border-l-4 border-[hsl(var(--education-blue))] rounded-r-lg p-4 hover-lift transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <p className="mb-3 font-semibold text-foreground text-lg leading-relaxed">
                  <span className="text-[hsl(var(--education-blue))] text-2xl font-serif">"</span>
                  {example.english}
                  <span className="text-[hsl(var(--education-blue))] text-2xl font-serif">"</span>
                </p>
                <p className="text-[hsl(var(--education-blue))] text-sm font-medium italic bg-[hsl(var(--education-blue)/0.1)] p-2 rounded">
                  {example.arabic}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Tip */}
        <div className="bg-gradient-to-br from-[hsl(var(--education-yellow)/0.15)] to-[hsl(var(--warning)/0.15)] border-2 border-[hsl(var(--education-yellow)/0.3)] rounded-xl p-6 mb-8 hover-glow animate-fade-in-up">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--education-yellow))] to-[hsl(var(--warning))] rounded-full flex items-center justify-center flex-shrink-0 mt-1 animate-bounce-subtle">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[hsl(var(--education-yellow))] text-xl mb-3 flex items-center">
                💡 Daily Learning Tip
              </h4>
              <p className="text-foreground leading-relaxed font-medium" data-testid="daily-tip">
                {word.dailyTip}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {onTakeQuiz && (
            <AnimatedButton 
              className="flex-1 bg-gradient-to-r from-[hsl(var(--education-purple))] to-[hsl(var(--primary))] hover:from-[hsl(var(--primary))] hover:to-[hsl(var(--education-blue))] text-lg py-3 font-bold shadow-lg hover:shadow-xl" 
              animation="celebration"
              onClick={onTakeQuiz}
              data-testid="take-quiz-button"
            >
              <div className="w-6 h-6 mr-3 animate-pulse-badge">🧠</div>
              Take Today's Quiz
            </AnimatedButton>
          )}
          {onViewArchive && (
            <AnimatedButton 
              variant="secondary" 
              className="flex-1 bg-gradient-to-r from-[hsl(var(--education-green))] to-[hsl(var(--success))] text-white hover:from-[hsl(var(--success))] hover:to-[hsl(var(--education-blue))] text-lg py-3 font-bold shadow-lg hover:shadow-xl" 
              animation="hover-lift"
              onClick={onViewArchive}
              data-testid="browse-archive-button"
            >
              <div className="w-6 h-6 mr-3">📚</div>
              Browse Archive
            </AnimatedButton>
          )}
        </div>
      </CardContent>
    </AnimatedCard>
  );
}

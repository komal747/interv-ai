import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Timer, CheckCircle2, XCircle } from "lucide-react";

interface MCQInterfaceProps {
  questions: any[];
  onComplete: (results: any) => void;
}

export function MCQInterface({ questions = [], onComplete }: MCQInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(60); // 1 minute per MCQ
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Defensive check for missing questions
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
        <div className="bento-card p-8 text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold">Oops! No questions found.</h2>
          <p className="text-text-muted">There was an issue loading the MCQ questions. Please try restarting the session.</p>
          <Button onClick={() => window.location.reload()} className="bg-accent">Restart Session</Button>
        </div>
      </div>
    );
  }

  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleNext = useCallback(() => {
    const newAnswer = {
      questionId: currentQuestion.id,
      selected: selectedOption,
      answer: selectedOption || "(No answer)",
      isCorrect: selectedOption === currentQuestion.idealAnswer,
      timeSpent: 60 - secondsRemaining,
    };
    
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSecondsRemaining(60);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(updatedAnswers);
    }
  }, [currentQuestion, selectedOption, secondsRemaining, answers, currentIndex, questions.length, onComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (secondsRemaining === 0) {
      handleNext();
    }
  }, [secondsRemaining, handleNext]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-20">
      <div className="mb-12 bg-card/50 border border-border px-6 py-2 rounded-full flex items-center gap-3">
        <Timer className={`w-4 h-4 ${secondsRemaining < 15 ? "text-red-500 animate-pulse" : "text-accent"}`} />
        <span className={`text-lg font-mono font-bold tracking-widest ${secondsRemaining < 15 ? "text-red-500" : "text-text-main"}`}>
          {formatTime(secondsRemaining)}
        </span>
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bento-card p-12 space-y-10 shadow-2xl shadow-black/50"
      >
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
            Question {currentIndex + 1} of {questions.length}
          </span>

          {currentQuestion.passage && (
            <div className="p-6 rounded-2xl bg-bg/50 border border-border shadow-inner max-h-[250px] overflow-y-auto custom-scrollbar italic text-text-muted leading-relaxed">
              <p className="text-sm font-medium">
                {currentQuestion.passage}
              </p>
            </div>
          )}

          <h2 className="text-2xl md:text-3xl font-bold text-text-main leading-tight tracking-tight">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option: string, i: number) => {
            const isCorrect = option === currentQuestion.idealAnswer;
            const isSelected = option === selectedOption;
            
            let variantClass = "bg-bg border-border hover:border-accent/50";
            if (isAnswered) {
              if (isCorrect) variantClass = "bg-success/10 border-success text-success shadow-[0_0_15px_rgba(34,197,94,0.1)]";
              else if (isSelected) variantClass = "bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
              else variantClass = "bg-bg border-border opacity-50";
            } else if (isSelected) {
              variantClass = "bg-accent/10 border-accent text-accent";
            }

            return (
              <button
                key={i}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnswered}
                className={`w-full p-6 rounded-2xl border text-left transition-all flex items-center justify-between group ${variantClass}`}
              >
                <span className="text-lg font-medium">{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-success" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-6 rounded-2xl bg-accent/5 border border-accent/20 space-y-2"
          >
            <p className="text-xs font-bold text-accent uppercase tracking-widest">Explanation</p>
            <p className="text-sm text-text-muted leading-relaxed italic">
              {currentQuestion.explanation}
            </p>
          </motion.div>
        )}

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleNext}
            disabled={!isAnswered}
            className="h-14 px-10 text-base font-bold rounded-xl bg-accent text-white hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center gap-2 disabled:opacity-50"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>

      <div className="mt-16 w-full max-w-3xl px-4">
        <div className="flex justify-between text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">
          <span>Quiz Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}

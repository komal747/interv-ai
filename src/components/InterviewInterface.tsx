import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Code2, Mic, ChevronRight, Timer, Brain, AlertCircle } from "lucide-react";
import { AnimatePresence } from "motion/react";
import Editor from "@monaco-editor/react";

interface InterviewInterfaceProps {
  type: "technical" | "coding";
  questions: any[];
  onComplete: (results: any) => void;
  userName?: string;
}

export function InterviewInterface({ type, questions = [], onComplete, userName }: InterviewInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(90);
  const [answers, setAnswers] = useState<any[]>([]);
  const [currentCode, setCurrentCode] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(true);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  
  const fullTranscriptRef = useRef("");
  const recognitionRef = useRef<any>(null);

  const currentQuestion = questions[currentIndex];
  
  const isUnsure = textAnswer.toLowerCase().includes("don't know") || 
                   textAnswer.toLowerCase().includes("not sure") || 
                   textAnswer.toLowerCase().includes("no clue") ||
                   textAnswer.toLowerCase().includes("sorry i am not sure");

  // Defensive check for missing questions
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
        <div className="bento-card p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold">Oops! No questions found.</h2>
          <p className="text-text-muted">There was an issue loading the interview questions. Please try restarting the session.</p>
          <Button onClick={() => window.location.reload()} className="bg-accent">Restart Session</Button>
        </div>
      </div>
    );
  }

  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  // AI Voice Assistant - Text to Speech
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }
    
    // Cancel any ongoing speech
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.error("Error cancelling speech:", e);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a good voice if possible
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Initial Greeting and First Question
  useEffect(() => {
    if (questions.length === 0) return;
    const q = questions[currentIndex]?.question || questions[currentIndex]?.title || "";
    if (currentIndex === 0 && type !== "coding") {
      const greeting = `Hello ${userName || "there"}! I'm your AI interviewer. Let's start with the first question. ${q}`;
      speak(greeting);
    } else if (type !== "coding") {
      speak(q);
    }
  }, [currentIndex, type, userName, speak, questions]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupportsSpeech(false);
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let currentInterim = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalTranscript) {
          const newPart = (fullTranscriptRef.current ? " " : "") + finalTranscript;
          fullTranscriptRef.current += newPart;
          setTextAnswer(fullTranscriptRef.current);
          setInterimTranscript("");
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'aborted' || event.error === 'no-speech') return;
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
          setMicPermissionDenied(true);
        }
      };

      recognition.onend = () => {
        if (isListening) {
          try {
            recognition.start();
          } catch (e) {
            // Already started
          }
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isListening]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    } else {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Already stopped
      }
    }
  }, [isListening]);

  // Initial Greeting and First Question

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNext = useCallback(() => {
    // Determine the final answer, prioritizing the ref for voice sessions
    const finalAnswerText = type === "coding" ? currentCode : (fullTranscriptRef.current || textAnswer || "(No answer)");
    
    // Stop listening
    setIsListening(false);

    const newAnswer = {
      questionId: currentQuestion.id,
      answer: finalAnswerText,
      timeSpent: 90 - secondsRemaining,
    };
    
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSecondsRemaining(90);
      setCurrentCode("");
      setTextAnswer("");
      fullTranscriptRef.current = "";
      setIsListening(false);
    } else {
      onComplete(updatedAnswers);
    }
  }, [currentQuestion, type, currentCode, textAnswer, secondsRemaining, answers, currentIndex, questions.length, onComplete]);

  const handleSkip = useCallback(() => {
    const newAnswer = {
      questionId: currentQuestion.id,
      answer: "(Skipped)",
      timeSpent: 90 - secondsRemaining,
    };
    
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSecondsRemaining(90);
      setCurrentCode("");
      setTextAnswer("");
      setIsListening(false);
    } else {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      onComplete(updatedAnswers);
    }
  }, [currentQuestion, secondsRemaining, answers, currentIndex, questions.length, onComplete]);

  useEffect(() => {
    if (type === "coding") return;
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
  }, [currentIndex, type]);

  useEffect(() => {
    if (type === "coding") return;
    if (secondsRemaining === 0) {
      handleNext();
    }
  }, [secondsRemaining, handleNext, type]);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-20">
      {/* Timer at the top - Hide for coding */}
      <div className="flex flex-col items-center gap-4 mb-12">
        {isSpeaking && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full"
          >
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 4] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                  className="w-1 bg-accent rounded-full"
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">AI is speaking...</span>
          </motion.div>
        )}
        
        {type !== "coding" && (
          <div className="bg-card/50 border border-border px-6 py-2 rounded-full flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)] ${secondsRemaining < 20 ? "bg-red-500" : "bg-success"}`} />
            <span className={`text-lg font-mono font-bold tracking-widest ${secondsRemaining < 20 ? "text-red-500" : "text-text-main"}`}>
              {formatTime(secondsRemaining)}
            </span>
          </div>
        )}
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bento-card p-12 md:p-16 space-y-12 shadow-2xl shadow-black/50 overflow-hidden relative"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-text-main leading-tight text-center max-w-3xl mx-auto tracking-tight">
          {currentQuestion.question || currentQuestion.title}
        </h2>

        {currentQuestion.hint && (
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex gap-3 items-start max-w-2xl mx-auto">
            <Brain className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-text-muted italic">
              <span className="text-accent font-bold not-italic mr-1">Hint:</span>
              {currentQuestion.hint}
            </p>
          </div>
        )}

        <div className="relative">
          {type === "coding" ? (
            <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-border bg-[#1e1e1e] shadow-inner">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={currentCode || currentQuestion.starterCode}
                onChange={(value) => setCurrentCode(value || "")}
                options={{
                  fontSize: 16,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 20 },
                  fontFamily: "'JetBrains Mono', monospace",
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-bg/30 border border-border rounded-2xl p-8 min-h-[300px] focus-within:border-accent/50 transition-colors shadow-inner">
                <textarea
                  className="w-full h-full min-h-[250px] bg-transparent border-none focus:ring-0 text-text-main placeholder:text-text-muted/50 resize-none text-xl leading-relaxed"
                  placeholder="Type your detailed answer here..."
                  value={textAnswer}
                  onChange={(e) => {
                    setTextAnswer(e.target.value);
                    fullTranscriptRef.current = e.target.value;
                  }}
                />
                {interimTranscript && (
                  <div className="absolute bottom-4 left-8 right-8 pointer-events-none">
                    <p className="text-accent/60 text-lg italic opacity-70 animate-pulse">
                      {interimTranscript}...
                    </p>
                  </div>
                )}
              </div>
              
              <AnimatePresence>
                {micPermissionDenied && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-4 overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-red-500">Microphone Access Denied</p>
                      <p className="text-xs text-text-muted leading-relaxed">
                        Voice mode cannot start because microphone access was blocked. Please click the <span className="text-text-main font-bold">Lock/Microphone icon</span> in your browser's address bar and select <span className="text-text-main font-bold">"Allow"</span>, then refresh the page.
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-red-500 font-bold"
                        onClick={() => setMicPermissionDenied(false)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {isUnsure && !micPermissionDenied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl bg-accent/10 border border-accent/20 flex gap-4 animate-in fade-in slide-in-from-top-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <Brain className="w-5 h-5 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-accent">Interview Tip: Handling "I Don't Know"</p>
                      <p className="text-xs text-text-muted leading-relaxed">
                        Instead of just saying "I don't know", try: <span className="text-text-main italic">"I'm not fully familiar with this specific concept, but based on what I know about [related topic], I would approach it by..."</span> or <span className="text-text-main italic">"That's a great question. I haven't worked with that directly yet, but I'd love to learn more about how it handles [specific scenario]."</span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
          <Button 
            variant="outline" 
            onClick={() => {
              if (!browserSupportsSpeech) {
                alert("Your browser does not support voice recognition. Please try using Chrome or Edge on desktop.");
                return;
              }
              setMicPermissionDenied(false);
              setIsListening(!isListening);
            }}
            className={`h-12 px-8 rounded-full border-border transition-all flex items-center gap-3 text-sm font-bold uppercase tracking-widest ${
              isListening 
                ? "bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                : "bg-card/50 hover:bg-border text-text-muted hover:text-text-main"
            } ${!browserSupportsSpeech ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : "text-accent"}`} />
            {!browserSupportsSpeech ? "Voice Unsupported" : (isListening ? "Listening..." : "Voice Mode")}
          </Button>

          <div className="flex items-center gap-10">
            <button 
              onClick={handleSkip}
              className="text-text-muted hover:text-text-main transition-colors font-bold text-sm tracking-widest uppercase"
            >
              Skip Question
            </button>
            <Button 
              onClick={handleNext}
              className="h-16 px-12 text-lg font-bold rounded-2xl bg-accent text-white hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 flex items-center gap-3 group"
            >
              Next Question
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Progress bar at the bottom */}
      <div className="mt-16 w-full max-w-4xl px-4">
        <div className="flex justify-between text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">
          <span>Session Progress</span>
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

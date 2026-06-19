import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FeatureCards } from "./components/FeatureCards";
import { InterviewSetup } from "./components/InterviewSetup";
import { CodingSetup } from "./components/CodingSetup";
import { MCQSetup } from "./components/MCQSetup";
import { InterviewInterface } from "./components/InterviewInterface";
import { MCQInterface } from "./components/MCQInterface";
import { Chatbot } from "./components/Chatbot";
import { Dashboard } from "./components/Dashboard";
import { Library } from "./components/Library";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { ResumeAnalyzerSetup } from "./components/ResumeAnalyzerSetup";
import { ResumeAnalyzerResults } from "./components/ResumeAnalyzerResults";
import { AuthForm } from "./components/AuthForm";
import { generateInterviewQuestions, generateCodingChallenge, generateInterviewSummary, generateMCQs, analyzeResume } from "./lib/gemini";
import { generateInterviewQuestionsGroq, generateInterviewSummaryGroq, generateCodingChallengeGroq, generateMCQsGroq, analyzeResumeGroq } from "./lib/groq";
import { Loader2, Brain, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

type View = "landing" | "setup" | "coding-setup" | "mcq-setup" | "interview" | "mcq" | "results" | "loading" | "dashboard" | "library" | "reports" | "settings" | "resume-analyzer-setup" | "resume-analyzer-results";

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [interviewType, setInterviewType] = useState<"technical" | "coding" | "mcq">("technical");
  const [questions, setQuestions] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);
  const [loadingText, setLoadingText] = useState("Tailoring your interview...");
  const [aiProvider, setAiProvider] = useState<"gemini" | "groq">("groq");
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("user_name") || "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("is_authenticated") === "true";
  });
  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem("interview_history");
    return saved ? JSON.parse(saved) : [];
  });

  const handleGetStarted = () => setView("setup");
  const handleDashboard = () => setView("dashboard");
  const handleLogo = () => setView("landing");

  const handleLogout = () => {
    console.log("Logout triggered");
    setIsAuthenticated(false);
    setUserName("");
    localStorage.removeItem("is_authenticated");
    localStorage.removeItem("user_name");
    setView("landing");
  };

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsAuthenticated(true);
    localStorage.setItem("is_authenticated", "true");
    localStorage.setItem("user_name", name);
    setView("landing");
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your entire interview history?")) {
      setHistory([]);
      localStorage.removeItem("interview_history");
    }
  };

  const startTechnicalInterview = async (data: any) => {
    setLoadingText(`Tailoring your interview with ${aiProvider === 'gemini' ? 'Gemini 1.5' : 'Groq Llama 3.3'}...`);
    setUserName(data.userName);
    setView("loading");
    try {
      const qs = aiProvider === "gemini" 
        ? await generateInterviewQuestions(data.role, data.experience, data.jobDescription, data.resumeText)
        : await generateInterviewQuestionsGroq(data.role, data.experience, data.jobDescription, data.resumeText);
      
      if (!qs || qs.length === 0) {
        throw new Error("No questions were generated. Please try again.");
      }

      setQuestions(qs);
      setInterviewType("technical");
      setView("interview");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to generate interview questions.");
      setView("setup");
    }
  };

  const startCodingPractice = async (data: any) => {
    setLoadingText(`Generating coding challenges with ${aiProvider === 'gemini' ? 'Gemini 1.5' : 'Groq Llama 3.3'}...`);
    setView("loading");
    try {
      const challenges = aiProvider === "gemini"
        ? await generateCodingChallenge(data.difficulty, data.language)
        : await generateCodingChallengeGroq(data.difficulty, data.language);
      
      if (!challenges || challenges.length === 0) {
        throw new Error("No challenges were generated. Please try again.");
      }

      setQuestions(challenges);
      setInterviewType("coding");
      setView("interview");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to generate coding challenges.");
      setView("coding-setup");
    }
  };

  const startMCQPractice = async (data: any) => {
    setLoadingText(`Generating MCQs for ${data.topic} with ${aiProvider === 'gemini' ? 'Gemini 1.5' : 'Groq Llama 3.3'}...`);
    setView("loading");
    try {
      const qs = aiProvider === "gemini"
        ? await generateMCQs(data.topic, data.difficulty)
        : await generateMCQsGroq(data.topic, data.difficulty);
      
      if (!qs || qs.length === 0) {
        throw new Error("No MCQs were generated. Please try again.");
      }

      setQuestions(qs);
      setInterviewType("mcq");
      setView("mcq");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to generate MCQs.");
      setView("mcq-setup");
    }
  };

  const startResumeAnalysis = async (data: any) => {
    setLoadingText(`Analyzing your resume with ${aiProvider === 'gemini' ? 'Gemini 1.5' : 'Groq Llama 3.3'}...`);
    setView("loading");
    try {
      const analysis = aiProvider === "gemini"
        ? await analyzeResume(data.role, data.jobDescription, data.resumeText)
        : await analyzeResumeGroq(data.role, data.jobDescription, data.resumeText);
      setResumeAnalysis(analysis);
      setView("resume-analyzer-results");
    } catch (error) {
      console.error(error);
      setView("resume-analyzer-setup");
    }
  };

  const handleInterviewComplete = async (interviewResults: any[]) => {
    setResults(interviewResults);
    setLoadingText(`Analyzing your performance with ${aiProvider === 'gemini' ? 'Gemini 1.5' : 'Groq Llama 3.3'}...`);
    setView("loading");
    
    try {
      let interviewSummary;
      
      if (interviewType === "mcq") {
        const correctCount = interviewResults.filter(r => r.isCorrect).length;
        const score = Math.round((correctCount / questions.length) * 100);
        interviewSummary = {
          overallScore: score,
          confidenceLevel: score > 80 ? "High" : score > 50 ? "Medium" : "Low",
          strengths: [
            `Correctly answered ${correctCount} out of ${questions.length} questions`,
            score > 70 ? "Strong grasp of the topic fundamentals" : "Identified key knowledge areas"
          ],
          growthAreas: [
            score < 100 ? `Review the ${questions.length - correctCount} questions you missed` : "Keep practicing with harder difficulty",
            "Deep dive into the explanations provided for each question"
          ],
          summary: `You completed the MCQ session on ${questions[0]?.topic || "the selected topic"} with a score of ${score}%.`
        };
      } else {
        interviewSummary = aiProvider === "gemini"
          ? await generateInterviewSummary(questions, interviewResults)
          : await generateInterviewSummaryGroq(questions, interviewResults);
      }

      setSummary(interviewSummary);
      
      // Save to history
      const newRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: interviewType,
        score: interviewSummary.overallScore || 0,
        confidence: interviewSummary.confidenceLevel || "Medium"
      };
      const updatedHistory = [...history, newRecord];
      setHistory(updatedHistory);
      localStorage.setItem("interview_history", JSON.stringify(updatedHistory));

      setView("results");
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7c3aed", "#3b82f6", "#ffffff"]
      });
    } catch (error) {
      console.error("Summary generation failed:", error);
      setView("results");
    }
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-bg text-text-main selection:bg-accent/30">
      <Navbar 
        onDashboardClick={handleDashboard} 
        onLogoClick={handleLogo}
        onLibraryClick={() => setView("library")}
        onReportsClick={() => setView("reports")}
        onSettingsClick={() => setView("settings")}
        onLogout={handleLogout}
        currentView={view}
        userName={userName}
      />

      <main>
        {view === "landing" && (
          <>
            <Hero 
              onGetStarted={handleGetStarted} 
              onViewDashboard={() => setView("dashboard")} 
            />
            <div className="mt-12">
              <FeatureCards 
                onMCQClick={() => setView("mcq-setup")} 
                onCodingClick={() => setView("coding-setup")}
                onResumeClick={() => setView("resume-analyzer-setup")}
              />
            </div>
          </>
        )}

        {view === "setup" && (
          <div className="space-y-12">
            <div className="max-w-2xl mx-auto px-4 pt-32 -mb-24">
              <div className="bento-card bg-card/30 border-border/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">AI Provider</p>
                    <p className="text-sm font-bold text-text-main">{aiProvider === 'gemini' ? 'Google Gemini 1.5' : 'Groq Llama 3.3'}</p>
                  </div>
                </div>
                <div className="flex bg-bg rounded-lg p-1 border border-border">
                  <button 
                    onClick={() => setAiProvider("gemini")}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${aiProvider === 'gemini' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-main'}`}
                  >
                    Gemini
                  </button>
                  <button 
                    onClick={() => setAiProvider("groq")}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${aiProvider === 'groq' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-main'}`}
                  >
                    Groq
                  </button>
                </div>
              </div>
            </div>
            <InterviewSetup onGenerate={startTechnicalInterview} />
          </div>
        )}

        {view === "coding-setup" && (
          <CodingSetup 
            onStart={startCodingPractice} 
            onCancel={() => setView("landing")} 
          />
        )}

        {view === "mcq-setup" && (
          <MCQSetup 
            onGenerate={startMCQPractice} 
            onCancel={() => setView("landing")} 
          />
        )}

        {view === "loading" && (
          <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-text-main">{loadingText}</h2>
              <p className="text-text-muted text-sm">Our AI is processing your request using Gemini 3.1 Flash.</p>
            </div>
          </div>
        )}

        {view === "interview" && (
          <InterviewInterface 
            type={interviewType as "technical" | "coding"}
            questions={questions}
            onComplete={handleInterviewComplete}
            userName={userName}
          />
        )}

        {view === "mcq" && (
          <MCQInterface 
            questions={questions}
            onComplete={handleInterviewComplete}
          />
        )}

        {view === "results" && (
          <div className="max-w-4xl mx-auto px-10 py-32">
            <div className="bento-card p-12 text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-text-main">Interview Complete!</h2>
              <p className="text-text-muted text-lg mb-12 max-w-xl mx-auto">
                {summary?.summary || `Great job! You've completed the ${interviewType} session. Your performance is being analyzed.`}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
                <div className="bento-card bg-bg/50">
                  <p className="metric-title">Overall Score</p>
                  <p className="text-4xl font-bold text-accent">{summary?.overallScore || 0}%</p>
                </div>
                <div className="bento-card bg-bg/50">
                  <p className="metric-title">Questions Completed</p>
                  <p className="text-4xl font-bold text-text-main">{results.length}</p>
                </div>
                <div className="bento-card bg-bg/50">
                  <p className="metric-title">Confidence Level</p>
                  <p className={`text-4xl font-bold ${summary?.confidenceLevel === 'High' ? 'text-success' : summary?.confidenceLevel === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {summary?.confidenceLevel || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12 text-left">
                <div className="bento-card border-accent/20">
                  <h3 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-3">
                    {summary?.strengths && summary.strengths.length > 0 ? (
                      summary.strengths.map((s: string, i: number) => (
                        <li key={i} className="text-xs text-text-muted flex gap-2">
                          <span className="text-success">✓</span>
                          {s}
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-text-muted italic">No specific strengths identified based on the provided answers.</li>
                    )}
                  </ul>
                </div>
                <div className="bento-card border-yellow-500/20">
                  <h3 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    Areas for Growth
                  </h3>
                  <ul className="space-y-3">
                    {summary?.growthAreas && summary.growthAreas.length > 0 ? (
                      summary.growthAreas.map((g: string, i: number) => (
                        <li key={i} className="text-xs text-text-muted flex gap-2">
                          <span className="text-yellow-500">!</span>
                          {g}
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-text-muted italic">No specific growth areas identified.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="space-y-8 text-left">
                <h3 className="text-2xl font-bold text-text-main flex items-center gap-3">
                  <Brain className="w-6 h-6 text-accent" />
                  Detailed Review
                </h3>
                
                {questions.map((q, i) => {
                  const result = results.find(r => r.questionId === q.id) || results[i];
                  return (
                    <div key={i} className="bento-card bg-card/30 border-border/50 overflow-hidden">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
                            {i + 1}
                          </span>
                          <div>
                            <h4 className="text-lg font-bold text-text-main leading-tight mb-2">
                              {q.question || q.title}
                            </h4>
                            <div className="flex gap-2">
                              <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-border text-text-muted">
                                {q.difficulty || "Medium"}
                              </span>
                              <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-accent/10 text-accent">
                                {q.type || "Technical"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Your Answer</p>
                          <div className="p-4 rounded-xl bg-bg/50 border border-border min-h-[100px]">
                            <p className="text-sm text-text-main leading-relaxed">
                              {result?.answer || "No answer provided."}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-success uppercase tracking-widest">Ideal Solution</p>
                          <div className="p-4 rounded-xl bg-success/5 border border-success/20 min-h-[100px]">
                            <p className="text-sm text-text-main leading-relaxed italic">
                              {q.idealAnswer || q.solution || "Solution not available."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-12">
                <Button 
                  onClick={() => setView("dashboard")}
                  className="h-14 px-12 text-base font-bold rounded-xl bg-accent hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}

        {view === "dashboard" && (
          <Dashboard 
            history={history} 
            onBack={() => setView("landing")}
            onStartNew={() => setView("setup")}
          />
        )}

        {view === "library" && (
          <Library onExplore={(topic) => startMCQPractice({ topic, difficulty: "Intermediate" })} />
        )}

        {view === "reports" && (
          <Reports history={history} />
        )}

        {view === "settings" && (
          <Settings 
            userName={userName} 
            setUserName={setUserName}
            aiProvider={aiProvider}
            setAiProvider={setAiProvider}
            onClearHistory={clearHistory}
          />
        )}

        {view === "resume-analyzer-setup" && (
          <ResumeAnalyzerSetup 
            onAnalyze={startResumeAnalysis}
            onCancel={() => setView("landing")}
          />
        )}

        {view === "resume-analyzer-results" && (
          <ResumeAnalyzerResults 
            analysis={resumeAnalysis}
            onBack={() => setView("resume-analyzer-setup")}
          />
        )}
      </main>

      <footer className="py-12 border-t border-border text-center">
        <p className="text-text-muted text-xs font-medium uppercase tracking-widest">© 2026 InterviewAI. All rights reserved.</p>
      </footer>

      <Chatbot provider={aiProvider} />
    </div>
  );
}

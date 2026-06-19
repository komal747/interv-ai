import { useState } from "react";
import { Button } from "./ui/button";
import { Brain, Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthFormProps {
  onLogin: (name: string) => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(name || "Candidate");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-text-muted mt-2">
            {isLogin 
              ? "Sign in to access your interview dashboard" 
              : "Join InterviewAI to start your career journey"}
          </p>
        </div>

        <motion.div 
          layout
          className="bento-card p-8 bg-card/30 backdrop-blur-xl border-border/50 shadow-2xl shadow-accent/5"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full h-12 bg-bg/50 border border-border rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all pl-10"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                      <span className="text-xs font-bold">@</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 bg-bg/50 border border-border rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Password</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-bold text-accent hover:underline uppercase tracking-widest">Forgot?</button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 bg-bg/50 border border-border rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all pl-10"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-card px-2 text-text-muted italic">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-11 border-border/50 hover:bg-border/50 rounded-xl text-xs font-bold gap-2">
              <Chrome className="w-4 h-4" />
              Google
            </Button>
            <Button variant="outline" className="h-11 border-border/50 hover:bg-border/50 rounded-xl text-xs font-bold gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </Button>
          </div>
        </motion.div>

        <p className="text-center mt-8 text-sm text-text-muted italic">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent font-bold hover:underline not-italic"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

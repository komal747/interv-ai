import { motion } from "motion/react";
import { Trophy, Target, TrendingUp, Calendar, ArrowLeft, Sparkles, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterviewRecord {
  id: string;
  date: string;
  type: string;
  score: number;
  confidence: string;
}

interface DashboardProps {
  history: InterviewRecord[];
  onBack: () => void;
  onStartNew: () => void;
}

export function Dashboard({ history, onBack, onStartNew }: DashboardProps) {
  const totalInterviews = history.length;
  const avgScore = totalInterviews > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalInterviews) 
    : 0;
  
  const cheerUpMessages = [
    "You're doing great! Every interview is a step closer to your dream job.",
    "Consistency is key! Keep practicing and you'll be unstoppable.",
    "Don't be afraid of mistakes; they are your best teachers.",
    "Your hard work will pay off. Keep pushing your boundaries!",
    "Believe in yourself as much as we believe in your potential!",
    "Success is the sum of small efforts repeated day in and day out."
  ];

  const randomMessage = cheerUpMessages[Math.floor(Math.random() * cheerUpMessages.length)];

  return (
    <div className="max-w-6xl mx-auto px-6 py-32">
      <div className="flex items-center justify-between mb-12">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-text-main">Your Progress</h1>
        </div>
        <Button 
          onClick={onStartNew}
          className="bg-accent hover:bg-accent/90 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-accent/20"
        >
          Start New Practice
        </Button>
      </div>

      {/* Cheer up message */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 p-6 bg-accent/5 border border-accent/20 rounded-2xl flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Smile className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="text-sm font-bold text-accent uppercase tracking-widest mb-1">Daily Motivation</p>
          <p className="text-text-main font-medium italic">"{randomMessage}"</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bento-card bg-card/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-500" />
            </div>
            <p className="metric-title mb-0">Total Interviews</p>
          </div>
          <p className="text-5xl font-bold text-text-main">{totalInterviews}</p>
          <p className="text-xs text-text-muted mt-2">Sessions completed</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bento-card bg-card/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <p className="metric-title mb-0">Average Score</p>
          </div>
          <p className="text-5xl font-bold text-text-main">{avgScore}%</p>
          <p className="text-xs text-text-muted mt-2">Overall performance</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bento-card bg-card/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <p className="metric-title mb-0">Confidence</p>
          </div>
          <p className="text-5xl font-bold text-text-main">
            {history.length > 0 ? history[history.length - 1].confidence : "N/A"}
          </p>
          <p className="text-xs text-text-muted mt-2">Last session level</p>
        </motion.div>
      </div>

      {/* History Table */}
      <div className="bento-card overflow-hidden mb-12">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-text-main">Recent Activity</h2>
        </div>
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 font-bold text-xs uppercase tracking-widest text-text-muted">Date</th>
                  <th className="pb-4 font-bold text-xs uppercase tracking-widest text-text-muted">Type</th>
                  <th className="pb-4 font-bold text-xs uppercase tracking-widest text-text-muted">Score</th>
                  <th className="pb-4 font-bold text-xs uppercase tracking-widest text-text-muted">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.slice().reverse().map((record) => (
                  <tr key={record.id} className="group hover:bg-accent/5 transition-colors">
                    <td className="py-4 text-sm text-text-main">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-border text-text-muted uppercase tracking-wider">
                        {record.type}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-border rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent" 
                            style={{ width: `${record.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-text-main">{record.score}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-xs font-bold ${
                        record.confidence === 'High' ? 'text-success' : 
                        record.confidence === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {record.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-border rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-text-muted">No interviews completed yet. Start your first session to see your progress!</p>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bento-card bg-accent/5 border-accent/20">
          <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Interview Tips
          </h3>
          <ul className="space-y-3">
            <li className="text-sm text-text-muted flex gap-2">
              <span className="text-accent font-bold">•</span>
              Be specific: Use the STAR method (Situation, Task, Action, Result) for behavioral questions.
            </li>
            <li className="text-sm text-text-muted flex gap-2">
              <span className="text-accent font-bold">•</span>
              Think out loud: In coding interviews, explain your thought process as you write code.
            </li>
            <li className="text-sm text-text-muted flex gap-2">
              <span className="text-accent font-bold">•</span>
              Research the company: Tailor your answers to their specific values and tech stack.
            </li>
          </ul>
        </div>
        <div className="bento-card bg-purple-500/5 border-purple-500/20">
          <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Next Steps
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Based on your recent performance, we recommend focusing on:
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs font-bold">System Design</span>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs font-bold">Behavioral Prep</span>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs font-bold">Data Structures</span>
          </div>
        </div>
      </div>
    </div>
  );
}

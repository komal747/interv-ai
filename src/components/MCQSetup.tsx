import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Brain, Calculator, MessageSquare, Lightbulb } from "lucide-react";

interface MCQSetupProps {
  onGenerate: (data: any) => void;
  onCancel: () => void;
}

export function MCQSetup({ onGenerate, onCancel }: MCQSetupProps) {
  const [topic, setTopic] = useState("Quantitative Aptitude");
  const [difficulty, setDifficulty] = useState("Intermediate");

  const topics = [
    { id: "Quantitative Aptitude", icon: Calculator, desc: "Math, numbers, and logic" },
    { id: "Verbal Ability", icon: MessageSquare, desc: "Grammar and comprehension" },
    { id: "Logical Reasoning", icon: Lightbulb, desc: "Patterns and deductions" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto px-4 py-32"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 text-text-main">MCQ Mastery Setup</h2>
        <p className="text-text-muted">Choose your challenge and sharpen your fundamentals.</p>
      </div>

      <div className="bento-card space-y-8">
        <div className="space-y-4">
          <Label className="metric-title">Select Topic</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  topic === t.id 
                    ? "bg-accent/10 border-accent shadow-lg shadow-accent/5" 
                    : "bg-bg border-border hover:bg-border"
                }`}
              >
                <t.icon className={`w-6 h-6 mb-3 ${topic === t.id ? "text-accent" : "text-text-muted"}`} />
                <p className={`font-bold text-sm ${topic === t.id ? "text-text-main" : "text-text-muted"}`}>{t.id}</p>
                <p className="text-[10px] text-text-muted mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="metric-title">Difficulty Level</Label>
          <div className="grid grid-cols-3 gap-3">
            {["Fresher", "Intermediate", "Expert"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`h-12 rounded-xl font-semibold text-sm transition-all ${
                  difficulty === level 
                    ? "bg-accent text-white shadow-lg shadow-accent/20" 
                    : "bg-bg text-text-muted border border-border hover:bg-border"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-14 text-base font-bold rounded-xl border-border hover:bg-border transition-all"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => onGenerate({ topic, difficulty })}
            className="flex-[2] h-14 text-base font-bold rounded-xl bg-accent hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

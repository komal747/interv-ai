import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CodingSetupProps {
  onStart: (data: any) => void;
  onCancel: () => void;
}

export function CodingSetup({ onStart, onCancel }: CodingSetupProps) {
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [language, setLanguage] = useState("JavaScript");

  const languages = ["Java", "Python", "C", "C++", "JavaScript"];
  const levels = ["Easy", "Intermediate", "Advance"];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto px-4 py-32"
    >
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-3 text-text-main">Coding Practice</h2>
        <p className="text-text-muted">Master algorithms and logic in your favorite language.</p>
      </div>

      <div className="bento-card space-y-10">
        <div className="space-y-4">
          <Label className="metric-title">Difficulty Level</Label>
          <div className="grid grid-cols-3 gap-3">
            {levels.map((level) => (
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

        <div className="space-y-4">
          <Label className="metric-title">Choose Language</Label>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`h-12 px-6 rounded-xl font-semibold text-sm transition-all ${
                  language === lang 
                    ? "bg-gradient-accent text-white shadow-lg shadow-accent/20" 
                    : "bg-bg text-text-muted border border-border hover:bg-border"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Button 
            onClick={() => onStart({ difficulty, language })}
            className="w-full h-14 text-base font-bold rounded-xl bg-accent hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
          >
            Start Coding Practice
          </Button>
          <button 
            onClick={onCancel}
            className="w-full py-2 text-text-muted hover:text-text-main transition-colors font-semibold text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

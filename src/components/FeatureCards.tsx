import { motion } from "motion/react";
import { CheckCircle2, Code2, BrainCircuit, ChevronRight } from "lucide-react";

const features = [
  {
    icon: CheckCircle2,
    title: "MCQ Mastery",
    description: "Quick conceptual checks to sharpen your fundamentals.",
    color: "text-blue-400",
  },
  {
    icon: Code2,
    title: "Live Coding",
    description: "Solve real-world problems in our integrated code editor.",
    color: "text-purple-400",
  },
  {
    icon: BrainCircuit,
    title: "Resume Analyzer",
    description: "AI-powered PDF analysis to match your profile with any job.",
    color: "text-blue-500",
  },
];

interface FeatureCardsProps {
  onMCQClick?: () => void;
  onCodingClick?: () => void;
  onResumeClick?: () => void;
}

export function FeatureCards({ onMCQClick, onCodingClick, onResumeClick }: FeatureCardsProps) {
  return (
    <div className="bento-grid px-10 max-w-5xl mx-auto pb-32">
      {features.map((feature, index) => {
        const isInteractive = 
          (feature.title === "MCQ Mastery" && onMCQClick) || 
          (feature.title === "Live Coding" && onCodingClick) ||
          (feature.title === "Resume Analyzer" && onResumeClick);
        
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            onClick={() => {
              if (feature.title === "MCQ Mastery" && onMCQClick) {
                onMCQClick();
              } else if (feature.title === "Live Coding" && onCodingClick) {
                onCodingClick();
              } else if (feature.title === "Resume Analyzer" && onResumeClick) {
                onResumeClick();
              }
            }}
            className={`bento-card group transition-all ${isInteractive ? "cursor-pointer hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5" : "cursor-default"}`}
          >
          <feature.icon className={`w-8 h-8 mb-6 ${feature.color}`} />
          <h3 className="text-xl font-bold mb-2 text-text-main">{feature.title}</h3>
          <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
          <div className="mt-auto pt-6 flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Learn More <ChevronRight className="w-3 h-3" />
          </div>
        </motion.div>
        );
      })}
    </div>
  );
}

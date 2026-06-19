import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
  onViewDashboard: () => void;
}

export function Hero({ onGetStarted, onViewDashboard }: HeroProps) {
  return (
    <div className="relative pt-40 pb-24 flex flex-col items-center text-center px-4">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight mb-6 text-text-main"
      >
        Practice <span className="text-accent">Smarter</span>.
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-text-muted text-lg md:text-xl max-w-2xl mb-12"
      >
        The ultimate AI-driven platform for technical, MCQ, and coding interviews.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button 
          onClick={onGetStarted}
          className="h-14 px-10 text-base font-semibold rounded-xl bg-accent text-white hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
        >
          Mock Interview
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
        <Button 
          onClick={onViewDashboard}
          variant="outline"
          className="h-14 px-10 text-base font-semibold rounded-xl border-border bg-card hover:bg-border transition-all text-text-main"
        >
          View Dashboard
        </Button>
      </motion.div>
    </div>
  );
}

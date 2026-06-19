import { motion } from "motion/react";
import { BookOpen, Code, Brain, Database, Layout, Search, Cloud, Shield, Cpu, Globe, ArrowRight, Star, Zap } from "lucide-react";

const studyPacks = [
  { id: 1, title: "React Hooks Mastery", category: "Frontend", icon: Layout, questions: 45, color: "text-blue-500", featured: true },
  { id: 2, title: "System Design Fundamentals", category: "Backend", icon: Database, questions: 30, color: "text-purple-500", featured: true },
  { id: 3, title: "Data Structures & Algorithms", category: "Coding", icon: Code, questions: 120, color: "text-accent", featured: true },
  { id: 4, title: "Behavioral Interview Prep", category: "Soft Skills", icon: Brain, questions: 25, color: "text-success" },
  { id: 5, title: "SQL & Database Design", category: "Backend", icon: Database, questions: 40, color: "text-orange-500" },
  { id: 6, title: "Product Management Basics", category: "Management", icon: BookOpen, questions: 15, color: "text-red-500" },
  { id: 7, title: "Cloud Architecture (AWS/GCP)", category: "DevOps", icon: Cloud, questions: 55, color: "text-sky-500" },
  { id: 8, title: "Cybersecurity Essentials", category: "Security", icon: Shield, questions: 35, color: "text-emerald-500" },
  { id: 9, title: "Machine Learning 101", category: "AI/ML", icon: Cpu, questions: 50, color: "text-indigo-500" },
];

const learningPaths = [
  { title: "Full Stack Mastery", duration: "12 Weeks", level: "Intermediate", icon: Globe },
  { title: "FAANG Interview Sprint", duration: "4 Weeks", level: "Expert", icon: Star },
  { title: "Junior Dev Kickstart", duration: "8 Weeks", level: "Beginner", icon: Zap },
];

interface LibraryProps {
  onExplore?: (topic: string) => void;
}

export function Library({ onExplore }: LibraryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-6 py-32"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-text-main mb-2">Study Library</h1>
          <p className="text-text-muted">Curated resources to sharpen your skills.</p>
        </div>
        
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search study packs..."
            className="w-full h-12 pl-12 pr-4 bg-card/30 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-text-main transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {studyPacks.map((pack) => (
          <motion.div
            key={pack.id}
            whileHover={{ y: -5 }}
            onClick={() => onExplore?.(pack.title)}
            className="bento-card group cursor-pointer hover:border-accent/50 transition-all relative overflow-hidden"
          >
            {pack.featured && (
              <div className="absolute top-0 right-0 bg-accent text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                Featured
              </div>
            )}
            <div className="flex items-start justify-between mb-6">
              <div className={`p-3 rounded-xl bg-bg border border-border group-hover:border-accent/30 transition-colors`}>
                <pack.icon className={`w-6 h-6 ${pack.color}`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-border text-text-muted">
                {pack.category}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-accent transition-colors">
              {pack.title}
            </h3>
            <p className="text-sm text-text-muted mb-6">
              Master the core concepts of {pack.title.toLowerCase()} with our AI-generated question bank.
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                {pack.questions} Questions
              </span>
              <button className="text-xs font-bold text-accent uppercase tracking-widest hover:underline flex items-center gap-1">
                Explore Pack
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-text-main">Learning Paths</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <div 
              key={path.title} 
              onClick={() => onExplore?.(path.title)}
              className="bento-card border-accent/10 bg-accent/5 hover:bg-accent/10 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-accent/20">
                  <path.icon className="w-5 h-5 text-accent" />
                </div>
                <h4 className="font-bold text-text-main group-hover:text-accent transition-colors">{path.title}</h4>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted">
                <span>{path.duration}</span>
                <span className="text-accent">{path.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

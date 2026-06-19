import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { FileText, Briefcase, Upload, CheckCircle2 } from "lucide-react";
import { extractTextFromPDF } from "@/lib/pdf";

interface InterviewSetupProps {
  onGenerate: (data: any) => void;
}

export function InterviewSetup({ onGenerate }: InterviewSetupProps) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("Intermediate");
  const [jobDescription, setJobDescription] = useState("");
  const [userName, setUserName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (file.type === "application/pdf") {
        const text = await extractTextFromPDF(file);
        setResumeText(text);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target?.result as string);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Failed to read file:", error);
      alert("Failed to read file. Please try a different format or copy-paste the text.");
    } finally {
      setIsUploading(false);
    }
  };

  const quickRoles = ["Frontend Developer", "Backend Developer", "Data Analytics", "Business Analyst"];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto px-4 py-32"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 text-text-main">Session Setup</h2>
        <p className="text-text-muted">Tailor the AI to your specific career goals.</p>
      </div>

      <div className="bento-card space-y-8">
        <div className="space-y-4">
          <Label className="metric-title">Your Name</Label>
          <Input 
            placeholder="e.g. Komal"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="h-12 bg-bg border-border rounded-xl focus:ring-accent text-text-main"
          />
        </div>

        <div className="space-y-4">
          <Label className="metric-title">Target Role</Label>
          <Input 
            placeholder="e.g. Full Stack Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-12 bg-bg border-border rounded-xl focus:ring-accent text-text-main"
          />
          <div className="flex flex-wrap gap-2">
            {quickRoles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="metric-title">Experience Level</Label>
          <div className="grid grid-cols-3 gap-3">
            {["Fresher", "Intermediate", "Expert"].map((level) => (
              <button
                key={level}
                onClick={() => setExperience(level)}
                className={`h-12 rounded-xl font-semibold text-sm transition-all ${
                  experience === level 
                    ? "bg-accent text-white shadow-lg shadow-accent/20" 
                    : "bg-bg text-text-muted border border-border hover:bg-border"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="metric-title">Resume (Text/PDF)</Label>
          <div className="flex flex-col gap-2">
            <input 
              type="file" 
              accept=".txt,.md,.pdf" 
              onChange={handleResumeUpload}
              className="hidden"
              id="resume-upload"
            />
            <label 
              htmlFor="resume-upload"
              className="h-12 flex items-center justify-center border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/50 transition-colors text-text-muted text-sm"
            >
              {isUploading ? "Processing PDF..." : resumeText ? "Resume Processed ✓" : "Upload Resume (.pdf, .txt)"}
            </label>
            {resumeText && (
              <p className="text-[10px] text-success font-bold uppercase tracking-widest">Resume content captured</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="metric-title">Job Description</Label>
          <Textarea 
            placeholder="Paste requirements here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[150px] bg-bg border-border rounded-xl focus:ring-accent text-text-main"
          />
        </div>

        <Button 
          onClick={() => onGenerate({ role, experience, jobDescription, userName, resumeText })}
          disabled={!role || !jobDescription || !userName}
          className="w-full h-14 text-base font-bold rounded-xl bg-accent hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
        >
          Generate Interview
        </Button>
      </div>
    </motion.div>
  );
}

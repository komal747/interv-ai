import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Briefcase, ChevronLeft, Upload, CheckCircle2 } from "lucide-react";
import { extractTextFromPDF } from "@/lib/pdf";

interface ResumeAnalyzerSetupProps {
  onAnalyze: (data: any) => void;
  onCancel: () => void;
}

export function ResumeAnalyzerSetup({ onAnalyze, onCancel }: ResumeAnalyzerSetupProps) {
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a valid file type manually just in case
    const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isText = file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt") || file.name.toLowerCase().endsWith(".md");

    if (!isPDF && !isText) {
      alert("Please upload a PDF or text file (.pdf, .txt, .md)");
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    setResumeText(""); // Clear previous text

    try {
      if (isPDF) {
        console.log("Attempting PDF extraction for:", file.name);
        const text = await extractTextFromPDF(file);
        if (!text || text.trim().length === 0) {
          throw new Error("Could not extract any text from the PDF. It might be an image-only PDF.");
        }
        setResumeText(text);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          if (!text) {
            alert("The file appeared to be empty.");
            return;
          }
          setResumeText(text);
        };
        reader.onerror = () => {
          alert("Failed to read the text file.");
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Failed to read file:", error);
      alert(error instanceof Error ? error.message : "Failed to read file. Please try a different format or copy-paste the text.");
      setFileName("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto px-4 py-32"
    >
      <button 
        onClick={onCancel}
        className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-8 font-bold text-xs uppercase tracking-widest"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-text-main">Resume Analyzer</h2>
        <p className="text-text-muted max-w-xl mx-auto">
          AI-powered PDF analysis to match your profile with any job description.
        </p>
      </div>

      <div className="bento-card space-y-10 p-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-accent" />
            <Label className="metric-title !mb-0">Target Job Role</Label>
          </div>
          <Input 
            placeholder="e.g. Senior Frontend Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-14 bg-bg border-border rounded-xl focus:ring-accent text-text-main text-lg"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <Label className="metric-title !mb-0">Your Resume</Label>
            </div>
            <button 
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-xs text-accent hover:underline"
            >
              {showManualInput ? "Use File Upload" : "Paste Text Instead"}
            </button>
          </div>
          
          {!showManualInput ? (
            <div className="relative">
              <input 
                type="file" 
                accept=".pdf,.txt,.md" 
                onChange={handleResumeUpload}
                className="hidden"
                id="analyzer-resume-upload"
              />
              <label 
                htmlFor="analyzer-resume-upload"
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all p-10 bg-bg/50 ${
                  resumeText ? 'border-success/50 bg-success/5' : 'border-border hover:border-accent/50'
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-text-main font-semibold">Processing PDF...</p>
                    <p className="text-text-muted text-xs">Extracting your skills and achievements</p>
                  </div>
                ) : resumeText ? (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                    <p className="text-text-main font-bold text-lg">{fileName || "Resume Uploaded"}</p>
                    <p className="text-success text-sm font-medium">Ready for analysis</p>
                    <button className="text-accent text-xs mt-2 underline">Change File</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2">
                      <Upload className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <p className="text-text-main font-bold text-lg">Upload Resume</p>
                      <p className="text-text-muted text-sm mt-1">Drag and drop your PDF or click to browse</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-white/5 border border-border px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold text-text-muted">PDF</span>
                      <span className="bg-white/5 border border-border px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold text-text-muted">TXT</span>
                    </div>
                  </div>
                )}
              </label>
            </div>
          ) : (
            <Textarea 
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[250px] bg-bg border-border rounded-xl focus:ring-accent text-text-main text-base"
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-accent" />
            <Label className="metric-title !mb-0">Job Description</Label>
          </div>
          <Textarea 
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] bg-bg border-border rounded-xl focus:ring-accent text-text-main"
          />
        </div>

        <Button 
          onClick={() => onAnalyze({ role, jobDescription, resumeText })}
          disabled={!role || !jobDescription || !resumeText}
          className="w-full h-16 text-lg font-bold rounded-xl bg-accent hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
        >
          Analyze Resume
        </Button>
      </div>
    </motion.div>
  );
}

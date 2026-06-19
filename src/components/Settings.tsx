import { motion } from "motion/react";
import { User, Shield, Bell, Zap, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsProps {
  userName: string;
  setUserName: (name: string) => void;
  aiProvider: "gemini" | "groq";
  setAiProvider: (provider: "gemini" | "groq") => void;
  onClearHistory: () => void;
}

export function Settings({ userName, setUserName, aiProvider, setAiProvider, onClearHistory }: SettingsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-32"
    >
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-text-main mb-2">Settings</h1>
        <p className="text-text-muted">Manage your account and platform preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bento-card">
          <div className="flex items-center gap-3 mb-8">
            <User className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-text-main">Profile Settings</h2>
          </div>
          
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-text-muted">Display Name</Label>
              <Input 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                className="bg-bg border-border rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-text-muted">Email Address</Label>
              <Input 
                value="user@example.com"
                disabled
                className="bg-bg/50 border-border rounded-xl h-12 opacity-50 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* AI Preferences */}
        <div className="bento-card">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-text-main">AI Configuration</h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-sm text-text-muted max-w-xl">
              Select your preferred AI model provider. Gemini offers deep reasoning, while Groq provides ultra-fast response times.
            </p>
            
            <div className="flex bg-bg rounded-xl p-1 border border-border w-fit">
              <button 
                onClick={() => setAiProvider("gemini")}
                className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${aiProvider === 'gemini' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-main'}`}
              >
                Google Gemini
              </button>
              <button 
                onClick={() => setAiProvider("groq")}
                className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${aiProvider === 'groq' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-main'}`}
              >
                Groq Llama
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bento-card border-red-500/20">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-text-main">Danger Zone</h2>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-text-main mb-1">Clear Session History</h3>
              <p className="text-sm text-text-muted">This will permanently delete all your previous interview records.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={onClearHistory}
              className="border-red-500/50 text-red-500 hover:bg-red-500/10 h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-xs"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <Button className="bg-accent hover:bg-accent/90 h-14 px-12 rounded-xl font-bold text-base shadow-lg shadow-accent/20">
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

import { Brain, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onDashboardClick: () => void;
  onLogoClick: () => void;
  onLibraryClick: () => void;
  onReportsClick: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
  currentView: string;
  userName?: string;
}

export function Navbar({ 
  onDashboardClick, 
  onLogoClick, 
  onLibraryClick, 
  onReportsClick, 
  onSettingsClick,
  onLogout,
  currentView,
  userName = "Candidate"
}: NavbarProps) {
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-10 bg-bg/80 backdrop-blur-md border-b border-border">
      <div 
        className="flex items-center gap-2 cursor-pointer group" 
        onClick={onLogoClick}
      >
        <div className="p-1.5 bg-accent rounded-lg group-hover:scale-110 transition-transform">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-text-main">Interview<span className="text-accent">AI</span></span>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
          <button 
            onClick={onDashboardClick} 
            className={`hover:text-text-main transition-colors ${currentView === 'dashboard' ? 'text-accent' : ''}`}
          >
            Session
          </button>
          <button 
            onClick={onLibraryClick} 
            className={`hover:text-text-main transition-colors ${currentView === 'library' ? 'text-accent' : ''}`}
          >
            Library
          </button>
          <button 
            onClick={onReportsClick} 
            className={`hover:text-text-main transition-colors ${currentView === 'reports' ? 'text-accent' : ''}`}
          >
            Reports
          </button>
          <button 
            onClick={onSettingsClick} 
            className={`hover:text-text-main transition-colors ${currentView === 'settings' ? 'text-accent' : ''}`}
          >
            Settings
          </button>
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="hidden sm:flex flex-col items-end mr-1">
            <span className="text-[10px] font-bold text-text-main leading-tight">{userName}</span>
            <span className="text-[9px] text-accent font-bold uppercase tracking-tighter">Pro Member</span>
          </div>
          <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-[10px] font-bold text-accent">
            {initials || "CA"}
          </div>
          <button 
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-border/50 text-text-muted transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}

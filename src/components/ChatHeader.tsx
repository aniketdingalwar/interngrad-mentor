import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import CallbackForm from "./CallbackForm";
import internGradLogo from "@/assets/interngrad-logo.png";

const ChatHeader = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 glass-effect sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden">
          <img 
            src={internGradLogo} 
            alt="Interngrad Logo" 
            className="w-8 h-8 object-contain"
          />
        </div>
        
        <div>
          <h1 className="font-display font-bold text-foreground leading-tight">
            Interngrad AI
          </h1>
          <p className="text-xs text-muted-foreground">
            Your career mentor assistant
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <CallbackForm />
        
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <a href="https://interngrad-solutions.com" target="_blank" rel="noopener noreferrer">
            <span className="text-xs mr-1.5">Visit Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;

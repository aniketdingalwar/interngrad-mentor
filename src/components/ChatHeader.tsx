import { Bot, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatHeader = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 glass-effect sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl chat-gradient flex items-center justify-center shadow-sm">
          <Bot className="w-5 h-5 text-primary-foreground" />
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

      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-muted-foreground hover:text-foreground"
      >
        <a href="https://interngrad.in" target="_blank" rel="noopener noreferrer">
          <span className="text-xs mr-1.5">Visit Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </Button>
    </header>
  );
};

export default ChatHeader;

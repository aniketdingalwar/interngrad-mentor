import { Sparkles } from "lucide-react";

const WelcomeMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl chat-gradient flex items-center justify-center mb-4 shadow-lg">
        <Sparkles className="w-8 h-8 text-primary-foreground" />
      </div>
      
      <h2 className="font-display text-xl font-bold text-foreground mb-2">
        Welcome to Interngrad AI
      </h2>
      
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        I'm your personal career mentor. Ask me about courses, career paths, 
        industry skills, or anything related to becoming industry-ready.
      </p>

      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-xs font-medium">Ready to help</span>
      </div>
    </div>
  );
};

export default WelcomeMessage;

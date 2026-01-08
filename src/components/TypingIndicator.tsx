import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in-up">
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-accent text-accent-foreground">
        <Bot className="w-4 h-4" />
      </div>

      {/* Typing bubble */}
      <div className="bg-chat-assistant text-chat-assistant-foreground px-4 py-3 rounded-2xl rounded-bl-md message-shadow">
        <div className="flex gap-1.5 items-center h-5">
          <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import VoiceInputButton from "./VoiceInputButton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    transcript,
    status,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput((prev) => {
        // If there's existing text, append with space
        if (prev.trim()) {
          return `${prev} ${transcript}`;
        }
        return transcript;
      });
    }
  }, [transcript]);

  // Reset transcript when voice input stops
  useEffect(() => {
    if (status === "idle" && transcript) {
      resetTranscript();
    }
  }, [status, transcript, resetTranscript]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput("");
      resetTranscript();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [input]);

  const isListening = status === "listening";

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 p-4 border-t border-border bg-card"
    >
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? "Listening... speak now"
              : "Ask anything about Interngrad courses, admissions, or career guidance..."
          }
          disabled={disabled}
          className={cn(
            "min-h-[48px] max-h-[150px] resize-none pr-24 py-3 rounded-xl",
            "bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary",
            "placeholder:text-muted-foreground/60",
            isListening && "border-2 border-destructive/50 bg-destructive/5"
          )}
          rows={1}
        />
        
        <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
          <VoiceInputButton
            status={status}
            isSupported={isSupported}
            onStart={startListening}
            onStop={stopListening}
            disabled={disabled}
          />
          
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || disabled}
            className={cn(
              "h-9 w-9 rounded-lg",
              "bg-primary hover:bg-primary/90 transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;

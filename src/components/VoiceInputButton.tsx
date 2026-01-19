import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SpeechStatus } from "@/hooks/useSpeechRecognition";

interface VoiceInputButtonProps {
  status: SpeechStatus;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

const VoiceInputButton = ({
  status,
  isSupported,
  onStart,
  onStop,
  disabled,
}: VoiceInputButtonProps) => {
  if (!isSupported) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled
              className="h-9 w-9 rounded-lg text-muted-foreground"
            >
              <MicOff className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice input not supported in this browser</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const isListening = status === "listening";
  const isProcessing = status === "processing";

  const handleClick = () => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleClick}
            disabled={disabled || isProcessing}
            className={cn(
              "h-9 w-9 rounded-lg transition-all",
              isListening && "bg-destructive/10 text-destructive animate-pulse",
              !isListening && "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isListening ? (
              <div className="relative">
                <Mic className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-ping" />
              </div>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isListening
              ? "Click to stop listening"
              : isProcessing
              ? "Processing..."
              : "Click to speak"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VoiceInputButton;

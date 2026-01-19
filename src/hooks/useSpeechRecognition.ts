import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export type SpeechStatus = "idle" | "listening" | "processing";

interface UseSpeechRecognitionReturn {
  transcript: string;
  status: SpeechStatus;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-IN"; // Indian English
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  const clearSilenceTimeout = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      setStatus("processing");
      recognitionRef.current.stop();
      setTimeout(() => setStatus("idle"), 300);
    }
    clearSilenceTimeout();
  }, [clearSilenceTimeout]);

  const resetSilenceTimeout = useCallback(() => {
    clearSilenceTimeout();
    // Auto-stop after 5 seconds of silence
    silenceTimeoutRef.current = setTimeout(() => {
      stopListening();
      toast.info("Stopped listening due to silence");
    }, 5000);
  }, [clearSilenceTimeout, stopListening]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    setTranscript("");
    setStatus("listening");

    recognitionRef.current.onstart = () => {
      setStatus("listening");
      resetSilenceTimeout();
    };

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      resetSilenceTimeout();
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      setStatus("idle");
      clearSilenceTimeout();

      switch (event.error) {
        case "not-allowed":
          toast.error("Microphone access denied. Please allow microphone permissions.");
          break;
        case "no-speech":
          toast.info("No speech detected. Try again.");
          break;
        case "network":
          toast.error("Network error. Please check your connection.");
          break;
        default:
          toast.error(`Speech recognition error: ${event.error}`);
      }
    };

    recognitionRef.current.onend = () => {
      setStatus("idle");
      clearSilenceTimeout();
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      toast.error("Failed to start speech recognition");
      setStatus("idle");
    }
  }, [resetSilenceTimeout, clearSilenceTimeout]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    transcript,
    status,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import WelcomeMessage from "@/components/WelcomeMessage";
import QuickActions from "@/components/QuickActions";
import CallbackForm from "@/components/CallbackForm";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-fade-in-up z-50">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 rounded-xl chat-gradient flex items-center justify-center shadow-sm">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              
              <div>
                <h1 className="font-display font-bold text-foreground leading-tight">
                  Interngrad AI
                </h1>
                <p className="text-xs text-muted-foreground">
                  Smart Career Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <CallbackForm />
              
              {hasMessages && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Chat area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto chat-scroll"
          >
            {!hasMessages ? (
              <div className="flex flex-col justify-center min-h-full p-2">
                <WelcomeMessage />
                <QuickActions onAction={sendMessage} />
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-3">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    isStreaming={
                      isLoading &&
                      message.role === "assistant" &&
                      index === messages.length - 1
                    }
                  />
                ))}
                {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                  <TypingIndicator />
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:right-6 w-14 h-14 rounded-full chat-gradient shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-105"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        )}
      </button>
    </>
  );
};

export default ChatWidget;

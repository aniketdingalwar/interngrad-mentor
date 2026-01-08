import { useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import WelcomeMessage from "@/components/WelcomeMessage";
import QuickActions from "@/components/QuickActions";

const Index = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto chat-scroll"
      >
        {!hasMessages ? (
          <div className="flex flex-col justify-center min-h-full">
            <WelcomeMessage />
            <QuickActions onAction={sendMessage} />
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto">
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

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};

export default Index;

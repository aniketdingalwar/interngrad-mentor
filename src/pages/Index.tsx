import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Your main website content would go here */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">
          Welcome to Interngrad
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Bridge the gap between college and industry. Click the chat button to get started! 💬
        </p>
      </div>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Index;

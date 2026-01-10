import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Users, HelpCircle, DollarSign, Clock, Lightbulb, Rocket } from "lucide-react";

interface QuickActionsProps {
  onAction: (message: string) => void;
}

const quickActions = [
  {
    icon: BookOpen,
    label: "📚 Courses",
    message: "What courses does Interngrad offer?",
  },
  {
    icon: GraduationCap,
    label: "🎯 Career Help",
    message: "I'm confused about my career path. Can you guide me?",
  },
  {
    icon: DollarSign,
    label: "💰 Pricing",
    message: "How much do the courses cost?",
  },
  {
    icon: Clock,
    label: "⏱️ Duration",
    message: "How long are the courses?",
  },
  {
    icon: Lightbulb,
    label: "🤔 Why Interngrad?",
    message: "What makes Interngrad different from other platforms?",
  },
  {
    icon: Users,
    label: "👥 About Us",
    message: "Tell me about Interngrad",
  },
  {
    icon: Rocket,
    label: "🚀 Beginners",
    message: "I'm a complete beginner. Can I join?",
  },
  {
    icon: HelpCircle,
    label: "🆘 Support",
    message: "I need help with login issues",
  },
];

const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-4">
      {quickActions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          onClick={() => onAction(action.message)}
          className="h-auto py-3 px-3 flex flex-col items-center gap-1.5 text-center hover:bg-secondary hover:border-primary/30 transition-all group"
        >
          <action.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-foreground">{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;

import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Users, HelpCircle } from "lucide-react";

interface QuickActionsProps {
  onAction: (message: string) => void;
}

const quickActions = [
  {
    icon: BookOpen,
    label: "Explore Courses",
    message: "What courses does Interngrad offer? I want to explore my options.",
  },
  {
    icon: GraduationCap,
    label: "Career Guidance",
    message: "I'm confused about my career path. Can you help me understand what skills I need?",
  },
  {
    icon: Users,
    label: "About Interngrad",
    message: "What makes Interngrad different from other online learning platforms?",
  },
  {
    icon: HelpCircle,
    label: "Get Support",
    message: "I need help with login or technical issues.",
  },
];

const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-6">
      {quickActions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          onClick={() => onAction(action.message)}
          className="h-auto py-4 px-4 flex flex-col items-center gap-2 text-center hover:bg-secondary hover:border-primary/30 transition-all group"
        >
          <action.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-foreground">{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;

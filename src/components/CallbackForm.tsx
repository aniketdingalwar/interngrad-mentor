import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const CallbackForm = () => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    domain: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.domain) {
      toast.error("Please fill all fields");
      return;
    }

    // Simulate submission
    setSubmitted(true);
    toast.success("🎉 Request submitted! We'll call you soon.");
    
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", domain: "" });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary"
        >
          <Phone className="w-4 h-4" />
          Request Callback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Request a Callback
          </DialogTitle>
        </DialogHeader>
        
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <p className="text-lg font-medium text-foreground">Thank you! 🙏</p>
            <p className="text-sm text-muted-foreground text-center">
              Our team will reach out to you within 24-48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name ✨</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address 📧</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number 📱</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="domain">Interested Domain 🎯</Label>
              <Select
                value={formData.domain}
                onValueChange={(value) => setFormData({ ...formData, domain: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mechanical">🔧 Mechanical Engineering</SelectItem>
                  <SelectItem value="automobile">🚗 Automobile Engineering</SelectItem>
                  <SelectItem value="corporate">💼 Corporate Readiness</SelectItem>
                  <SelectItem value="unsure">🤔 Not sure yet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full gap-2">
              <Send className="w-4 h-4" />
              Submit Request
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CallbackForm;

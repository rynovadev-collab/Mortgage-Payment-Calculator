import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, CheckCircle, Bug, Lightbulb, Wrench, FileQuestion } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { z } from "zod";

const feedbackSchema = z.object({
  feedbackType: z.enum(['bug', 'feature', 'improvement', 'other']),
  feedbackText: z.string()
    .min(10, "Feedback must be at least 10 characters")
    .max(1000, "Feedback must be less than 1000 characters")
});

const FeedbackWidget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { track } = useAnalytics();
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="h-5 w-5" />;
      case 'feature': return <Lightbulb className="h-5 w-5" />;
      case 'improvement': return <Wrench className="h-5 w-5" />;
      case 'other': return <FileQuestion className="h-5 w-5" />;
      default: return <MessageCircle className="h-5 w-5" />;
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setFeedbackLoading(true);
    try {
      const validatedData = feedbackSchema.parse({ 
        feedbackType: feedbackType as any, 
        feedbackText 
      });

      const feedbackData = {
        user_id: user.id,
        feedback_type: validatedData.feedbackType,
        feedback_text: validatedData.feedbackText,
      };

      const { error } = await supabase
        .from('feedback')
        .insert(feedbackData);

      if (error) throw error;

      track('feedback_submitted', { type: validatedData.feedbackType });

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for helping us improve AmortIQ!",
      });

      setIsSubmitted(true);
      setShowForm(false);
      setFeedbackText("");
      setFeedbackType("");
    } catch (error) {
      console.error('Feedback submission error:', error);
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.issues[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to submit feedback. Please try again.",
        });
      }
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (!user) return null;

  if (isSubmitted && !showForm) {
    return (
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-green-900 mb-2">Feedback Submitted!</h3>
            <p className="text-green-700 mb-4">We appreciate your input and will review it soon.</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            className="border-green-300 hover:bg-green-100"
          >
            Submit More Feedback?
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <MessageCircle className="h-6 w-6 text-primary" />
          Share Your Feedback
        </CardTitle>
        <CardDescription className="text-base">
          Help us improve by sharing bugs, feature requests, or suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFeedbackSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">What type of feedback is this?</Label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">
                  <div className="flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    <span>Bug Report</span>
                  </div>
                </SelectItem>
                <SelectItem value="feature">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>Feature Request</span>
                  </div>
                </SelectItem>
                <SelectItem value="improvement">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span>Improvement Suggestion</span>
                  </div>
                </SelectItem>
                <SelectItem value="other">
                  <div className="flex items-center gap-2">
                    <FileQuestion className="h-4 w-4" />
                    <span>Other</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedbackText" className="text-base font-semibold">
              Your Feedback
            </Label>
            <Textarea
              id="feedbackText"
              placeholder="Tell us what's on your mind. Be as detailed as possible to help us understand your feedback better."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              disabled={feedbackLoading}
              rows={6}
              maxLength={1000}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground text-right">
              {feedbackText.length}/1000 characters
            </p>
          </div>

          <Button
            type="submit"
            disabled={feedbackLoading || !feedbackType || !feedbackText.trim()}
            className="w-full text-lg py-6"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {feedbackLoading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackWidget;

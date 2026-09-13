import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageSquare, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewText: z.string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must be less than 500 characters")
});

const ReviewWidget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { track } = useAnalytics();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const fetchExistingReview = async () => {
      if (!user) return;

      const { data: review, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching review:', error);
      } else if (review) {
        setExistingReview(review);
        setRating(review.rating);
        setReviewText(review.review_text);
        setShowForm(false);
        setIsSubmitted(true);
      }
    };

    fetchExistingReview();
  }, [user]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setReviewLoading(true);
    try {
      const validatedData = reviewSchema.parse({ rating, reviewText });

      const reviewData = {
        user_id: user.id,
        rating: validatedData.rating,
        review_text: validatedData.reviewText,
      };

      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('user_id', user.id);

        if (error) throw error;

        track('review_updated', { rating: validatedData.rating });

        toast({
          title: "Review Updated!",
          description: "Thank you for updating your review!",
        });
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert(reviewData);

        if (error) throw error;

        track('review_submitted', { rating: validatedData.rating });

        toast({
          title: "Review Submitted!",
          description: "Thank you for your feedback!",
        });
      }

      // Refresh review data
      const { data: updatedReview } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (updatedReview) {
        setExistingReview(updatedReview);
      }

      setIsSubmitted(true);
      setShowForm(false);
    } catch (error) {
      console.error('Review submission error:', error);
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
          description: "Failed to submit review. Please try again.",
        });
      }
    } finally {
      setReviewLoading(false);
    }
  };

  if (!user) return null;

  if (isSubmitted && !showForm) {
    return (
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-green-900 mb-2">Review Submitted!</h3>
            <p className="text-green-700 mb-4">Thank you for sharing your experience.</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            className="border-green-300 hover:bg-green-100"
          >
            Submit Another Review?
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <MessageSquare className="h-6 w-6 text-primary" />
          Share Your Experience
        </CardTitle>
        <CardDescription className="text-base">
          Help others by sharing your experience with AmortIQ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReviewSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Rate Your Experience</Label>
            <div className="flex gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 cursor-pointer transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 5 && "Excellent! ⭐"}
                {rating === 4 && "Great! 👍"}
                {rating === 3 && "Good 👌"}
                {rating === 2 && "Fair 😐"}
                {rating === 1 && "Poor 😞"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewText" className="text-base font-semibold">
              Your Review
            </Label>
            <Textarea
              id="reviewText"
              placeholder="Tell us about your experience with AmortIQ. What features do you love? How has it helped you manage your mortgage?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={reviewLoading}
              rows={5}
              maxLength={500}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground text-right">
              {reviewText.length}/500 characters
            </p>
          </div>

          <Button
            type="submit"
            disabled={reviewLoading || rating === 0 || !reviewText.trim()}
            className="w-full text-lg py-6"
            size="lg"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            {reviewLoading 
              ? "Submitting..." 
              : existingReview 
              ? "Update Review" 
              : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewWidget;

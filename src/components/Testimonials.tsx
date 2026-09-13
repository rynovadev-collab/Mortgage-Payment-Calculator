import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  profiles?: {
    username?: string;
    address?: string;
  };
}

const Testimonials = () => {
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      const { data: reviewsData, error } = await supabase
        .from('reviews')
        .select('*')
        .order('rating', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      if (reviewsData && reviewsData.length > 0) {
        // Fetch profiles for each review
        const reviewsWithProfiles = await Promise.all(
          reviewsData.map(async (review) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, address')
              .eq('user_id', review.user_id)
              .maybeSingle();

            return {
              ...review,
              profiles: profile || undefined,
            };
          })
        );

        setAllReviews(reviewsWithProfiles);
        setDisplayedReviews(reviewsWithProfiles.slice(0, 3));
      }
    };

    fetchReviews();
  }, []);

  // Rotate reviews every 30 seconds
  useEffect(() => {
    if (allReviews.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 3;
        if (nextIndex >= allReviews.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [allReviews]);

  // Update displayed reviews when index changes
  useEffect(() => {
    if (allReviews.length > 0) {
      const newReviews = [];
      for (let i = 0; i < 3; i++) {
        const index = (currentIndex + i) % allReviews.length;
        newReviews.push(allReviews[index]);
      }
      setDisplayedReviews(newReviews);
    }
  }, [currentIndex, allReviews]);

  const extractLocation = (address?: string) => {
    if (!address) return "UK";
    const parts = address.split(',');
    return parts[parts.length - 1]?.trim() || "UK";
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-black">
          Trusted by UK Homeowners
        </h2>
        <p className="text-center text-black mb-12 max-w-2xl mx-auto">
          Join thousands of people who are taking control of their mortgage and saving money
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayedReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-all duration-500 animate-fade-in">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-black mb-4 italic">
                  "{review.review_text}"
                </p>
                <div>
                  <div className="font-semibold text-black">
                    {review.profiles?.username || "AmortIQ User"}
                  </div>
                  <div className="text-sm text-black">
                    {extractLocation(review.profiles?.address)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {allReviews.length > 3 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(allReviews.length / 3) }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  Math.floor(currentIndex / 3) === index
                    ? "bg-primary w-8"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;

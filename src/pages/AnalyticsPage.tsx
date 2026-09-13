import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Trash2, BarChart3, Star, Users, Award, TrendingUp, MessageCircle, Bug, Lightbulb, Wrench, FileQuestion, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username?: string;
    email?: string;
    address?: string;
  };
}

interface Feedback {
  id: string;
  feedback_type: string;
  feedback_text: string;
  created_at: string;
  user_id: string;
  status: string;
  profiles?: {
    username?: string;
    email?: string;
    address?: string;
  };
}

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { getEvents, exportEvents, clearEvents } = useAnalytics();
  const events = getEvents();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data: reviewsData, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching reviews:', error);
          return;
        }

        if (reviewsData && reviewsData.length > 0) {
          const reviewsWithProfiles = await Promise.all(
            reviewsData.map(async (review) => {
              const { data: profile } = await supabase
                .from('profiles')
                .select('username, email, address')
                .eq('user_id', review.user_id)
                .maybeSingle();

              return {
                ...review,
                profiles: profile || undefined,
              };
            })
          );

          setReviews(reviewsWithProfiles);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();

    const fetchFeedback = async () => {
      try {
        const { data: feedbackData, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching feedback:', error);
          return;
        }

        if (feedbackData && feedbackData.length > 0) {
          const feedbackWithProfiles = await Promise.all(
            feedbackData.map(async (item) => {
              const { data: profile } = await supabase
                .from('profiles')
                .select('username, email, address')
                .eq('user_id', item.user_id)
                .maybeSingle();

              return {
                ...item,
                profiles: profile || undefined,
              };
            })
          );

          setFeedback(feedbackWithProfiles);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleExport = () => {
    const dataStr = exportEvents();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getEventCounts = () => {
    const counts: Record<string, number> = {};
    events.forEach(event => {
      counts[event.event] = (counts[event.event] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const getUniqueUsers = () => {
    const users = new Set(events.filter(e => e.userId).map(e => e.userId));
    return users.size;
  };

  const getTodayEvents = () => {
    const today = new Date().toDateString();
    return events.filter(e => new Date(e.timestamp || '').toDateString() === today).length;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  const getFeedbackTypeDistribution = () => {
    const distribution = { bug: 0, feature: 0, improvement: 0, other: 0 };
    feedback.forEach(item => {
      distribution[item.feedback_type as keyof typeof distribution]++;
    });
    return distribution;
  };

  const feedbackDistribution = getFeedbackTypeDistribution();

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="h-4 w-4 text-red-500" />;
      case 'feature': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'improvement': return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'other': return <FileQuestion className="h-4 w-4 text-gray-500" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge variant="default">New</Badge>;
      case 'reviewing': return <Badge variant="secondary">Reviewing</Badge>;
      case 'resolved': return <Badge className="bg-green-500">Resolved</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track user interactions, app usage, and customer reviews</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={clearEvents} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Data
          </Button>
        </div>
      </div>

      {/* LTV Rate Management Card */}
      <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/super-user9246')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Mortgage Rate Management
          </CardTitle>
          <CardDescription>
            Click to access the LTV mortgage rate management panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Update and manage mortgage rates displayed on the News page
            </p>
            <Button variant="outline" size="sm">
              Open Panel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">
            <BarChart3 className="h-4 w-4 mr-2" />
            Event Analytics
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Star className="h-4 w-4 mr-2" />
            Customer Reviews
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageCircle className="h-4 w-4 mr-2" />
            User Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6 mt-6">

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUniqueUsers()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTodayEvents()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getEventCounts().length}</div>
          </CardContent>
          </Card>
          </div>

          {/* Event Breakdown */}
          <Card>
        <CardHeader>
          <CardTitle>Event Breakdown</CardTitle>
          <CardDescription>Most frequent events tracked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getEventCounts().slice(0, 10).map(([event, count]) => (
              <div key={event} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="font-medium">{event}</span>
                <span className="text-sm text-muted-foreground">{count} times</span>
              </div>
            ))}
          </div>
          </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>Latest 20 tracked events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.slice(-20).reverse().map((event, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{event.event}</span>
                  <span className="text-xs text-muted-foreground">
                    {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'No timestamp'}
                  </span>
                </div>
                {event.properties && Object.keys(event.properties).length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <pre className="text-xs bg-muted/50 p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(event.properties, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6 mt-6">
          {reviewsLoading ? (
            <div className="text-center py-12">Loading reviews...</div>
          ) : (
            <>
              {/* Review Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Total Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{reviews.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Average Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold flex items-center gap-2">
                      {getAverageRating()}
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      5-Star Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{distribution[5]}</div>
                    <p className="text-xs text-muted-foreground">
                      {reviews.length > 0 ? Math.round((distribution[5] / reviews.length) * 100) : 0}% of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">4+ Stars</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{distribution[5] + distribution[4]}</div>
                    <p className="text-xs text-muted-foreground">
                      {reviews.length > 0 ? Math.round(((distribution[5] + distribution[4]) / reviews.length) * 100) : 0}% of total
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Rating Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>Breakdown of ratings received</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 w-20">
                          <span className="font-medium">{rating}</span>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: reviews.length > 0 
                                ? `${(distribution[rating as keyof typeof distribution] / reviews.length) * 100}%` 
                                : '0%'
                            }}
                          />
                        </div>
                        <span className="w-16 text-right text-sm text-muted-foreground">
                          {distribution[rating as keyof typeof distribution]} ({reviews.length > 0 
                            ? Math.round((distribution[rating as keyof typeof distribution] / reviews.length) * 100) 
                            : 0}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* All Reviews Database */}
              <Card>
                <CardHeader>
                  <CardTitle>All Customer Reviews</CardTitle>
                  <CardDescription>Complete database of reviews with user details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No reviews yet</p>
                    ) : (
                      reviews.map((review) => (
                        <div key={review.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                  {review.profiles?.username || "AmortIQ User"}
                                </span>
                                {review.profiles?.email && (
                                  <span className="text-sm text-muted-foreground">
                                    ({review.profiles.email})
                                  </span>
                                )}
                              </div>
                              {review.profiles?.address && (
                                <p className="text-sm text-muted-foreground">
                                  📍 {review.profiles.address}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                User ID: {review.user_id}
                              </p>
                            </div>
                            <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                              {new Date(review.created_at).toLocaleDateString()} {new Date(review.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <div className="flex gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="ml-2 font-semibold">{review.rating}/5</span>
                          </div>
                          
                          <p className="text-gray-700 italic bg-muted/50 p-3 rounded">"{review.review_text}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6 mt-6">
          {feedbackLoading ? (
            <div className="text-center py-12">Loading feedback...</div>
          ) : (
            <>
              {/* Feedback Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Total Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{feedback.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      Bug Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{feedbackDistribution.bug}</div>
                    <p className="text-xs text-muted-foreground">
                      {feedback.length > 0 ? Math.round((feedbackDistribution.bug / feedback.length) * 100) : 0}% of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Feature Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{feedbackDistribution.feature}</div>
                    <p className="text-xs text-muted-foreground">
                      {feedback.length > 0 ? Math.round((feedbackDistribution.feature / feedback.length) * 100) : 0}% of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Improvements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{feedbackDistribution.improvement}</div>
                    <p className="text-xs text-muted-foreground">
                      {feedback.length > 0 ? Math.round((feedbackDistribution.improvement / feedback.length) * 100) : 0}% of total
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Feedback Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Type Distribution</CardTitle>
                  <CardDescription>Breakdown of feedback categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(feedbackDistribution).map(([type, count]) => (
                      <div key={type} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-32 capitalize">
                          {getFeedbackIcon(type)}
                          <span className="font-medium">{type}</span>
                        </div>
                        <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: feedback.length > 0 
                                ? `${(count / feedback.length) * 100}%` 
                                : '0%'
                            }}
                          />
                        </div>
                        <span className="w-16 text-right text-sm text-muted-foreground">
                          {count} ({feedback.length > 0 
                            ? Math.round((count / feedback.length) * 100) 
                            : 0}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* All Feedback Database */}
              <Card>
                <CardHeader>
                  <CardTitle>All User Feedback</CardTitle>
                  <CardDescription>Complete database of feedback with user details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedback.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No feedback yet</p>
                    ) : (
                      feedback.map((item) => (
                        <div key={item.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="font-semibold">
                                  {item.profiles?.username || "AmortIQ User"}
                                </span>
                                {item.profiles?.email && (
                                  <span className="text-sm text-muted-foreground">
                                    ({item.profiles.email})
                                  </span>
                                )}
                                <div className="flex items-center gap-2">
                                  {getFeedbackIcon(item.feedback_type)}
                                  <span className="text-sm font-medium capitalize">{item.feedback_type}</span>
                                </div>
                                {getStatusBadge(item.status)}
                              </div>
                              {item.profiles?.address && (
                                <p className="text-sm text-muted-foreground">
                                  📍 {item.profiles.address}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                User ID: {item.user_id}
                              </p>
                            </div>
                            <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                              {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 bg-muted/50 p-3 rounded">{item.feedback_text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
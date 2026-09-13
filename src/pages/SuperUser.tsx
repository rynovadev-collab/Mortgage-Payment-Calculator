import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Save, RefreshCw, Download, Trash2, BarChart3, Star, Users, Award, MessageCircle, Bug, Lightbulb, Wrench, FileQuestion, Settings, BookOpen, Newspaper, Shield, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAnalytics } from "@/hooks/useAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { GuidesManagement } from "@/components/admin/GuidesManagement";
import { NewsManagement } from "@/components/admin/NewsManagement";
import { ForumModeration } from "@/components/admin/ForumModeration";
import { FeaturesManagement } from "@/components/admin/FeaturesManagement";
import { RefundManagement } from "@/components/admin/RefundManagement";

const rateSchema = z.object({
  two_year_rate: z.number().min(0).max(99.99),
  five_year_rate: z.number().min(0).max(99.99),
  description: z.string().min(1).max(200),
});

interface MortgageRate {
  id: string;
  ltv_ratio: string;
  two_year_rate: number;
  five_year_rate: number;
  description: string;
  display_order: number;
  updated_at?: string;
}

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

const SuperUser = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getEvents, exportEvents, clearEvents } = useAnalytics();
  const events = getEvents();
  
  const [rates, setRates] = useState<MortgageRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    fetchRates();
    fetchReviews();
    fetchFeedback();
  }, []);

  const fetchRates = async () => {
    try {
      const { data, error } = await supabase
        .from('mortgage_rates')
        .select('*')
        .order('display_order');

      if (error) throw error;

      setRates(data || []);
    } catch (error) {
      console.error('Error fetching rates:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load mortgage rates.",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleRateChange = (id: string, field: keyof MortgageRate, value: string | number) => {
    setRates(rates.map(rate => 
      rate.id === id ? { ...rate, [field]: value } : rate
    ));
  };

  const handleSave = async (rateId: string) => {
    setSaving(true);
    try {
      const rate = rates.find(r => r.id === rateId);
      if (!rate) throw new Error('Rate not found');

      rateSchema.parse({
        two_year_rate: rate.two_year_rate,
        five_year_rate: rate.five_year_rate,
        description: rate.description,
      });

      const { error } = await supabase
        .from('mortgage_rates')
        .update({
          two_year_rate: rate.two_year_rate,
          five_year_rate: rate.five_year_rate,
          description: rate.description,
        })
        .eq('id', rateId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Mortgage rate updated successfully.",
      });
    } catch (error) {
      console.error('Error saving rate:', error);
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
          description: "Failed to save mortgage rate.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

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

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SharedNavigation />
        <main className="container mx-auto px-4 py-16">
          <div className="space-y-4">
            <Skeleton className="h-12 w-96" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SharedNavigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Super User Panel</h1>
            <p className="text-muted-foreground">
              Complete admin control over content, rates, analytics, and moderation
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={clearEvents} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Events
            </Button>
          </div>
        </div>

        <Tabs defaultValue="rates" className="w-full">
          <TabsList className="grid w-full grid-cols-9 gap-1">
            <TabsTrigger value="rates" className="text-xs">
              <Settings className="h-4 w-4 mr-1" />
              Rates
            </TabsTrigger>
            <TabsTrigger value="refunds" className="text-xs">
              <DollarSign className="h-4 w-4 mr-1" />
              Refunds
            </TabsTrigger>
            <TabsTrigger value="guides" className="text-xs">
              <BookOpen className="h-4 w-4 mr-1" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="news" className="text-xs">
              <Newspaper className="h-4 w-4 mr-1" />
              News
            </TabsTrigger>
            <TabsTrigger value="features" className="text-xs">
              <Star className="h-4 w-4 mr-1" />
              Features
            </TabsTrigger>
            <TabsTrigger value="forum" className="text-xs">
              <Shield className="h-4 w-4 mr-1" />
              Forum
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs">
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs">
              <Star className="h-4 w-4 mr-1" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs">
              <MessageCircle className="h-4 w-4 mr-1" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rates" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Mortgage Rates Management
                </CardTitle>
                <CardDescription>
                  Update the average mortgage rates by LTV ratio. Changes will be reflected immediately on the News page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {rates.map((rate) => (
                    <Card key={rate.id} className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg">{rate.ltv_ratio} LTV</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`two-year-${rate.id}`}>2-Year Fixed Rate (%)</Label>
                            <Input
                              id={`two-year-${rate.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              max="99.99"
                              value={rate.two_year_rate}
                              onChange={(e) => handleRateChange(rate.id, 'two_year_rate', parseFloat(e.target.value) || 0)}
                              placeholder="e.g., 3.77"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`five-year-${rate.id}`}>5-Year Fixed Rate (%)</Label>
                            <Input
                              id={`five-year-${rate.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              max="99.99"
                              value={rate.five_year_rate}
                              onChange={(e) => handleRateChange(rate.id, 'five_year_rate', parseFloat(e.target.value) || 0)}
                              placeholder="e.g., 3.94"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`description-${rate.id}`}>Description</Label>
                            <Textarea
                              id={`description-${rate.id}`}
                              value={rate.description}
                              onChange={(e) => handleRateChange(rate.id, 'description', e.target.value)}
                              placeholder="Brief description"
                              rows={1}
                              maxLength={200}
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => handleSave(rate.id)}
                            disabled={saving}
                            className="flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Last updated: {rates[0]?.updated_at ? new Date(rates[0].updated_at).toLocaleString() : 'Never'}
                    </p>
                    <Button
                      variant="outline"
                      onClick={fetchRates}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refunds" className="space-y-6 mt-6">
            <RefundManagement />
          </TabsContent>

          <TabsContent value="guides" className="space-y-6 mt-6">
            <GuidesManagement />
          </TabsContent>

          <TabsContent value="news" className="space-y-6 mt-6">
            <NewsManagement />
          </TabsContent>

          <TabsContent value="features" className="space-y-6 mt-6">
            <FeaturesManagement />
          </TabsContent>

          <TabsContent value="forum" className="space-y-6 mt-6">
            <ForumModeration />
          </TabsContent>

          <TabsContent value="events" className="space-y-6 mt-6">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default SuperUser;

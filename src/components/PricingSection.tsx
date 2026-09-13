import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Crown, Calculator, TrendingUp, Users, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PricingSection = () => {
  const navigate = useNavigate();
  const { session, subscriptionData } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  const plans = [
    {
      name: "Free",
      price: "£0",
      period: "forever",
      description: "Perfect for getting started with basic mortgage calculations",
      features: [
        "Basic mortgage calculator",
        "6-month payment preview",
        "Interest savings calculator",
        "Basic charts and graphs",
        "Email support"
      ],
      limitations: [
        "Limited to 6 months payment schedule",
        "Basic analytics only",
        "Mortgage details locked for 3 days after creation"
      ],
      button: "Get Started Free",
      variant: "outline" as const,
      popular: false,
      planType: "free" as const
    },
    {
      name: "Premium Monthly",
      price: "£6.99",
      period: "per month",
      description: "Complete mortgage analysis with advanced features and unlimited access",
      features: [
        "Everything in Free",
        "Complete payment schedule (full term)",
        "Advanced overpayment scenarios",
        "Detailed savings projections",
        "Interactive charts and graphs",
        "Export to PDF/Excel",
        "Priority email support",
        "What-if scenario modeling",
        "Refinancing analysis",
        "Property value tracking"
      ],
      limitations: [],
      button: "Start Monthly Plan",
      variant: "premium" as const,
      popular: false,
      planType: "monthly" as const
    },
    {
      name: "Premium Annual",
      price: "£59.99",
      period: "per year",
      description: "Best value - Save £24 with annual billing",
      features: [
        "Everything in Premium Monthly",
        "Complete payment schedule (full term)",
        "Advanced overpayment scenarios",
        "Detailed savings projections",
        "Interactive charts and graphs",
        "Export to PDF/Excel",
        "Priority email support",
        "What-if scenario modeling",
        "Refinancing analysis",
        "Property value tracking"
      ],
      limitations: [],
      button: "Start Annual Plan",
      variant: "premium" as const,
      popular: true,
      savings: "Save £24/year",
      planType: "annual" as const
    }
  ];

  const handlePlanClick = async (planType: 'free' | 'monthly' | 'annual') => {
    // Check if user is logged in
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    // Handle free plan
    if (planType === 'free') {
      navigate('/dashboard');
      return;
    }

    // Handle premium plans
    if (subscriptionData?.subscribed) {
      toast.info('You already have an active subscription');
      navigate('/dashboard');
      return;
    }

    try {
      setCheckoutLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              Please log in or create an account to continue
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full"
            >
              Log In / Sign Up
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAuthDialog(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold mb-4 text-black">Choose Your Plan</h2>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Start free and upgrade when you need advanced mortgage analysis tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative shadow-card hover:shadow-glow transition-smooth ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-secondary text-white px-4 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Best Value
                </Badge>
              )}
              {plan.savings && (
                <Badge className="absolute -top-3 right-4 bg-secondary text-white px-3 py-1">
                  {plan.savings}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="mb-4">
                  {plan.name === "Free" ? (
                    <Calculator className="h-12 w-12 text-primary mx-auto" />
                  ) : (
                    <Crown className="h-12 w-12 text-secondary mx-auto" />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-black">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2 text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium text-black mb-2">Limitations:</p>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-start gap-3">
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5">
                            <div className="h-1 w-3 bg-black rounded"></div>
                          </div>
                          <span className="text-sm text-black">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-6">
                  <Button 
                    variant={plan.variant} 
                    size="lg" 
                    className="w-full"
                    onClick={() => handlePlanClick(plan.planType)}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? 'Processing...' : plan.button}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-8 text-sm text-black">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Advanced Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Trusted by 10,000+ Users</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default PricingSection;

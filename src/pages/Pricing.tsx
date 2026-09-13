import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

const Pricing = () => {
  const breadcrumbs = [
    { name: "Home", url: "https://amortiq.co.uk/" },
    { name: "Pricing", url: "https://amortiq.co.uk/pricing" }
  ];

  return (
    <>
      <SEOHead 
        title="AmortIQ Pricing - Free & Premium Plans | UK Mortgage Calculator"
        description="Choose the right plan for you. Free mortgage calculator or Premium with unlimited tracking, advanced analytics, and more. Cancel anytime. 14-day money-back guarantee."
        keywords="mortgage calculator pricing, free mortgage calculator, premium mortgage tracker, uk mortgage subscription"
      />
      <StructuredData 
        breadcrumbs={breadcrumbs}
        pageType="WebPage"
        headline="AmortIQ Pricing Plans"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SharedNavigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Simple, Transparent
            <span className="text-primary block">Pricing</span>
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Choose the plan that works best for you. No hidden fees, cancel anytime.
          </p>
        </div>

        <PricingSection />

        <Card className="max-w-3xl mx-auto mt-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-black">
                Yes, you can cancel your subscription at any time through your account settings. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-black">
                We accept all major credit and debit cards through our secure payment provider, Stripe.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-black">
                Yes! You can use our basic features for free. Upgrade to Premium to unlock advanced features and unlimited mortgage tracking.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-black">
                We offer a 14-day money-back guarantee. If you're not satisfied with Premium, contact us within 14 days of your purchase for a full refund.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
    </>
  );
};

export default Pricing;

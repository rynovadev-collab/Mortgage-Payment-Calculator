import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Features = () => {
  const [features, setFeatures] = useState<Array<{
    id: string;
    title: string;
    description: string;
    icon_name: string;
    is_coming_soon: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbs = [
    { name: "Home", url: "https://amortiq.co.uk/" },
    { name: "Features", url: "https://amortiq.co.uk/features" }
  ];

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Star;
  };

  const currentFeatures = features.filter(f => !f.is_coming_soon);
  const comingSoonFeatures = features.filter(f => f.is_coming_soon);

  return (
    <>
      <SEOHead 
        title="AmortIQ Features - Mortgage Calculator, Tracker & Analytics"
        description="Explore AmortIQ's features: advanced mortgage calculator, overpayment tracking, payment schedules, visual analytics, and secure data storage for UK homeowners."
        keywords="mortgage calculator features, overpayment tracker, amortization table, payment schedule, mortgage analytics"
      />
      <StructuredData 
        breadcrumbs={breadcrumbs}
        pageType="CollectionPage"
        headline="Powerful Features to Manage Your Mortgage"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SharedNavigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features to
            <span className="text-primary block">Manage Your Mortgage</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to understand, track, and optimize your mortgage in one place.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {currentFeatures.map((feature) => {
                const Icon = getIcon(feature.icon_name);
                return (
                  <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Icon className="h-12 w-12 text-primary mb-4" />
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {comingSoonFeatures.length > 0 && (
              <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    {comingSoonFeatures.map((feature) => (
                      <li key={feature.id}>• {feature.title}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
    </>
  );
};

export default Features;

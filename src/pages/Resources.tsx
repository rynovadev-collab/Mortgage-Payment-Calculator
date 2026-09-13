import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calculator, TrendingUp, AlertCircle, Home } from "lucide-react";
import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Resources = () => {
  const [guides, setGuides] = useState<Array<{
    id: string;
    title: string;
    description: string;
    topics: string[];
  }>>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbs = [
    { name: "Home", url: "https://amortiq.co.uk/" },
    { name: "Resources", url: "https://amortiq.co.uk/resources" }
  ];

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('published', true)
        .order('display_order');

      if (error) throw error;

      const formattedGuides = (data || []).map(guide => ({
        ...guide,
        topics: Array.isArray(guide.topics) ? guide.topics : 
                (typeof guide.topics === 'string' ? JSON.parse(guide.topics) : [])
      }));

      setGuides(formattedGuides);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const tools = [
    {
      icon: Home,
      title: "Affordability Calculator",
      description: "Calculate how much you could borrow based on your income and deposit.",
      link: "/affordability-calculator"
    },
    {
      icon: Calculator,
      title: "Mortgage Calculator",
      description: "Calculate your monthly payments and total interest costs."
    },
    {
      icon: TrendingUp,
      title: "Overpayment Simulator",
      description: "See how overpayments can reduce your mortgage term and interest."
    },
    {
      icon: BookOpen,
      title: "Amortization Schedule",
      description: "View detailed payment breakdowns over your mortgage term."
    }
  ];

  return (
    <>
      <SEOHead 
        title="Mortgage Resources & Guides - Learn About UK Mortgages | AmortIQ"
        description="Free mortgage education resources. Learn about overpayments, refinancing, first-time buying, and mortgage management. Expert guidance for UK homeowners."
        keywords="mortgage guide, overpayment guide, refinancing tips, first time buyer, uk mortgage advice, mortgage resources"
      />
      <StructuredData 
        breadcrumbs={breadcrumbs}
        pageType="CollectionPage"
        headline="Mortgage Resources & Guides"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SharedNavigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mortgage
            <span className="text-primary block">Resources & Guides</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about managing your mortgage effectively.
          </p>
        </div>

        {/* Educational Guides */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-black">Guides & Articles</h2>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : guides.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <BookOpen className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-semibold text-black mb-2">Coming Soon</h3>
                <p className="text-black max-w-md mx-auto">
                  We're working on comprehensive guides and articles to help you make the most of your mortgage. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {guides.map((guide) => (
                <Card key={guide.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {guide.title}
                    </CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {guide.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="text-sm text-gray-700">
                          • {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Tools Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-black">Helpful Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              
              if (tool.link) {
                return (
                  <Link key={index} to={tool.link} className="block hover:shadow-lg transition-shadow">
                    <Card className="h-full">
                      <CardHeader>
                        <Icon className="h-10 w-10 text-primary mb-2" />
                        <CardTitle>{tool.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-black">{tool.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              }
              
              return (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-black">{tool.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Important Notice */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              The information provided in these resources is for educational purposes only and should not be considered financial advice. 
              Always consult with a qualified mortgage advisor or financial professional before making decisions about your mortgage.
            </p>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
    </>
  );
};

export default Resources;

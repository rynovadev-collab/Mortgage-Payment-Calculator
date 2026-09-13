import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Newspaper, AlertCircle } from "lucide-react";
import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface BaseRateData {
  rate: number;
  date: string;
  change: number;
}

const News = () => {
  const [baseRate, setBaseRate] = useState<BaseRateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [mortgageRates, setMortgageRates] = useState<Array<{
    ltv: string;
    twoYear: string;
    fiveYear: string;
    description: string;
  }>>([]);

  useEffect(() => {
    // Fetch Bank of England base rate from edge function
    const fetchBaseRate = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-base-rate');

        if (error) {
          console.error('Error fetching base rate:', error);
          throw error;
        }

        if (data) {
          setBaseRate({
            rate: data.rate,
            date: data.date,
            change: data.change
          });
        }
      } catch (error) {
        console.error('Error fetching base rate:', error);
        // Fallback to default data on error
        setBaseRate({
          rate: 4.0,
          date: new Date().toISOString().split('T')[0],
          change: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBaseRate();
  }, []);

  useEffect(() => {
    fetchNewsArticles();
  }, []);

  const fetchNewsArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching news articles:', error);
      }
      
      // You can add these articles to state if you want to display them on the page
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Fetch mortgage rates from database
    const fetchMortgageRates = async () => {
      try {
        const { data, error } = await supabase
          .from('mortgage_rates')
          .select('*')
          .order('display_order');

        if (error) throw error;

        if (data) {
          setMortgageRates(data.map(rate => ({
            ltv: rate.ltv_ratio,
            twoYear: `${rate.two_year_rate}%`,
            fiveYear: `${rate.five_year_rate}%`,
            description: rate.description
          })));
        }
      } catch (error) {
        console.error('Error fetching mortgage rates:', error);
        // Fallback to default data on error
        setMortgageRates([
          { ltv: "60%", twoYear: "3.77%", fiveYear: "3.94%", description: "Best rates for high equity" },
          { ltv: "75%", twoYear: "4.74%", fiveYear: "5.04%", description: "Popular LTV bracket" },
          { ltv: "85%", twoYear: "4.15%", fiveYear: "4.28%", description: "First-time buyers" },
          { ltv: "90%", twoYear: "4.22%", fiveYear: "4.45%", description: "Low deposit mortgages" },
          { ltv: "95%", twoYear: "5.24%", fiveYear: "5.49%", description: "Highest LTV available" },
        ]);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchMortgageRates();
  }, []);

  return (
    <>
      <SEOHead 
        title="UK Mortgage News & Rates - Bank of England Base Rate | AmortIQ"
        description="Stay updated with the latest UK mortgage rates, Bank of England base rate changes, and average mortgage rates by LTV ratio. Real-time mortgage market data."
        keywords="bank of england base rate, uk mortgage rates, ltv mortgage rates, current mortgage rates, mortgage news uk"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SharedNavigation />
        
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mortgage
              <span className="text-primary block">News & Rates</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest mortgage rates and Bank of England updates.
            </p>
          </div>

          {/* Bank of England Base Rate */}
          <section className="mb-16">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  Bank of England Base Rate
                </CardTitle>
                <CardDescription>Current official bank rate set by the Monetary Policy Committee</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : baseRate ? (
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-4">
                      <span className="text-6xl font-bold text-primary">{baseRate.rate}%</span>
                      <Badge 
                        variant={baseRate.change > 0 ? "destructive" : "default"}
                        className="text-lg px-3 py-1"
                      >
                        {baseRate.change > 0 ? '+' : ''}{baseRate.change}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(baseRate.date).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                    <div className="bg-background/50 p-4 rounded-lg mt-4">
                      <p className="text-sm text-gray-700">
                        The Bank of England base rate influences mortgage interest rates across the UK. 
                        Changes typically affect variable rate mortgages immediately, while fixed rates 
                        may be impacted over time.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Unable to load base rate data</p>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Average Mortgage Rates by LTV */}
          <section className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Newspaper className="h-8 w-8 text-primary" />
                  Average Mortgage Rates by LTV
                </CardTitle>
                <CardDescription>
                  Current average rates for different Loan-to-Value (LTV) ratios
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ratesLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-48 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold text-black">LTV Ratio</th>
                            <th className="text-left py-3 px-4 font-semibold text-black">2-Year Fixed</th>
                            <th className="text-left py-3 px-4 font-semibold text-black">5-Year Fixed</th>
                            <th className="text-left py-3 px-4 font-semibold text-black">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mortgageRates.map((rate, index) => (
                            <tr 
                              key={index} 
                              className="border-b hover:bg-muted/50 transition-colors"
                            >
                              <td className="py-4 px-4">
                                <Badge variant="outline" className="font-semibold">
                                  {rate.ltv}
                                </Badge>
                              </td>
                              <td className="py-4 px-4 font-medium text-primary">
                                {rate.twoYear}
                              </td>
                              <td className="py-4 px-4 font-medium text-primary">
                                {rate.fiveYear}
                              </td>
                              <td className="py-4 px-4 text-sm text-black">
                                {rate.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        Understanding LTV (Loan-to-Value)
                      </h4>
                      <p className="text-sm text-black mb-2">
                        LTV is the percentage of your property value that you're borrowing. 
                        For example, if you're buying a £200,000 home with a £20,000 deposit, 
                        your LTV is 90%. Lower LTV ratios typically qualify for better interest rates.
                      </p>
                      <p className="text-xs text-black italic">
                        Rates updated: October 2025. Source: Uswitch/Mojo Mortgages market averages.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Market Updates */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-black">Latest Market Updates</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rate Changes Expected</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-black">
                    The Monetary Policy Committee meets eight times per year to review and set the base rate. 
                    The next meeting is scheduled for early next month. Market analysts predict a potential 
                    rate hold or modest decrease depending on inflation data.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fixed vs Variable Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    With base rates showing volatility, many borrowers are opting for longer fixed-rate 
                    terms to lock in current rates. 5-year fixed rates are particularly popular as they 
                    offer stability and are currently competitive with 2-year options.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Disclaimer */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p className="text-sm">
                The rates displayed are indicative averages based on market data and may not reflect 
                the exact rates available to you. Your actual rate depends on your credit score, 
                deposit size, property value, and lender criteria. Always compare quotes from multiple 
                lenders and consult with a qualified mortgage advisor before making decisions.
              </p>
            </CardContent>
          </Card>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default News;

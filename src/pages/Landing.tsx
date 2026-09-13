import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Shield, TrendingUp } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import TrustSignals from "@/components/TrustSignals";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import SharedNavigation from "@/components/SharedNavigation";

const Landing = () => {
  const { user } = useAuth();
  const { track, pageView } = useAnalytics();

  useEffect(() => {
    pageView('landing_page');
  }, [pageView]);

  return (
    <>
      <SEOHead 
        title="AmortIQ - Smart Mortgage Calculator & Overpayment Tracker | Save Thousands"
        description="Free UK mortgage calculator with overpayment tracking. See exactly how much you can save on interest and pay off your mortgage faster. Trusted by homeowners across the UK."
        keywords="mortgage calculator UK, overpayment calculator, mortgage tracker, amortization schedule, mortgage savings calculator, early repayment calculator"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SharedNavigation />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <article>
          <header className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Save Thousands on Your Mortgage
              <span className="text-primary block mt-2">With Smart Overpayment Tracking</span>
            </h1>

            {/* Hero Video */}
            <div className="mb-8 md:mb-12 max-w-4xl mx-auto">
              <video 
                className="w-full rounded-lg shadow-2xl"
                src="https://res.cloudinary.com/dxmlp4a6j/video/upload/v1762032803/hero-video_db9bgs.mp4"
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Free mortgage calculator showing exactly how much you'll save with overpayments. 
              See your path to mortgage freedom and track your progress month by month.
            </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto">
            {user ? (
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto"
                  onClick={() => track('cta_click', { location: 'hero_main', type: 'dashboard' })}
                >
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto"
                    onClick={() => track('cta_click', { location: 'hero_main', type: 'start_managing' })}
                  >
                    Start Managing Your Mortgage
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto"
                    onClick={() => track('cta_click', { location: 'hero_main', type: 'sign_in' })}
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Trust Signals */}
        <TrustSignals />

        {/* Features */}
        <section id="features" className="scroll-mt-16 py-12 md:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calculator className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-4" />
              <CardTitle className="text-lg sm:text-xl">Smart Calculator</CardTitle>
              <CardDescription>
                Advanced mortgage calculations and overpayment scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-black">
                Track savings and see how overpaying can improve your financial health.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-4" />
              <CardTitle className="text-lg sm:text-xl">Secure & Private</CardTitle>
              <CardDescription>
                Your financial data is encrypted and secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-black">
                No personal information is required your data is secure.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-4" />
              <CardTitle className="text-lg sm:text-xl">Progress Tracking</CardTitle>
              <CardDescription>
                Visualize your financial journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-black">
                Track your progress with detailed charts, tables and generate interest savings.
              </p>
            </CardContent>
          </Card>
        </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* FAQ */}
        <FAQ />

        {/* CTA Section */}
        <section className="text-center py-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription>
                Take control of your mortgage and start saving today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <Link to="/dashboard">
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => track('cta_click', { location: 'final_cta', type: 'access_dashboard' })}
                  >
                    Access Your Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => track('cta_click', { location: 'final_cta', type: 'create_account' })}
                  >
                    Create Your Free Account
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </section>
        </article>
      </main>
      
      <Footer />
    </div>
    </>
  );
};

export default Landing;

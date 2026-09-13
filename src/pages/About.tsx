import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

const About = () => {
  const breadcrumbs = [
    { name: "Home", url: "https://amortiq.co.uk/" },
    { name: "About", url: "https://amortiq.co.uk/about" }
  ];

  return (
    <>
      <SEOHead 
        title="About AmortIQ - Our Mission to Make Mortgages Clear & Simple"
        description="Learn about AmortIQ's mission to make mortgages transparent and easy to understand. Independent, user-focused mortgage tools built for UK homeowners."
        keywords="about amortiq, mortgage tools, financial planning, uk mortgage calculator"
      />
      <StructuredData 
        breadcrumbs={breadcrumbs}
        pageType="AboutPage"
        headline="About AmortIQ"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SharedNavigation />

      {/* About Content */}
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-center">About AmortIQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Amortiq was created with a simple goal: to make mortgages easier to understand. Buying a home is one of the biggest financial decisions most people will ever make, yet the tools available are often confusing, outdated, or designed to benefit lenders rather than consumers.
            </p>
            <p>
              Amortiq takes a different approach. It's built to be clear, transparent, and user‑friendly — giving you the numbers you need without hidden catches. Every feature is designed with trust in mind, from accurate calculations to compliance with consumer protections.
            </p>
            <p>
              This project is also about growth and possibility. Amortiq represents the belief that independent, user‑focused software can empower people to make smarter financial choices. By supporting it, you're helping to shape a tool that puts clarity and fairness first.
            </p>
            <p>
              Amortiq is a new venture built on a simple promise: transparency and empowerment in mortgage planning. With the support of active users, we'll continue to expand the platform with powerful new features and improvements. Every calculation today is the foundation for tomorrow's smarter tools.
            </p>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
    </>
  );
};

export default About;

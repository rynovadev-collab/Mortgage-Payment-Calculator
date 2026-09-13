import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

const Contact = () => {
  const breadcrumbs = [
    { name: "Home", url: "https://amortiq.co.uk/" },
    { name: "Contact", url: "https://amortiq.co.uk/contact" }
  ];

  return (
    <>
      <SEOHead 
        title="Contact AmortIQ - Get Support & Send Feedback | UK Mortgage Calculator"
        description="Contact AmortIQ for support, feedback, or inquiries. We're here to help you with your mortgage calculations and tracking needs."
        keywords="contact amortiq, mortgage calculator support, customer service, feedback"
      />
      <StructuredData 
        breadcrumbs={breadcrumbs}
        pageType="ContactPage"
        headline="Contact Us"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <SharedNavigation />
      
      <div className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-lg text-muted-foreground">
                We'd love to hear from you. Get in touch with us for support, feedback, or general inquiries.
              </p>

              <div className="flex justify-center">
                <Card className="border-primary/20 max-w-md w-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Mail className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">Get in Touch</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      For support, feedback, or general inquiries, reach out to us.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="mailto:amortiqinfo@gmail.com">
                        amortiqinfo@gmail.com
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">How accurate are the mortgage calculations?</h4>
                    <p className="text-sm text-muted-foreground">
                      Our calculations are based on standard mortgage formulas and are designed to be as accurate as possible. However, they are for informational purposes only and should not replace professional financial advice.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Can I cancel my premium subscription anytime?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can cancel your subscription at any time through the "Manage Subscription" link in your account settings.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Is my financial data secure?</h4>
                    <p className="text-sm text-muted-foreground">
                      Absolutely. All your data is encrypted and securely stored. We never share your personal financial information with third parties.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  We typically respond to all inquiries within 72 hours during business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
    </>
  );
};

export default Contact;

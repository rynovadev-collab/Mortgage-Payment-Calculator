import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";
import { Shield, AlertTriangle, Info } from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SharedNavigation />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">Disclaimer</h1>
          <p className="text-muted-foreground">Important information about using AmortIQ</p>
        </div>

        <div className="space-y-6">
          <section className="bg-card border rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold mb-3">Prototype Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AmortIQ is a prototype mortgage planning tool designed to provide approximate calculations 
                  and assist users in understanding their mortgage options. While we have developed this platform 
                  with care and strive to ensure accuracy in all calculations, users should be aware that this 
                  is an evolving service that may contain limitations.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card border rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Info className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold mb-3">Calculation Accuracy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our calculations have been designed to be as accurate as possible based on standard mortgage 
                  principles. However, several factors may cause variations between our calculations and actual 
                  figures provided by lenders:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Individual lender-specific terms and conditions</li>
                  <li>Interest rates with multiple decimal places that may be rounded differently</li>
                  <li>Specific contractual clauses unique to certain mortgage products</li>
                  <li>Fees, charges, and additional costs not captured in standard calculations</li>
                  <li>Variable rate changes and market fluctuations</li>
                  <li>Early repayment charges and overpayment restrictions</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-card border rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold mb-3">Not Financial Advice</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The information and calculations provided by AmortIQ do not constitute financial advice, 
                  professional guidance, or recommendations. Users should:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Exercise their own judgment when using this service</li>
                  <li>Consult with qualified financial advisors before making mortgage decisions</li>
                  <li>Verify all calculations and figures with their mortgage lender</li>
                  <li>Read and understand their mortgage contract terms thoroughly</li>
                  <li>Seek independent legal advice where appropriate</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-card border rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AmortIQ and its creators accept no liability for any losses, financial damages, discrepancies, 
                  or miscalculations arising from the use of this service. This includes, but is not limited to, 
                  variations in lender terms and conditions, changes in interest rates, or differences between 
                  calculated and actual figures. Users acknowledge that they use this service at their own risk 
                  and should verify all information independently.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card border rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold mb-3">User Responsibility</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By using AmortIQ, you acknowledge that you understand this is a planning tool only and that 
                  you are responsible for verifying all information, making informed decisions, and seeking 
                  appropriate professional advice before entering into any financial agreements or commitments.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-muted/50 border-l-4 border-primary p-4 rounded">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Disclaimer;

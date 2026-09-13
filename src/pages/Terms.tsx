import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <SharedNavigation />
      
      <div className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="mb-6">
                Welcome to AmortIQ ("we", "our", "us"). These Terms and Conditions ("Terms") govern your access to and use of our website, services, and subscription plans (the "Service"). By using the Service, you agree to these Terms. If you do not agree, you must not use the Service.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">1. Eligibility</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>You must be at least 18 years old to use the Service.</li>
                <li>By using the Service, you confirm you have the legal capacity to enter into a binding contract.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">2. Nature of the Service</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>The Service provides mortgage calculation and financial planning tools for informational purposes only.</li>
                <li>We do not provide financial, legal, or investment advice. You should consult a qualified professional before making financial decisions.</li>
                <li>We make reasonable efforts to ensure accuracy, but we do not guarantee that calculations, projections, or outputs are error-free.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">3. Subscriptions and Payments</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>Access to premium features requires a paid subscription.</li>
                <li>Subscription fees are clearly displayed at checkout and are billed via our payment provider (Stripe).</li>
                <li>By subscribing, you authorise recurring payments until you cancel.</li>
                <li>You may cancel at any time via the Manage Subscription link in your account.</li>
                <li>Fees are non-refundable except where required by law (e.g., 14-day cooling-off period under UK consumer law for digital services not yet accessed).</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">4. Free Trials and Promotions</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>Any free trial or promotional offer is subject to these Terms.</li>
                <li>We reserve the right to withdraw or modify promotions at any time.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">5. Intellectual Property and Copyright Protection</h2>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Ownership:</strong> All content, software code, algorithms, design elements, logos, trademarks, and proprietary technology used in the Service are owned exclusively by AmortIQ or licensed to us. This includes but is not limited to:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Website design and user interface</li>
                    <li>Calculation algorithms and methodologies</li>
                    <li>Software architecture and source code</li>
                    <li>Database structures and schemas</li>
                    <li>Graphics, images, and visual elements</li>
                    <li>Text content and documentation</li>
                  </ul>
                </li>
                <li><strong>Copyright Protection:</strong> The Service is protected by UK and international copyright laws (Copyright, Designs and Patents Act 1988). All rights are expressly reserved.</li>
                <li><strong>Strictly Prohibited Activities:</strong> Without our express written consent, you may NOT:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Copy, reproduce, or duplicate any portion of the Service</li>
                    <li>Modify, adapt, translate, or create derivative works</li>
                    <li>Reverse engineer, decompile, or disassemble the software</li>
                    <li>Extract or scrape data using automated tools</li>
                    <li>Remove or alter copyright notices or proprietary markings</li>
                    <li>Use the Service to build a competing product or service</li>
                    <li>Resell, sublicense, or commercially exploit the Service</li>
                    <li>Frame or mirror any part of the Service</li>
                  </ul>
                </li>
                <li><strong>Monitoring and Enforcement:</strong> We actively monitor for unauthorized use and reserve the right to pursue legal action, including seeking injunctive relief and monetary damages, against violators.</li>
                <li><strong>Trade Secrets:</strong> Certain proprietary methods and algorithms constitute trade secrets and are protected under applicable law.</li>
                <li><strong>Your Data:</strong> You retain ownership of any personal financial data you input into the Service. However, you grant us a limited license to process this data solely for providing the Service to you.</li>
                <li><strong>Licensing Inquiries:</strong> If you are interested in licensing our technology or forming a partnership, please contact us at legal@amortiq.co.uk</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">6. Acceptable Use and Security</h2>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Use the Service for unlawful purposes or in violation of any applicable laws.</li>
                <li>Attempt to gain unauthorized access to our systems, servers, or networks.</li>
                <li>Resell, sublicense, rent, lease, or distribute the Service without explicit written permission.</li>
                <li>Use any automated systems (bots, scrapers, crawlers) to access the Service.</li>
                <li>Interfere with or disrupt the Service or servers connected to it.</li>
                <li>Transmit viruses, malware, or any malicious code.</li>
                <li>Impersonate another person or misrepresent your affiliation.</li>
                <li>Circumvent any security features or access controls.</li>
                <li>Copy, imitate, or create a derivative work based on our Service.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">7. Availability and Maintenance</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>We aim to provide continuous access but do not guarantee uninterrupted Service.</li>
                <li>We may suspend or restrict access for maintenance, upgrades, or security reasons.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>To the fullest extent permitted by law, we are not liable for:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Losses arising from reliance on calculations or projections.</li>
                    <li>Indirect, incidental, or consequential damages.</li>
                  </ul>
                </li>
                <li>Our total liability for any claim is limited to the amount you paid us in the 12 months preceding the claim.</li>
                <li>Nothing in these Terms excludes liability for fraud, death, or personal injury caused by negligence.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">9. Data Protection and Privacy</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>We process personal data in accordance with our Privacy Policy.</li>
                <li>By using the Service, you consent to such processing.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">10. Termination</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>You may stop using the Service at any time.</li>
                <li>We may suspend or terminate your account if you breach these Terms.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>We may update these Terms from time to time.</li>
                <li>Material changes will be notified to you in advance. Continued use of the Service after changes means you accept the new Terms.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">12. Governing Law</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>These Terms are governed by the laws of England and Wales.</li>
                <li>Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Terms;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <SharedNavigation />
      
      <div className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="mb-6">
                This Privacy Policy describes how AmortIQ ("we", "our", "us") collects, uses, and protects your information when you use our Service.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>Account information (email address, username)</li>
                <li>Mortgage data you enter into our calculator</li>
                <li>Usage analytics to improve our service</li>
                <li>Payment information (processed securely by Stripe)</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>To provide and maintain our Service</li>
                <li>To process payments and manage subscriptions</li>
                <li>To improve our Service and develop new features</li>
                <li>To communicate with you about your account and updates</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Data Security</h2>
              <p className="mb-6">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Data Retention</h2>
              <p className="mb-6">
                We retain your information only as long as necessary to provide our services or as required by law. You may request deletion of your account and data at any time.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Third-Party Services</h2>
              <p className="mb-6">
                We use trusted third-party services including Supabase for data storage and Stripe for payment processing. These services have their own privacy policies and security measures.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Your Rights</h2>
              <p className="mb-6">
                You have the right to access, update, or delete your personal information. You may also opt out of non-essential communications at any time.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p className="mb-6">
                If you have any questions about this Privacy Policy, please contact us through our support channels.
              </p>

              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privacy;

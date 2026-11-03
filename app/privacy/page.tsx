
import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AmortIQ handles data and protects visitor privacy.",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Last updated: 3 November 2026
        </p>

        <div className="space-y-8 leading-7">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">1. Who we are</h2>
            <p>
              AmortIQ is a free UK mortgage calculator developed and
              operated by RynovaDev. You can contact the operator through{" "}
              <a href="https://rynovadev.co.uk"
                className="underline">rynovadev.co.uk</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              2. Mortgage calculator information
            </h2>
            <p>
              Mortgage figures entered into the calculator are processed
              in your browser to generate estimates. We do not require
              registration or intentionally transmit your calculator
              inputs to our servers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              3. Hosting and technical information
            </h2>
            <p>
              Our website is hosted using Vercel. When you access the
              website, technical information such as IP addresses,
              request details, browser information and timestamps may
              be processed for delivery, security and troubleshooting.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              4. Website analytics
            </h2>
            <p>
              We use Vercel Web Analytics to understand general website
              usage, such as page visits and navigation patterns.
              We use this information to assess and improve the website.
              We do not use analytics to collect the mortgage figures
              you enter into the calculator.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              5. Cookies and similar technologies
            </h2>
            <p>
              The website does not currently use advertising cookies.
              Essential technologies may be used to deliver and secure
              the service. We will update this policy and implement
              appropriate consent controls if we introduce technologies
              requiring consent.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              6. Legal basis and retention
            </h2>
            <p>
              Where personal data is processed for website security,
              operation or privacy-conscious usage measurement, we
              generally rely on legitimate interests, subject to
              applicable law and your rights. Technical records may
              be retained by our service providers under their
              applicable retention policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              7. Your rights
            </h2>
            <p>
              Depending on the circumstances, UK data protection law
              gives you rights to request access, correction, erasure,
              restriction or objection to processing of your personal
              data. You may also complain to the UK Information
              Commissioner's Office at{" "}
              <a href="https://ico.org.uk"
                className="underline">ico.org.uk</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              8. Third-party providers
            </h2>
            <p>
              Our hosting and analytics provider may process
              information in other countries using applicable
              data protection safeguards. External links are governed
              by the privacy policies of their respective websites.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              9. Changes and contact
            </h2>
            <p>
              We may update this policy as the website develops.
              For privacy enquiries, visit our{" "}
              <Link href="/contact" className="underline">
                contact page
              </Link>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

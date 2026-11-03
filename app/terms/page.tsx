
import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing the use of the AmortIQ mortgage calculator.",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-4 text-4xl font-bold">Terms of Use</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Last updated: 3 November 2026
        </p>

        <div className="space-y-8 leading-7">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              1. About AmortIQ
            </h2>
            <p>
              AmortIQ is a free mortgage calculation and educational
              website developed and operated by RynovaDev.
              By using this website, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              2. Calculator estimates
            </h2>
            <p>
              The calculator provides illustrative estimates of
              mortgage repayments, interest costs, repayment
              schedules and potential overpayment savings.
              Results depend on the information you provide and
              the assumptions used by the calculator.
            </p>
            <p className="mt-3">
              Actual lender calculations may differ because of
              interest calculation methods, rate changes, fees,
              payment dates and other mortgage conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              3. Not financial advice
            </h2>
            <p>
              AmortIQ provides general information only. It does
              not provide regulated financial advice, mortgage
              recommendations or lending decisions.
              You should consult your mortgage lender or a
              suitably qualified adviser before making important
              financial decisions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              4. Mortgage overpayments
            </h2>
            <p>
              Overpayment calculations do not necessarily account
              for early repayment charges, lender restrictions,
              product fees or changes to your mortgage agreement.
              Check your lender's terms before making additional
              payments.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              5. Website availability
            </h2>
            <p>
              We aim to keep the website accurate and accessible,
              but cannot guarantee uninterrupted availability or
              error-free operation. We may modify, suspend or
              discontinue features when necessary.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              6. Acceptable use
            </h2>
            <p>
              You may use AmortIQ for lawful personal and
              informational purposes. You must not interfere with
              the website, attempt unauthorised access or misuse
              its infrastructure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              7. Intellectual property
            </h2>
            <p>
              Unless otherwise stated, the website's original
              content, branding and presentation belong to
              their respective rights holders. You may not
              represent AmortIQ or its content as your own.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              8. Liability
            </h2>
            <p>
              To the extent permitted by law, we are not
              responsible for losses resulting from reliance on
              illustrative calculations or general information.
              Nothing in these terms excludes or limits liability
              that cannot lawfully be excluded or limited.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              9. External websites
            </h2>
            <p>
              Links to third-party websites are provided for
              convenience. We do not control their content,
              availability or policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              10. Governing law
            </h2>
            <p>
              These terms are governed by the laws of England
              and Wales, subject to any mandatory legal rights
              that apply to you.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              11. Contact and privacy
            </h2>
            <p>
              For enquiries, visit our{" "}
              <Link href="/contact" className="underline">
                contact page
              </Link>. For information about personal data,
              see our{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

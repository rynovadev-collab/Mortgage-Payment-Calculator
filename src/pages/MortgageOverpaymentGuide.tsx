import { Link } from "react-router-dom";
import { ArrowRight, Calculator } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const MortgageOverpaymentGuide = () => {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-white text-slate-950">
        {/* Article Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-primary">
              <span>Guide</span>
              <span className="text-slate-400">•</span>
              <span>Mortgage Overpayments</span>
            </div>

            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-5xl">
              Looking to Save Hundreds of Thousands on Your Mortgage?
            </h1>

            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-800">
              A beginner&apos;s guide to mortgage overpayments, reducing
              interest, shortening your mortgage term and using your LTV as a
              target — without sacrificing every spare pound along the way.
            </p>

            <div className="mt-7 text-sm font-medium text-slate-600">
              By AmortIQ &nbsp; • &nbsp; 7 min read
            </div>
          </div>
        </header>

        {/* Article */}
        <article className="mx-auto max-w-3xl px-5 py-12 md:py-16">
          <div className="text-[17px] leading-8 text-slate-900">

            {/* Introduction */}
            <p className="text-xl font-semibold leading-9 text-slate-950">
              Mortgage overpayments can be one of the simplest ways to reduce
              the total cost of your mortgage.
            </p>

            <p className="mt-5">
              When you overpay, you reduce the balance on which future mortgage
              interest is calculated. Over many years, that can make a
              substantial difference to both the amount of interest you pay and
              the date you finally become mortgage-free.
            </p>

            <p className="mt-5">
              But that doesn&apos;t mean you should throw every spare pound at
              your mortgage.
            </p>

            <p className="mt-5">
              A more balanced approach is to understand what an overpayment
              could achieve, decide what you&apos;re actually trying to
              accomplish, and choose an amount that still leaves room for
              savings, emergencies and enjoying your money.
            </p>

            <hr className="my-10 border-slate-200" />

            {/* Why */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Why can mortgage overpayments save so much?
              </h2>

              <p className="mt-5">
                A mortgage lasting 20, 30 or even 40 years gives interest a
                very long time to accumulate.
              </p>

              <p className="mt-5">
                Your normal monthly payment repays part of the amount you
                borrowed while also covering interest charged by the lender.
                Particularly earlier in a mortgage, a substantial amount of
                money can be going towards interest.
              </p>

              <p className="mt-5">
                When you make an overpayment, you reduce the outstanding
                balance faster. There is then less debt for future interest to
                be charged against.
              </p>

              <div className="my-8 border-l-4 border-primary bg-slate-50 px-6 py-5">
                <p className="font-bold text-slate-950">
                  The principle is simple:
                </p>

                <p className="mt-1 text-lg text-slate-900">
                  Lower mortgage balance → less future interest → potentially
                  shorter mortgage term.
                </p>
              </div>

              <p>
                The actual saving depends on your mortgage balance, interest
                rate, remaining term and the amount you overpay. On larger
                mortgages with long remaining terms, the difference can
                potentially reach tens of thousands of pounds — and under some
                circumstances even six figures.
              </p>
            </section>

            <hr className="my-10 border-slate-200" />

            {/* Calculator */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                See what overpaying could do to your mortgage
              </h2>

              <p className="mt-5">
                Generic examples are useful, but your own mortgage is what
                matters.
              </p>

              <p className="mt-5">
                AmortIQ lets you enter your mortgage balance, interest rate and
                exact remaining term, then compare your normal mortgage with
                monthly overpayments and lump-sum payments.
              </p>

              <Link
                to="/"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90"
              >
                <Calculator className="h-5 w-5" />
                Calculate your mortgage overpayment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            <hr className="my-10 border-slate-200" />

            {/* Monthly vs lump sum */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Monthly overpayments vs lump-sum payments
              </h2>

              <p className="mt-5">
                There are two straightforward ways to make mortgage
                overpayments.
              </p>

              <h3 className="mt-7 text-xl font-bold text-slate-950">
                Monthly overpayments
              </h3>

              <p className="mt-3">
                You can add a manageable amount to your normal mortgage payment
                every month. That could be £50, £100, £250 or any other amount
                that comfortably fits your budget.
              </p>

              <h3 className="mt-7 text-xl font-bold text-slate-950">
                Lump-sum overpayments
              </h3>

              <p className="mt-3">
                You can also make a larger one-off payment using savings, a
                bonus or other money you&apos;ve decided you no longer need to
                keep accessible.
              </p>

              <p className="mt-5">
                Neither approach is automatically better. You can also combine
                them — making modest monthly overpayments while occasionally
                paying a lump sum when your finances allow.
              </p>
            </section>

            <hr className="my-10 border-slate-200" />

            {/* Philosophy */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Should you overpay as much as you possibly can?
              </h2>

              <p className="mt-5 font-semibold text-slate-950">
                Not necessarily.
              </p>

              <p className="mt-5">
                Seeing a large potential interest saving can make it tempting
                to put every bit of disposable income into your mortgage.
              </p>

              <p className="mt-5">
                But your mortgage is only one part of your financial life. You
                may need emergency savings, have more expensive debts, want to
                save or invest for the future, improve your home, travel, or
                simply enjoy some of the money you work for.
              </p>

              <div className="my-8 border-l-4 border-primary bg-slate-50 px-6 py-5">
                <p className="text-lg font-bold text-slate-950">
                  Instead of asking:
                </p>

                <p className="mt-2">
                  “How much can I possibly overpay?”
                </p>

                <p className="mt-4 text-lg font-bold text-slate-950">
                  Try asking:
                </p>

                <p className="mt-2">
                  “What am I trying to achieve with this overpayment?”
                </p>
              </div>

              <p>
                Giving your overpayments a specific purpose can help you reduce
                your mortgage while maintaining a sensible balance elsewhere
                in your life.
              </p>
            </section>

            <hr className="my-10 border-slate-200" />

            {/* LTV */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Using LTV as an overpayment target
              </h2>

              <p className="mt-5">
                One useful target to investigate, particularly when you&apos;re
                approaching a new mortgage deal, is your{" "}
                <strong>loan-to-value ratio (LTV)</strong>.
              </p>

              <p className="mt-5">
                LTV compares your outstanding mortgage balance with the current
                value of your property.
              </p>

              <div className="my-7 border border-slate-300 bg-slate-50 p-6">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-700">
                  LTV formula
                </p>

                <p className="mt-2 text-xl font-bold text-slate-950">
                  Mortgage balance ÷ property value × 100
                </p>
              </div>

              <h3 className="mt-8 text-2xl font-bold text-slate-950">
                Example: targeting 75% LTV
              </h3>

              <p className="mt-4">
                Imagine your home is worth <strong>£300,000</strong> and your
                remaining mortgage balance is <strong>£231,000</strong>.
              </p>

              <p className="mt-5">
                £231,000 ÷ £300,000 × 100 gives you an LTV of approximately{" "}
                <strong>77%</strong>.
              </p>

              <p className="mt-5">
                Now imagine you&apos;re approaching remortgage and you want to
                investigate mortgage products available around{" "}
                <strong>75% LTV</strong>.
              </p>

              <p className="mt-5">
                75% of a £300,000 property is:
              </p>

              <p className="my-5 text-3xl font-extrabold text-slate-950">
                £225,000
              </p>

              <p>
                Your mortgage balance is £231,000, so the difference between
                the two balances is:
              </p>

              <p className="my-5 text-3xl font-extrabold text-primary">
                £6,000
              </p>

              <p>
                You now have a specific target to investigate rather than
                simply overpaying indefinitely.
              </p>

              <p className="mt-5">
                If reaching £225,000 before your next mortgage deal would put
                you in a more useful LTV position, you can calculate how much
                of that £6,000 might be reached through your normal repayments
                and how much additional overpayment may be required.
              </p>

              <p className="mt-5">
                Lower LTVs can give borrowers access to different mortgage
                products and potentially lower rates. However, lenders use
                different LTV bands and pricing, so reaching a particular LTV
                does not guarantee a particular interest rate.
              </p>
            </section>

            <h3 className="mt-8 text-2xl font-bold text-slate-950">
  Remember: your property value can change too
</h3>

<p className="mt-4">
  Your mortgage balance is only one half of the LTV calculation. The other is
  the value of your home, and that can change by the time you come to renew or
  remortgage.
</p>

<p className="mt-5">
  If your property has increased in value, your LTV could fall even without
  making a large additional overpayment. If property prices have fallen, the
  opposite can happen and you could find yourself closer to — or above — an
  LTV threshold you were hoping to reach.
</p>

<p className="mt-5">
  This is another reason why keeping some money accessible can sometimes be
  useful. Rather than committing all of your available cash to the mortgage
  months in advance, you could keep some flexibility until you have a clearer
  idea of your property&apos;s valuation and the mortgage products available
  when your current deal is coming to an end.
</p>

<div className="my-8 border-l-4 border-primary bg-slate-50 px-6 py-5">
  <p className="font-bold text-slate-950">
    Think of LTV as a moving target.
  </p>

  <p className="mt-2">
    Your mortgage balance generally falls as you make repayments, while your
    property value can rise or fall. Keeping some cash available gives you the
    option to make a targeted overpayment later if it would help you reach a
    useful LTV band.
  </p>
</div>

            <hr className="my-10 border-slate-200" />

            {/* Rules */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Check your mortgage rules before overpaying
              </h2>

              <p className="mt-5">
                Before making a significant overpayment, check the terms of
                your own mortgage.
              </p>

              <p className="mt-5">
                In particular, check:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-900">
                <li>Your penalty-free overpayment allowance</li>
                <li>Whether an early repayment charge applies</li>
                <li>How your lender applies overpayments</li>
                <li>
                  Whether your normal monthly payment changes after an
                  overpayment
                </li>
              </ul>

              <p className="mt-5">
                Many mortgages allow some penalty-free overpayments, commonly
                around 10% per year, but this is not a universal rule. Always
                check your own mortgage agreement or ask your lender.
              </p>
            </section>

            <hr className="my-10 border-slate-200" />

            {/* Fees */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Don&apos;t forget mortgage product fees
              </h2>

              <p className="mt-5">
                When comparing mortgage deals, the interest rate isn&apos;t the
                only number that matters. Some mortgage products also come with
                arrangement or product fees.
              </p>

              <p className="mt-5">
                You may have the option to pay the fee upfront or add it to
                your mortgage balance.
              </p>

              <p className="mt-5">
                Adding the fee to the mortgage avoids paying it immediately,
                but it also means borrowing that amount. As a result, you can
                pay mortgage interest on the fee as well.
              </p>

              <p className="mt-5">
                AmortIQ includes an option to add a product fee to the mortgage
                so you can see how financing the fee changes the calculation.
              </p>
            </section>

            <hr className="my-10 border-slate-200" />

            {/* Savings */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Should you keep the money in savings instead?
              </h2>

              <p className="mt-5">
                Mortgage overpayments provide a relatively predictable
                benefit: reducing your balance means avoiding some future
                mortgage interest.
              </p>

              <p className="mt-5">
                But accessible savings provide flexibility.
              </p>

              <p className="mt-5">
                Once money has been paid into a standard mortgage, getting it
                back may not be straightforward. Keeping an appropriate
                emergency fund can therefore be important before making
                aggressive overpayments.
              </p>

              <p className="mt-5">
                You may also want to compare the cost of your mortgage with
                other debts and consider the returns available from savings,
                pensions or investments according to your own circumstances.
              </p>
            </section>

            <hr className="my-10 border-slate-200" />

            {/* Steps */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                A simple mortgage overpayment strategy
              </h2>

              <ol className="mt-6 list-decimal space-y-4 pl-6">
                <li>
                  <strong>Calculate your starting point.</strong> Enter your
                  mortgage balance, interest rate and exact remaining term.
                </li>

                <li>
                  <strong>Experiment with realistic overpayments.</strong> Try
                  monthly amounts and lump sums you could genuinely afford.
                </li>

                <li>
                  <strong>Look at the long-term effect.</strong> Compare the
                  estimated interest saving and mortgage-free date.
                </li>

                <li>
                  <strong>Calculate your LTV.</strong> If you&apos;re
                  approaching a new mortgage deal, investigate whether reaching
                  a different LTV could be useful.
                </li>

                <li>
                  <strong>Check your mortgage rules.</strong> Make sure the
                  payment wouldn&apos;t trigger an early repayment charge.
                </li>

                <li>
                  <strong>Keep some balance in your life.</strong> Choose an
                  amount that helps your mortgage without leaving you short of
                  savings or money for everything else.
                </li>
              </ol>
            </section>

            <hr className="my-10 border-slate-200" />

            {/* Conclusion */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                So, should you overpay your mortgage?
              </h2>

              <p className="mt-5">
                Mortgage overpayments can substantially reduce the amount of
                interest you pay and potentially bring your mortgage-free date
                forward.
              </p>

              <p className="mt-5">
                But the goal shouldn&apos;t necessarily be to overpay as much
                as humanly possible.
              </p>

              <p className="mt-5">
                Work out what you want the overpayment to achieve. That might
                be becoming mortgage-free earlier, reducing lifetime interest,
                reaching an LTV target before remortgaging, or simply making
                steady progress while keeping plenty of flexibility elsewhere.
              </p>

              <p className="mt-5 font-semibold text-slate-950">
                Calculate first. Set a target. Then decide what makes sense for
                your life.
              </p>

              <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
              >
                <Calculator className="h-5 w-5" />
                Try the AmortIQ Calculator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            {/* Disclaimer */}
            <div className="mt-14 border-t border-slate-300 pt-7">
              <p className="text-sm leading-6 text-slate-700">
                <strong className="text-slate-950">
                  Important information:
                </strong>{" "}
                AmortIQ provides calculations and educational information for
                illustrative purposes only and does not provide financial
                advice. Mortgage terms, overpayment allowances, interest
                calculations, product fees and early repayment charges vary
                between lenders and products. Check your mortgage agreement and
                consider speaking to your lender or a qualified mortgage
                adviser before making financial decisions.
              </p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
};

export default MortgageOverpaymentGuide;
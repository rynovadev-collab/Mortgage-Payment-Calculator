import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MortgageSeoContent = () => {
  return (
    <section className="space-y-6 pt-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          How Mortgage Overpayments Can Affect Your Mortgage
        </h2>

        <p className="max-w-4xl text-muted-foreground">
          Making extra payments towards a repayment mortgage can reduce
          the outstanding balance more quickly. Because future interest
          is calculated on a smaller balance, overpayments may reduce
          the total interest you pay and help you repay your mortgage
          sooner.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Monthly Mortgage Overpayments
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              A monthly overpayment is an amount you choose to pay on
              top of your normal mortgage payment each month.
            </p>

            <p>
              Even relatively small regular overpayments can have a
              significant effect over a long mortgage term because they
              reduce the balance on which future interest is charged.
            </p>

            <p>
              Use the calculator above to compare different monthly
              overpayment amounts and see how they could affect your
              estimated mortgage term and total interest.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Lump-Sum Mortgage Overpayments
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              A lump-sum overpayment is a one-off payment made directly
              towards your mortgage balance.
            </p>

            <p>
              Because the mortgage balance is reduced immediately, a
              lump-sum payment can reduce the amount of interest charged
              from that point onwards.
            </p>

            <p>
              You can use the lump-sum field above alongside a regular
              monthly overpayment to estimate the combined effect.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Monthly Overpayment or Lump Sum?
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 leading-7 text-muted-foreground">
          <p>
            Both approaches reduce the mortgage balance, but they do so
            at different times. A lump sum reduces the balance
            immediately, while monthly overpayments reduce it gradually
            over time.
          </p>

          <p>
            If you have money available now, paying it earlier generally
            means there is less balance on which future mortgage
            interest can be calculated. However, whether overpaying is
            suitable for you depends on your mortgage terms, finances
            and other priorities.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Mortgage Overpayment FAQs
        </h2>

        <Card>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h3 className="font-semibold">
                Does overpaying a mortgage reduce interest?
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                On a typical repayment mortgage, reducing the outstanding
                balance can reduce the amount of interest charged in the
                future. The exact saving depends on factors such as your
                interest rate, remaining term and timing of the
                overpayment.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                How much can I overpay on my mortgage?
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This depends on your mortgage agreement. Some lenders
                allow a certain amount to be overpaid each year without
                an early repayment charge, while other mortgage products
                have different limits. Check your mortgage terms or ask
                your lender before making a large overpayment.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Is it better to reduce my mortgage term or monthly payment?
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                If an overpayment is used to shorten the effective term
                while maintaining your normal payment, it can produce a
                greater reduction in future interest than simply lowering
                future monthly payments. Your lender may handle
                overpayments differently, so check how your mortgage
                account is recalculated.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Is this mortgage calculator exact?
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The calculator provides estimates using the mortgage
                balance, interest rate, remaining term and overpayments
                you enter. Actual lender calculations can differ because
                of daily interest, rate changes, payment dates, fees and
                the specific terms of your mortgage.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border bg-muted/40 p-5">
        <h2 className="font-semibold">
          Important Information
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          AmortIQ is an informational mortgage calculation tool and does
          not provide financial advice. Results are estimates and should
          not be treated as a mortgage offer, recommendation or guarantee.
          Check your mortgage agreement for overpayment limits and early
          repayment charges, and contact your lender or an appropriately
          qualified adviser if you are unsure.
        </p>
      </div>
    </section>
  );
};

export default MortgageSeoContent;
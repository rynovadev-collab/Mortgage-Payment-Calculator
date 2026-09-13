import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CalculatorMethodology = () => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          How This Mortgage Calculator Works
        </h2>

        <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
          AmortIQ estimates mortgage repayments using the balance,
          interest rate, remaining term and overpayments you enter.
          It is designed to show how different overpayment strategies
          could affect your mortgage over time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculation Assumptions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
          <p>
            The standard monthly repayment is calculated using a
            repayment mortgage formula based on the mortgage balance,
            annual interest rate and remaining mortgage term.
          </p>

          <p>
            Interest is modelled monthly using the annual interest rate
            divided by 12. Each monthly payment first covers the
            estimated interest for that month, with the remainder
            reducing the mortgage balance.
          </p>

          <p>
            Monthly overpayments are added to the calculated standard
            monthly repayment and are assumed to continue every month
            until the mortgage is repaid.
          </p>

          <p>
            Any lump-sum overpayment is assumed to be paid immediately,
            reducing the mortgage balance before future monthly
            interest is calculated.
          </p>

          <p>
            The calculator assumes the interest rate remains unchanged
            for the entire calculation period. It does not currently
            model future rate changes, fees, early repayment charges,
            payment holidays or changes made by your lender.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why Your Lender May Show Different Results</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
          <p>
            Mortgage lenders may calculate interest daily rather than
            monthly and can apply payments at different points during
            the month. This can produce small differences between
            AmortIQ estimates and your lender's figures.
          </p>

          <p>
            Your mortgage may also contain product-specific conditions,
            such as annual overpayment limits, early repayment charges
            or rules about whether an overpayment reduces the term or
            future monthly payments.
          </p>

          <p>
            For exact figures, always check your mortgage statement,
            mortgage offer or lender's own calculations.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default CalculatorMethodology;
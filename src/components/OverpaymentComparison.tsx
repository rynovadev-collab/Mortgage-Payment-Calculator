import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { UserMortgageData } from "@/types/mortgage";

import {
  calculateMortgageScenario,
  formatMortgageDuration,
} from "@/utils/mortgageEngine";

interface OverpaymentComparisonProps {
  mortgageData: UserMortgageData;
}

const OverpaymentComparison = ({
  mortgageData,
}: OverpaymentComparisonProps) => {
  const {
    mortgageAmount,
    currentRate,
    remainingTermYears,
    remainingTermMonths,
    monthlyPayment,
    overpaymentAmount,
  } = mortgageData;

  const termMonths = Math.max(
    1,
    remainingTermYears * 12 + remainingTermMonths
  );

  const standard = calculateMortgageScenario({
    mortgageAmount,
    annualRate: currentRate,
    termMonths,
    monthlyPayment,
    monthlyOverpayment: 0,
    lumpSum: 0,
  });

  const comparisonAmounts = Array.from(
    new Set([
      0,
      50,
      100,
      200,
      500,
      1000,
      Math.max(0, overpaymentAmount || 0),
    ])
  ).sort((a, b) => a - b);

  const comparisons = comparisonAmounts.map((amount) => {
    const result = calculateMortgageScenario({
      mortgageAmount,
      annualRate: currentRate,
      termMonths,
      monthlyPayment,
      monthlyOverpayment: amount,
      lumpSum: 0,
    });

    return {
      amount,
      monthlyPayment: result.totalMonthlyPayment,
      months: result.months,

      monthsSaved: Math.max(
        0,
        standard.months - result.months
      ),

      totalInterest: result.totalInterest,

      interestSaved: Math.max(
        0,
        standard.totalInterest - result.totalInterest
      ),
    };
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">
          Compare Overpayment Amounts
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Compare monthly overpayments on their own to see how increasing
          your regular payment could reduce your mortgage term and total
          interest.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Monthly Overpayment Comparison
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b text-sm">
                  <th className="py-3 pr-4 text-left">
                    Overpayment
                  </th>

                  <th className="px-4 py-3 text-right">
                    Monthly Payment
                  </th>

                  <th className="px-4 py-3 text-right">
                    Mortgage Term
                  </th>

                  <th className="px-4 py-3 text-right">
                    Time Saved
                  </th>

                  <th className="px-4 py-3 text-right">
                    Total Interest
                  </th>

                  <th className="py-3 pl-4 text-right">
                    Interest Saved
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisons.map((row) => {
                  const selected =
                    row.amount ===
                    Math.max(0, overpaymentAmount || 0);

                  return (
                    <tr
                      key={row.amount}
                      className={
                        selected
                          ? "border-b bg-primary/10"
                          : "border-b"
                      }
                    >
                      <td className="py-4 pr-4 font-semibold">
                        <div className="flex items-center gap-2">
                          {formatCurrency(row.amount)}

                          {selected && (
                            <Badge>
                              Selected
                            </Badge>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right">
                        {formatCurrency(
                          row.monthlyPayment
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        {formatMortgageDuration(
                          row.months
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        {row.monthsSaved > 0
                          ? formatMortgageDuration(
                            row.monthsSaved
                          )
                          : "—"}
                      </td>

                      <td className="px-4 py-4 text-right">
                        {formatCurrency(
                          row.totalInterest
                        )}
                      </td>

                      <td className="py-4 pl-4 text-right font-semibold text-primary">
                        {row.interestSaved > 0
                          ? formatCurrency(
                            row.interestSaved
                          )
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default OverpaymentComparison;
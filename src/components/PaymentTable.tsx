import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Calendar } from "lucide-react";

import { MortgageData } from "@/types/mortgage";
import { calculateMortgageScenario } from "@/utils/mortgageEngine";

interface PaymentTableProps {
  mortgageData: MortgageData;
}

const PaymentTable = ({ mortgageData }: PaymentTableProps) => {
  const paymentSchedule = useMemo(() => {
    const result = calculateMortgageScenario({
      mortgageAmount: mortgageData.mortgageAmount,
      annualRate: mortgageData.currentRate,
      termMonths: mortgageData.loanTermMonths,
      monthlyPayment: mortgageData.monthlyPayment,
      monthlyOverpayment: mortgageData.overpayment || 0,
      lumpSum: mortgageData.lumpSumAmount || 0,
    });

    return result.schedule;
  }, [mortgageData]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  if (!paymentSchedule.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl md:text-2xl font-bold">
          Mortgage Payment Schedule
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          See how each monthly payment is divided between principal and
          interest, and how your mortgage balance falls over time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Monthly Amortisation Breakdown
          </CardTitle>

          <CardDescription>
            Full month-by-month repayment schedule based on your selected
            mortgage, monthly overpayment and any lump-sum payment.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="max-h-[520px] overflow-auto rounded-md border">
            <Table className="min-w-[700px]">
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead className="bg-background">
                    Month
                  </TableHead>

                  <TableHead className="bg-background">
                    Payment
                  </TableHead>

                  <TableHead className="bg-background">
                    Principal
                  </TableHead>

                  <TableHead className="bg-background">
                    Interest
                  </TableHead>

                  <TableHead className="bg-background">
                    Remaining Balance
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paymentSchedule.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">
                      {row.month}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(row.payment)}
                    </TableCell>

                    <TableCell className="font-medium">
                      {formatCurrency(row.principal)}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(row.interest)}
                    </TableCell>

                    <TableCell className="font-medium">
                      {formatCurrency(row.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PaymentTable;
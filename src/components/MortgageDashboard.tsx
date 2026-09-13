import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import PaymentTable from "./PaymentTable";
import { MortgageChart } from "./MortgageChart";
import { InterestPrincipalChart } from "./InterestPrincipalChart";
import MortgageSummary from "./MortgageSummary";
import OverpaymentComparison from "./OverpaymentComparison";

import { UserMortgageData } from "@/types/mortgage";

import { calculateRequiredMonthlyPayment } from "@/utils/mortgageCalculations";
import MortgageSeoContent from "./MortgageSeoContent";
import CalculatorMethodology from "./CalculatorMethodology";

const MortgageDashboard = () => {
  const [mortgageAmount, setMortgageAmount] = useState(250000);
  const [currentRate, setCurrentRate] = useState(4);
  const [remainingTermYears, setRemainingTermYears] = useState(40);
  const [overpaymentAmount, setOverpaymentAmount] = useState(0);
  const [lumpSumAmount, setLumpSumAmount] = useState(0);

  const loanTermMonths = Math.min(
    600,
    Math.max(
      1,
      Math.round(remainingTermYears * 12)
    )
  );

  const monthlyPayment = useMemo(() => {
    return calculateRequiredMonthlyPayment(
      mortgageAmount,
      currentRate,
      loanTermMonths
    );
  }, [mortgageAmount, currentRate, loanTermMonths]);

  const mortgageData: UserMortgageData = {
    mortgageAmount,
    currentRate,
    remainingTermYears,
    monthlyPayment,
    overpaymentAmount,
    lumpSumAmount,
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="space-y-6 pb-10">
      {/* Heading */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
            Mortgage Overpayment Calculator
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            See how mortgage overpayments could reduce your interest,
            shorten your mortgage term and bring your mortgage-free date
            forward.
          </p>
        </div>

        <Badge
          variant="secondary"
          className="w-fit px-4 py-2 text-sm md:text-base"
        >
          {remainingTermYears} years remaining
        </Badge>
      </div>

      {/* Calculator inputs */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mortgage Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="mortgageAmount">
                Current Mortgage Balance (£)
              </Label>

              <Input
                id="mortgageAmount"
                type="number"
                min="0"
                step="1000"
                value={mortgageAmount}
                onChange={(e) =>
                  setMortgageAmount(
                    Math.max(
                      0,
                      Number(e.target.value) || 0
                    )
                  )
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currentRate">
                Interest Rate (%)
              </Label>

              <Input
                id="currentRate"
                type="number"
                min="0"
                step="0.01"
                value={currentRate}
                onChange={(e) =>
                  setCurrentRate(
                    Math.max(
                      0,
                      Number(e.target.value) || 0
                    )
                  )
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="remainingTerm">
                Remaining Mortgage Term (Years)
              </Label>

              <Input
                id="remainingTerm"
                type="number"
                min="1"
                max="50"
                step="1"
                value={remainingTermYears}
                onChange={(e) =>
                  setRemainingTermYears(
                    Math.min(
                      50,
                      Math.max(
                        1,
                        Number(e.target.value) || 1
                      )
                    )
                  )
                }
              />
            </div>

            <div className="rounded-xl bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                Calculated standard monthly payment
              </p>

              <p className="mt-1 text-3xl font-bold">
                {formatCurrency(monthlyPayment)}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Based on a repayment mortgage at the selected interest
                rate and remaining term.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Overpayment */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Overpayment</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="overpayment">
                Extra Monthly Payment (£)
              </Label>

              <Input
                id="overpayment"
                type="number"
                min="0"
                step="10"
                value={overpaymentAmount}
                onChange={(e) =>
                  setOverpaymentAmount(
                    Math.max(
                      0,
                      Number(e.target.value) || 0
                    )
                  )
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lumpSum">
                One-Off Lump Sum (£)
              </Label>

              <Input
                id="lumpSum"
                type="number"
                min="0"
                max={mortgageAmount}
                step="100"
                value={lumpSumAmount}
                onChange={(e) =>
                  setLumpSumAmount(
                    Math.max(
                      0,
                      Math.min(
                        mortgageAmount,
                        Number(e.target.value) || 0
                      )
                    )
                  )
                }
              />

              <p className="text-xs text-muted-foreground">
                Enter any one-off amount you want to pay towards your mortgage
                immediately.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                Quick Overpayments
              </p>

              <div className="grid grid-cols-3 gap-2">
                {[0, 50, 100, 200, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                    variant={
                      overpaymentAmount === amount
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setOverpaymentAmount(amount)
                    }
                  >
                    £{amount}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                Quick Lump Sums
              </p>

              <div className="grid grid-cols-3 gap-2">
                {[0, 1000, 2500, 5000, 10000, 20000].map((amount) => {
                  const safeAmount = Math.min(
                    amount,
                    mortgageAmount
                  );

                  return (
                    <Button
                      key={amount}
                      variant={
                        lumpSumAmount === safeAmount
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setLumpSumAmount(safeAmount)
                      }
                    >
                      £{amount.toLocaleString("en-GB")}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">
                Standard monthly payment
              </p>

              <p className="text-xl font-semibold">
                {formatCurrency(monthlyPayment)}
              </p>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">
                New monthly payment with overpayment
              </p>

              <p className="mt-1 text-3xl font-bold text-primary">
                {formatCurrency(
                  monthlyPayment + overpaymentAmount
                )}
              </p>

              {overpaymentAmount > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Includes {formatCurrency(overpaymentAmount)} extra
                  every month.
                </p>
              )}

              {lumpSumAmount > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Plus a one-off lump-sum payment of{" "}
                  {formatCurrency(lumpSumAmount)}.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Headline results */}
      <MortgageSummary mortgageData={mortgageData} />

      {/* Overpayment comparison */}
      <OverpaymentComparison mortgageData={mortgageData} />

      {/* Mortgage visualisations */}
      <div className="grid gap-4 md:gap-6 xl:grid-cols-2">
        <MortgageChart mortgageData={mortgageData} />
        <InterestPrincipalChart mortgageData={mortgageData} />
      </div>

      {/* Full payment schedule */}
      <PaymentTable
        mortgageData={{
          mortgageAmount,
          currentRate,
          monthlyPayment,
          loanTermMonths,
          overpayment: overpaymentAmount,
          lumpSumAmount,
        }}
      />
      {/* Educational and SEO content */}
      <CalculatorMethodology />
      <MortgageSeoContent />
    </div>
  );
};

export default MortgageDashboard;
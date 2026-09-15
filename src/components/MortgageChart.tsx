import { useMemo } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UserMortgageData } from "@/types/mortgage";
import { calculateMortgageScenario } from "@/utils/mortgageEngine";

interface MortgageChartProps {
  mortgageData: UserMortgageData;
}

export const MortgageChart = ({
  mortgageData,
}: MortgageChartProps) => {
  const chartData = useMemo(() => {
    const {
      mortgageAmount,
      currentRate,
      remainingTermYears,
      remainingTermMonths,
      monthlyPayment,
      overpaymentAmount,
      lumpSumAmount,
    } = mortgageData;

    if (
      mortgageAmount <= 0 ||
      monthlyPayment <= 0 ||
      currentRate < 0
    ) {
      return {
        data: [],
        scenarios: [],
      };
    }

    const termMonths = Math.max(
      1,
      remainingTermYears * 12 + remainingTermMonths
    );

    const scenarioAmounts = Array.from(
      new Set([
        0,
        100,
        200,
        500,
        Math.max(0, overpaymentAmount || 0),
      ])
    ).sort((a, b) => a - b);

    const scenarioResults = scenarioAmounts.map((amount) => {
      const isSelected =
        amount === Math.max(0, overpaymentAmount || 0);

      return {
        amount,
        result: calculateMortgageScenario({
          mortgageAmount,
          annualRate: currentRate,
          termMonths,
          monthlyPayment,
          monthlyOverpayment: amount,
          lumpSum: isSelected
            ? lumpSumAmount || 0
            : 0,
        }),
      };
    });

    const longestScenario = Math.max(
      ...scenarioResults.map(
        ({ result }) => result.schedule.length
      ),
      0
    );

    const rows: Record<
      string,
      number | string | null
    >[] = [];

    for (
      let month = 0;
      month <= longestScenario;
      month++
    ) {
      const date = new Date();
      date.setMonth(date.getMonth() + month);

      const row: Record<
        string,
        number | string | null
      > = {
        month,
        date: date.toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        }),
      };

      scenarioResults.forEach(({ amount, result }) => {
        if (month === 0) {
          row[`overpayment_${amount}`] =
            result.startingBalance;
          return;
        }

        const scheduleRow =
          result.schedule[month - 1];

        row[`overpayment_${amount}`] =
          scheduleRow
            ? scheduleRow.balance
            : null;
      });

      rows.push(row);
    }

    return {
      data: rows,
      scenarios: scenarioAmounts,
    };
  }, [mortgageData]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (month: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + month);

    return date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  };

  if (!chartData.data.length) {
    return null;
  }

  const lineStyles = [
    "#64748b", // grey - no overpayment
    "#2563eb", // blue
    "#16a34a", // green
    "#ea580c", // orange
    "#9333ea", // purple
    "#dc2626", // red
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Mortgage Balance Comparison
        </CardTitle>

        <CardDescription>
          Compare different monthly overpayment amounts. Your selected scenario
          also includes your {formatCurrency(mortgageData.lumpSumAmount || 0)}
          one-off lump-sum payment, so its starting balance may be lower.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {mortgageData.lumpSumAmount > 0 && (
          <div className="mb-4 rounded-lg border bg-muted/50 p-3 text-sm">
            <span className="font-semibold">Your selected scenario starts lower:</span>{" "}
            the {formatCurrency(mortgageData.lumpSumAmount)} lump-sum payment is
            deducted immediately from your mortgage balance.
          </div>
        )}
        <div className="h-[360px] w-full md:h-[420px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={chartData.data}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
              />

              <XAxis
                dataKey="month"
                tickFormatter={formatDate}
                minTickGap={60}
              />

              <YAxis
                tickFormatter={formatCurrency}
                width={80}
              />

              <Tooltip
                labelFormatter={(value) =>
                  formatDate(Number(value))
                }
                formatter={(
                  value: number,
                  name: string
                ) => [
                    formatCurrency(value),
                    name,
                  ]}
                contentStyle={{
                  backgroundColor:
                    "hsl(var(--card))",
                  border:
                    "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />

              <Legend />

              {chartData.scenarios.map(
                (amount, index) => {
                  const isSelected =
                    amount ===
                    mortgageData.overpaymentAmount;

                  return (
                    <Line
                      key={amount}
                      type="monotone"
                      dataKey={`overpayment_${amount}`}
                      name={
                        amount === 0
                          ? "No overpayment"
                          : isSelected
                            ? `£${amount.toLocaleString("en-GB")}/month + £${(
                              mortgageData.lumpSumAmount || 0
                            ).toLocaleString("en-GB")} lump sum`
                            : `£${amount.toLocaleString("en-GB")}/month`
                      }
                      stroke={
                        lineStyles[
                        index %
                        lineStyles.length
                        ]
                      }
                      strokeWidth={
                        isSelected ? 4 : 2
                      }
                      strokeDasharray={
                        amount === 0
                          ? "6 6"
                          : undefined
                      }
                      dot={false}
                      connectNulls={false}
                    />
                  );
                }
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
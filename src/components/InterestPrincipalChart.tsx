import { useMemo } from "react";
import {
  Area,
  AreaChart,
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

interface InterestPrincipalChartProps {
  mortgageData: UserMortgageData;
}

export const InterestPrincipalChart = ({
  mortgageData,
}: InterestPrincipalChartProps) => {
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
      return [];
    }

    const result = calculateMortgageScenario({
      mortgageAmount,
      annualRate: currentRate,
      termMonths: Math.max(
        1,
        remainingTermYears * 12 + remainingTermMonths
      ),
      monthlyPayment,
      monthlyOverpayment: overpaymentAmount || 0,
      lumpSum: lumpSumAmount || 0,
    });

    return result.schedule.map((row) => {
      const currentDate = new Date();

      currentDate.setMonth(
        currentDate.getMonth() + row.month - 1
      );

      return {
        month: row.month - 1,
        date: currentDate.toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        }),
        principal: row.principal,
        interest: row.interest,
      };
    });
  }, [mortgageData]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
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

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Principal vs Interest</CardTitle>

        <CardDescription>
          See how each payment in your selected overpayment scenario is split
          between principal and interest over time.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[320px] w-full md:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
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
                minTickGap={50}
              />

              <YAxis
                tickFormatter={formatCurrency}
                width={80}
              />

              <Tooltip
                labelFormatter={(value) =>
                  formatDate(Number(value))
                }
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />

              <Legend />

              <Area
                type="monotone"
                dataKey="principal"
                name="Principal"
                stackId="payment"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.55}
              />

              <Area
                type="monotone"
                dataKey="interest"
                name="Interest"
                stackId="payment"
                stroke="hsl(var(--destructive))"
                fill="hsl(var(--destructive))"
                fillOpacity={0.35}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
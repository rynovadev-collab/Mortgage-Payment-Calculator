import { useMemo } from "react";
import {
    CalendarDays,
    Clock3,
    PiggyBank,
    TrendingDown,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    calculateMortgageFreeDate,
    calculateMortgageScenario,
    formatMortgageDuration,
} from "@/utils/mortgageEngine";

import { UserMortgageData } from "@/types/mortgage";

interface MortgageSummaryProps {
    mortgageData: UserMortgageData;
}

const MortgageSummary = ({ mortgageData }: MortgageSummaryProps) => {
    const results = useMemo(() => {
        const {
            mortgageAmount,
            currentRate,
            remainingTermYears,
            remainingTermMonths,
            monthlyPayment,
            overpaymentAmount,
            lumpSumAmount,
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

        const overpaid = calculateMortgageScenario({
            mortgageAmount,
            annualRate: currentRate,
            termMonths,
            monthlyPayment,
            monthlyOverpayment: overpaymentAmount || 0,
            lumpSum: lumpSumAmount || 0,
        });

        const monthsSaved = Math.max(
            0,
            standard.months - overpaid.months
        );

        const interestSaved = Math.max(
            0,
            standard.totalInterest - overpaid.totalInterest
        );

        const mortgageFreeDate = calculateMortgageFreeDate(
            overpaid.months
        );

        return {
            standard,
            overpaid,
            monthsSaved,
            interestSaved,
            mortgageFreeDate,
        };
    }, [mortgageData]);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
            maximumFractionDigits: 0,
        }).format(value);

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl md:text-2xl font-bold">
                    Your Overpayment Results
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                    Based on a monthly overpayment of{" "}
                    {formatCurrency(mortgageData.overpaymentAmount || 0)}
                    {mortgageData.lumpSumAmount > 0 && (
                        <>
                            {" "}plus an immediate lump-sum payment of{" "}
                            {formatCurrency(mortgageData.lumpSumAmount)}
                        </>
                    )}
                    .
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Interest Saved
                        </CardTitle>

                        <PiggyBank className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(results.interestSaved)}
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                            Less interest over the mortgage
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Time Saved
                        </CardTitle>

                        <Clock3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatMortgageDuration(results.monthsSaved)}
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                            Earlier than standard repayments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Mortgage-Free Date
                        </CardTitle>

                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {results.mortgageFreeDate.toLocaleDateString(
                                "en-GB",
                                {
                                    month: "short",
                                    year: "numeric",
                                }
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                            Estimated final repayment
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Interest
                        </CardTitle>

                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(results.overpaid.totalInterest)}
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                            Instead of{" "}
                            {formatCurrency(results.standard.totalInterest)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Standard vs Overpayment</CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-3 text-left font-medium">
                                    Scenario
                                </th>
                                <th className="py-3 text-right font-medium">
                                    Monthly Payment
                                </th>
                                <th className="py-3 text-right font-medium">
                                    Time Remaining
                                </th>
                                <th className="py-3 text-right font-medium">
                                    Total Interest
                                </th>
                                <th className="py-3 text-right font-medium">
                                    Total Paid
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-b">
                                <td className="py-4 font-medium">
                                    Standard repayment
                                </td>

                                <td className="py-4 text-right">
                                    {formatCurrency(
                                        mortgageData.monthlyPayment
                                    )}
                                </td>

                                <td className="py-4 text-right">
                                    {formatMortgageDuration(results.standard.months)}
                                </td>

                                <td className="py-4 text-right">
                                    {formatCurrency(
                                        results.standard.totalInterest
                                    )}
                                </td>

                                <td className="py-4 text-right">
                                    {formatCurrency(results.standard.totalPaid)}
                                </td>
                            </tr>

                            <tr>
                                <td className="py-4 font-medium">
                                    With overpayment
                                </td>

                                <td className="py-4 text-right">
                                    {formatCurrency(
                                        mortgageData.monthlyPayment +
                                        (mortgageData.overpaymentAmount || 0)
                                    )}
                                </td>

                                <td className="py-4 text-right">
                                    {formatMortgageDuration(results.overpaid.months)}
                                </td>

                                <td className="py-4 text-right">
                                    {formatCurrency(
                                        results.overpaid.totalInterest
                                    )}
                                </td>

                                <td className="py-4 text-right">
                                    {formatCurrency(results.overpaid.totalPaid)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default MortgageSummary;
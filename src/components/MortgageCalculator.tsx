import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Home, Percent, Clock, DollarSign } from "lucide-react";
import { MortgageData } from "@/types/mortgage";
import { calculateInterestSavings } from "@/utils/mortgageCalculations";

interface MortgageCalculatorProps {
  mortgageData: MortgageData;
  setMortgageData: (data: MortgageData) => void;
}

const MortgageCalculator = ({ mortgageData, setMortgageData }: MortgageCalculatorProps) => {

  const [results, setResults] = useState<any>(null);

  const calculateMortgage = () => {
    const { mortgageAmount, currentRate, monthlyPayment, loanTermMonths, overpayment } = mortgageData;
    
    // Calculate interest savings properly using the utility function
    const savings = calculateInterestSavings(
      mortgageAmount,
      currentRate,
      monthlyPayment,
      overpayment,
      loanTermMonths
    );
    
    const interestSaved = savings.fullTerm;
    const totalInterestWithout = savings.totalInterestStandard;
    const totalInterestWith = savings.totalInterestWithOverpayment;
    const months = savings.monthsToPayoff;
    const timeSaved = savings.monthsToPayoffStandard - months;
    
    setResults({
      standardMonthlyPayment: monthlyPayment.toFixed(2),
      totalMonthlyPayment: (monthlyPayment + overpayment).toFixed(2),
      totalInterestWithout: totalInterestWithout.toFixed(2),
      totalInterestWith: totalInterestWith.toFixed(2),
      interestSaved: interestSaved.toFixed(2),
      timeSaved: Math.floor(timeSaved / 12),
      timeSavedMonths: timeSaved % 12,
      newPayoffTime: Math.floor(months / 12),
      newPayoffMonths: months % 12
    });
  };

  const handleInputChange = (field: keyof MortgageData, value: string) => {
    // Handle empty string to avoid leading zeros
    if (value === '') {
      setMortgageData({
        ...mortgageData,
        [field]: 0
      });
      return;
    }
    
    setMortgageData({
      ...mortgageData,
      [field]: parseFloat(value) || 0
    });
  };

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold mb-4">Mortgage Overpayment Calculator</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See exactly how much you can save by making extra payments toward your mortgage principal.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Mortgage Details
              </CardTitle>
              <CardDescription>
                Enter your current mortgage information to calculate potential savings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mortgage-amount" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Loan Amount (£)
                </Label>
                <Input
                  id="mortgage-amount"
                  type="number"
                  value={mortgageData.mortgageAmount === 0 ? '' : mortgageData.mortgageAmount}
                  onChange={(e) => handleInputChange('mortgageAmount', e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interest-rate" className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Annual Interest Rate (%)
                </Label>
                <Input
                  id="interest-rate"
                  type="number"
                  step="0.1"
                  value={mortgageData.currentRate === 0 ? '' : mortgageData.currentRate}
                  onChange={(e) => handleInputChange('currentRate', e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthly-payment" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Monthly Payment (£)
                </Label>
                <Input
                  id="monthly-payment"
                  type="number"
                  value={mortgageData.monthlyPayment === 0 ? '' : mortgageData.monthlyPayment}
                  onChange={(e) => handleInputChange('monthlyPayment', e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loan-term" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Loan Term (in Months)
                </Label>
                <Input
                  id="loan-term"
                  type="number"
                  value={mortgageData.loanTermMonths === 0 ? '' : mortgageData.loanTermMonths}
                  onChange={(e) => handleInputChange('loanTermMonths', e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="overpayment" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Monthly Overpayment (£)
                </Label>
                <Input
                  id="overpayment"
                  type="number"
                  value={mortgageData.overpayment === 0 ? '' : mortgageData.overpayment}
                  onChange={(e) => handleInputChange('overpayment', e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <Button onClick={calculateMortgage} variant="financial" size="lg" className="w-full">
                Calculate Savings
              </Button>
            </CardContent>
          </Card>

          {results && (
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-primary">Your Potential Savings</CardTitle>
              <CardDescription>
                Here's how overpaying £{mortgageData.overpayment}/month could benefit you
              </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">Your Monthly Payment</p>
                    <p className="text-2xl font-bold text-primary">£{results.standardMonthlyPayment}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">Total Monthly Payment (with overpayment)</p>
                    <p className="text-2xl font-bold text-primary">£{results.totalMonthlyPayment}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">Interest Saved</p>
                    <p className="text-2xl font-bold text-secondary">£{results.interestSaved}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                  <p className="text-3xl font-bold text-primary">
                    {results.timeSaved} years {results.timeSavedMonths} months
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-muted-foreground">New Payoff Time</p>
                  <p className="text-2xl font-bold">
                    {results.newPayoffTime} years {results.newPayoffMonths} months
                  </p>
                </div>
                
                <Button variant="premium" size="lg" className="w-full">
                  Unlock Premium Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default MortgageCalculator;

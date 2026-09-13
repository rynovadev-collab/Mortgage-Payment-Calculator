import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Home, AlertCircle } from "lucide-react";
import SharedNavigation from "@/components/SharedNavigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

const AffordabilityCalculator = () => {
  const [deposit, setDeposit] = useState<string>("");
  const [applicant1Salary, setApplicant1Salary] = useState<string>("");
  const [applicant2Salary, setApplicant2Salary] = useState<string>("");

  const breadcrumbs = [
    { name: "Home", url: "https://amortiq.co.uk/" },
    { name: "Resources", url: "https://amortiq.co.uk/resources" },
    { name: "Affordability Calculator", url: "https://amortiq.co.uk/affordability-calculator" }
  ];

  const calculateMaxPurchase = () => {
    const depositAmount = parseFloat(deposit) || 0;
    const salary1 = parseFloat(applicant1Salary) || 0;
    const salary2 = parseFloat(applicant2Salary) || 0;
    
    const totalSalary = salary1 + salary2;
    const borrowingCapacity = totalSalary * 4.5;
    const maxPurchasePrice = borrowingCapacity + depositAmount;
    
    return {
      maxPurchasePrice,
      depositAmount,
      borrowingCapacity
    };
  };

  const { maxPurchasePrice, depositAmount, borrowingCapacity } = calculateMaxPurchase();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <SEOHead 
        title="Mortgage Affordability Calculator - Check How Much You Can Borrow | AmortIQ"
        description="Calculate your maximum mortgage affordability based on your salary and deposit. Lenders typically lend 4.5x your combined salary. Free UK mortgage calculator."
        keywords="mortgage affordability calculator, how much can i borrow, mortgage calculator uk, first time buyer calculator, house affordability"
      />
      <StructuredData 
        breadcrumbs={breadcrumbs}
        pageType="WebPage"
        headline="Mortgage Affordability Calculator"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SharedNavigation />
        
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mortgage Affordability
              <span className="text-primary block">Calculator</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculate how much you could borrow based on your income and deposit
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Info Card */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Lenders usually lend with a minimum deposit of 5%.</strong> Most lenders will typically offer up to 4.5 times your combined annual salary. This calculator provides an estimate only.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Deposit Input */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Deposit Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="deposit">How much deposit do you have?</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="0"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      className="pl-7"
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applicants Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Applicant 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Applicant 1
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="applicant1">Annual Salary</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                      <Input
                        id="applicant1"
                        type="number"
                        placeholder="0"
                        value={applicant1Salary}
                        onChange={(e) => setApplicant1Salary(e.target.value)}
                        className="pl-7"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Applicant 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Applicant 2 (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="applicant2">Annual Salary</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                      <Input
                        id="applicant2"
                        type="number"
                        placeholder="0"
                        value={applicant2Salary}
                        onChange={(e) => setApplicant2Salary(e.target.value)}
                        className="pl-7"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            {maxPurchasePrice > 0 && (
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Your Maximum Purchase Price</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-primary mb-2">
                      {formatCurrency(maxPurchasePrice)}
                    </p>
                    <p className="text-gray-600">
                      You could buy a property for up to this amount
                    </p>
                  </div>

                  <div className="border-t pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Maximum Borrowing (4.5x salary):</span>
                      <span className="font-semibold text-lg">{formatCurrency(borrowingCapacity)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Your Deposit:</span>
                      <span className="font-semibold text-lg">{formatCurrency(depositAmount)}</span>
                    </div>
                    {depositAmount > 0 && maxPurchasePrice > 0 && (
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-gray-700">Deposit Percentage:</span>
                        <span className="font-semibold text-lg">
                          {((depositAmount / maxPurchasePrice) * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-gray-700">
                      <strong>Important:</strong> This is an estimate only. Actual borrowing capacity depends on many factors including credit score, existing debts, and lender criteria. Always consult with a mortgage advisor for accurate advice.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AffordabilityCalculator;

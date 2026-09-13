import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserMortgageData } from "@/types/mortgage";
import MortgageAmountStep from "./MortgageAmountStep";
import InterestRateStep from "./InterestRateStep";
import MonthlyPaymentStep from "./MonthlyPaymentStep";
import ContractEndStep from "./ContractEndStep";
import PaymentDayStep from "./PaymentDayStep";
import OverpaymentStep from "./OverpaymentStep";

interface OnboardingFlowProps {
  onComplete: (data: UserMortgageData) => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [mortgageData, setMortgageData] = useState<UserMortgageData>({
    mortgageAmount: 0,
    currentRate: 0,
    monthlyPayment: 0,
    contractEndDate: "",
    paymentDayOfMonth: 1,
    overpaymentAmount: 0
  });

  const steps = [
    { title: "Mortgage Amount", component: MortgageAmountStep },
    { title: "Interest Rate", component: InterestRateStep },
    { title: "Monthly Payment", component: MonthlyPaymentStep },
    { title: "Contract End Date", component: ContractEndStep },
    { title: "Payment Day", component: PaymentDayStep },
    { title: "Overpayment", component: OverpaymentStep }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = (stepData: Partial<UserMortgageData>) => {
    const updatedData = { ...mortgageData, ...stepData };
    setMortgageData(updatedData);
    
    if (currentStep === steps.length - 1) {
      onComplete(updatedData);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to AmortIQ</h1>
          <p className="text-muted-foreground">Let's set up your mortgage details</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              data={mortgageData}
              onNext={handleNext}
              onPrevious={currentStep > 0 ? handlePrevious : undefined}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;
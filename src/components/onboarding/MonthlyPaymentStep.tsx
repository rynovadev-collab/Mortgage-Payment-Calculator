import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserMortgageData } from "@/types/mortgage";

interface StepProps {
  data: UserMortgageData;
  onNext: (data: Partial<UserMortgageData>) => void;
  onPrevious?: () => void;
}

const MonthlyPaymentStep = ({ data, onNext, onPrevious }: StepProps) => {
  const [payment, setPayment] = useState(data.monthlyPayment || '');

  const handleNext = () => {
    if (payment && Number(payment) > 0) {
      onNext({ monthlyPayment: Number(payment) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">What's your monthly payment?</h3>
        <p className="text-muted-foreground">Enter your regular monthly mortgage payment</p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="payment" className="text-base">Monthly Payment (£)</Label>
        <Input
          id="payment"
          type="number"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          placeholder="1500"
          className="text-2xl h-16 text-center"
          min="1"
          autoFocus
        />
      </div>

      <div className="flex gap-3">
        {onPrevious && (
          <Button variant="outline" onClick={onPrevious} className="w-full h-12 text-lg">
            Back
          </Button>
        )}
        <Button 
          onClick={handleNext} 
          disabled={!payment || Number(payment) <= 0}
          className="w-full h-12 text-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MonthlyPaymentStep;
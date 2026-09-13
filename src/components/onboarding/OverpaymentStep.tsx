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

const OverpaymentStep = ({ data, onNext, onPrevious }: StepProps) => {
  const [overpayment, setOverpayment] = useState(data.overpaymentAmount?.toString() || '0');

  const handleNext = () => {
    onNext({ overpaymentAmount: Number(overpayment) || 0 });
  };

  const quickAmounts = [0, 100, 200, 500, 1000];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Any monthly overpayments?</h3>
        <p className="text-muted-foreground">Enter any extra amount you pay each month (optional)</p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="overpayment" className="text-base">Monthly Overpayment (£)</Label>
        <Input
          id="overpayment"
          type="number"
          value={overpayment}
          onChange={(e) => setOverpayment(e.target.value)}
          placeholder="0"
          className="text-2xl h-16 text-center"
          min="0"
          autoFocus
        />
        
        <div className="grid grid-cols-5 gap-2 mt-4">
          {quickAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => setOverpayment(amount.toString())}
              className={Number(overpayment) === amount ? 'bg-primary text-primary-foreground' : ''}
            >
              £{amount}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {onPrevious && (
          <Button variant="outline" onClick={onPrevious} className="w-full h-12 text-lg">
            Back
          </Button>
        )}
        <Button 
          onClick={handleNext} 
          className="w-full h-12 text-lg"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default OverpaymentStep;
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

const MortgageAmountStep = ({ data, onNext }: StepProps) => {
  const [amount, setAmount] = useState(data.mortgageAmount || '');

  const handleNext = () => {
    if (amount && Number(amount) > 0) {
      onNext({ mortgageAmount: Number(amount) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">What's your mortgage amount?</h3>
        <p className="text-muted-foreground">Enter the total amount of your mortgage loan</p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="amount" className="text-base">Mortgage Amount (£)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="300000"
          className="text-2xl h-16 text-center"
          min="1"
          autoFocus
        />
      </div>

      <div className="flex gap-3">
        <Button 
          onClick={handleNext} 
          disabled={!amount || Number(amount) <= 0}
          className="w-full h-12 text-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MortgageAmountStep;
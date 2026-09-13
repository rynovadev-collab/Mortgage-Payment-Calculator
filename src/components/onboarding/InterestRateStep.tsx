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

const InterestRateStep = ({ data, onNext, onPrevious }: StepProps) => {
  const [rate, setRate] = useState(data.currentRate || '');

  const handleNext = () => {
    if (rate && Number(rate) > 0) {
      onNext({ currentRate: Number(rate) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">What's your interest rate?</h3>
        <p className="text-muted-foreground">Enter your current mortgage interest rate</p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="rate" className="text-base">Interest Rate (%)</Label>
        <Input
          id="rate"
          type="number"
          step="0.01"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="3.5"
          className="text-2xl h-16 text-center"
          min="0.01"
          max="50"
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
          disabled={!rate || Number(rate) <= 0}
          className="w-full h-12 text-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default InterestRateStep;
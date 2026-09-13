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

const PaymentDayStep = ({ data, onNext, onPrevious }: StepProps) => {
  const [day, setDay] = useState(data.paymentDayOfMonth || '');

  const handleNext = () => {
    if (day && Number(day) >= 1 && Number(day) <= 31) {
      onNext({ paymentDayOfMonth: Number(day) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Which day do you make payments?</h3>
        <p className="text-muted-foreground">Enter the day of the month you make your mortgage payment</p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="day" className="text-base">Payment Day of Month</Label>
        <Input
          id="day"
          type="number"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          placeholder="1"
          className="text-2xl h-16 text-center"
          min="1"
          max="31"
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
          disabled={!day || Number(day) < 1 || Number(day) > 31}
          className="w-full h-12 text-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PaymentDayStep;
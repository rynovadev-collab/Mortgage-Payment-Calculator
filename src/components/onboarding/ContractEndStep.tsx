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

const ContractEndStep = ({ data, onNext, onPrevious }: StepProps) => {
  const [endDate, setEndDate] = useState(data.contractEndDate || '');

  const handleNext = () => {
    if (endDate) {
      onNext({ contractEndDate: endDate });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">When does your mortgage end?</h3>
        <p className="text-muted-foreground">Enter the date when your mortgage contract ends</p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="endDate" className="text-base">Contract End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="text-lg h-16 text-center"
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
          disabled={!endDate}
          className="w-full h-12 text-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ContractEndStep;
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  strength: "weak" | "medium" | "strong" | "very-strong";
  errors: string[];
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  strength,
  errors,
}) => {
  if (!password) return null;

  const strengthConfig = {
    weak: { value: 25, color: "bg-red-500", text: "Weak", icon: AlertCircle },
    medium: { value: 50, color: "bg-orange-500", text: "Medium", icon: Shield },
    strong: { value: 75, color: "bg-blue-500", text: "Strong", icon: Shield },
    "very-strong": { value: 100, color: "bg-green-500", text: "Very Strong", icon: CheckCircle },
  };

  const config = strengthConfig[strength];
  const Icon = config.icon;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${strength === "weak" ? "text-red-500" : strength === "medium" ? "text-orange-500" : strength === "strong" ? "text-blue-500" : "text-green-500"}`} />
        <span className="text-sm font-medium">Password Strength: {config.text}</span>
      </div>
      <Progress value={config.value} className="h-2" />
      
      {errors.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1 mt-2">
          {errors.map((error, index) => (
            <li key={index} className="flex items-center gap-1">
              <span className="text-red-500">•</span> {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

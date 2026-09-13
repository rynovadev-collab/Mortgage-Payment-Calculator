import { Shield, Users, Award, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TrustSignals = () => {
  const signals = [
    {
      icon: Users,
      value: "Growing",
      label: "Community",
      description: "Trusted by homeowners across the UK"
    },
    {
      icon: Shield,
      value: "Bank-Grade",
      label: "Security",
      description: "Your data is encrypted and protected"
    },
    {
      icon: Award,
      value: "Highly",
      label: "Rated",
      description: "Positive feedback from users"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Available",
      description: "Access your mortgage data anytime"
    }
  ];

  return (
    <section className="py-12 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <Card key={index} className="text-center border-none shadow-sm">
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                   <div className="text-2xl font-bold text-black mb-1">
                    {signal.value}
                  </div>
                  <div className="text-sm font-semibold text-black mb-1">
                    {signal.label}
                  </div>
                  <div className="text-xs text-black">
                    {signal.description}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;

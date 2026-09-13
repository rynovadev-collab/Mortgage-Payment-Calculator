import { Calculator } from "lucide-react";

const SiteHeader = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="h-5 w-5" />
          </div>

          <div>
            <p className="text-lg font-bold leading-none">
              AmortIQ
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Mortgage Overpayment Calculator
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Free UK mortgage calculator
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
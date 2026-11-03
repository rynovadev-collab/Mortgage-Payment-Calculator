import { Calculator } from "lucide-react";
import Link from "next/link";

const SiteHeader = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="h-5 w-5" />
          </div>

          <div>
            <p className="text-lg font-bold leading-none">
              AmortIQ
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Mortgage Payment Calculator
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/guides/mortgage-overpayment-beginners-guide"
            className="text-sm font-semibold text-slate-800 transition-colors hover:text-primary"
          >
            Mortgage Guide
          </Link>

          <span className="hidden text-sm text-slate-600 md:inline">
            Free UK mortgage calculator
          </span>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
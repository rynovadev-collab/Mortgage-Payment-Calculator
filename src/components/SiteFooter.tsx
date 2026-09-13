const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <div>
            <p className="font-semibold">
              AmortIQ
            </p>

            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              A free UK mortgage overpayment calculator for estimating
              how regular overpayments and lump-sum payments could affect
              your mortgage term and interest costs.
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-sm font-medium">
              Important
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              AmortIQ provides estimates for informational purposes only
              and does not provide financial advice.
            </p>
          </div>
        </div>

        <div className="mt-6 border-t pt-6 text-sm text-muted-foreground">
          © {currentYear} AmortIQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
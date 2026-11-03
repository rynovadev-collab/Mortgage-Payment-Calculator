import SEOHead from "@/components/SEOHead";
import MortgageDashboard from "@/components/MortgageDashboard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <SiteHeader />

      <main className="container mx-auto px-4 py-8">
        <MortgageDashboard />
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
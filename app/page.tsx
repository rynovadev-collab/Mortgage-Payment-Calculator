import MortgageDashboard from "@/components/MortgageDashboard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AmortIQ",
  url: "https://mortgage-payment-calculator-kohl.vercel.app/",
};

export default function Home() {
  return (
    <>
    
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <MortgageDashboard />
      </main>
      <SiteFooter />
    </div>

    </>
  );
}

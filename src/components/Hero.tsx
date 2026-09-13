import { ArrowRight, Calculator, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-mortgage.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-12 sm:py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 sm:mb-6 leading-tight">
              Take Control of Your
              <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Mortgage Future
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-2xl">
              Calculate overpayments, track savings, and see how much faster you can become mortgage-free with our advanced financial tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="group w-full sm:w-auto min-h-[48px]">
                Start Calculating
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20 w-full sm:w-auto min-h-[48px]">
                View Premium Features
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 mt-8 sm:mt-12 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Advanced Calculator</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Savings Tracker</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Mortgage calculator and financial planning" 
                className="rounded-2xl shadow-glow w-full h-auto"
              />
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-card">
                <div className="text-sm text-black">Potential Savings</div>
                <div className="text-2xl font-bold text-secondary">Thousands</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-card">
                <div className="text-sm text-black">Time Saved</div>
                <div className="text-2xl font-bold text-primary">Years</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I calculate my monthly mortgage payment?",
      answer: "Enter the mortgage amount, annual interest rate and remaining repayment term. AmortIQ estimates the monthly capital-and-interest payment using a standard repayment mortgage formula."
    },
    {
      question: "Does a longer mortgage term mean lower monthly payments?",
      answer: "Usually yes. Spreading repayments over more months reduces the estimated monthly payment, but generally increases the total interest paid over the life of the mortgage."
    },
    {
      question: "Does this calculator include mortgage fees or changing interest rates?",
      answer: "You can enter a product fee and choose whether to add it to the mortgage balance. Estimates assume the interest rate stays constant; actual lender payments can differ if rates, fees or payment dates change."
    },
    {
      question: "How accurate are the mortgage calculations?",
      answer: "Our calculations use standard mortgage formulas and are highly accurate for planning purposes. However, always verify final figures with your lender as they may have specific terms or fees that affect your actual payments."
    },
    {
      question: "Is my financial data secure?",
      answer: "Absolutely. All data is encrypted using bank-grade security (256-bit SSL encryption). We never share your personal information with third parties, and you can delete your data at any time."
    },
    {
      question: "Can I track multiple mortgages?",
      answer: "Yes! Premium subscribers can track unlimited mortgages. This is perfect if you have multiple properties or want to compare different mortgage scenarios."
    },
    {
      question: "How do overpayments work?",
      answer: "Overpayments reduce your mortgage balance faster, which means you pay less interest overall and can become mortgage-free sooner. Our calculator shows you exactly how much you'll save with different overpayment amounts."
    },
    {
      question: "What's the difference between free and premium?",
      answer: "The free version includes our basic mortgage calculator. Premium adds overpayment tracking, detailed amortization schedules, payment history, advanced analytics, and the ability to track multiple mortgages."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your premium subscription at any time through your account settings. You'll continue to have access until the end of your billing period."
    },
    {
      question: "Do you offer a mobile app?",
      answer: "Our website is fully mobile-responsive and works perfectly on all devices. A dedicated mobile app is planned for future release based on user demand."
    },
    {
      question: "How do I get started?",
      answer: "Simply click 'Get Started' to create a free account. You can start using the mortgage calculator immediately. Upgrade to Premium anytime to unlock advanced features."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-black">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-black mb-12">
          Everything you need to know about AmortIQ
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-black">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-black">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;

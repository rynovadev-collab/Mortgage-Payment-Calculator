import type { Metadata } from "next";
import Guide from "@/components/MortgageOverpaymentGuide";
export const metadata: Metadata = {
  title: "Mortgage Overpayments and LTV: A Beginner’s Guide",
  description:
    "Learn how mortgage overpayments, interest savings and loan-to-value (LTV) bands work in the UK.",
};
export default function Page() {
  return <Guide />;
}

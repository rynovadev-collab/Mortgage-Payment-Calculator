import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: "Mortgage Payment Calculator UK | AmortIQ",
    template: "%s | AmortIQ",
  },
  description:
    "Free UK mortgage payment calculator. Calculate monthly mortgage repayments, total interest, repayment schedules and how much overpayments could save.",
  applicationName: "AmortIQ",
  openGraph: {
    title: "Mortgage Payment Calculator UK | AmortIQ",
    description:
      "Calculate monthly mortgage repayments, total interest and potential overpayment savings with our free UK mortgage calculator.",
    siteName: "AmortIQ",
    type: "website",
    locale: "en_GB",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
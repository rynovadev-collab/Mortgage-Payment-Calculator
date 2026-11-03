import type { MetadataRoute } from "next";
const base = "https://mortgage-payment-calculator-kohl.vercel.app";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/guides/mortgage-overpayment-beginners-guide",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((p) => ({ url: base + p }));
}

import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export const metadata:Metadata={title:"About AmortIQ",robots:{index:true,follow:true}};
export default function Page(){return <><SiteHeader/><main className="container mx-auto max-w-3xl px-4 py-12 min-h-[55vh]"><h1 className="text-3xl font-bold mb-6">About AmortIQ</h1><p className="leading-7 text-muted-foreground">AmortIQ is a free UK mortgage payment and overpayment calculator developed and operated by RynovaDev. It helps you explore estimated monthly repayments, mortgage interest and the possible effects of overpaying. Figures are illustrative, not financial advice.</p><p className="mt-6">Operated by <a className="underline" href="https://rynovadev.co.uk">RynovaDev</a>.</p></main><SiteFooter/></>}

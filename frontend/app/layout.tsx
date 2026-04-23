import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepOptimizer — AI Perception Intelligence for Shopify",
  description: "See how AI shopping agents perceive your store. Diagnose intelligence gaps and fix your product data to rank higher in the agentic commerce era.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0e0e0e] text-[#f5f5f5] antialiased">
        {children}
      </body>
    </html>
  );
}

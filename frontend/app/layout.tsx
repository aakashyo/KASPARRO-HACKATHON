import type { Metadata } from "next";
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RepOptimizer — AI Perception Intelligence for Shopify",
  description: "See how AI shopping agents perceive your store. Diagnose intelligence gaps and fix your product data to rank higher in the agentic commerce era.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-[#0e0e0e] text-[#f5f5f5] antialiased">
        {children}
      </body>
    </html>
  );
}

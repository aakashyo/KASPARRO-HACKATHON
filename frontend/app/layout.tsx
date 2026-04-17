import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI RepOptimizer — Perception Intelligence for Shopify",
  description: "Diagnose how AI shopping agents perceive your Shopify store. Identify intelligence gaps, fix product data, and win the agentic ranking race.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] antialiased">{children}</body>
    </html>
  );
}

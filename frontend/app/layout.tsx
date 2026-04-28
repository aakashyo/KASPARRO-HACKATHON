import type { Metadata } from "next";
import {
  Fraunces,
  Manrope,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const body = Manrope({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const mono = Space_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RepOptimizer - AI Perception Intelligence for Shopify",
  description:
    "See how AI shopping agents perceive your store. Diagnose perception gaps and fix your product data for the agentic commerce era.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

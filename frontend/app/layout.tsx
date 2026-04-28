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
  weight: ["300", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RepOptimizer — AI Catalog Intelligence for Shopify",
  description:
    "Audit your Shopify catalog and rewrite it to rank higher in AI-powered recommendation engines. Built for the Kasparro Hackathon Track 5.",
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

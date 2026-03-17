import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DealDrop — Track Amazon Prices & Save Money",
  description:
    "DealDrop helps you track Amazon product prices over time. Paste a product link, and we'll watch the price and alert you when it drops.",
  keywords: ["price tracker", "amazon deals", "price drop alert", "DealDrop"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="antialiased bg-[#FFFDF5] text-black">{children}</body>
    </html>
  );
}

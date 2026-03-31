import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  style: ["normal"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whim | Last-minute salon deals",
  description:
    "Whim surfaces same-day salon openings with delightful booking flows for guests, stylists, and admins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} bg-charcoal text-surface`}
    >
      <body className="min-h-screen bg-charcoal text-surface antialiased">
        {children}
      </body>
    </html>
  );
}

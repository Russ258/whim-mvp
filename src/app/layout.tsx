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
  title: "Whim | Last-minute hair deals · Sydney",
  description: "Same-day hair salon slots in Sydney at up to 40% off. Browse, book instantly, show your QR code. No credit card required.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} bg-surface text-charcoal`}
    >
      <body className="min-h-screen bg-surface text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}

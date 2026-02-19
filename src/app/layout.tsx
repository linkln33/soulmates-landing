import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soulmates Quest — Find Your Cosmic Match",
  description: "16 spiritual systems. One soulmate. Free cosmic compatibility reading — no account needed.",
  openGraph: {
    title: "Soulmates Quest",
    description: "16 spiritual systems. One soulmate.",
    url: "https://soulmates.quest",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

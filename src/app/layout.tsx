import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const aclonica = localFont({
  src: "../../public/fonts/Aclonica.ttf",
  variable: "--font-aclonica",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soulmates Quest — Find Your Cosmic Match",
  description: "16 spiritual systems. One soulmate. Free cosmic compatibility reading — no account needed.",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '256x256', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
  openGraph: {
    title: "Soulmates Quest",
    description: "16 spiritual systems. One soulmate.",
    url: "https://soulmates.quest",
    type: "website",
    images: [{ url: '/logo.png', width: 1024, height: 1024 }],
  },
  twitter: {
    card: 'summary',
    title: 'Soulmates Quest',
    description: '16 spiritual systems. One soulmate.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${aclonica.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

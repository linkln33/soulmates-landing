import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL } from "@/lib/site/config";

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

const description =
  "A free reading from your first name and birth date: numerology, sun sign and a symbolic past-life archetype. The Soulmates Quest dating app is being prepared for a private pilot.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Soulmates Quest — Free Reading",
  description,
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '256x256', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
  openGraph: {
    title: "Soulmates Quest",
    description,
    url: SITE_URL,
    type: "website",
    images: [{ url: '/logo.png', width: 1024, height: 1024 }],
  },
  twitter: {
    card: 'summary',
    title: 'Soulmates Quest',
    description,
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${aclonica.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

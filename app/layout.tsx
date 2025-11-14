import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast'
import { DebugBanner } from '@/components/DebugBanner'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tattoo Stencil Printer - Print Large Tattoos on A4 Paper",
  description: "Split your tattoo designs into 4 A4 sheets with alignment marks. Perfect for creating large stencils with a standard home printer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DebugBanner />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Botflixer – Infinite AI Video Feed",
  description: "Watch an endless feed of AI-generated videos from across the internet.",
  metadataBase: new URL("https://botflixer.com"),
  openGraph: {
    title: "Botflixer – Infinite AI Video Feed",
    description: "Discover AI videos from across the web in one endless stream.",
    url: "https://botflixer.com",
    siteName: "Botflixer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Botflixer – Infinite AI Video Feed",
    description: "Discover AI videos from across the web in one endless stream.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

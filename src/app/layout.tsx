import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Botflixer — Scroll Infinite AI Videos in a TikTok-Style Feed",
  description:
    "Botflixer is an infinite AI video feed. Scroll endlessly through AI-generated videos, music clips, weird experiments, and creative AI content.",

  openGraph: {
    title: "Botflixer — Scroll Infinite AI Videos",
    description:
      "An endless TikTok-style feed for AI videos. Discover infinite AI content instantly.",
    url: "https://botflixer.com",
    siteName: "Botflixer",
    images: [
      {
        url: "https://botflixer.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Botflixer infinite AI video feed",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Botflixer — Scroll Infinite AI Videos",
    description:
      "Endless AI video feed. Discover infinite AI generated videos instantly.",
    images: ["https://botflixer.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
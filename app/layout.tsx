import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GlowDesk — Classical Arabic for Adult Learners",
  description:
    "18 structured skills take you from the Arabic alphabet to reading the Quran with comprehension. Built by a teacher. $50/month includes 12 live classes.",
  openGraph: {
    title: "GlowDesk — Classical Arabic for Adult Learners",
    description:
      "From letters to Quranic comprehension — 18 skills, live classes, root-based vocabulary.",
    url: "https://glowdesk.io",
    siteName: "GlowDesk",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

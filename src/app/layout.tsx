import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boardroom — your AI board of directors",
  description:
    "Paste a startup idea and convene a live AI board meeting: VC, CFO, CTO, " +
    "Customer, and Competitor agents debate and generate risk cards, scores, a " +
    "competitor map, an MVP roadmap, a board memo, and a weekend action plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#070a14] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

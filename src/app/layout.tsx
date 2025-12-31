import type { Metadata } from "next";
import { Inter, Mountains_of_Christmas } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const mountainsOfChristmas = Mountains_of_Christmas({
  subsets: ["latin"],
  variable: "--font-festive",
  weight: "700",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pets Santa - AI Christmas Pet Portraits",
  description: "Upload a photo of your pet and let AI turn it into a festive holiday portrait. Dress your pet in Santa, Elf, or Reindeer outfits—no editing needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${mountainsOfChristmas.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

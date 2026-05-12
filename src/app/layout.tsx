import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NR Calibre I — Limited Edition Timepiece",
  description:
    "NR Calibre I. 42mm Automatic. Swiss Movement. Limited to 500 pieces worldwide.",
  icons: {
    icon: "/nr-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}

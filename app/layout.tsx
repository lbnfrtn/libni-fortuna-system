import type { Metadata } from "next";
import { Cormorant_Garamond, Karla, La_Belle_Aurore } from "next/font/google";
import "./globals.css";
import "./editorial.css";

// Project Me brand: Cormorant Garamond (serif display + italic) + Karla (sans UI).
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const signature = La_Belle_Aurore({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-signature",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Libni Fortuna",
  description: "Libni Fortuna — Life Strategist, transformational mentor, TEDx speaker and experience curator. Come home to yourself.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${signature.variable}`}>
      <body>{children}</body>
    </html>
  );
}

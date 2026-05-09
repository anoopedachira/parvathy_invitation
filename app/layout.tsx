import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Cormorant_SC,
  Inter,
  Great_Vibes,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const cormorantSC = Cormorant_SC({
  variable: "--font-cormorant-sc",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parvathy & Harikrishnan — A new chapter begins",
  description: "Join us for a beautiful celebration of love and new beginnings. May 5, 2026 — Royal Convention Centre, Pattambi.",
  keywords: ["wedding", "invitation", "Parvathy", "Harikrishnan", "celebration"],
  authors: [{ name: "Parvathy & Harikrishnan" }],
  openGraph: {
    title: "Parvathy & Harikrishnan — Wedding Invitation",
    description: "A cinematic celebration of love and new beginnings.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // You'll need to add this image
        width: 1200,
        height: 630,
        alt: "Parvathy & Harikrishnan Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parvathy & Harikrishnan — A new chapter begins",
    description: "Join us for a beautiful celebration of love and new beginnings.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${cormorantSC.variable} ${inter.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F3EE]">
        {children}
      </body>
    </html>
  );
}

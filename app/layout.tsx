import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "carKharedo - Buy & Sell Used Cars",
    template: "%s | carKharedo",
  },
  description:
    "India's most trusted platform for buying and selling used cars. Find the best deals on certified pre-owned cars in your city.",
  keywords: [
    "used cars",
    "buy cars",
    "sell cars",
    "second hand cars",
    "certified cars",
    "car marketplace",
    "pre-owned cars",
    "car deals",
  ],
  openGraph: {
    siteName: "carKharedo",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@carkharedo", // Replace with your Twitter handle
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

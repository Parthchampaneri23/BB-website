import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "../../public/output.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MarketTicker from "../components/MarketTicker";

export const metadata: Metadata = {
  title: "BusinessBulletin | Stock Markets, Economy, Finance & Technology News",
  description: "Get latest news on share market, personal finance news, economy news, stock market updates, company news, and technology at BusinessBulletin.",
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f5f8fc] text-[#171717] antialiased selection:bg-[#eaf2ff] selection:text-[#0069f7]">
        <Header />
        <MarketTicker />
        <main className="max-w-[1240px] mx-auto px-3 sm:px-6 py-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

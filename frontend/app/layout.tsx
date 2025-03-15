import type { Metadata } from "next";
import { Tektur } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/Providers";

const TekturSans = Tektur({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RenderBro",
  description: "A realtime 3D rendering tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${TekturSans} antialiased`}>
        <SessionProviderWrapper>
          <Header />
          {children}
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

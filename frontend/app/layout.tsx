import type { Metadata } from "next";
import { Tektur } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import HeaderWrapper from "@/components/HeaderWrapper";

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
          <HeaderWrapper />
          {children}
          <Footer />
        </SessionProviderWrapper>
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecoilProvider from '../providers/RecoilProvider';
import GoogleOAuthProviderWrapper from "@/providers/GoogleAuthProviderWrapper";
import Header from "@/modules/user/layout/components/Header";
import ModalManager from "@/modules/user/layout/components/ModalManager";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book my show",
  description: "Movie Booking App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">  
 
    <RecoilProvider >
    <GoogleOAuthProviderWrapper>
      <ModalManager/>
      <body className={inter.className}>{children}</body>
      </GoogleOAuthProviderWrapper>
    </RecoilProvider>
    </html>
  );
}

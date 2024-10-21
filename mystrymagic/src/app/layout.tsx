import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react"
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Whisper-Box",
  description: "WhisperBox - Where your identity remains a secret.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
      </Head>
      <AuthProvider>
        <body className={inter.className}>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
      <Analytics />
    </html>
  );
}
/*
<footer className="text-center bottom-0 p-4 md:p-6 bg-gray-900 text-white">
            © 2023 True Feedback. All rights reserved.
          </footer>

*/
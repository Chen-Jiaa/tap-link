import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  description: "Link Switcher Dashboard",
  title: "Link Switcher",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>
            {children}
        </main> 
      </body>
    </html>
  );
}

